export default class WebDavNotFoundError extends Error {
  constructor(msg = 'not found') {
    super(msg);
    this.name = 'WebDavNotFoundError';
  }
}
