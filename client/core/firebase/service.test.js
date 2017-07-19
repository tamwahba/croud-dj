/* eslint-env mocha */
import expect from 'expect';

import { checkRoomExists } from './service';

describe('core', () => {
  describe('firebase', () => {
    describe('service', () => {
      describe('checkRoomExists', () => {
        let roomExists;
        const mockDatabse = {
          ref: () => ({
            once: (op, callback) => {
              callback({
                exists: () => roomExists,
                ref: 'fake-ref',
              });
            },
          }),
        };

        beforeEach(() => {
          roomExists = false;
        });

        it('should resolve when room exists', () => {
          roomExists = true;

          return checkRoomExists('', mockDatabse);
        });

        it('should resolve with reference when room exists', () => {
          roomExists = true;

          return checkRoomExists('', mockDatabse)
            .then(ref => expect(ref).toEqual('fake-ref'));
        });

        it('should reject when room does not exist', () => {
          roomExists = false;

          return checkRoomExists('', mockDatabse)
            .catch(() => {});
        });
      });
    });
  });
});
