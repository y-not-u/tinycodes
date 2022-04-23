import ReactTooltip from 'react-tooltip';
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/dist/tagify.css';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import Tagify from '@yaireo/tagify';
import { observer } from 'mobx-react';
import { AiFillStar, AiOutlineStar, AiOutlineShareAlt } from 'react-icons/ai';
import { GoKebabVertical } from 'react-icons/go';
import { Snippet } from '../../../@types/snippet';
import DropdownMenu, { DropdownItem } from '../../components/DropdownMenu';
import { useStore } from '../../contextProvider/storeContext';
import Modal from '../../components/Modal';
import { base64_encode } from 'renderer/utils/helper';

const TopBar = ({ snippet }: { snippet: Snippet | null }) => {
  const store = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const tagifyRef = useRef<Tagify>();
  const tagOptions = Object.keys(store?.labelStore.labels || {}) || [];

  useEffect(() => {
    const addHandler = (
      e: CustomEvent<Tagify.AddEventData<Tagify.TagData>>
    ) => {
      if (snippet && e.detail.data) {
        const label = e.detail.data.value;
        store?.labelStore.addSnippet(label, snippet.id);
        store?.snippetsStore.addLabel(snippet.id, label);
      }
    };

    const removeHandler = (
      e: CustomEvent<Tagify.RemoveEventData<Tagify.TagData>>
    ) => {
      if (snippet && e.detail.data) {
        const label = e.detail.data.value;
        store?.labelStore.removeSnippet(label, snippet.id);
        store?.snippetsStore.removeLabel(snippet.id, label);
      }
    };

    const changeHandler = (
      e: CustomEvent<Tagify.ChangeEventData<Tagify.TagData>>
    ) => {
      if (snippet) {
        store?.snippetsStore.updateLabels(
          snippet.id,
          e.detail.tagify.value.map((i) => i.value)
        );
      }
    };
    tagifyRef.current?.on('add', addHandler);
    tagifyRef.current?.on('remove', removeHandler);
    // tagifyRef.current?.on('change', changeHandler);

    const tg = tagifyRef.current;
    return () => {
      tg?.off('remove', removeHandler);
      tg?.off('add', addHandler);
      tg?.off('change', changeHandler);
    };
  }, [snippet, store]);

  const handleEdit = () => {
    store?.appStore.setMode('edit');
  };

  const handleRemove = () => {
    if (snippet && store) {
      store.appStore.setSelectedSnippetId(null);
      store.appStore.setMode(null);
      store.snippetsStore.remove(snippet.id);
      store.starStore.remove(snippet.id);
      toast.success('删除成功', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
      });
      setShowConfirm(false);
    }
  };

  const handleToggleStar = () => {
    const starStore = store?.starStore;
    if (snippet) {
      const { id } = snippet;
      if (starStore?.has(id) === false) {
        starStore?.add(id);
      } else {
        starStore?.remove(id);
      }
    }
  };

  const getShareURL = (): string => {
    if (!snippet) {
      return '';
    }
    const COLORS = 'midnight';
    const BACKGROUND = 'true';
    const DARK_MODE = 'true';
    const PADDING = '64';
    const LANGUAGE = snippet.lang;
    const TITLE = snippet.title;
    const CODE = base64_encode(snippet.content);

    const url = `https://ray.so/?colors=${COLORS}&background=${BACKGROUND}&darkMode=${DARK_MODE}&padding=${PADDING}&title=${TITLE}&code=${CODE}&language=${LANGUAGE}`;
    return url;
  };

  const openShareURL = () => {
    const url = getShareURL();
    window.electron.shell.openExternal(url);
  };

  const copyShareURL = () => {
    const url = getShareURL();
    window.electron.clipboard.write(url);
  };

  const menuItems = (
    <>
      <DropdownItem onClick={handleEdit}>编辑</DropdownItem>
      <DropdownItem onClick={() => setShowConfirm(true)}>删除</DropdownItem>
    </>
  );

  const shareMenuItems = (
    <>
      <DropdownItem onClick={copyShareURL}>复制URL</DropdownItem>
      <DropdownItem onClick={openShareURL}>打开URL</DropdownItem>
    </>
  );

  return (
    <div className="content-bar">
      {store?.appStore.mode === 'new' ? (
        <span />
      ) : (
        <Tags
          tagifyRef={tagifyRef}
          className="tags"
          value={snippet?.labels || []}
          placeholder="添加标签"
          settings={{ editTags: false }}
          whitelist={tagOptions}
        />
      )}
      <div className="actions">
        <button className="action-btn" type="button" onClick={handleToggleStar}>
          {snippet && store?.starStore.has(snippet.id) ? (
            <AiFillStar className="icon" color="#f8a131" />
          ) : (
            <AiOutlineStar className="icon" color="#8a8a8a" />
          )}
        </button>
        <DropdownMenu overlay={shareMenuItems}>
          <button className="action-btn" type="button">
            <AiOutlineShareAlt className="icon" color="#8a8a8a" />
          </button>
        </DropdownMenu>
        <DropdownMenu overlay={menuItems}>
          <button className="action-btn" type="button">
            <GoKebabVertical className="icon" color="#8a8a8a" />
          </button>
        </DropdownMenu>
        <ReactTooltip
          className="tooltip"
          effect="solid"
          delayShow={500}
          place="bottom"
        />
      </div>
      <Modal
        isOpen={showConfirm}
        width="50%"
        onConfirm={handleRemove}
        onClose={() => setShowConfirm(false)}
      >
        <h2>删除片段</h2>
        <br />
        <p>删除后，片段将会完全移除。</p>
      </Modal>
    </div>
  );
};
export default observer(TopBar);
