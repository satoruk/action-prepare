import yaml from "js-yaml";
import { promises } from "fs";

export type Config = {
  env?: {
    [k: string]: string;
  };
  file?: {
    [k: string]: string;
  };
};

export function assertConfig(v: unknown): asserts v is Config {
  if (typeof v != "object" || v == null) {
    throw new TypeError("Not Config");
  }
}

export async function loadConfig(path): Promise<Config> {
  const { readFile } = promises;
  const raw = await readFile(path, "utf8");
  const config = yaml.safeLoad(raw);
  assertConfig(config);
  return config;
}
