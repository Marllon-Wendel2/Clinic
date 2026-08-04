import { Test, TestingModule } from '@nestjs/testing';
import { PatienController } from './patient.controller';
import { PatienService } from './patient.service';

describe('PatienController', () => {
  let controller: PatienController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatienController],
      providers: [PatienService],
    }).compile();

    controller = module.get<PatienController>(PatienController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
