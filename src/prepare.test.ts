import { prepareEnv, prepareFile, prepareMask } from "./prepare";

import * as core from "@actions/core";

import * as fsUtils from "./fsUtils";
import { setup, reset } from "./testUtils";

let spyInfo: jest.SpyInstance<void, [string]>;
let spyError: jest.SpyInstance<void, [string | Error]>;
beforeEach(() => {
  jest.clearAllMocks();
  spyInfo = jest.spyOn(core, "info").mockReturnValue();
  spyError = jest.spyOn(core, "error").mockReturnValue();

  setup();
  process.env.K1 = "V1";
});
afterEach(() => {
  reset();
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

  test.each([
    ["dummyValue", "dummyValue"],
    ["_${K1}_", "_V1_"],
  ])('prepareMask("%s") to be "%s"', async (value, expected) => {
    const config = {
      mask: [value],
    };
    await prepareMask(config);

    expect(spyExportVariable).toHaveBeenCalledTimes(0);

    expect(spySetSecret).toHaveBeenCalledWith(expected);
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

  test.each([
    ["dummyValue", "dummyValue"],
    ["_${K1}_", "_V1_"],
  ])(
    'prepareEnv({ env: { dummyKey: "%s" } }) to be "%s"',
    async (value, expected) => {
      const config = {
        env: {
          dummyKey: value,
        },
      };
      await prepareEnv(config);

      expect(spyExportVariable).toHaveBeenCalledWith("dummyKey", expected);
      expect(spyExportVariable).toHaveBeenCalledTimes(1);

      expect(spySetSecret).toHaveBeenCalledWith(expected);
      expect(spySetSecret).toHaveBeenCalledTimes(1);
    }
  );

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
        dummyKey3: {
          value: "_${K1}_",
        },
      },
    };
    await prepareEnv(config);

    expect(spyExportVariable).toHaveBeenCalledWith("dummyKey1", "dummyValue1");
    expect(spyExportVariable).toHaveBeenCalledWith("dummyKey2", "dummyValue2");
    expect(spyExportVariable).toHaveBeenCalledWith("dummyKey3", "_V1_");
    expect(spyExportVariable).toHaveBeenCalledTimes(3);

    expect(spySetSecret).toHaveBeenCalledWith("dummyValue2");
    expect(spySetSecret).toHaveBeenCalledWith("_V1_");
    expect(spySetSecret).toHaveBeenCalledTimes(2);
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

    test.each([
      [
        { file1: "content1" }, //
        "file1",
        'wrote "file1"',
      ],
      [
        { "_${K1}_": "content1" }, //
        "_V1_",
        'wrote "_${K1}_"',
      ],
    ])("could write a file", async (file, filename, infoMsg) => {
      const config = { file };
      const spyWriteFile = jest.spyOn(fsUtils, "writeFile");
      spyWriteFile.mockImplementation(() => Promise.resolve(true));

      await prepareFile(baseDir, config);

      expect(spyWriteFile).toHaveBeenCalledWith(baseDir, filename, "content1");
      expect(spyWriteFile).toHaveBeenCalledTimes(1);

      expect(spyInfo).toHaveBeenCalledWith(infoMsg);
      expect(spyInfo).toHaveBeenCalledTimes(1);

      expect(spyError).toHaveBeenCalledTimes(0);
    });

    test("could not write a file", async () => {
      const config = {
        file: {
          file1: "content1",
        },
      };
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
