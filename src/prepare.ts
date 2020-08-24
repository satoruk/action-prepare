import { info, error, exportVariable } from "@actions/core";

import { Config } from "./config";
import { writeFile } from "./fsUtils";

export async function prepareEnv(config: Config): Promise<void> {
  if (!config.env) {
    return;
  }
  for (const k in config.env) {
    exportVariable(k, config.env[k]);
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
