import { assertConfig, loadConfig } from "./config";
import { ConfigActionError } from "./errors";

describe("assertConfig", () => {
  test.each([
    ["pattern1", {}, {}],
    [
      "pattern2",
      { env: {}, file: {}, mask: [] },
      { env: {}, file: {}, mask: [] },
    ],
    [
      "pattern3",
      {
        env: {
          K1: "V1",
          K2: { value: "V2" },
          K3: { value: "V3", secret: false },
        },
        file: { "path/to/file1": "file1 value" },
        mask: ["mask1"],
      },
      {
        env: {
          K1: "V1",
          K2: { value: "V2" },
          K3: { value: "V3", secret: false },
        },
        file: { "path/to/file1": "file1 value" },
        mask: ["mask1"],
      },
    ],
  ])("assertConfig(%s) to be success", (_, data, expected) => {
    expect(() => {
      assertConfig(data);
    }).not.toThrow();
    expect(data).toStrictEqual(expected);
  });

  test.each([
    [
      "pattern1",
      { env: { K1: {} } },
      "should have required property 'value' at .env['K1']",
    ],
    [
      "pattern1",
      { env: { K1: { secret: false } } },
      "should have required property 'value' at .env['K1']",
    ],
    [
      "pattern1",
      { env: { "in.valid": "v1" } },
      "should NOT have additional properties at .env",
    ],
  ])("assertConfig(%s) to throw error", async (_, data, expected) => {
    const actual = () => {
      assertConfig(data);
    };
    expect(actual).toThrow(ConfigActionError);
    expect(actual).toThrow(expected);
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
