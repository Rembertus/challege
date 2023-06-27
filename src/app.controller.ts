import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MessageResponse } from '@app/shared/domain/model/message.response';
import { MessageEnum } from '@app/shared/infraestructure/enums/message.enum';

@Controller()
export class AppController {

  @Get('status')
  status(): any {
    return new MessageResponse(HttpStatus.OK, MessageEnum.SERVICE_STARTED, null);
  }
}
