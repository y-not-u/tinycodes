import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { EditorPref } from '../../../main/preferences';
import { useStore } from '../../contextProvider/storeContext';
import Empty from './Empty';
import Editor from './Editor';
import Viewer from './Viewer';
import './Content.scss';

const Content = () => {
  const store = useStore();
  const theme = store?.appStore?.theme;

  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>('light');
  const [editorMode, setEditorMode] = useState<'readonly' | 'editable'>(
    'readonly'
  );

  useEffect(() => {
    switch (theme) {
      case 'dark':
        setEditorTheme('vs-dark');
        break;
      case 'light':
        setEditorTheme('light');
        break;
      case 'system':
        (async () => {
          const isDarkMode = await window.electron.system.isDarkMode();
          if (isDarkMode) {
            setEditorTheme('vs-dark');
          } else {
            setEditorTheme('light');
          }
        })();
        break;
      default:
        break;
    }
  }, [theme]);

  useEffect(() => {
    (async () => {
      const editorPref = (await window.electron.preferences.get(
        'editor'
      )) as EditorPref;
      if (editorPref) {
        setEditorMode(editorPref.defaultMode);
      }
    })();
  }, []);

  let showView: React.ReactNode;
  switch (store?.appStore.mode) {
    case 'view':
      showView = (
        <Viewer
          editorTheme={editorTheme}
          readonly={editorMode === 'readonly'}
        />
      );
      break;
    case 'new':
      showView = <Editor editorTheme={editorTheme} />;
      break;
    case 'edit':
      showView = <Editor editorTheme={editorTheme} />;
      break;
    default:
      showView = <Empty />;
  }

  return <div className="content">{showView}</div>;
};

export default observer(Content);
