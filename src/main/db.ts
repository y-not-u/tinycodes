import StormDB from 'stormdb';
import { app } from 'electron';

const dbPath = `${app.getPath('userData')}/db.stormdb`;

// eslint-disable-next-line new-cap
const engine = new StormDB.localFileEngine(dbPath);
const db = new StormDB(engine);

db.default({ snippets: [], stars: [], labels: {}, trash: [] });

export default db;
