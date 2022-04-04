import { makeAutoObservable, toJS } from 'mobx';
import { Snippet } from '../../@types/snippet';

class SnippetsStore {
  constructor() {
    makeAutoObservable(this);
    this.sync();
  }

  snippets: Snippet[] = [];

  updateSnippets(snippets: Snippet[]) {
    this.snippets = snippets;
  }

  push(snippet: Snippet) {
    this.snippets.push(snippet);
  }

  async add({
    title,
    content,
    lang,
  }: {
    title: string;
    content: string;
    lang: string;
  }) {
    const saved = await window.electron.db.newSnippet({
      title,
      content,
      lang,
    });
    this.push(saved);
    return saved;
  }

  find(id: string) {
    return this.snippets.find((i) => i.id === id);
  }

  update(newData: Partial<Snippet>) {
    const found = this.snippets.find((i) => i.id === newData.id);
    if (!found) {
      return;
    }
    const updated = { ...toJS(found), ...newData } as Snippet;
    window.electron.db.updateSnippet(updated);
    this.sync();
  }

  remove(id: string) {
    window.electron.db.removeSnippet(id);
    this.snippets = this.snippets.filter((i) => i.id !== id);
  }

  addLabel(id: string, label: string) {
    const found = this.find(id);
    if (found) {
      this.updateLabels(id, (found.labels || []).concat(label));
    }
  }

  removeLabel(id: string, label: string) {
    const found = this.find(id);
    if (found) {
      this.updateLabels(
        id,
        (found.labels || []).filter((i) => i !== label)
      );
    }
  }

  updateLabels(id: string, labels: string[]) {
    this.update({
      id,
      labels,
    });
  }

  async sync() {
    const val = await window.electron.db.getSnippets();
    this.snippets = val;
  }
}

export default SnippetsStore;
