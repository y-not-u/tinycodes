/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { net } from 'electron';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

const checkUpdate = async () => {
  const request = net.request({
    method: 'GET',
    protocol: 'https:',
    hostname: 'tiny-codes.netlify.com',
    port: 443,
    path: '/latest.yml',
  });

  const promise = new Promise<unknown>((resolve, reject) => {
    request.on('response', (resp) => {
      const body: Uint8Array[] = [];
      resp.on('data', (chunk) => {
        body.push(chunk);
      });

      resp.on('end', () => {
        const data = Buffer.concat(body).toString();
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
  request.end();
  return promise;
};

export { checkUpdate };
