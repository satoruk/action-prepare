import * as openpgp from "openpgp";
import Ajv from "ajv";
import yaml from "js-yaml";
import { promises } from "fs";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";

import configSchema from "./config.schema.json";
import { ConfigActionError } from "./errors";
import { Inputs } from "./inputs";
import { pathResolve } from "./fsUtils";

export type Config = {
  mask?: string[];
  env?: {
    [k: string]:
      | string
      | {
          value: string;
          secret?: boolean;
        };
  };
  file?: {
    [k: string]: string;
  };
};

const ERROR_KEYWORD_ORDER = ["required", "type"].reverse();

export function assertConfig(v: unknown): asserts v is Config {
  const ajv = new Ajv();
  const validate = ajv.compile(configSchema);
  validate(v);
  if (validate.errors) {
    // sort by dataPath and keyword
    const errors = validate.errors;
    const groupedDataPathErrors = groupBy(errors, "dataPath");
    const dataPaths = sortBy(Object.keys(groupedDataPathErrors), "length");
    for (const dataPath of dataPaths) {
      const dataPathErrors = groupedDataPathErrors[dataPath];
      const sortedErrors = sortBy(
        dataPathErrors,
        (v) => -ERROR_KEYWORD_ORDER.indexOf(v.keyword)
      );
      for (const e of sortedErrors) {
        throw new ConfigActionError(`${e.message} at ${e.dataPath}`);
      }
    }
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
  const absolutePath = pathResolve(baseDir, path);
  const raw = await readFile(absolutePath, "utf8");
  return loadConfigYaml(raw);
}

export async function loadConfigWithGPGPassphrase(
  baseDir: string,
  path: string,
  gpgPassphrase: string
): Promise<Config> {
  const { readFile } = promises;
  const absolutePath = pathResolve(baseDir, path);
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
