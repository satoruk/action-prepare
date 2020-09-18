import "source-map-support/register";
import { info } from "@actions/core";

export async function run(baseDir: string): Promise<void> {
  info("Hello World");
  info(`base dir: ${baseDir}`);
  const camelCase = require("lodash/camelCase");
  // const camelCase = require(process.env["MODULE"] || "lodash/camelCase");
  info(`camel case: ${camelCase("Foo Bar")}`);
  throw new Error("aa");
}

info(`require.main = ${require.main}`);
info(`module = ${module}`);
info(`require.main === module = ${require.main === module}`);
info(`process.cwd() = ${process.cwd()}`);
/* istanbul ignore next */
// if (require.main === module) {
const baseDir = process.cwd();
run(baseDir);
// }
