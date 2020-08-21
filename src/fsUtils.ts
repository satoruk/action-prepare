import { promises } from "fs";
import { dirname, join } from "path";

export async function makeDir(baseDir: string, path: string): Promise<boolean> {
  const { mkdir, stat } = promises;

  if (path == ".") {
    return true;
  }

  const targetPath = join(baseDir, path);
  try {
    const result = await stat(targetPath);
    if (!result.isDirectory()) {
      throw new Error(`not a directory: ${path}`);
    }
  } catch (e) {
    if (e.code != "ENOENT") {
      throw e;
    }
    await mkdir(targetPath, { recursive: true });
  }
  return true;
}

export async function writeFile(
  baseDir: string,
  path: string,
  content: string
): Promise<boolean> {
  const { writeFile } = promises;
  const absolutePath = join(baseDir, path);
  const relativeDir = dirname(path);
  await makeDir(baseDir, relativeDir);
  await writeFile(absolutePath, content);
  return true;
}
