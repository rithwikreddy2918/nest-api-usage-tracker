import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiUsage } from './api-usage.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ApiUsage)
    private readonly repo: Repository<ApiUsage>,
  ) {}

  log(data: Partial<ApiUsage>) {
    return this.repo.save(data);
  }

  findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }
}
