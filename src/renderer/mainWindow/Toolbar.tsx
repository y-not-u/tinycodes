import { WindowsControls } from 'react-windows-controls';
import { AiOutlinePlus } from 'react-icons/ai';
import { useStore } from '../contextProvider/storeContext';
import './Toolbar.scss';

const Toolbar = () => {
  const store = useStore();
  const handleClose = () => {
    window.electron.windowManage.close();
  };
  const handleMaximize = () => {
    window.electron.windowManage.maximize();
  };
  const handleMinimize = () => {
    window.electron.windowManage.minimize();
  };

  const handleNewSnippet = () => {
    store?.appStore.setSelectedSnippetId(null);
    store?.appStore.setMode('new');
  };

  return (
    <div className="toolbar">
      <button className="new-button" type="button" onClick={handleNewSnippet}>
        <AiOutlinePlus size="1.1rem" />
        添加新片段
      </button>
      {window.electron.process.platform === 'linux' ? null : (
        <div className="window-control">
          <WindowsControls
            style={{ height: '40px' }}
            isMaximized
            dark={store?.appStore.theme === 'dark'}
            onClose={handleClose}
            onMaximize={handleMaximize}
            onMinimize={handleMinimize}
          />
        </div>
      )}
    </div>
  );
};

export default Toolbar;
