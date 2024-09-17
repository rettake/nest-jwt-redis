import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Inject,
  Query,
  ExecutionContext,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

class DynamicCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { author, orderBy } = request.query;

    return `articles-${author || ''}-${orderBy || 'desc'}`;
  }
}

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async clearCache() {
    const keys = await this.cacheManager.store.keys();
    const articleKeys = keys.filter((key) => key.startsWith('articles-'));
    for (const key of articleKeys) {
      await this.cacheManager.del(key);
    }
  }

  @Post()
  @ApiCreatedResponse()
  @UseGuards(AuthGuard)
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articleService.create(createArticleDto);
    await this.clearCache();
    return article;
  }

  @UseInterceptors(DynamicCacheInterceptor)
  @CacheKey('article-key')
  @CacheTTL(1000 * 60 * 60 * 12)
  @Get()
  @ApiOkResponse()
  findAll(@Query('author') author: string, @Query('orderBy') orderBy: string) {
    return this.articleService.findAll(author, orderBy);
  }

  @Get(':id')
  @CacheKey('article-key')
  @CacheTTL(1000 * 60 * 60 * 12)
  @ApiOkResponse()
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = await this.articleService.update(
      +id,
      updateArticleDto,
    );

    await this.clearCache();

    return updatedArticle;
  }

  @Delete(':id')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const deletedArticle = await this.articleService.remove(+id);

    await this.clearCache();

    return deletedArticle;
  }
}
