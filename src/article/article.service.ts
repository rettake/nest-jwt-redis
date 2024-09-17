import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create(createArticleDto);
    return this.articleRepository.save(article);
  }

  findAll(author: string, orderBy: string) {
    const query = this.articleRepository.createQueryBuilder('article');

    if (author) {
      query.where('article.author = :author', { author });
    }

    if (orderBy) {
      if (orderBy === 'asc') {
        query.orderBy('article.createdAt', 'ASC');
      } else if (orderBy === 'desc') {
        query.orderBy('article.createdAt', 'DESC');
      } else {
        throw new Error(`Invalid orderBy value: ${orderBy}`);
      }
    }

    return query.getMany();
  }

  findOne(id: number) {
    return this.articleRepository.findOne({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.articleRepository.update(id, updateArticleDto);
  }

  remove(id: number) {
    return this.articleRepository.delete(id);
  }
}
