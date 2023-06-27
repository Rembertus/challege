import { HttpStatus, Injectable } from '@nestjs/common';
import { MessageResponse } from '@app/shared/domain/model/message.response';
import { MessageEnum } from '@app/shared/infraestructure/enums/message.enum';
import { BuySellDto } from '@app/bankathon/domain/dto/buy-sell.dto';
import { TowerbankService } from '@app/bankathon/infraestructure/services/towerbank.service';
import { WalletService } from '@app/bankathon/infraestructure/services/wallet.service';
import { BalancingService } from '@app/bankathon/infraestructure/services/balancing.service';
import { ActionEnum } from '@app/bankathon/infraestructure/enums/action.enum';

@Injectable()
export class BankathonService {
  constructor(
    private readonly towerbankService: TowerbankService,
    private readonly walletService: WalletService,
    private readonly balancingService: BalancingService
  ) { }

  /**
   * Processes the Purchase or Sale of Cryptocurrencies.
   * @returns MessageResponse containing the transaction data or a 404 - NO FOUND code.
   */
  public async processTransaction(
    buySellDto: BuySellDto,
    token: string,
    userAgent: string
  ): Promise<MessageResponse> {
    const responseProviders = await this.towerbankService.getBalanceProviders(token, userAgent);
    if (responseProviders.status != 200) {
      return new MessageResponse(HttpStatus.FORBIDDEN, responseProviders.statusText, null);
    }

    const balanceProviders = await responseProviders.json()

    // Check if exchangeName Exists
    const result = balanceProviders.data.find(({ name }) => name === buySellDto.exchangeName);
    if (result.balance < buySellDto.amount) {
      return new MessageResponse(HttpStatus.UNAUTHORIZED, MessageEnum.NOT_FUNDS_EXCHANGE, null);
    }

    const accountId = `${process.env.TOWERBANK_ACCOUNT_ID}`;
    const responseAccountInfo = await this.towerbankService.getAccountInfo(token, userAgent);
    if (responseAccountInfo.status != 200) {
      return new MessageResponse(HttpStatus.FORBIDDEN, responseAccountInfo.statusText, null);
    }
    const accountInfo = await responseAccountInfo.json()

    if (accountInfo.balance < buySellDto.amount) {
      return new MessageResponse(HttpStatus.FORBIDDEN, MessageEnum.NOT_FUNDS_LOCAL, null);
    }

    // Process in a Transaction
    // const queryRunner = getConnection().createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    let transaction;
    try {
      const responseTransaction = await this.towerbankService.processTransaction(
        accountId,
        buySellDto.amount,
        buySellDto.transactionType,
        token,
        userAgent
      );
      if (responseTransaction.status != 200) {
        // await queryRunner.rollbackTransaction();
        throw Error(responseTransaction.statusText);
      }
      transaction = await responseTransaction.json()

      // Wait for confirmation from the Wallet
      const responseWallet = await this.walletService.waitWalletResponse();
      if (responseWallet) {
        // await queryRunner.commitTransaction();
      } else {
        // await queryRunner.rollbackTransaction();
        return new MessageResponse(HttpStatus.SERVICE_UNAVAILABLE, MessageEnum.TRANSACTION_CANCELED, null);
      }
    } catch (error) {
      // since we have errors lets rollback the changes we made
      // await queryRunner.rollbackTransaction();
      return new MessageResponse(HttpStatus.SERVICE_UNAVAILABLE, MessageEnum.TRANSACTION_NOT_PROCESSED, null);
    } finally {
      // we need to release a queryRunner which was manually instantiated
      // await queryRunner.release();
    }

    return new MessageResponse(HttpStatus.OK, MessageEnum.TRANSACTION_PROCESSED, transaction);
  }

