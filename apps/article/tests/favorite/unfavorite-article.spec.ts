import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';
import { DtoArticle } from '../../dto';

const request = supertest(app);

describe('Article - Unfavorite Article', () => {
  it('should able to unfavorite an article', async () => {
    const { article, accessToken, articleService, user } = await setup();

    await articleService.favoriteArticle({
      articleId: article.id,
      userId: user.id
    });

    const response = await request
      .delete(`/api/articles/${article.slug}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.article).toBeDefined();

    const favoritedArticle: DtoArticle = response.body.article;

    expect(favoritedArticle.favorited).toBe(false);
    expect(favoritedArticle.favoritesCount).toBe(0);
  });

  it('should return a status code of 400 - Bad Request if the client does not favorite the targeted article', async () => {
    const { article, accessToken } = await setup();

    const response = await request
      .delete(`/api/articles/${article.slug}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.status).toBe(400);
  });

  it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
    const { article } = await setup();

    const response = await request
      .delete(`/api/articles/${article.slug}/favorite`)
      .send();

    expect(response.status).toBe(401);
  });

  it('should return a status code of 404 - Not Found if the targeted article does not exist', async () => {
    const { accessToken } = await setup();

    const response = await request
      .delete('/api/articles/hello-world/favorite')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(404);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const factory = new ServiceFactory();
  const userService = factory.newUserService();
  const authService = factory.newAuthService();
  const articleService = factory.newArticleService();
  const userId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const accessToken = authService.generateAccessToken({
    userId,
    loginId: chance.guid()
  });
  const user = await userService.getUserById({ id: userId });
  assert(user);
  const articleId = await articleService.createArticle({
    userId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });
  const article = await articleService.getArticleById({ id: articleId });
  assert(article);

  const commentId = await articleService.createArticleComment({
    articleId: article.id,
    userId,
    body: chance.sentence()
  });

  return {
    chance,
    userService,
    articleService,
    authService,
    user,
    article,
    accessToken,
    commentId
  };
};
