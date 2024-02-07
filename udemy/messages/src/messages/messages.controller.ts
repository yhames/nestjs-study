import { Controller, Get, Post } from '@nestjs/common';

@Controller('/messages')
export class MessagesController {
  @Get()
  listMessages() {
    return 'All messages';
  }

  @Post()
  createMessage() {
    return 'Create message';
  }

  @Get('/:id')
  getMessage() {
    return 'One message';
  }
}
