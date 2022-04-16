import {
  NotFoundError,
  SyncLockError,
  UnauthorizedError,
} from '../../main/handles/webdav';
import {
  dismissNotify,
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from './notify';

export interface WebDavConfig {
  username: string;
  password: string;
  url: string;
}

const api = window.electron.webdav;
const { preferences } = window.electron;

async function auth(config: WebDavConfig): Promise<boolean> {
  try {
    notifyInfo('发送请求');
    await preferences.set('webdav', config);
    const isOk = await api.connect();
    dismissNotify();
    if (isOk) {
      notifySuccess('验证成功');
      return true;
    }
    notifyError('验证错误');
    return false;
  } catch (e) {
    if (typeof e === 'string') {
      notifyError(e);
    } else if (e instanceof NotFoundError) {
      notifyWarning('认证通过，路径不存在');
    } else if (e instanceof UnauthorizedError) {
      notifyError('验证错误');
    }
    return false;
  }
}

/**
 * Sync data between local and remote
 */
async function sync() {
  try {
    await api.sync();
  } catch (e) {
    if (typeof e === 'string') {
      notifyError(e);
    } else if (e instanceof SyncLockError) {
      notifyError('同步进行中');
    }
  }
}

const webdav = {
  auth,
  sync,
};

export default webdav;
