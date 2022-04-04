import { makeAutoObservable } from 'mobx';

class StarStore {
  constructor() {
    makeAutoObservable(this);
    window.electron.db
      .getStars()
      .then((val) => {
        this.ids = val;
        return val;
      })
      .catch(() => {
        this.ids = [];
      });
  }

  ids: string[] = [];

  add(id: string) {
    this.ids.push(id);
    window.electron.db.updateStars(this.ids.slice());
  }

  remove(id: string) {
    this.ids = this.ids.filter((i) => i !== id);
    window.electron.db.updateStars(this.ids.slice());
  }

  has(id: string) {
    return this.ids.includes(id);
  }
}

export default StarStore;
