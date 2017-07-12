/* eslint-env mocha */
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

        it('should reject when room does not exist', () => {
          roomExists = false;

          return checkRoomExists('', mockDatabse)
            .catch(() => {});
        });
      });
    });
  });
});
