import { ActionEnum } from '@app/bankathon/infraestructure/enums/action.enum';
import { CryptoCurrenciesEnum } from '@app/bankathon/infraestructure/enums/crypto-currencies.enum';
import { ExchangesEnum } from '@app/bankathon/infraestructure/enums/exchanges.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BuySellDto {
  @ApiProperty({ enum: ExchangesEnum, example: 'binance' })
  @IsNotEmpty()
  @IsString()
  readonly exchangeName: ExchangesEnum;

  @ApiProperty({ example: 10.5 })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty({ example: 'purchase' || 'sell' })
  @IsNotEmpty()
  @IsString()
  readonly transactionType: ActionEnum;

  @ApiProperty({ example: 'ether' || 'bitcoin' || 'bnb' })
  @IsNotEmpty()
  @IsString()
  readonly cryptoCurrency: CryptoCurrenciesEnum;  
}
