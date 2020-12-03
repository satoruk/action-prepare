import { endGroup, startGroup, setFailed, warning } from "@actions/core";

import { ConfigActionError } from "./errors";
import { loadConfig } from "./config";
import { loadInputs } from "./inputs";
import { prepareEnv, prepareFile, prepareMask } from "./prepare";

export async function run(baseDir: string): Promise<void> {
  warning("Change default branch to `main` https://github.com/satoruk/action-prepare/issues/30")
  try {
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
  } catch (e) {
    setFailed(e);
  }
}

/* istanbul ignore next */
if (require.main === module) {
  const baseDir = process.cwd();
  run(baseDir);
}
