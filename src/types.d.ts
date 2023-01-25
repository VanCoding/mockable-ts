declare module "mutable-proxy" {
  function DEFAULT<T extends object>(): {
    proxy: T;
    setTarget: (target: T) => void;
  };

  export default DEFAULT;
}
