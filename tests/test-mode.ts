import { test } from "uvu";
import { expect } from "@stackbuilders/assertive-ts";
import { mock, mockable, reset, resetAll } from "../src/index.js";

const mockableObject = mockable({
  a: () => 1 as number,
});

const mockableFunction = mockable(() => "1" as string);

test("calls correct code when not mocked", () => {
  expect(mockableObject.a()).toBeEqual(1);
  expect(mockableFunction()).toBeEqual("1");
});
test("calls mocked code when mocked", () => {
  mock(mockableObject, { a: () => 2 });
  mock(mockableFunction, () => "2");
  expect(mockableObject.a()).toBeEqual(2);
  expect(mockableFunction()).toBeEqual("2");
});
test("calls correct code when mocked and reset afterwards", () => {
  mock(mockableObject, { a: () => 2 });
  mock(mockableFunction, () => "2");
  reset(mockableObject);
  reset(mockableFunction);
  expect(mockableObject.a()).toBeEqual(1);
  expect(mockableFunction()).toBeEqual("1");
});

test("calls correct code when mocked and resetAll", () => {
  mock(mockableObject, { a: () => 2 });
  mock(mockableFunction, () => "2");
  resetAll();
  expect(mockableObject.a()).toBeEqual(1);
  expect(mockableFunction()).toBeEqual("1");
});

test.run();
