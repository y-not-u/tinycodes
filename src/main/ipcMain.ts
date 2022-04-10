import { ipcMain, clipboard, nativeTheme } from 'electron';
import preferences from './preferences';
import {
  addLabel,
  getLabels,
  getSnippets,
  getStars,
  newSnippet,
  removeLabel,
  removeSnippet,
  renameLabel,
  updateLabel,
  updateSnippet,
  updateStars,
} from './service';
import AppUpdater from './updater';

ipcMain.handle('db-new-snippet', async (_, val) => {
  return newSnippet(val);
});

ipcMain.handle('db-update-snippet', async (_, val) => {
  updateSnippet(val);
});

ipcMain.handle('db-get-snippets', async () => {
  return getSnippets();
});

ipcMain.handle('db-remove-snippet', async (_, id: string) => {
  removeSnippet(id);
});

ipcMain.handle('write-clipboard', (_, text: string) => {
  clipboard.writeText(text);
});

ipcMain.handle('db-get-stars', async () => {
  return getStars();
});

ipcMain.handle('db-update-stars', async (_, stars: string[]) => {
  updateStars(stars);
});

ipcMain.handle('db.label.add', async (_, name: string) => {
  addLabel(name);
});

ipcMain.handle('db.label.remove', async (_, name: string) => {
  removeLabel(name);
});

ipcMain.handle('db.label.rename', async (_, before: string, after: string) => {
  renameLabel(before, after);
});

ipcMain.handle('db.label.all', () => {
  return getLabels();
});

ipcMain.handle('db.label.update', (_, name: string, ids: string[]) => {
  updateLabel(name, ids);
});
ipcMain.handle('preferences.get', async (_, key: string) => {
  try {
    return preferences.get(key).value();
  } catch (e) {
    return null;
  }
});

ipcMain.handle('preferences.set', (_, key: string, value: unknown) => {
  preferences.set(key, value).save();
});

ipcMain.handle('system.isDarkMode', () => {
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('checkUpdate', () => {
  const updater = new AppUpdater();
  return updater;
});
