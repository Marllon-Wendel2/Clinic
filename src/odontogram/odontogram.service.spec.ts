import { Test, TestingModule } from '@nestjs/testing';
import { OdontogramService } from './odontogram.service';

describe('OdontogramService', () => {
  let service: OdontogramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdontogramService],
    }).compile();

    service = module.get<OdontogramService>(OdontogramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
