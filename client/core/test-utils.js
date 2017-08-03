import expect from 'expect';

export function mockDispatch(expectedActions) {
  return (action) => {
    if (action && action.type) {
      const expectedAction = expectedActions.shift();
      expect(expectedAction).toExist(`Unexpected action ${action.type} was dispatched`);
      expect(action.type).toEqual(expectedAction.type);
    }
  };
}

export class MockFetch {
  constructor() {
    this.reset = this.reset.bind(this);
    this.resolveWith = this.resolveWith.bind(this);
    this.rejectWith = this.rejectWith.bind(this);
    this.fetch = this.fetch.bind(this);

    this.reset();
  }

  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  resolveWith(...args) {
    this.resolve(...args);
  }

  rejectWith(...args) {
    this.reject(...args);
  }

  fetch() {
    return this.promise;
  }
}
