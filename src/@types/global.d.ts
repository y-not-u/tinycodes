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
      preferences: {
        get: (key: string) => Promise<unknown>;
        set: (key: string, value: unknown) => void;
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
