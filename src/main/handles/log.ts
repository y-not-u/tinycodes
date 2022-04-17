import { ipcMain } from 'electron';

const log = require('electron-log');

ipcMain.handle('log.info', async (_, message: string) => {
  log.info(message);
});

ipcMain.handle('log.debug', async (_, message: string) => {
  log.debug(message);
});

ipcMain.handle('log.error', async (_, message: string) => {
  log.error(message);
});
