import SyncLockError from './SyncLockError';
import UnauthorizedError from './UnauthorizedError';
import NotFoundError from './NotFoundError';

const errors = { NotFoundError, SyncLockError, UnauthorizedError };
export { NotFoundError, SyncLockError, UnauthorizedError };
export default errors;
