import { action, makeObservable, observable, runInAction } from 'mobx';

type Mode = 'view' | 'edit' | 'new' | null;
export type Theme = 'system' | 'light' | 'dark';

class AppStore {
  mode: Mode = null;

  newSnippetTitle: string = '';

  selectedSnippetId: string | null = null;

  theme: Theme = 'light';

  constructor() {
    makeObservable(this, {
      mode: observable,
      newSnippetTitle: observable,
      selectedSnippetId: observable,
      theme: observable,
      setMode: action,
      setTheme: action,
      updateNewSnippetTitle: action,
      setSelectedSnippetId: action,
    });
    this.initTheme();
  }

  async initTheme() {
    const val = await window.electron.preferences.get('theme');
    runInAction(() => {
      this.theme = val as Theme;
    });
  }

  setMode(mode: Mode) {
    this.mode = mode;
    if (mode === 'new') {
      this.newSnippetTitle = '';
    }
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    window.electron.preferences.set('theme', theme);
  }

  updateNewSnippetTitle(val: string) {
    this.newSnippetTitle = val;
  }

  setSelectedSnippetId(id: string | null) {
    this.selectedSnippetId = id;
  }
}

export default AppStore;
