import { loadConfig } from "./config";
import { prepareEnv, prepareFile, prepareMask } from "./prepare";
import { loadInputs } from "./inputs";

export async function run(baseDir: string): Promise<void> {
  const inputs = await loadInputs();
  const config = await loadConfig(baseDir, inputs);

  await prepareMask(config);
  await prepareEnv(config);
  await prepareFile(baseDir, config);
}

/* istanbul ignore next */
if (require.main === module) {
  const baseDir = process.cwd();
  run(baseDir);
}
