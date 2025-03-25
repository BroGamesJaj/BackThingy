import { Test, TestingModule } from '@nestjs/testing';
import { FollowedService } from './followed.service';

describe('FollowedService', () => {
  let service: FollowedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowedService],
    }).compile();

    service = module.get<FollowedService>(FollowedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
