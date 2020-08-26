import { prepareEnv, prepareFile, prepareMask } from "./prepare";

import noop from "lodash/noop";
import * as core from "@actions/core";

import * as fsUtils from "./fsUtils";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("prepareMask", () => {
  let spyExportVariable: jest.SpyInstance<void, [string, string]>;
  let spySetSecret: jest.SpyInstance<void, [string]>;
  beforeEach(() => {
    spyExportVariable = jest.spyOn(core, "exportVariable").mockReturnValue();
    spySetSecret = jest.spyOn(core, "setSecret").mockReturnValue();
  });

  test("without any values", async () => {
    const config = {};
    await prepareMask(config);

    expect(spyExportVariable).toHaveBeenCalledTimes(0);
    expect(spySetSecret).toHaveBeenCalledTimes(0);
  });

  test("with a string value", async () => {
    const config = {
      mask: ["dummyValue"],
    };
    await prepareMask(config);

    expect(spyExportVariable).toHaveBeenCalledTimes(0);

    expect(spySetSecret).toHaveBeenCalledWith("dummyValue");
    expect(spySetSecret).toHaveBeenCalledTimes(1);
  });
});

describe("prepareEnv", () => {
  let spyExportVariable: jest.SpyInstance<void, [string, string]>;
  let spySetSecret: jest.SpyInstance<void, [string]>;
  beforeEach(() => {
    spyExportVariable = jest.spyOn(core, "exportVariable").mockReturnValue();
    spySetSecret = jest.spyOn(core, "setSecret").mockReturnValue();
  });

  test("without any values", async () => {
    const config = {};
    await prepareEnv(config);

    expect(spyExportVariable).toHaveBeenCalledTimes(0);
    expect(spySetSecret).toHaveBeenCalledTimes(0);
  });

  test("with a string value", async () => {
    const config = {
      env: {
        dummyKey: "dummyValue",
      },
    };
    await prepareEnv(config);

    expect(spyExportVariable).toHaveBeenCalledWith("dummyKey", "dummyValue");
    expect(spyExportVariable).toHaveBeenCalledTimes(1);

    expect(spySetSecret).toHaveBeenCalledTimes(0);
  });

  test("with object values", async () => {
    const config = {
      env: {
        dummyKey1: {
          value: "dummyValue1",
          secret: false,
        },
        dummyKey2: {
          value: "dummyValue2",
          secret: true,
        },
      },
    };
    await prepareEnv(config);

    expect(spyExportVariable).toHaveBeenCalledWith("dummyKey1", "dummyValue1");
    expect(spyExportVariable).toHaveBeenCalledWith("dummyKey2", "dummyValue2");
    expect(spyExportVariable).toHaveBeenCalledTimes(2);

    expect(spySetSecret).toHaveBeenCalledWith("dummyValue2");
    expect(spySetSecret).toHaveBeenCalledTimes(1);
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
