import useEventListener from '@use-it/event-listener';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { version } from '../../../release/app/package.json';
import { useStore } from '../contextProvider/storeContext';
import languages from './Content/languages';
import Modal from '../components/Modal';
import { EditorPref, WebDavPref } from '../../main/preferences';
import { Theme } from '../stores/app';
import { notifySuccess, notifyWarning } from '../utils/notify';
import webdav from '../utils/webdav';
import { APP_DOWNLOAD_URL } from '../../constants';

import './Setting.scss';

interface NewVersion {
  version: string;
  releaseDate: string;
}

interface WebDavConfig {
  username: string;
  password: string;
  url: string;
}

const defaultWebDavConfig: WebDavConfig = {
  username: '',
  password: '',
  url: '',
};

const Setting = () => {
  const store = useStore();
  const [shortcut, setShortcut] = useState('');
  const [defaultLang, setDefaultLang] = useState('text');
  const [newVersion, setNewVersion] = useState<NewVersion | null>(null);
  const [editorDefaultMode, setEditorDefaultMode] = useState<
    'readonly' | 'editable'
  >('readonly');
  const [webDavDialog, setWebDavDialog] = useState(false);
  const [webDavConfig, setWebDavConfig] = useState<WebDavConfig | null>(null);
  const quickWindowShortcutRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

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
        setEditorDefaultMode(editorPref.defaultMode);
      }
    })();
  }, []);

  useEffect(() => {
    window.electron.preferences
      .get<WebDavPref>('webdav')
      .then((config) => {
        setWebDavConfig(config);
        return true;
      })
      .catch(() => {});
  }, []);

  const openExternal = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('external')) {
      e.preventDefault();
      window.electron.shell.openExternal((target as HTMLAnchorElement).href);
    }
  };

  useEventListener('click', (e: Event) => {
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

  const handleOpenConfigWebDav = async () => {
    const config = await window.electron.preferences.get<WebDavConfig>(
      'webdav'
    );
    setWebDavConfig(config);
    setWebDavDialog(true);
  };

  const handleConfigWebDav = async () => {
    if (webDavConfig === null) return;

    const authed = await webdav.auth(webDavConfig);
    if (authed) {
      setWebDavDialog(false);
    }
  };

  const handleSyncWebDav = async () => {
    await webdav.sync();
    notifySuccess('同步成功');
  };

  const handleUpdatePartialWebDav = (config: Partial<WebDavConfig>) => {
    setWebDavConfig({ ...defaultWebDavConfig, ...webDavConfig, ...config });
  };

  const handleCheckUpdate = () => {
    window.electron.system.checkUpdate().catch(() => {
      notifyWarning('发送失败，轻检查网络');
    });
  };

  const handleSetDefaultLang = (val: string) => {
    window.electron.preferences.set('editor.defaultLang', val);
    setDefaultLang(val);
  };

  const handleSetTheme = (val: string) => {
    store?.appStore.setTheme(val as Theme);
  };

  const handleSetEditorDefaultMode = (val: string) => {
    window.electron.preferences.set('editor.defaultMode', val);
    setEditorDefaultMode(val as 'readonly' | 'editable');
  };

  const handleOpenSite = () => {
    setNewVersion(null);
    window.electron.shell.openExternal(APP_DOWNLOAD_URL);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="setting">
      <div className="setting-title">
        <h2>偏好设置</h2>
        <AiOutlineCloseCircle
          className="close-btn"
          size={22}
          onClick={handleGoBack}
        />
      </div>
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
        <div className="setting-item">
          <span>默认模式</span>
          <select
            value={editorDefaultMode}
            onChange={(e) => handleSetEditorDefaultMode(e.target.value)}
          >
            <option value="readonly">只读</option>
            <option value="editable">可编辑</option>
          </select>
        </div>
      </section>
      <section>
        <p className="title">数据</p>
        <div className="setting-item">
          <span>数据文件</span>
          <button type="button" onClick={handleExport}>
            导出
          </button>
        </div>
        <div className="setting-item">
          <span>WebDav</span>
          <div>
            <button
              className="sync-btn"
              type="button"
              onClick={handleSyncWebDav}
            >
              同步
            </button>
            <button type="button" onClick={handleOpenConfigWebDav}>
              设置
            </button>
          </div>
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
          <span>源码</span>
          <a className="external" href="https://github.com/y-not-u/tinycodes">
            github.com/y-not-u/tinycodes
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
      <Modal
        isOpen={webDavDialog}
        onClose={() => setWebDavDialog(false)}
        onConfirm={handleConfigWebDav}
        width="50%"
      >
        <div>
          Username:
          <input
            type="text"
            value={webDavConfig?.username}
            onChange={(e) =>
              handleUpdatePartialWebDav({ username: e.target.value })
            }
          />
        </div>
        <div>
          Password:
          <input
            value={webDavConfig?.password}
            type="password"
            onChange={(e) =>
              handleUpdatePartialWebDav({ password: e.target.value })
            }
          />
        </div>
        <div>
          URL:
          <input
            value={webDavConfig?.url}
            type="text"
            onChange={(e) => handleUpdatePartialWebDav({ url: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};

export default observer(Setting);
