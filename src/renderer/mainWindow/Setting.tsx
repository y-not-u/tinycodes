import useEventListener from '@use-it/event-listener';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import yaml from 'js-yaml';
import semver from 'semver';
import { useRef, useEffect, useState } from 'react';
import { version } from '../../../release/app/package.json';
import { useStore } from '../contextProvider/storeContext';
import languages from './Content/languages';
import Modal from '../components/Modal';
import { EditorPref } from '../../main/preferences';
import { Theme } from '../stores/app';
import { APP_DOWNLOAD_URL } from '../../constants';

import './Setting.scss';

interface NewVersion {
  version: string;
  releaseDate: string;
}

const Setting = () => {
  const store = useStore();
  const [shortcut, setShortcut] = useState('');
  const [defaultLang, setDefaultLang] = useState('text');
  const [newVersion, setNewVersion] = useState<NewVersion | null>(null);
  const quickWindowShortcutRef = useRef<HTMLInputElement>(null);

  useEventListener(
    'keyup',
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        window.electron.preferences.set('shortcuts.quickWindow', '');
        window.electron.setting.shortcuts.quickWindow(shortcut, '');
        setShortcut('');
      } else if (
        (e.shiftKey || e.ctrlKey || e.altKey) &&
        !['Control', 'Shift', 'Alt'].includes(e.key)
      ) {
        const keys = [];
        if (e.ctrlKey) {
          keys.push('Ctrl');
        }
        if (e.shiftKey) {
          keys.push('Shift');
        }
        if (e.altKey) {
          keys.push('Alt');
        }
        if (e.key) {
          keys.push(e.key);
        }
        const newAccelerator = keys.join(' + ');
        window.electron.setting.shortcuts.quickWindow(shortcut, newAccelerator);
        setShortcut(newAccelerator);
        window.electron.preferences.set(
          'shortcuts.quickWindow',
          newAccelerator
        );
      }
    },
    quickWindowShortcutRef.current
  );

  useEffect(() => {
    (async () => {
      const editorPref = (await window.electron.preferences.get(
        'editor'
      )) as EditorPref;
      if (editorPref) {
        setDefaultLang(editorPref.defaultLang);
      }
    })();
  }, []);

  const openExternal = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('external')) {
      e.preventDefault();
      window.electron.shell.openExternal((target as HTMLAnchorElement).href);
    }
  };

  useEventListener('click', (e) => {
    openExternal(e);
  });

  useEffect(() => {
    (async () => {
      const quickWindowShortcut = await window.electron.preferences.get(
        'shortcuts.quickWindow'
      );
      if (quickWindowShortcut) {
        setShortcut(quickWindowShortcut as string);
      }
    })();
  }, []);

  const handleExport = () => {
    window.electron.file.save(
      '保存数据',
      'tiny-codes.json',
      '导出',
      JSON.stringify(store?.snippetsStore.snippets || {})
    );
  };

  const handleCheckUpdate = () => {
    window.electron.system
      .checkUpdate()
      .then((res) => {
        const updateData = yaml.load(res as string) as NewVersion;
        const { version: latestVersion } = updateData;
        if (semver.gt(latestVersion, version)) {
          setNewVersion(updateData);
        } else {
          toast.info('当前没有可用的更新', {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }

        return updateData;
      })
      .catch(() => {
        toast.warning('发送失败，轻检查网络', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const handleSetDefaultLang = (val: string) => {
    window.electron.preferences.set('editor.defaultLang', val);
    setDefaultLang(val);
  };

  const handleSetTheme = (val: string) => {
    store?.appStore.setTheme(val as Theme);
  };

  const handleOpenSite = () => {
    setNewVersion(null);
    window.electron.shell.openExternal(APP_DOWNLOAD_URL);
  };

  return (
    <div className="setting">
      <h2>偏好设置</h2>
      <section>
        <p className="title">外观</p>
        <div className="setting-item">
          <span>主题</span>
          <select
            value={store?.appStore.theme}
            onChange={(e) => handleSetTheme(e.target.value)}
          >
            <option value="system">跟随系统</option>
            <option value="light">轻白模式</option>
            <option value="dark">暗黑模式</option>
          </select>
        </div>
      </section>
      <section>
        <p className="title">快捷键</p>
        <div className="setting-item">
          <span>显示快捷窗口</span>
          <input
            className="shortcut-input"
            type="text"
            placeholder="设置快捷键"
            ref={quickWindowShortcutRef}
            value={shortcut}
            onChange={() => {}}
          />
        </div>
      </section>
      <section>
        <p className="title">编辑器</p>
        <div className="setting-item">
          <span>默认语言</span>
          <select
            value={defaultLang}
            onChange={(e) => handleSetDefaultLang(e.target.value)}
          >
            {languages.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section>
        <p className="title">导出</p>
        <div className="setting-item">
          <span>数据文件</span>
          <button type="button" onClick={handleExport}>
            导出
          </button>
        </div>
      </section>
      <section>
        <p className="title">版本</p>
        <div className="setting-item">
          <span>v{version}</span>
          <button type="button" onClick={handleCheckUpdate}>
            检查更新
          </button>
        </div>
      </section>
      <section>
        <p className="title">关于</p>
        <div className="setting-item">
          <span>官网</span>
          <a className="external" href="https://tiny-codes.netlify.com">
            tiny-codes.netlify.com
          </a>
        </div>
        <div className="setting-item">
          <span>反馈邮箱</span>
          <a className="external" href="mailto:xiangfeitian@pm.me">
            xiangfeitian@pm.me
          </a>
        </div>
      </section>
      <Modal
        isOpen={Boolean(newVersion)}
        onClose={() => setNewVersion(null)}
        okLabel="前往下载"
        onConfirm={handleOpenSite}
        width="50%"
      >
        <h2>发现新版本</h2>
        {newVersion?.releaseDate ? (
          <small>{dayjs(newVersion.releaseDate).format('YYYY-MM-DD')}</small>
        ) : null}
        <br />
        <br />
        <p>{newVersion?.version} 已经发布</p>
      </Modal>
    </div>
  );
};

export default observer(Setting);
