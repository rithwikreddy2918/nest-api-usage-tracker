import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiUsage } from './api-usage.entity';
import { Repository } from 'typeorm';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let repo: Repository<ApiUsage>;

  const mockRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(ApiUsage),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    repo = module.get(getRepositoryToken(ApiUsage));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return api usage logs', async () => {
    const logs = [
      {
        id: 1,
        method: 'GET',
        path: '/users',
        statusCode: 200,
        userId: 1,
      },
    ];

    mockRepo.find.mockResolvedValue(logs);

    const result = await service.findAll();
    expect(result).toEqual(logs);
    expect(repo.find).toHaveBeenCalled();
  });
});
