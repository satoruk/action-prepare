import { error, exportVariable, info, setSecret } from "@actions/core";
import isString from "lodash/isString";

import { Config } from "./config";
import { writeFile } from "./fsUtils";

export async function prepareMask(config: Config): Promise<void> {
  if (!config.mask) {
    return;
  }
  for (const v of config.mask) {
    setSecret(v);
  }
}

export async function prepareEnv(config: Config): Promise<void> {
  if (!config.env) {
    return;
  }
  for (const k in config.env) {
    const env = config.env[k];
    if (isString(env)) {
      setSecret(env);
      exportVariable(k, env);
    } else {
      if (env.secret !== false) {
        setSecret(env.value);
      }
      exportVariable(k, env.value);
    }
  }
}

export async function prepareFile(
  baseDir: string,
  config: Config
): Promise<void> {
  if (!config.file) {
    return;
  }
  for (const filename in config.file) {
    const content = config.file[filename];
    const result = await writeFile(baseDir, filename, content);
    if (result) {
      info(`wrote "${filename}"`);
    } else {
      error(`could not write "${filename}"`);
    }
  }
}
