import { Body, Headers, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponse } from '@app/shared/domain/model/message.response';
import { BankathonService } from '@app/bankathon/infraestructure/bankathon.service';
import { BuySellDto } from '@app/bankathon/domain/dto/buy-sell.dto';

@ApiTags('bankathon')
@Controller('bankathon')
export class BankathonController {

  constructor(private readonly bankathonService: BankathonService) { }

  @ApiOperation({ summary: 'Processes the Purchase or Sale of Cryptocurrencies.' })
  @ApiResponse({ status: 200, description: 'Response based on MessageResponse.', type: MessageResponse })
  @ApiResponse({ status: 403, description: 'Not authorized!' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('purchase-sell')
  async purchaseSell(
    @Req() request: any,
    @Body() buySellDto: BuySellDto,
    @Headers('User-Agent') userAgent: string
  ): Promise<MessageResponse> {
    const response = await this.bankathonService.processTransaction(buySellDto, request.headers.authorization, userAgent);
    return response;
  }

  @ApiOperation({ summary: 'Process Balancing of Balance.' })
  @ApiResponse({ status: 200, description: 'Response based on MessageResponse.', type: MessageResponse })
  @ApiResponse({ status: 403, description: 'Not authorized!' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Get('balancing-case1')
  async balancingCase1(
    @Req() request: any,
    @Headers('User-Agent') userAgent: string
  ): Promise<MessageResponse> {
    const response = await this.bankathonService.processBalancingCase1(request.headers.authorization, userAgent);
    return response;
  }

  @ApiOperation({ summary: 'Process Balancing of Balance.' })
  @ApiResponse({ status: 200, description: 'Response based on MessageResponse.', type: MessageResponse })
  @ApiResponse({ status: 403, description: 'Not authorized!' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Get('balancing-case2')
  async balancingCase2(
    @Req() request: any,
    @Headers('User-Agent') userAgent: string
  ): Promise<MessageResponse> {
    const response = await this.bankathonService.processBalancingCase2(request.headers.authorization, userAgent);
    return response;
  }

  @ApiOperation({ summary: 'Test get Account Info' })
  @ApiResponse({ status: 200, description: 'Response based on MessageResponse.', type: MessageResponse })
  @ApiResponse({ status: 403, description: 'Not authorized!' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Get('info')
  async gets(@Req() request: any, @Headers('User-Agent') userAgent: string): Promise<MessageResponse> {
    const response = await this.bankathonService.gets(request.headers.authorization, userAgent);
    return response;
  }
}
