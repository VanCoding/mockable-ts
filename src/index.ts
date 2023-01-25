/// <reference path="./types.d.ts" />
import makeProxy from "mutable-proxy";

const mockables = new WeakMap<
  object,
  { default: object; setTarget: (target: object) => void }
>();

const mocked = new Set<object>();

export const mockable =
  process.env.NODE_ENV !== "test"
    ? <T extends object>(v: T) => v
    : <T extends object>(value: T): T => {
        const { proxy, setTarget } = makeProxy();
        mockables.set(proxy, {
          default: value,
          setTarget,
        });
        setTarget(value);
        return proxy as T;
      };

export const mock = <T extends object>(mockable: T, mock: T) => {
  const entry = mockables.get(mockable);
  if (!entry) throw new Error("value is not mockable");
  entry.setTarget(mock);
  mocked.add(mockable);
};

export const reset = <T extends object>(mockable: T) => {
  const entry = mockables.get(mockable);
  if (!entry) throw new Error("value is not mockable");
  entry.setTarget(entry.default);
  mocked.delete(mockable);
};

export const resetAll = () => {
  for (const mockable of mocked) {
    reset(mockable);
  }
};
