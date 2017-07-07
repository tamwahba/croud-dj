import expect from 'expect';

export function mockDispatch(expectedActions) {
  return (action) => {
    const expectedAction = expectedActions.shift();
    expect(action.type).toEqual(expectedAction.type);
  };
}
