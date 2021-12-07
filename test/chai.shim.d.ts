declare namespace Chai {
  interface Assertion {
    force: Assertion
    matchSnapshot(contet: any): void // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
