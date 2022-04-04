import { v4 as uuidv4 } from 'uuid';
import { Snippet } from '../@types/snippet';
import db from './db';

const SNIPPETS = 'snippets';
const STARS = 'stars';
const LABELS = 'labels';

export function newSnippet(val: Snippet) {
  val.id = uuidv4();
  val.datetime = +new Date();
  db.get(SNIPPETS).push(val);
  db.save();
  return val;
}

export function getSnippets() {
  return db.get(SNIPPETS).value();
}

export function findSnippet(id: string) {
  return db
    .get(SNIPPETS)
    .value()
    .find((i: Snippet) => i.id === id);
}

export function findSnippetIndex(id: string) {
  return db
    .get(SNIPPETS)
    .value()
    .findIndex((i: Snippet) => i.id === id);
}

export function updateSnippet(snippet: Snippet) {
  const index = findSnippetIndex(snippet.id);
  db.get(SNIPPETS).get(index).set(snippet).save();
}

export function removeSnippet(id: string) {
  const index = findSnippetIndex(id);
  db.get(SNIPPETS).get(index).delete(true);
  db.save();
}

export function getStars(): string[] {
  return db.get(STARS).value();
}

export function updateStars(vals: string[]) {
  db.get(STARS).set(vals).save();
}

export function getLabels(): string[] {
  return db.get(LABELS).value();
}

export function addLabel(name: string) {
  return db.get(LABELS).set(name, []).save();
}

export function removeLabel(name: string) {
  db.get(LABELS).get(name).delete(true);
  db.save();
}

export function renameLabel(before: string, after: string) {
  const val = db.get(LABELS).get(before).value();
  db.get(LABELS).set(after, val);
  db.get(LABELS).get(before).delete(true);
  db.save();
}

export function updateLabel(name: string, ids: string[]) {
  db.get(LABELS).set(name, ids).save();
}
