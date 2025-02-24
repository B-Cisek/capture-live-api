import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { ChannelsService } from '../services/channels.service';
import { CurrentUser, CurrentUserType } from '../../user/decorators/user.decorator';
import { PageOptionsDto } from '../../shared/paginator/page-options.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserType, @Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(user.id, createChannelDto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserType, @Query() pageOptionsDto: PageOptionsDto) {
    return this.channelsService.findAll(user.id, pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.channelsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.channelsService.update(id, user.id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.channelsService.remove(id, user.id);
  }
}
