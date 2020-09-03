import * as core from "@actions/core";

import * as pkg from "./index";
import * as config from "./config";
import * as prepare from "./prepare";
import * as inputs from "./inputs";

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(core, "endGroup").mockReturnValue();
  jest.spyOn(core, "startGroup").mockReturnValue();
});

it("import keys", () => {
  expect(Object.keys(pkg).sort()).toStrictEqual(["run"]);
});

describe("run", () => {
  test("to success", async () => {
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
    expect(spyLoadConfig).toHaveBeenCalledWith(baseDir, valueInputs);

    expect(spyPrepareEnv).toBeCalledTimes(1);
    expect(spyPrepareEnv).toHaveBeenCalledWith(valueConfig);

    expect(spyPrepareFile).toBeCalledTimes(1);
    expect(spyPrepareFile).toHaveBeenCalledWith(baseDir, valueConfig);
  });

  test("to fail", async () => {
    const baseDir = "path/to/dummy";
    const valueInputs = {
      configFile: "config.yml",
    };
    const valueConfig = {
      env: {},
      files: {},
    };
    const error = new Error("dummy");
    const spyLoadInputs = jest
      .spyOn(inputs, "loadInputs")
      .mockReturnValue(Promise.reject(error));
    const spyLoadConfig = jest
      .spyOn(config, "loadConfig")
      .mockReturnValue(Promise.resolve(valueConfig));
    const spyPrepareEnv = jest
      .spyOn(prepare, "prepareEnv")
      .mockReturnValue(Promise.resolve());
    const spyPrepareFile = jest
      .spyOn(prepare, "prepareFile")
      .mockReturnValue(Promise.resolve());
    const spySetFailed = jest.spyOn(core, "setFailed").mockReturnValue();

    await pkg.run(baseDir);

    expect(spyLoadInputs).toBeCalledTimes(1);
    expect(spyLoadConfig).toBeCalledTimes(0);
    expect(spyPrepareEnv).toBeCalledTimes(0);
    expect(spyPrepareFile).toBeCalledTimes(0);
    expect(spySetFailed).toBeCalledTimes(1);
    expect(spySetFailed).toHaveBeenCalledWith(error);
  });
});
