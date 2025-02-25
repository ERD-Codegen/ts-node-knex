import {
  ArticleAlreadyFavoritedError,
  ArticleNotFoundError,
  ArticleService
} from '@conduit/core/service';
import {
  ApiError,
  ApiErrorBadRequest,
  ApiErrorInternalServerError,
  ApiErrorNotFound
} from '@conduit/utils/error';

import { DtoArticle } from '../../dto';
import {
  ApiFavoriteArticleConstructor,
  ApiFavoriteArticleInput,
  ApiFavoriteArticleOutput
} from './types';

export class ApiFavoriteArticle {
  private articleService: ArticleService;

  constructor({ articleService }: ApiFavoriteArticleConstructor) {
    this.articleService = articleService;
  }

  async execute({
    slug,
    userId
  }: ApiFavoriteArticleInput): ApiFavoriteArticleOutput {
    try {
      const article = await this.articleService.getArticleBySlug({
        slug,
        requestingUserId: userId
      });

      if (!article) {
        throw new ArticleNotFoundError({});
      }

      await this.articleService.favoriteArticle({
        userId,
        articleId: article.id
      });

      const tags = await this.articleService.getTagsByArticleId({
        articleId: article.id
      });

      const data = new DtoArticle({
        ...article,
        favoritesCount: article.favoritesCount + 1,
        tagList: tags.map((tag) => tag.tag),
        favorited: true
      });

      return { article: data };
    } catch (error) {
      throw this.convertErrorToApiError(error);
    }
  }

  private convertErrorToApiError(error: any) {
    if (error instanceof ApiError) {
      return error;
    }
    if (error instanceof ArticleNotFoundError) {
      return new ApiErrorNotFound({
        message: error.message,
        cause: error
      });
    }
    if (error instanceof ArticleAlreadyFavoritedError) {
      return new ApiErrorBadRequest({
        message: error.message,
        cause: error
      });
    }
    return new ApiErrorInternalServerError({});
  }
}
