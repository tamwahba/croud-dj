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

export class MockPromise {
  constructor() {
    this.reset = this.reset.bind(this);
    this.resolveWith = this.resolveWith.bind(this);
    this.rejectWith = this.rejectWith.bind(this);

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
}

export const MockRef = (path) => {
  const childReturns = [];
  const onceReturns = [];
  const setReturns = [];

  const pathParts = path ? path.split('/') : [];
  const key = pathParts[pathParts.length - 1];

  return {
    child: expect.createSpy().andCall((childKey) => {
      const nested = new MockRef(path + childKey);
      childReturns.push(nested);
      return nested;
    }),
    childReturns,
    key,
    off: expect.createSpy(),
    on: expect.createSpy(),
    once: expect.createSpy().andCall(() => {
      const retVal = new MockPromise();
      onceReturns.push(retVal);
      return retVal.promise;
    }),
    onceReturns,
    orderByChild: expect.createSpy(),
    parent: pathParts[pathParts.length - 2] ? new MockRef(path.replace(`/${key}`, '')) : null,
    set: expect.createSpy().andCall(() => {
      const retVal = new MockPromise();
      setReturns.push(retVal);
      return retVal.promise;
    }),
    setReturns,
    update: expect.createSpy(),
  };
};

export const MockDatabase = () => {
  const refReturns = [];
  return {
    ref: expect.createSpy().andCall((path) => {
      const nested = new MockRef(path);
      refReturns.push(nested);
      return nested;
    }),
    refReturns,
  };
};
