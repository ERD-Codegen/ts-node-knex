import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('POST /api/profiles/:username/follow', () => {
  it('should be able to follow a user', async () => {
    const { userB, accessTokenA } = await setup();
    const response = await request
      .post(`/api/profiles/${userB.username}/follow`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.profile).toBeDefined();
    const { profile } = response.body;
    expect(profile.username).toBe(userB.username);
    expect(profile.bio).toBe(userB.bio);
    expect(profile.image).toBe(userB.image);
    expect(profile.following).toBe(true);
  });

  it('should return a status code of 401 - Unauthorized if the client does not provide auth headers', async () => {
    const { userB } = await setup();
    const response = await request
      .post(`/api/profiles/${userB.username}/follow`)
      .send();
    expect(response.status).toBe(401);
  });

  it('should return a status code of 400 - Bad Request if the user has already followed the targeted user', async () => {
    const { userService, userA, userB, accessTokenA } = await setup();
    await userService.followUser({
      followerId: userA.id,
      followingUsername: userB.username
    });
    const response = await request
      .post(`/api/profiles/${userB.username}/follow`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send();
    expect(response.status).toBe(400);
  });

  it('should return a status code of 400 - Bad Request if the user tries to follow themselves', async () => {
    const { userA, accessTokenA } = await setup();
    const response = await request
      .post(`/api/profiles/${userA.username}/follow`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send();
    expect(response.status).toBe(400);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const factory = new ServiceFactory();
  const userService = factory.newUserService();
  const authService = factory.newAuthService();

  const userAId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const userA = await userService.getUserById({ id: userAId });
  assert(userA);
  const accessTokenA = authService.generateAccessToken({
    userId: userAId,
    loginId: chance.guid()
  });

  const userBId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const userB = await userService.getUserById({ id: userBId });
  assert(userB);
  const accessTokenB = authService.generateAccessToken({
    userId: userBId,
    loginId: chance.guid()
  });

  return {
    userService,
    userA,
    userB,
    accessTokenA,
    accessTokenB
  };
};
