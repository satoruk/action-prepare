import { assertConfig, loadConfig } from "./config";

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
  const baseDir = "src/fixtures";
  const dummy1Content = {
    env: {
      TOKEN: "DUMMY_TOKEN",
    },
    file: {
      "examples/dummy1.json": '{"dummy":"dummy1"}\n',
    },
  };

  test.each([
    [
      {
        configFile: "dummy1.yml",
      },
      dummy1Content,
    ],
    [
      {
        configFile: "dummy1.yml.gpg",
        gpgPassphrase: "secret stuff",
      },
      dummy1Content,
    ],
  ])("loadConfig(baseDir, %j)", async (inputs, expected) => {
    const config = await loadConfig(baseDir, inputs);
    expect(config).toStrictEqual(expected);
  });
});
