import { endGroup, startGroup } from "@actions/core";

import { loadConfig } from "./config";
import { prepareEnv, prepareFile, prepareMask } from "./prepare";
import { loadInputs } from "./inputs";

export async function run(baseDir: string): Promise<void> {
  const inputs = await loadInputs();
  const config = await loadConfig(baseDir, inputs);

  startGroup("Setting mask values");
  await prepareMask(config);
  endGroup();
  startGroup("Exporting environment variables");
  await prepareEnv(config);
  endGroup();
  startGroup("Saving defined files");
  await prepareFile(baseDir, config);
  endGroup();
}

/* istanbul ignore next */
if (require.main === module) {
  const baseDir = process.cwd();
  run(baseDir);
}
