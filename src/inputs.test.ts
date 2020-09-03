import { loadInputs } from "./inputs";
import { setup, reset, actionWith } from "./testUtils";

beforeEach(() => {
  setup();
});
afterEach(() => {
  reset();
});

describe("loadInputs", () => {
  test.each([
    [
      "satisfied all params",
      { config_file: "dummy.yml" },
      { configFile: "dummy.yml" },
    ],
    [
      "satisfied all params with blank gpg_passphrase",
      { config_file: "dummy.yml", gpg_passphrase: "" },
      { configFile: "dummy.yml" },
    ],
    [
      "satisfied all params with gpg_passphrase",
      { config_file: "dummy.yml", gpg_passphrase: "pass" },
      { configFile: "dummy.yml", gpgPassphrase: "pass" },
    ],
  ])("loadInputs() with %s", async (_, params, expected) => {
    actionWith(params);
    const config = await loadInputs();
    expect(config).toStrictEqual(expected);
  });

  test.each([
    [
      "unsatisfied config file path",
      {}, //
      "Input required and not supplied: config_file",
    ],
  ])("loadInputs() with %s", async (_, params, expected) => {
    actionWith(params);
    const actual = loadInputs();
    await expect(actual).rejects.toThrow(Error);
    await expect(actual).rejects.toThrow(expected);
  });
});
