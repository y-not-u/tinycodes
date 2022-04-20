import { ipcMain, app } from 'electron';
import { Agent } from 'https';
import dayjs from 'dayjs';
import { createClient, FileStat, ResponseDataDetailed } from 'webdav';
import fs from 'fs';
import preferences, { WebDavPref } from '../preferences';
import { UnauthorizedError, NotFoundError } from '../../exceptions/webdav';
import db from '../db';

interface Options {
  username: string;
  password: string;
  url: string;
  filepath: string;
}

const LOCK_FILE = `${app.getPath('userData')}/syncing.lock`;
const LOCAL_DATA_FILE = `${app.getPath('userData')}/db.stormdb`;

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

  public async stat(): Promise<FileStat | ResponseDataDetailed<FileStat>> {
    return this.client.stat(this.filepath);
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

  public async upload(localFile: string) {
    fs.createReadStream(localFile).pipe(
      this.client.createWriteStream(this.filepath)
    );
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

ipcMain.handle('webdav.sync', async () => {
  const webdav = await newWebDav();

  // if locked
  if ((await lock()) === false) {
    return false;
  }

  function upload() {
    webdav.upload(LOCAL_DATA_FILE);
  }

  async function download() {
    const dataString = await webdav.download();
    await fs.writeFileSync(LOCAL_DATA_FILE, dataString);
    db.reload();
  }

  // data file exists
  if (await webdav.exists()) {
    const remoteStat = (await webdav.stat()) as FileStat;
    const remoteMod = dayjs(remoteStat.lastmod).valueOf();

    const localStat = await fs.statSync(LOCAL_DATA_FILE);
    const localMod = localStat.mtimeMs;

    if (remoteMod > localMod) {
      await download();
    } else {
      upload();
    }
  } else {
    // data file not exists
    upload();
  }

  return unlock();
});
