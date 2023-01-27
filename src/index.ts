/// <reference path="./types.d.ts" />
import makeProxy from "mutable-proxy";

type MockableEntry<T extends object> = {
  default: T;
  setTarget: (target: T) => void;
};

const mockables = new WeakMap<object, MockableEntry<any>>();

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

const getEntry = <T extends object>(mockable: T) => {
  const entry = mockables.get(mockable);
  if (!entry) throw new Error("value is not mockable");
  return entry;
};

export const override = <T extends object>(mockable: T, mock: T) => {
  const entry = getEntry(mockable);
  entry.setTarget(mock);
  mocked.add(mockable);
};

export const original = <T extends object>(mockable: T): T =>
  getEntry(mockable)!.default;

export const reset = <T extends object>(mockable: T) => {
  const entry = getEntry(mockable);
  entry.setTarget(entry.default);
  mocked.delete(mockable);
};

export const resetAll = () => {
  for (const mockable of mocked) {
    reset(mockable);
  }
};
