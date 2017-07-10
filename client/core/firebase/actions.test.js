/* eslint-env mocha */
import expect from 'expect';

import { FIREBASE_ONLINE,
  FIREBASE_OFFLINE,
  firebaseOnline,
  firebaseOffline,
  watchFirebase } from './actions';
import { mockDispatch } from '../test-utils';

describe('core', () => {
  describe('firebase', () => {
    describe('actions', () => {
      describe('firebaseOnline', () => {
        it('should return correct action', () => {
          expect(firebaseOnline()).toEqual({
            type: FIREBASE_ONLINE,
          });
        });
      });

      describe('firebaseOffline', () => {
        it('should return correct action', () => {
          expect(firebaseOffline()).toEqual({
            type: FIREBASE_OFFLINE,
          });
        });
      });

      describe('watchFirebase', () => {
        let mockFirebase;

        class MockFirebase {
          constructor() {
            this.db = {
              ref: () => ({
                on: (op, cb) => {
                  this.callback = cb;
                },
              }),
            };
          }

          connect() {
            this.callback({
              val: () => true,
            });
          }

          disconnect() {
            this.callback({
              val: () => false,
            });
          }
        }

        beforeEach(() => {
          mockFirebase = new MockFirebase();
        });

        it('should dispatch correct actions on connected', () => {
          const expectedActions = [
            firebaseOnline(),
          ];

          watchFirebase(mockFirebase.db)(mockDispatch(expectedActions));
          mockFirebase.connect();

          expect(expectedActions.length).toEqual(0);
        });

        it('should dispatch correct actions on disconnected', () => {
          const expectedActions = [
            firebaseOffline(),
          ];


          watchFirebase(mockFirebase.db)(mockDispatch(expectedActions));
          mockFirebase.disconnect();

          expect(expectedActions.length).toEqual(0);
        });
      });
    });
  });
});
