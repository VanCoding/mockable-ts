import { test } from "uvu";
import { expect } from "@stackbuilders/assertive-ts";
import { override, mockable, reset, resetAll, original } from "../src/index.js";

const mockableObject = mockable({
  a: () => 1 as number,
});

const mockableFunction = mockable(() => "1" as string);

test("calls correct code when not mocked", () => {
  expect(mockableObject.a()).toBeEqual(1);
  expect(mockableFunction()).toBeEqual("1");
});

test("calls mocked code when mocked", () => {
  override(mockableObject, { a: () => 2 });
  override(mockableFunction, () => "2");
  expect(mockableObject.a()).toBeEqual(2);
  expect(mockableFunction()).toBeEqual("2");
});

test("calls correct code when mocked and reset afterwards", () => {
  override(mockableObject, { a: () => 2 });
  override(mockableFunction, () => "2");
  reset(mockableObject);
  reset(mockableFunction);
  expect(mockableObject.a()).toBeEqual(1);
  expect(mockableFunction()).toBeEqual("1");
});

test("calls correct code when mocked and resetAll", () => {
  override(mockableObject, { a: () => 2 });
  override(mockableFunction, () => "2");
  resetAll();
  expect(mockableObject.a()).toBeEqual(1);
  expect(mockableFunction()).toBeEqual("1");
});

test("returns original", () => {
  const real = {};
  const wrapped = mockable(real);

  expect(real).not.toBeEqual(wrapped);
  expect(real).toBeEqual(original(wrapped));
});

test.run();