  /**
   * Process Balancing of Balance - case 1.
   * @returns MessageResponse containing the transaction data or a 404 - NO FOUND code.
   */
  public async processBalancingCase1(token: string, userAgent: string): Promise<MessageResponse> {
    const responseProviders = await this.towerbankService.getBalanceProviders(token, userAgent);
    if (responseProviders.status != 200) {
      return new MessageResponse(HttpStatus.FORBIDDEN, responseProviders.statusText, null);
    }

    const balanceProviders = await responseProviders.json();
    const resultCase1 = await this.balancingService.processCase1(balanceProviders.data);
    // Process in a Transaction
    // const queryRunner = getConnection().createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // let responseTransaction;
    try {
      for (const result of resultCase1) {
        const responseTransaction = await this.towerbankService.processProviderTransaction(
          result.from,
          result.to,
          result.amount,
          token,
          userAgent
        );

        if (responseTransaction.status != 200) {
          // await queryRunner.rollbackTransaction();
          // new throw Error(responseTransaction.statusText);
          return new MessageResponse(HttpStatus.FORBIDDEN, responseTransaction.statusText, null);
        }
        const transaction = await responseTransaction.json();
      }
      // await queryRunner.commitTransaction();
    } catch (error) {
      // await queryRunner.rollbackTransaction();
      return new MessageResponse(HttpStatus.SERVICE_UNAVAILABLE, MessageEnum.TRANSACTION_NOT_PROCESSED, null);
    } finally {
      // we need to release a queryRunner which was manually instantiated
      // await queryRunner.release();
    }

    return new MessageResponse(HttpStatus.OK, MessageEnum.TRANSACTION_PROCESSED, resultCase1);
  }

  /**
    * Process Balancing of Balance - case 2.
    * @returns MessageResponse containing the transaction data or a 404 - NO FOUND code.
    */
  public async processBalancingCase2(token: string, userAgent: string): Promise<MessageResponse> {
    const responseProviders = await this.towerbankService.getBalanceProviders(token, userAgent);
    if (responseProviders.status != 200) {
      return new MessageResponse(HttpStatus.FORBIDDEN, responseProviders.statusText, null);
    }

    const balanceProviders = await responseProviders.json();
    const resultCase2 = await this.balancingService.processCase2(balanceProviders.data);

    // Process in a Transaction
    // const queryRunner = getConnection().createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // let responseTransaction;
    if (resultCase2.move.length > 0) {
      try {
        for (const move of resultCase2.move) {
          console.log('MOVE Crypto: from:', move.from, ' to: ', move.to, ' amount:', move.amount);
          // const responseTransaction = await this.towerbankService.processProviderTransaction(
          //   move.from,
          //   move.to,
          //   move.amount,
          //   token,
          //   userAgent
          // );

          // if (responseTransaction.status != 200) {
          //   // await queryRunner.rollbackTransaction();
          //   // new throw Error(responseTransaction.statusText);
          //   return new MessageResponse(HttpStatus.FORBIDDEN, responseTransaction.statusText, null);
          // }
          // const transaction = await responseTransaction.json();
        }
        // await queryRunner.commitTransaction();
      } catch (error) {
        // await queryRunner.rollbackTransaction();
        return new MessageResponse(HttpStatus.SERVICE_UNAVAILABLE, MessageEnum.TRANSACTION_NOT_PROCESSED, null);
      } finally {
        // we need to release a queryRunner which was manually instantiated
        // await queryRunner.release();
      }
    }

    if (resultCase2.BuySell.length > 0) {
      try {
        for (const buysell of resultCase2.BuySell) {
          if (buysell.transactionType == ActionEnum.PURCHASE) {
            console.log('Should consume an endpoint to buy crypto');
            console.log('PURCHASE Crypto: name:', buysell.name, ', amount:', buysell.amount);
          } else {
            console.log('Should consume an endpoint to sell crypto');
            console.log('SELL Crypto: name:', buysell.name, ', amount:', buysell.amount);
          }
        }
        // await queryRunner.commitTransaction();
      } catch (error) {
        // await queryRunner.rollbackTransaction();
      } finally {
        // we need to release a queryRunner which was manually instantiated
        // await queryRunner.release();
      }
    }

    return new MessageResponse(HttpStatus.OK, MessageEnum.TRANSACTION_PROCESSED, resultCase2);
  }

  /** For Test.   
   * @returns MessageResponse containing the transaction data or a 404 - NO FOUND code.
   */
  public async gets(token: string, userAgent: string): Promise<any> {
    const response = await this.towerbankService.getAccountInfo(token, userAgent);

    if (response.status != 200) {
      return new MessageResponse(HttpStatus.FORBIDDEN, response.statusText, null);
    }

    const accountInfo = await response.json();
    return new MessageResponse(HttpStatus.OK, MessageEnum.ENTITY_SELECT, accountInfo);
  }
}
