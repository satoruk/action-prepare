import { replaceEnvVer } from "./strUtils";
import { setup, reset } from "./testUtils";

beforeEach(() => {
  setup();
  delete process.env.K0;
  process.env.K1 = "V1";
  process.env.K2 = "V2";
  process.env.K3 = "${K1}";
});
afterEach(() => {
  reset();
});

describe("replaceEnvVer", () => {
  test.each([
    ["_${K0}_", "__"],
    ["_${K1}_", "_V1_"],
    ["_${${K1}}_", "_${V1}_"],
    ["_${ K1 }_", "_V1_"],
    ["_${ K3 }_", "_${K1}_"],
    ["_${K1}_${K1}_", "_V1_V1_"],
    ["_${K1}_${K2}_", "_V1_V2_"],
  ])('replaceEnvVer("%s") to be "%s"', (str, expected) => {
    expect(replaceEnvVer(str)).toEqual(expected);
  });
});
