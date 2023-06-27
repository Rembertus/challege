import { Module } from '@nestjs/common';
import { BankathonService } from '@app/bankathon/infraestructure/bankathon.service';
import { BankathonController } from '@app/bankathon/infraestructure/bankathon.controller';
import { TowerbankService } from '@app/bankathon/infraestructure/services/towerbank.service';
import { WalletService } from '@app/bankathon/infraestructure/services/wallet.service';
import { BalancingService } from '@app/bankathon/infraestructure/services/balancing.service';

@Module({
  imports: [],
  controllers: [BankathonController],
  providers: [BankathonService, TowerbankService, WalletService, BalancingService]
})

export class BankathonModule { }
