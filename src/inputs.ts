import { getInput } from "@actions/core";

export type Inputs = {
  configFile: string;
  gpgPassphrase?: string;
};

function getRequiredInput(name: string): string {
  return getInput(name, { required: true });
}

function getOptionalInput(name: string): string | void {
  const value = getInput(name);
  if (value == "") {
    return;
  }
  return value;
}

export async function loadInputs(): Promise<Inputs> {
  const configFile = getRequiredInput("config-file");
  let result: Inputs = {
    configFile,
  };

  const gpgPassphrase = getOptionalInput("gpg-passphrase");
  if (gpgPassphrase) {
    result = { ...result, gpgPassphrase };
  }

  return result;
}
