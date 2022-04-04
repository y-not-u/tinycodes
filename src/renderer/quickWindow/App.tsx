/* eslint-disable jsx-a11y/no-autofocus */
import { useEffect, useRef, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import { observer } from 'mobx-react';
import { Snippet } from '../../@types/snippet';
import './App.scss';

const rowHeight = 55;

const App: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const updateSnippets = (_: unknown, data: Snippet[]) => {
    setSnippets(data);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('snippets', updateSnippets);
    return () => {
      window.electron.ipcRenderer.removeListener('snippets', updateSnippets);
    };
  }, []);

  const snippetsList = () => {
    if (!search) {
      return snippets;
    }

    return snippets.filter((i) => i.title.indexOf(search) > -1);
  };

  const handleSearchUpdate = (text: string) => {
    setSearch(text);
    setSelectedIndex(0);
  };

  const hideWindow = () => {
    window.electron.windowManage.closeQuickWindow();
  };

  const handleSnippetSelected = () => {
    const data = snippetsList();
    window.electron.clipboard.write(data[selectedIndex].content);
    setSelectedIndex(0);
    setSearch('');
    hideWindow();
  };

  const isItemInViewPort = (index: number) => {
    const listEle = listRef.current;
    if (!listEle) {
      return false;
    }

    const viewHeight = listEle.offsetHeight;
    const itemsVisibleCount = Math.floor(viewHeight / rowHeight);
    const scrolled = Math.floor(listEle.scrollTop / rowHeight);
    if (index > scrolled && index < itemsVisibleCount + scrolled) {
      return true;
    }
    return false;
  };

  const onKeyPress = (event: KeyboardEvent) => {
    const { keyCode } = event;

    if ([38, 40].includes(keyCode)) {
      event.preventDefault();
    }

    // key up
    if (keyCode === 38) {
      const nextIndex = selectedIndex - 1 >= 0 ? selectedIndex - 1 : 0;
      const isInViewPort = isItemInViewPort(nextIndex);
      setSelectedIndex(nextIndex);

      if (!isInViewPort) {
        if (listRef.current) {
          listRef.current.scrollTop = (selectedIndex - 1) * 35;
        }
      }
    }

    // key down
    if (keyCode === 40) {
      const nextIndex =
        selectedIndex + 1 === snippetsList().length ? 0 : selectedIndex + 1;
      const isInViewPort = isItemInViewPort(nextIndex);
      setSelectedIndex(nextIndex);
      if (!isInViewPort) {
        if (listRef.current) {
          listRef.current.scrollTop = nextIndex * 35;
        }
      }
    }

    // escape
    if (keyCode === 27) {
      setSelectedIndex(-1);
      setSearch('');
      hideWindow();
    }

    if (keyCode === 13) {
      handleSnippetSelected();
    }
  };

  useEventListener('keydown', onKeyPress);
  return (
    <div className="quick-window">
      <div className="header">
        贴码
        <button className="close-btn" type="button" onClick={hideWindow}>
          &times;
        </button>
      </div>
      <div className="search">
        <input
          className="search-input"
          type="text"
          value={search}
          placeholder="搜索"
          onChange={(e) => handleSearchUpdate(e.target.value)}
        />
      </div>
      <div className="line" />
      <div className="quick-list" ref={listRef}>
        {snippetsList().map((i, index) => (
          <button
            key={i.id}
            className={`snippet ${selectedIndex === index ? 'actived' : ''}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            onDoubleClick={handleSnippetSelected}
          >
            {i.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default observer(App);
