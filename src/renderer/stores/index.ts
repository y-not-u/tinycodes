import SnippetsStore from './snippets';
import AppStore from './app';
import StarStore from './star';
import LabelStore from './label';

class RootStore {
  snippetsStore: SnippetsStore;

  appStore: AppStore;

  starStore: StarStore;

  labelStore: LabelStore;

  constructor() {
    this.snippetsStore = new SnippetsStore();
    this.appStore = new AppStore();
    this.starStore = new StarStore();
    this.labelStore = new LabelStore();
  }
}

export default RootStore;
