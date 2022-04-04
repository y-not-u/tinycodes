import { makeAutoObservable } from 'mobx';

class LabelStore {
  constructor() {
    makeAutoObservable(this);
    window.electron.db.label
      .all()
      .then((val) => {
        this.labels = val;
        return val;
      })
      .catch(() => {
        this.labels = {};
      });
  }

  labels: { [name: string]: string[] } = {};

  add(name: string) {
    this.labels[name.toString()] = [];
  }

  remove(name: string) {
    delete this.labels[name.toString()];
    window.electron.db.label.remove(name);
  }

  rename(before: string, after: string) {
    this.add(after);
    this.remove(before);
    window.electron.db.label.rename(before, after);
  }

  exists(name: string) {
    return Boolean(this.labels[`${name}`]);
  }

  addSnippet(name: string, id: string) {
    const nameString = name.toString();
    if (!this.exists(nameString)) {
      this.add(nameString);
    }
    this.labels[nameString].push(id);
    window.electron.db.label.update(name, this.labels[nameString].slice());
  }

  removeSnippet(name: string, id: string) {
    const nameString = name.toString();
    if (!this.exists(name)) {
      return;
    }
    this.labels[nameString] = this.labels[nameString].filter((i) => i !== id);
    window.electron.db.label.update(name, this.labels[nameString].slice());
  }
}

export default LabelStore;
