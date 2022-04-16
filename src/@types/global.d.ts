import { IpcRenderer, Shell } from 'electron';
import { Snippet, NewSnippet } from './snippet';

declare global {
  interface Window {
    electron: {
      process: NodeJS.Process;
      system: {
        isDarkMode: () => Promise<boolean>;
        checkUpdate: () => Promise<unknown>;
      };
      webdav: {
        connect: () => Promise<boolean>;
        exists: () => Promise<boolean>;
        download: () => Promise<void>;
        upload: (data: string) => Promise<boolean>;
        sync: () => Promise<boolean>;
      };
      preferences: {
        get: <T>(key: string) => Promise<T>;
        set: <T>(key: string, value: unknown) => Promise<T>;
      };
      shell: Shell;
      setting: {
        shortcuts: {
          quickWindow: (oldAccelerator: string, newAccelerator: string) => void;
        };
      };
      file: {
        save: (
          title: string,
          defaultPath: string,
          buttonLabel: string,
          data: string
        ) => void;
      };
      ipcRenderer: IpcRenderer;
      windowManage: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
        closeQuickWindow: () => void;
      };
      db: {
        all: () => Promise<object>;
        newSnippet: (snippet: NewSnippet) => Promise<Snippet>;
        updateSnippet: (snippet: Snippet) => void;
        removeSnippet: (id: string) => void;
        getSnippets: () => Promise<Snippet[]>;
        getStars: () => Promise<string[]>;
        updateStars: (stars: string[]) => void;
        label: {
          all: () => Promise<{ [key: string]: string[] }>;
          add: (name: string) => void;
          remove: (name: string) => void;
          update: (name: string, ids: string[]) => void;
          rename: (before: string, after: string) => void;
        };
      };
      clipboard: {
        write: (text: string) => void;
      };
    };
  }
}
