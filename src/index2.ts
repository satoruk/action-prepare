import { info } from "@actions/core";

export async function run(baseDir: string): Promise<void> {
  info("Hello World");
  info(`base dir: ${baseDir}`);
  // const camelCase = require("lodash/camelCase");
  const camelCase = require(process.env["MODULE"] || "lodash/camelCase");
  info(`camel case: ${camelCase("Foo Bar")}`);
}

/* istanbul ignore next */
if (require.main === module) {
  const baseDir = process.cwd();
  run(baseDir);
}
