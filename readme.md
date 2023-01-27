# mockable-ts

A very simple and lightweight library to mock code across integration tests.

## example

Suppose we have the following app:

```ts
// app.ts
import database from "./database";

export const run = () => {
  database.execute("DELETE * FROM users");
};

// database.ts
export default {
  execute: (sql: string) => {
    /* DB code */
  },
};
```

Now if we want to write an integration test that does not call the database, we can make the database code `mockable` like this:

```ts
// database.ts
import { mockable } from "mockable-ts";

export default mockable({
  execute: (sql: string) => {
    /* DB code */
  },
});
```

And in our unit test we can then `override` the database like this:

```ts
// app.spec.ts
import { override } from "mockable-ts";
import { run } from "./app";
import database from "./database";

describe("app", () => {
  it("deletes users", () => {
    override(database, {
      execute: (sql) => {
        console.log(`would execute SQL ${sql}`);
      },
    });
    run();
  });
});
```

## how does it work?

If you call `mockable` in production (NODE_ENV != 'TEST'), it just returns the value passed in, so it has absolutely no runtime performance impact. It only has a very small startup performance impact. If you call `mockable` in tests (NODE_ENV == 'TEST') it returns a proxy that forwards all calls to the original value passed into it, so it behaves exactly the same and code using it won't notice a difference. But the target value for those calls can then be swapped out at runtime using `override` or reset using `reset`

## why not use X instead?

### dependency injection

With dependency injections your whole codebase has to be written in a certain way. If that's not the case, good luck! If you consider using dependeny injection just for being able to mock out stuff... well, you probably shouldn't. If you have a more advanced use case where you need to swap out components based on configuration, the dependency injection might be the right choice.

### jest mocks

Jest mocks are really hacky and it's often not obvious how it behaves. Jest mocks out entire files by default, which is often not what you want. If you want to mock just a single function, it gets messy. In `mockable-ts` its much more explicit what is mockable and it's completely indepentent of the module system. So no hacks. Another problem with jest mocks is that you usually have to specify the path to the file **twice** which is not dry, and the second one usually gets forgotten.

here's what I mean:

```ts
import module from "./my-module";

jest.mock("./my-module"); //don't forget to add this!
```

## goals

- Provide functionality to make code mockable
- Provide functionality to mock code in tests
- Provide functionality to get original implementation and reset mocks
- Typesafety
- Infer types whenever possible
- No runtime performance impact
- As little startup performance impact as possible
- Easy refactoring
- Module-system agnostic

## non-goals

- Provide functionality to create mock objects (the stuff passed in to override)
- Provide functionality to verify interactions with mocks

## reference

### mockable<T extends object|function>(value: T): Proxy<T>

Wraps your object or function and returns a proxy that behaves exactly like the original. Wrap every object or function with this that you want to override in your tests. We recommend not wrapping anything until it's needed in a test.

### override<T>(proxy: Proxy<T>, value: T): void

Override the value of a proxy with a new one. Only call this in tests.

### reset(proxy: Proxy<any>): void

Reset a proxy to the original value

### resetAll(): void

Reset all proxies to the original value

### original<T>(proxy: Proxy<T>): T

Get the original value of a proxy

## license

MIT
