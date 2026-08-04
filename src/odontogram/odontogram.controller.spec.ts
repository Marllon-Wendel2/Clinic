import { Test, TestingModule } from '@nestjs/testing';
import { OdontogramController } from './odontogram.controller';
import { OdontogramService } from './odontogram.service';

describe('OdontogramController', () => {
  let controller: OdontogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OdontogramController],
      providers: [OdontogramService],
    }).compile();

    controller = module.get<OdontogramController>(OdontogramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
