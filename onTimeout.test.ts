import { onTimeout, DEFAULT_TIMEOUT_MS } from "./onTimeout";

const delay = (msec = 0) => new Promise((resolve) => setTimeout(resolve, msec));

describe("onTimeout", () => {
  describe("arguments", () => {
    it("default", async () => {
      const callback = jest.fn();
      const unsubscribe = onTimeout(callback);
      expect(callback).not.toHaveBeenCalled();
      await delay(DEFAULT_TIMEOUT_MS + 10);
      expect(callback).toHaveBeenCalled();
      unsubscribe();
    });
  });

  it("to call callback function", async () => {
    const callback = jest.fn();
    const unsubscribe = onTimeout(callback, 0);
    expect(callback).not.toHaveBeenCalled();
    await delay(10);
    expect(callback).toHaveBeenCalled();
    unsubscribe();
  });

  it("to cancel by unsubscribe", async () => {
    const callback = jest.fn();
    const unsubscribe = onTimeout(callback, 0);
    unsubscribe();
    await delay(10);
    expect(callback).not.toHaveBeenCalled();
  });
});
