import * as openpgp from "openpgp";
import yaml from "js-yaml";
import { join } from "path";
import { promises } from "fs";
import { Inputs } from "./inputs";

export type Config = {
  mask?: string[];
  env?: {
    [k: string]:
      | string
      | {
          value: string;
          secret: boolean;
        };
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

export async function loadConfig(
  baseDir: string,
  inputs: Inputs
): Promise<Config> {
  if (inputs.gpgPassphrase) {
    return loadConfigWithGPGPassphrase(
      baseDir,
      inputs.configFile,
      inputs.gpgPassphrase
    );
  } else {
    return loadConfigFile(baseDir, inputs.configFile);
  }
}

export async function loadConfigFile(
  baseDir: string,
  path: string
): Promise<Config> {
  const { readFile } = promises;
  const absolutePath = join(baseDir, path);
  const raw = await readFile(absolutePath, "utf8");
  return loadConfigYaml(raw);
}

export async function loadConfigWithGPGPassphrase(
  baseDir: string,
  path: string,
  gpgPassphrase: string
): Promise<Config> {
  const { readFile } = promises;
  const absolutePath = join(baseDir, path);
  const content = await readFile(absolutePath);
  const { data: raw } = await openpgp.decrypt({
    message: await openpgp.message.read(content),
    passwords: [gpgPassphrase],
    format: "utf8",
  });
  return loadConfigYaml(raw);
}

export async function loadConfigYaml(raw: string): Promise<Config> {
  const config = yaml.safeLoad(raw);
  assertConfig(config);
  return config;
}
