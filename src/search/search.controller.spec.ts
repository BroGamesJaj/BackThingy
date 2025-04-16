import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma.service';

describe('SearchController', () => {
  let controller: SearchController;
  let mockSearchService;
  const mockPrismaService = {
    create: jest.fn(),
    findPfp: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
