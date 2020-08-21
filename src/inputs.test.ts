import { loadInputs } from "./inputs";
import { setup, reset, actionWith } from "./testUtils";

beforeEach(() => {
  jest.resetModules();
  setup();
});
afterEach(() => {
  reset();
});

describe("loadInputs", () => {
  test.each([
    [
      "satisfied all params",
      { "config-file": "dummy.yml" }, //
      { configFile: "dummy.yml" },
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
