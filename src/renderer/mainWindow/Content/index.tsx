import { observer } from 'mobx-react';
import { useStore } from '../../contextProvider/storeContext';
import Empty from './Empty';
import Editor from './Editor';
import Viewer from './Viewer';
import './Content.scss';

const Content = () => {
  const store = useStore();

  let showView: React.ReactNode;
  switch (store?.appStore.mode) {
    case 'view':
      showView = <Viewer />;
      break;
    case 'new':
      showView = <Editor />;
      break;
    case 'edit':
      showView = <Editor />;
      break;
    default:
      showView = <Empty />;
  }

  return <div className="content">{showView}</div>;
};

export default observer(Content);
