import { promises } from "fs";
import { join } from "path";

import { mkTempDir, rmDir } from "./testUtils";
import { makeDir, writeFile, pathResolve } from "./fsUtils";

let baseDir: string;
beforeEach(async () => {
  baseDir = await mkTempDir("fsUtils-");
});
afterEach(async () => {
  await rmDir(baseDir);
});

describe("pathResolve", () => {
  test.each([
    [".", "/basePath"],
    ["a", "/basePath/a"],
    ["a/b", "/basePath/a/b"],
    ["/a/b", "/a/b"],
  ])('pathResolve(baseDir, "%s") to be "%s"', (path, expected) => {
    expect(pathResolve("/basePath", path)).toEqual(expected);
  });
});

describe("makeDir", () => {
  describe("make new directory", () => {
    test.each([["."], ["a"], ["a/b"]])(
      'makeDir(baseDir, "%s") to be true',
      async (path) => {
        const { stat } = promises;

        await expect(makeDir(baseDir, path)).resolves.toBe(true);

        const result = await stat(join(baseDir, path));
        expect(result.isDirectory()).toBe(true);
      }
    );
  });

  describe("already exists a directory", () => {
    const path = "a";
    beforeEach(async () => {
      const { mkdir } = promises;
      await mkdir(join(baseDir, path));
    });
    test(`makeDir(baseDir, "${path}") to be true`, async () => {
      await expect(makeDir(baseDir, path)).resolves.toBe(true);
    });
  });

  describe("already exists a text file", () => {
    const path = "a";
    beforeEach(async () => {
      const { writeFile } = promises;
      await writeFile(join(baseDir, path), "dummy");
    });
    test(`makeDir(baseDir, "${path}") to throw error`, async () => {
      const actual = makeDir(baseDir, path);
      await expect(actual).rejects.toThrow(Error);
      await expect(actual).rejects.toThrow(`not a directory: ${path}`);
    });
  });
});

describe("writeFile", () => {
  describe("make new text file", () => {
    test.each([["a"], ["a/b"]])(
      'writeFile(baseDir, "%s", "dummy") to be true',
      async (path) => {
        const { readFile } = promises;
        const content = "dummy";

        await expect(writeFile(baseDir, path, content)).resolves.toBe(true);

        await expect(
          readFile(join(baseDir, path), { encoding: "utf8" })
        ).resolves.toStrictEqual(content);
      }
    );
  });

  describe("already exists a directory", () => {
    const path = "a";
    beforeEach(async () => {
      const { mkdir } = promises;
      await mkdir(join(baseDir, path));
    });
    test(`writeFile(baseDir, "${path}", "dummy") to throw error`, async () => {
      const content = "dummy";
      const actual = writeFile(baseDir, path, content);

      // Error is dir
      await expect(actual).rejects.toThrow(/EISDIR/);
    });
  });

  describe("already exists a text file", () => {
    const path = "a";
    beforeEach(async () => {
      const { writeFile } = promises;
      await writeFile(join(baseDir, path), "foo");
    });
    test(`writeFile(baseDir, "${path}", "dummy") to be true`, async () => {
      const { readFile } = promises;
      const content = "dummy";
      await expect(writeFile(baseDir, path, content)).resolves.toBe(true);
      await expect(
        readFile(join(baseDir, path), { encoding: "utf8" })
      ).resolves.toStrictEqual(content);
    });
  });
});
