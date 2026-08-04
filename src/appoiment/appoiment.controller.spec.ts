import { Test, TestingModule } from '@nestjs/testing';
import { AppoimentController } from './appoiment.controller';
import { AppoimentService } from './appoiment.service';

describe('AppoimentController', () => {
  let controller: AppoimentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppoimentController],
      providers: [AppoimentService],
    }).compile();

    controller = module.get<AppoimentController>(AppoimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
