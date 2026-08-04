import { Test, TestingModule } from '@nestjs/testing';
import { AppoimentService } from './appoiment.service';

describe('AppoimentService', () => {
  let service: AppoimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppoimentService],
    }).compile();

    service = module.get<AppoimentService>(AppoimentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
