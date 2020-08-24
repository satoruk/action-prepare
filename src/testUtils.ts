import { promises } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { promisify } from "util";

import rimraf from "rimraf";

function getInputName(name: string): string {
  return `INPUT_${name.replace(/ /g, "_").toUpperCase()}`;
}

export function setInput(name: string, value: string): void {
  process.env[getInputName(name)] = value;
}

const OLD_ENV = process.env;

export function actionWith(params: { [k: string]: string }) {
  for (const [name, value] of Object.entries(params)) {
    setInput(name, value);
  }
}

export function setup() {
  process.env = { ...OLD_ENV };
}

export function reset() {
  process.env = OLD_ENV;
}

export async function mkTempDir(prefix: string) {
  const { mkdtemp } = promises;
  return mkdtemp(join(tmpdir(), prefix));
}

export async function rmDir(path: string) {
  const rm = promisify(rimraf);
  return rm(path);
}
