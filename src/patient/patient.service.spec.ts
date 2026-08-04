import { Test, TestingModule } from '@nestjs/testing';
import { PatienService } from './patient.service';

describe('PatienService', () => {
  let service: PatienService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatienService],
    }).compile();

    service = module.get<PatienService>(PatienService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
