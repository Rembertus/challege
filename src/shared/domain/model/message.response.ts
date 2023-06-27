import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty()
  statusCode: number; // Código de respuesta

  @ApiProperty()
  message: string; // Mensaje de texto de respuesta, así como un resultado más complejo tipo JSON

  @ApiProperty()
  response: any; // data_tipo_JSON

  constructor(statusCode?: number, message?: string, response?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.response = response;
  }
}
