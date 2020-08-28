const PATTERN_ENV_VER = /\$\{\s*([a-zA-Z_]+[a-zA-Z0-9_]*)\s*\}/g;

export function replaceEnvVer(v: string) {
  return v.replace(PATTERN_ENV_VER, (_, key) => process.env[key] || "");
}
