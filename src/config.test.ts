import { promises } from "fs";

import { loadConfig, assertConfig } from "./config";

beforeEach(() => {
  jest.resetModules();
});

describe("assertConfig", () => {
  test.each([
    ["string", "dummy"],
    ["null", null],
  ])("assertConfig(%s) to throw error", async (_, arg) => {
    expect(() => {
      assertConfig(arg);
    }).toThrowError(new Error("Not Config"));
  });
});

describe("loadConfig", () => {
  test.each([
    [
      "normal1",
      [
        "env:",
        "  TOKEN: DUMMY_TOKEN",
        "file:",
        "  examples/dummy1.json: |",
        "    {",
        '      "dummy": "dummy1"',
        "    }",
        "",
      ].join("\n"),
      {
        env: {
          TOKEN: "DUMMY_TOKEN",
        },
        file: {
          "examples/dummy1.json": '{\n  "dummy": "dummy1"\n}\n',
        },
      },
    ],
  ])("loadConfig(file %s)", async (_, content, expected) => {
    jest.spyOn(promises, "readFile").mockReturnValue(Promise.resolve(content));
    const config = await loadConfig("dummy_config.yml");
    expect(config).toStrictEqual(expected);
  });
});
