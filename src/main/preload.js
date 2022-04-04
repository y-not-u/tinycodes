const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  process: {
    platform: process.platform,
  },
  system: {
    isDarkMode() {
      return ipcRenderer.invoke('system.isDarkMode');
    },
    checkUpdate() {
      return ipcRenderer.invoke('checkUpdate');
    },
  },
  preferences: {
    get(key) {
      return ipcRenderer.invoke('preferences.get', key);
    },
    set(key, value) {
      ipcRenderer.invoke('preferences.set', key, value);
    },
  },
  setting: {
    shortcuts: {
      quickWindow(oldAccelerator, newAccelerator) {
        ipcRenderer.invoke(
          'setting.shortcuts.quickWindow',
          oldAccelerator,
          newAccelerator
        );
      },
    },
  },
  file: {
    save(title = 'Save file', defaultPath, buttonLabel = 'save', data) {
      ipcRenderer.invoke(
        'setting.export',
        title,
        defaultPath,
        buttonLabel,
        data
      );
    },
  },
  shell,
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example', 'snippets'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  windowManage: {
    minimize() {
      ipcRenderer.send('window-minimize');
    },
    maximize() {
      ipcRenderer.send('window-maximize');
    },
    close() {
      ipcRenderer.send('window-close');
    },
    closeQuickWindow() {
      ipcRenderer.send('quick-window-close');
    },
  },
  db: {
    newSnippet(snippet) {
      return ipcRenderer.invoke('db-new-snippet', snippet);
    },
    updateSnippet(snippet) {
      return ipcRenderer.invoke('db-update-snippet', snippet);
    },
    getSnippets() {
      return ipcRenderer.invoke('db-get-snippets');
    },
    removeSnippet(id) {
      return ipcRenderer.invoke('db-remove-snippet', id);
    },
    getStars() {
      return ipcRenderer.invoke('db-get-stars');
    },
    updateStars(stars) {
      return ipcRenderer.invoke('db-update-stars', stars);
    },
    label: {
      add(name) {
        return ipcRenderer.invoke('db.label.add', name);
      },
      remove(name) {
        return ipcRenderer.invoke('db.label.remove', name);
      },
      rename(before, after) {
        return ipcRenderer.invoke('db.label.rename', before, after);
      },
      all() {
        return ipcRenderer.invoke('db.label.all');
      },
      update(name, ids) {
        return ipcRenderer.invoke('db.label.update', name, ids);
      },
    },
  },
  clipboard: {
    write(text) {
      ipcRenderer.invoke('write-clipboard', text);
    },
  },
});
