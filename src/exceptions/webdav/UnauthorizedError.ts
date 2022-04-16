export default class WebDavUnauthorizedError extends Error {
  constructor(msg = 'unauthorized') {
    super(msg);
    this.name = 'WebDavUnauthorizedError';
  }
}
