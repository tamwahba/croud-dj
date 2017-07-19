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
