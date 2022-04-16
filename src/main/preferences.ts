import StormDB from 'stormdb';
import { app } from 'electron';

const dbPath = `${app.getPath('userData')}/Preferences`;

// eslint-disable-next-line new-cap
const engine = new StormDB.localFileEngine(dbPath);
const preferences = new StormDB(engine);

export interface EditorPref {
  defaultLang: string;
  defaultMode: 'readonly' | 'editable';
}

export interface WebDavPref {
  username: string;
  password: string;
  url: string;
}

export interface Preferences {
  theme: 'light' | 'dark' | 'system';
  sortBy: 'time' | 'title';
  labelsFolded: boolean;
  editor: EditorPref;
  webdav: WebDavPref;
}

preferences.default({
  theme: 'system',
  sortBy: 'time',
  labelsFolded: false,
  editor: {
    defaultLang: 'text',
    defaultMode: 'readonly',
  },
  windowBounds: {
    width: 971,
    height: 600,
  },
  shortcuts: {
    quickWindow: 'Ctrl + Shift + V',
  },
  webdav: {
    username: '',
    password: '',
    url: '',
  },
});

export default preferences;
