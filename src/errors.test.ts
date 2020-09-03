import { ActionError, ConfigActionError } from "./errors";

describe("ActionError", () => {
  test.each([
    [
      "new ActionError()", //
      new ActionError(),
      "",
    ],
    [
      "new ActionError(string)", //
      new ActionError("foo"),
      "foo",
    ],
  ])("%s", (_, error, message) => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toStrictEqual(message);
    expect(error.stack).not.toBeUndefined();
  });
});

describe("ConfigActionError", () => {
  test.each([
    [
      "new ConfigActionError()", //
      new ConfigActionError(),
      "",
    ],
    [
      "new ConfigActionError(string)", //
      new ConfigActionError("foo"),
      "foo",
    ],
  ])("%s", (_, error, message) => {
    expect(error).toBeInstanceOf(ActionError);
    expect(error.message).toStrictEqual(message);
    expect(error.stack).not.toBeUndefined();
  });
});
