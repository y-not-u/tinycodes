import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { toast } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';
import Monaco from 'monaco-editor';
import useEventListener from '@use-it/event-listener';
import { languageName } from './languages';
import { useStore } from '../../contextProvider/storeContext';
import { Snippet } from '../../../@types/snippet';
import TopBar from './TopBar';
import MarkdownPreview from './MarkdownPreview';
import './Content.scss';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface IProps {
  editorTheme: 'light' | 'vs-dark';
}

const Viewer = (props: IProps) => {
  const { editorTheme } = props;
  const store = useStore();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const selectedSnippetId = store?.appStore.selectedSnippetId;
  const snippets = store?.snippetsStore.snippets;

  const [snippet, setSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    const found = snippets?.slice().find((i) => i.id === selectedSnippetId);
    if (found) {
      setSnippet(found);
    }
  }, [selectedSnippetId, snippets]);

  useEventListener('resize', () => {
    editorRef.current?.layout();
  });

  const handleEditorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
  };

  const handleWriteClipboard = () => {
    if (editorRef.current) {
      window.electron.clipboard.write(editorRef.current.getValue());
    } else if (snippet) {
      window.electron.clipboard.write(snippet.content);
    }
    toast.success('成功复制到剪贴板', {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  return (
    <>
      <TopBar snippet={snippet} />
      <h2 className="title">{snippet?.title}</h2>
      <span className="datetime">
        {dayjs().diff(dayjs(snippet?.datetime), 'day', true) > 1
          ? dayjs(snippet?.datetime).format('YYYY-MM-DD HH:mm:ss')
          : dayjs(snippet?.datetime).fromNow()}
      </span>
      <div className="data">
        <button className="copy" type="button" onClick={handleWriteClipboard}>
          复制
        </button>
        {snippet?.lang === 'markdown' ? (
          <MarkdownPreview value={snippet.content} />
        ) : (
          <MonacoEditor
            onMount={handleEditorDidMount}
            value={snippet?.content}
            theme={editorTheme}
            options={{ readOnly: true }}
            language={snippet?.lang}
          />
        )}
      </div>
      <div className="bottom-toolbox">
        <span className="lang">{languageName(snippet?.lang)}</span>
      </div>
    </>
  );
};

export default observer(Viewer);
