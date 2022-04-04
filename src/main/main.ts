/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Tray,
  nativeImage,
  Menu,
  globalShortcut,
  screen,
  dialog,
  nativeTheme,
} from 'electron';
import MenuBuilder from './menu';
import preferences from './preferences';
import { resolveHtmlPath } from './util';
import { getSnippets } from './service';
import './ipcMain';

let mainWindow: BrowserWindow | null = null;
let quickWindow: BrowserWindow | null = null;
let tray = null;
let isWindowShowing = true;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const showQuickWindow = () => {
  const { x, y } = screen.getCursorScreenPoint();
  quickWindow?.setPosition(x, y);
  quickWindow?.focus();
  quickWindow?.setAlwaysOnTop(true);
  quickWindow?.show();
};

const showMainWindow = () => {
  if (mainWindow) {
    mainWindow.show();
    isWindowShowing = true;
  }
};

const hideMainWindow = () => {
  if (mainWindow) {
    if (process.platform === 'win32') {
      mainWindow.minimize();
    }

    mainWindow.hide();

    if (process.platform === 'darwin') {
      app.hide();
    }

    isWindowShowing = false;
  }
};

const toggleMainWindow = () => {
  if (isWindowShowing) {
    hideMainWindow();
  } else {
    showMainWindow();
  }
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const bounds = {
    width: 971,
    height: 600,
    ...preferences.get('windowBounds').value(),
  };

  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600,
    frame: process.platform === 'linux',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDevelopment,
    },
  });

  if (process.platform === 'linux') {
    mainWindow.removeMenu();
  }

  mainWindow.setBounds(bounds);

  mainWindow.loadURL(`${resolveHtmlPath('index.html')}?MainWindow`);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('close', () => {
    preferences.set('windowBounds', mainWindow?.getBounds()).save();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

const createQuickWindow = () => {
  quickWindow = new BrowserWindow({
    width: 309,
    height: 500,
    minWidth: 200,
    minHeight: 350,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  quickWindow.loadURL(`${resolveHtmlPath('index.html')}?QuickWindow`);
  quickWindow.on('focus', () => {
    quickWindow?.webContents.send('snippets', getSnippets());
  });
};
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    createQuickWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    tray = new Tray(
      nativeImage
        .createFromPath(getAssetPath('icon.png'))
        .resize({ width: 16, height: 16 })
    );
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        type: 'normal',
        click: () => {
          toggleMainWindow();
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.on('click', () => {
      if (process.platform !== 'darwin') {
        toggleMainWindow();
      }
    });
    tray.setToolTip('贴码');
    tray.setContextMenu(contextMenu);
  })
  .then(() => {
    const quickWindowShortcut = preferences
      .get('shortcuts.quickWindow')
      .value();
    if (quickWindowShortcut) {
      globalShortcut.register(quickWindowShortcut, () => {
        showQuickWindow();
      });
    }
  })
  .catch(console.log);

ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window-close', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  hideMainWindow();
});

ipcMain.on('quick-window-close', () => {
  quickWindow?.hide();
});

ipcMain.handle(
  'setting.shortcuts.quickWindow',
  (_, oldAccelerator: string, newAccelerator: string) => {
    if (oldAccelerator !== '') {
      globalShortcut.unregister(oldAccelerator.replaceAll(' ', ''));
    }

    if (newAccelerator !== '') {
      globalShortcut.register(newAccelerator.replaceAll(' ', ''), () => {
        showQuickWindow();
      });
    }
  }
);

ipcMain.handle(
  'setting.export',
  (
    _,
    title: string,
    defaultPath: string,
    buttonLabel: string,
    data: string
  ) => {
    if (!mainWindow) {
      return;
    }

    const options = {
      title,
      defaultPath,
      buttonLabel,
    };
    dialog
      .showSaveDialog(mainWindow, options)
      // eslint-disable-next-line promise/always-return
      .then(({ filePath }) => {
        if (!filePath) {
          return;
        }

        fs.writeFileSync(filePath, data, 'utf-8');
      })
      .catch(console.log);
  }
);

nativeTheme.on('updated', () => {
  mainWindow?.reload();
});
