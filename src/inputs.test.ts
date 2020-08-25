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
      { "config-file": "dummy.yml" },
      { configFile: "dummy.yml" },
    ],
    [
      "satisfied all params with blank gpg-passphrase",
      { "config-file": "dummy.yml", "gpg-passphrase": "" },
      { configFile: "dummy.yml" },
    ],
    [
      "satisfied all params with gpg-passphrase",
      { "config-file": "dummy.yml", "gpg-passphrase": "pass" },
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
      new Error("Input required and not supplied: config-file"),
    ],
  ])("loadInputs() with %s", async (_, params, expected) => {
    actionWith(params);
    return expect(loadInputs()).rejects.toThrowError(expected);
  });
});
