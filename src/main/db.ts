import StormDB from 'stormdb';
import { app } from 'electron';

const dbPath = `${app.getPath('userData')}/db.stormdb`;

// eslint-disable-next-line
console.log(`data file: ${dbPath}\r\n`);

// eslint-disable-next-line new-cap
const engine = new StormDB.localFileEngine(dbPath);
const db = new StormDB(engine);
const defaultData = { snippets: [], stars: [], labels: {}, trash: [] };

db.default(defaultData);

export default db;
