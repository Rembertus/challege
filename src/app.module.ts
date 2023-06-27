// Author : Remberto Gonzales Cruz (rembertus@gmail.com)
// Date creation: 20230622

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@app/app.controller';
import { BankathonModule } from '@app/bankathon/infraestructure/bankathon.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: !ENV ? '.env' : `.env.${ENV}` }),
    BankathonModule,
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule { }
