import test from 'node:test';
import assert from 'node:assert/strict';
import { setAuthUser, isAuth, isAdmin } from './auth.middleware';

test('isAuth denies unauthenticated requests', () => {
  setAuthUser(null);

  const req: any = {};
  const res: any = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  };
  const next = () => {
    res.nextCalled = true;
  };

  isAuth(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.payload, { error: 'Unauthorized' });
});

test('isAdmin allows admin users and denies non-admins', () => {
  setAuthUser({ id: 1, name: 'Admin', email: 'admin@test.com', userTypeId: 2 });

  const adminReq: any = {};
  const adminRes: any = { status(code: number) { this.statusCode = code; return this; }, json(payload: unknown) { this.payload = payload; return this; } };
  const adminNext = () => {
    adminRes.nextCalled = true;
  };

  isAdmin(adminReq, adminRes, adminNext);

  assert.equal(adminRes.statusCode, undefined);
  assert.equal(adminReq.user?.userTypeId, 2);

  setAuthUser({ id: 2, name: 'User', email: 'user@test.com', userTypeId: 1 });

  const userReq: any = {};
  const userRes: any = { status(code: number) { this.statusCode = code; return this; }, json(payload: unknown) { this.payload = payload; return this; } };
  const userNext = () => {
    userRes.nextCalled = true;
  };

  isAdmin(userReq, userRes, userNext);

  assert.equal(userRes.statusCode, 403);
  assert.deepEqual(userRes.payload, { error: 'Forbidden' });
});
