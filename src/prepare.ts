import { error, exportVariable, info, setSecret } from "@actions/core";
import isString from "lodash/isString";
import { replaceEnvVer } from "./strUtils";

import { Config } from "./config";
import { writeFile } from "./fsUtils";

export async function prepareMask(config: Config): Promise<void> {
  if (!config.mask) {
    return;
  }
  for (const v of config.mask) {
    setSecret(replaceEnvVer(v));
  }
}

export async function prepareEnv(config: Config): Promise<void> {
  if (!config.env) {
    return;
  }
  for (const k in config.env) {
    const env = config.env[k];
    if (isString(env)) {
      const value = replaceEnvVer(env);
      setSecret(value);
      exportVariable(k, value);
    } else {
      const value = replaceEnvVer(env.value);
      if (env.secret !== false) {
        setSecret(value);
      }
      exportVariable(k, value);
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
    const actualFilename = replaceEnvVer(filename);
    const result = await writeFile(baseDir, actualFilename, content);
    if (result) {
      info(`wrote "${filename}"`);
    } else {
      error(`could not write "${filename}"`);
    }
  }
}
