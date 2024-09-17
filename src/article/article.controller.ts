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
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @ApiCreatedResponse()
  @UseGuards(AuthGuard)
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articleService.create(createArticleDto);
    this.cacheManager.del('article-key');
    return article;
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('article-key')
  @CacheTTL(1000 * 60 * 60 * 12)
  @Get()
  @ApiOkResponse()
  findAll() {
    return this.articleService.findAll();
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

    this.cacheManager.del('article-key');

    return updatedArticle;
  }

  @Delete(':id')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const deletedArticle = await this.articleService.remove(+id);

    this.cacheManager.del('article-key');

    return deletedArticle;
  }
}
