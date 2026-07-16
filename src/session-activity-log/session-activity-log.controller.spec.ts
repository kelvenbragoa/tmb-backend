import { Test, TestingModule } from '@nestjs/testing';
import { SessionActivityLogController } from './session-activity-log.controller';
import { SessionActivityLogService } from './session-activity-log.service';

describe('SessionActivityLogController', () => {
  let controller: SessionActivityLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionActivityLogController],
      providers: [SessionActivityLogService],
    }).compile();

    controller = module.get<SessionActivityLogController>(SessionActivityLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
