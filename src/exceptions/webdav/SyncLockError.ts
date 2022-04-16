export default class WebDavSyncLockError extends Error {
  constructor(msg = 'sync lock') {
    super(msg);
    this.name = 'WebDavSyncLockError';
  }
}
