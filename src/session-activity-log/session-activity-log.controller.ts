import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionActivityLogService } from './session-activity-log.service';
import { CreateSessionActivityLogDto } from './dto/create-session-activity-log.dto';
import { UpdateSessionActivityLogDto } from './dto/update-session-activity-log.dto';

@Controller('session-activity-log')
export class SessionActivityLogController {
  constructor(private readonly sessionActivityLogService: SessionActivityLogService) {}

  @Post()
  create(@Body() createSessionActivityLogDto: CreateSessionActivityLogDto) {
    return this.sessionActivityLogService.create(createSessionActivityLogDto);
  }

  @Get()
  findAll() {
    return this.sessionActivityLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionActivityLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionActivityLogDto: UpdateSessionActivityLogDto) {
    return this.sessionActivityLogService.update(+id, updateSessionActivityLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionActivityLogService.remove(+id);
  }
}
