import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StreamsService } from '../services/streams.service';
import { CreateStreamDto } from '../dto/create-stream.dto';
import { UpdateStreamDto } from '../dto/update-stream.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser, Payload } from '../../users/user.decorator';
import { PageOptionsDto } from '../../shared/paginator/page-options.dto';

@UseGuards(AuthGuard)
@Controller('api/streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Post()
  create(
    @Body() createStreamDto: CreateStreamDto,
    @CurrentUser() user: Payload,
  ) {
    return this.streamsService.create(createStreamDto, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: Payload,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.streamsService.findAll(user.id, pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Payload) {
    return this.streamsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStreamDto: UpdateStreamDto,
    @CurrentUser() user: Payload,
  ) {
    return this.streamsService.update(id, user.id, updateStreamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: Payload) {
    return this.streamsService.remove(id, user.id);
  }
}
