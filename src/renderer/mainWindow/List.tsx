import { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import {
  AiOutlineSync,
  AiOutlineSortAscending,
  AiOutlineSearch,
} from 'react-icons/ai';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Snippet } from '../../@types/snippet';
import { useStore } from '../contextProvider/storeContext';
import FileIcon from '../components/FileIcon';
import DropdownMenu, { DropdownItem } from '../components/DropdownMenu';
import './List.scss';

const SnippetItem = (props: {
  value: Snippet;
  isSelected: boolean;
  onClick: (snippet: Snippet) => void;
}) => {
  const { value, isSelected, onClick } = props;
  const itemClasses = classNames('snippet', { actived: isSelected });
  const handleOnClick = () => {
    onClick(value);
  };
  return (
    <div
      className={itemClasses}
      onKeyUp={handleOnClick}
      onClick={handleOnClick}
      role="button"
      tabIndex={0}
      title={value.title}
    >
      <FileIcon lang={value.lang} />
      <span className="file-name">{value.title}</span>
    </div>
  );
};

const List = ({ filter }: { filter?: string }) => {
  const [syncing, setSyncing] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'time'>('time');
  const store = useStore();
  const appStore = store?.appStore;
  const snippetsStore = store?.snippetsStore;
  const starStore = store?.starStore;
  const newItemClass = classNames('new-snippet', 'actived', {
    'is-empty': !store?.appStore.newSnippetTitle?.trim(),
  });

  const handleSetSortBy = (val: typeof sortBy) => {
    setSortBy(val);
    window.electron.preferences.set('sortBy', val);
  };

  const menuItems = (
    <>
      <DropdownItem onClick={() => handleSetSortBy('title')}>
        按标题
      </DropdownItem>
      <DropdownItem onClick={() => handleSetSortBy('time')}>
        按时间
      </DropdownItem>
    </>
  );

  useEffect(() => {
    appStore?.setSelectedSnippetId(null);
    appStore?.setMode(null);
  }, [appStore, filter]);

  useEffect(() => {
    (async () => {
      const sortByInPreferences = await window.electron.preferences.get(
        'sortBy'
      );

      if (sortByInPreferences) {
        setSortBy(sortByInPreferences as typeof sortBy);
      }
    })();
  }, []);

  const getSnippets = useCallback(async () => {
    setSyncing(true);
    if (snippetsStore?.snippets) {
      const all = snippetsStore?.snippets;
      let sorted: Snippet[] = [];

      if (sortBy === 'title') {
        sorted = all.slice().sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'time') {
        sorted = all;
      }
      if (filter === 'all') {
        setSnippets(sorted);
      } else if (filter === 'star') {
        const starIds = starStore?.ids;
        if (starIds) {
          setSnippets(sorted.filter((i) => starIds.includes(i.id)));
        }
      }
    }

    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  }, [snippetsStore?.snippets, starStore, filter, sortBy]);

  useEffect(() => {
    getSnippets();
  }, [getSnippets]);

  const snippetsList = () => {
    if (search) {
      return snippets.filter((i) => i.title.indexOf(search) > -1);
    }
    return snippets;
  };

  const handleOnClick = (v: Snippet) => {
    appStore?.setSelectedSnippetId(v.id);
    appStore?.setMode('view');
  };

  const handleSearch = (val: string) => {
    setSearch(val);
  };

  return (
    <div className="list">
      <span className="search">
        <AiOutlineSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </span>
      <div className="toolbox">
        <button type="button" onClick={getSnippets}>
          <AiOutlineSync
            className={`icon ${syncing ? 'syncing' : ''}`}
            color="#8a8a8a"
          />
        </button>
        <DropdownMenu overlay={menuItems}>
          <button type="button">
            <AiOutlineSortAscending className="icon" color="#8a8a8a" />
          </button>
        </DropdownMenu>
      </div>
      {store?.appStore.mode === 'new' && (
        <div className={newItemClass}>
          {store?.appStore.newSnippetTitle || 'Untitled'}
        </div>
      )}
      <SimpleBar className="snippets">
        {snippetsList().map((i: Snippet) => (
          <SnippetItem
            key={i.id}
            value={i}
            isSelected={i.id === appStore?.selectedSnippetId}
            onClick={(v) => handleOnClick(v)}
          />
        ))}
      </SimpleBar>
    </div>
  );
};

List.defaultProps = {
  filter: 'all',
};

export default observer(List);
