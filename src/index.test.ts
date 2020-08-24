import * as pkg from "./index";
import * as config from "./config";
import * as prepare from "./prepare";
import * as inputs from "./inputs";

beforeEach(() => {
  jest.clearAllMocks();
});

it("import keys", () => {
  expect(Object.keys(pkg).sort()).toStrictEqual(["run"]);
});

describe("run", () => {
  test("foo", async () => {
    const baseDir = "path/to/dummy";
    const valueInputs = {
      configFile: "config.yml",
    };
    const valueConfig = {
      env: {},
      files: {},
    };
    const spyLoadInputs = jest
      .spyOn(inputs, "loadInputs")
      .mockReturnValue(Promise.resolve(valueInputs));
    const spyLoadConfig = jest
      .spyOn(config, "loadConfig")
      .mockReturnValue(Promise.resolve(valueConfig));
    const spyPrepareEnv = jest
      .spyOn(prepare, "prepareEnv")
      .mockReturnValue(Promise.resolve());
    const spyPrepareFile = jest
      .spyOn(prepare, "prepareFile")
      .mockReturnValue(Promise.resolve());

    await pkg.run(baseDir);

    expect(spyLoadInputs).toBeCalledTimes(1);

    expect(spyLoadConfig).toBeCalledTimes(1);
    expect(spyLoadConfig).toHaveBeenCalledWith(valueInputs.configFile);

    expect(spyPrepareEnv).toBeCalledTimes(1);
    expect(spyPrepareEnv).toHaveBeenCalledWith(valueConfig);

    expect(spyPrepareFile).toBeCalledTimes(1);
    expect(spyPrepareFile).toHaveBeenCalledWith(baseDir, valueConfig);
  });
});
