import { getInput } from "@actions/core";

type Inputs = {
  configFile: string;
};

export async function loadInputs(): Promise<Inputs> {
  const configFile = getInput("config-file", { required: true });
  const result: Inputs = {
    configFile,
  };
  return result;
}
