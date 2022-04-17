import { ipcMain, app } from 'electron';
import { Agent } from 'https';
import { createClient } from 'webdav';
import fs from 'fs';
import db from '../db';
import preferences, { WebDavPref } from '../preferences';
import { UnauthorizedError, NotFoundError } from '../../exceptions/webdav';

interface Options {
  username: string;
  password: string;
  url: string;
  filepath: string;
}

const LOCK_FILE = `${app.getPath('userData')}/syncing.lock`;

class WebDav {
  private client;

  private filepath: string;

  constructor(options: Options) {
    const { url, username, password, filepath } = options;
    this.client = createClient(url, {
      username,
      password,
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    });
    this.filepath = filepath;
  }

  public async connect(): Promise<boolean> {
    try {
      return await this.client.exists('/');
    } catch (e: any) {
      if (e.status === 401) {
        throw new UnauthorizedError();
      }
      // INFO: Synology webdav method propfind not allowded
      if (e.status === 405) {
        throw new NotFoundError();
      }

      throw e;
      // return false;
    }
  }

  public async exists(): Promise<boolean> {
    try {
      return await this.client.exists(this.filepath);
    } catch (e: any) {
      return Promise.resolve(false);
    }
  }

  public async download(): Promise<string> {
    const data = await this.client.getFileContents(this.filepath);
    return data as string;
  }

  public async upload(data: string): Promise<boolean> {
    return this.client.putFileContents(this.filepath, data, {
      overwrite: true,
    });
  }
}

export async function lock(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    fs.writeFile(LOCK_FILE, 'just lock file', (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function unlock(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    fs.unlink(LOCK_FILE, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export default WebDav;
const newWebDav = async (): Promise<WebDav> => {
  const config: WebDavPref = await preferences.get('webdav').value();
  return new WebDav({
    ...config,
    filepath: 'tinycodes.json',
  });
};

ipcMain.handle('webdav.connect', async () => {
  return (await newWebDav()).connect();
});

ipcMain.handle('webdav.exists', async (): Promise<boolean> => {
  return (await newWebDav()).exists();
});

ipcMain.handle('webdav.upload', async (_, data: string) => {
  return (await newWebDav()).upload(data);
});

ipcMain.handle('webdav.download', async (): Promise<string> => {
  return (await newWebDav()).download();
});

ipcMain.handle('webdav.sync', async () => {
  const webdav = await newWebDav();

  // if locked
  if ((await lock()) === false) {
    return;
  }

  // data file exists
  // if (await webdav.exists()) {
  // } else {
  // data file not exists
  const data = await db.value();
  webdav.upload(JSON.stringify(data));
  // }
  unlock();
});
