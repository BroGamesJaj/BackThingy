import { Test, TestingModule } from '@nestjs/testing';
import { FollowedController } from './followed.controller';
import { FollowedService } from './followed.service';

describe('FollowedController', () => {
  let controller: FollowedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowedController],
      providers: [FollowedService],
    }).compile();

    controller = module.get<FollowedController>(FollowedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
