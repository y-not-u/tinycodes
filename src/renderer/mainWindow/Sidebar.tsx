import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { AiFillSetting } from 'react-icons/ai';
import { BsChevronRight, BsChevronDown } from 'react-icons/bs';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useStore } from '../contextProvider/storeContext';
import Modal from '../components/Modal';
import ContextMenu from '../components/ContextMenu';
import AllImage from '../../../assets/images/all.png';
import StarImage from '../../../assets/images/star.png';
// import TrashImage from '../../../assets/images/trash.png';
import LabelImage from '../../../assets/images/label.png';
import { productName, version } from '../../../release/app/package.json';
import './Sidebar.scss';

const Sidebar = () => {
  const store = useStore();
  const labelsRef = useRef(null);
  const [removeLabelModal, setRemoveLabelModal] = useState(false);
  const [labelName, setLabelName] = useState<string>();
  const [showLabels, setShowLabels] = useState(true);
  const labelsClasses = classNames('labels', { show: showLabels });

  useEffect(() => {
    (async () => {
      const showLabelsInPreferences = await window.electron.preferences.get(
        'labelsFolded'
      );
      if (showLabelsInPreferences !== undefined) {
        setShowLabels(showLabelsInPreferences as boolean);
      }
    })();
  }, []);

  const showRemoveLabelModal = (name?: string) => {
    if (!name) {
      return;
    }
    setRemoveLabelModal(true);
    setLabelName(name);
  };

  const handleRemoveLabel = () => {
    if (labelName) {
      const snippetIds = store?.labelStore.labels[labelName];
      snippetIds?.forEach((id) => {
        store?.snippetsStore.removeLabel(id, labelName);
      });
      store?.labelStore.remove(labelName);
    }
    setRemoveLabelModal(false);
  };

  const toggleLabelList = () => {
    setShowLabels(!showLabels);
    window.electron.preferences.set('labelsFolded', !showLabels);
  };

  return (
    <div className="sidebar">
      <div className="app-name">
        <span className="name">{productName}</span>
      </div>
      <SimpleBar className="modules">
        <NavLink to="all" className="section-item" activeClassName="actived">
          <img className="icon" src={AllImage} alt="" />
          <span className="title">所有片段</span>
        </NavLink>
        <NavLink to="star" className="section-item" activeClassName="actived">
          <img className="icon" src={StarImage} alt="" />
          <span className="title">收藏</span>
        </NavLink>
        {/*
      <p className="section-item">
        <img className="icon" src={TrashImage} alt="" />
        <span className="title">回收站</span>
      </p>
      <br />
      <br />
      <br />
      */}

        <section
          className="section-item"
          role="button"
          tabIndex={0}
          onClick={toggleLabelList}
          onKeyPress={() => {}}
        >
          <img className="icon" src={LabelImage} alt="" />
          <span className="title">标签</span>
          <div className="right-icon">
            {showLabels ? (
              <BsChevronDown color="gray" size={11} />
            ) : (
              <BsChevronRight color="gray" size={11} />
            )}
          </div>
        </section>
        <section className={labelsClasses} ref={labelsRef}>
          {store && (
            <ContextMenu
              areaRef={labelsRef}
              overlay={[
                // { label: '重命名', onClick: handleRemoveLabel },
                { label: '删除', onClick: showRemoveLabelModal },
              ]}
            >
              <>
                {Object.keys(store.labelStore.labels).map((name) => (
                  <div
                    className="label-item"
                    key={name}
                    title={name}
                    data-id={name}
                  >
                    {name}
                  </div>
                ))}
              </>
            </ContextMenu>
          )}
        </section>
      </SimpleBar>
      <div className="bottom-section">
        <NavLink to="setting">
          <AiFillSetting className="app-setting" color="#8a8a8a" />
        </NavLink>
        <span className="app-version">v{version}</span>
      </div>
      <Modal
        isOpen={removeLabelModal}
        onConfirm={handleRemoveLabel}
        onClose={() => setRemoveLabelModal(false)}
      >
        <h2>删除标签</h2>
        <br />
        <p>删除后，标签将会完全移除。</p>
      </Modal>
    </div>
  );
};

export default observer(Sidebar);
