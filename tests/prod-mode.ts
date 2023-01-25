import { test } from "uvu";
import { expect } from "@stackbuilders/assertive-ts";
import { mockable } from "../src/index.js";

test("returns original value when not in test mode", () => {
  const value = {};
  expect(mockable(value)).toBeEqual(value);
});

test.run();
