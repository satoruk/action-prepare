import { prepareEnv, prepareFile } from "./prepare";

import noop from "lodash/noop";
import * as core from "@actions/core";

import * as fsUtils from "./fsUtils";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("prepareEnv", () => {
  test("without any env values", async () => {
    const spy = jest.spyOn(core, "exportVariable");
    spy.mockImplementation(() => {});

    const config = {};
    await prepareEnv(config);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("with an env value", async () => {
    const spy = jest.spyOn(core, "exportVariable");
    spy.mockImplementation(() => {});

    const config = {
      env: {
        dummyKey: "dummyValue",
      },
    };
    await prepareEnv(config);

    expect(spy).toHaveBeenCalledWith("dummyKey", "dummyValue");
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("prepareFile", () => {
  test("without any file values", async () => {
    const baseDir = "dummy";
    const config = {};
    const spy = jest.spyOn(fsUtils, "writeFile");
    spy.mockImplementation(() => Promise.resolve(true));
    await prepareFile(baseDir, config);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe("with an file value", () => {
    const baseDir = "dummy";
    const config = {
      file: {
        file1: "content1",
      },
    };
    let spyInfo: jest.SpyInstance<void, [string]>;
    let spyError: jest.SpyInstance<void, [string | Error]>;

    beforeEach(() => {
      spyInfo = jest.spyOn(core, "info");
      spyInfo.mockImplementation(noop);

      spyError = jest.spyOn(core, "error");
      spyError.mockImplementation(noop);
    });

    test("could write a file", async () => {
      const spy = jest.spyOn(fsUtils, "writeFile");
      spy.mockImplementation(() => Promise.resolve(true));

      await prepareFile(baseDir, config);

      expect(spy).toHaveBeenCalledWith(baseDir, "file1", "content1");
      expect(spy).toHaveBeenCalledTimes(1);

      expect(spyInfo).toHaveBeenCalledWith('wrote "file1"');
      expect(spyInfo).toHaveBeenCalledTimes(1);

      expect(spyError).toHaveBeenCalledTimes(0);
    });

    test("could not write a file", async () => {
      const spy = jest.spyOn(fsUtils, "writeFile");
      spy.mockImplementation(() => Promise.resolve(false));

      await prepareFile(baseDir, config);

      expect(spy).toHaveBeenCalledWith(baseDir, "file1", "content1");
      expect(spy).toHaveBeenCalledTimes(1);

      expect(spyInfo).toHaveBeenCalledTimes(0);

      expect(spyError).toHaveBeenCalledWith('could not write "file1"');
      expect(spyError).toHaveBeenCalledTimes(1);
    });
  });
});
