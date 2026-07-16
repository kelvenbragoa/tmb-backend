import { Test, TestingModule } from '@nestjs/testing';
import { SessionActivityLogService } from './session-activity-log.service';

describe('SessionActivityLogService', () => {
  let service: SessionActivityLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionActivityLogService],
    }).compile();

    service = module.get<SessionActivityLogService>(SessionActivityLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
