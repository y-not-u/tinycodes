/* eslint-disable */
const fs = require('fs');

export function deleteFiles(path) {
  fs.rmdir(path, { recursive: true, force: true }, (err) => {
    const action = `Delete path "${path}"`;
    if (err) {
      console.error(`Failed: ${action}`, err);
    } else {
      console.log(`Success: ${action}`);
    }
  });
}

deleteFiles('release/app/dist');
deleteFiles('release/app/node_modules');
deleteFiles('release/build');
