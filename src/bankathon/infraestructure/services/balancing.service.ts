import { Injectable } from '@nestjs/common';
import { TestData } from '@app/bankathon/infraestructure/data/test.data';
import { ActionEnum } from '@app/bankathon/infraestructure/enums/action.enum';

@Injectable()
export class BalancingService {
  async processCase1(balanceProviders: any): Promise<any> {
    const totalProviders = balanceProviders.length;
    const average = balanceProviders.reduce((previous, current) => previous + parseFloat(current.balance), 0) / totalProviders;

    // balanceProviders[0].balance = 513000;
    // balanceProviders[1].balance = 1026000;
    // balanceProviders[2].balance = 769500;
    // balanceProviders[3].balance = 256500;

    const balanceDiff: any[] = [];
    for (const provider of balanceProviders) {
      balanceDiff.push({ name: provider.name, amount: (provider.balance - average) });
    }

    const listTmp = balanceDiff.sort((x, y) => x.amount - y.amount);
    const move: any[] = [];
    for (let i = 0; i < listTmp.length; i++) {
      if (listTmp[i].amount < 0) {
        for (let j = i + 1; j < listTmp.length; j++) {
          if (listTmp[j].amount > 0) {
            const amount = Math.min(listTmp[i].amount * -1, listTmp[j].amount);
            listTmp[i].amount += amount;
            listTmp[j].amount -= amount;
            move.push({ from: listTmp[j].name, to: listTmp[i].name, amount: amount });
            if (listTmp[i].amount == 0) {
              break;
            }
          }
        }
      }
    }

    return move;
  }

  async processCase2(balanceProviders: any): Promise<any> {
    const testData = TestData.getTestData();

    // balanceProviders[0].balance = 513000;
    // balanceProviders[1].balance = 513000;
    // balanceProviders[2].balance = 513000;
    // balanceProviders[3].balance = 1026000;

    const balanceDiff: any[] = [];
    for (const provider of balanceProviders) {
      const findTest = testData.data.find(({ name }) => name === provider.name);
      if (findTest) {
        balanceDiff.push({ name: provider.name, amount: (provider.balance - findTest.minimum) });
      }
    }

    let listTmp = balanceDiff.sort((x, y) => x.amount - y.amount);    
    const move: any[] = [];

    for (let i = 0; i < listTmp.length; i++) {
      if (listTmp[i].amount < 0) {
        for (let j = i + 1; j < listTmp.length; j++) {
          if (listTmp[j].amount > 0) {
            const amount = Math.min(listTmp[i].amount * -1, listTmp[j].amount);
            listTmp[i].amount += amount;
            listTmp[j].amount -= amount;
            move.push({ from: listTmp[j].name, to: listTmp[i].name, amount: amount });
            if (listTmp[i].amount == 0) {
              break;
            }
          }
        }
      }
    }

    const process: any[] = [];
    listTmp = listTmp.filter(balance => balance.amount != 0);
    for (const provider of listTmp) {
      if (provider.amount < 0) {
        process.push({ name: provider.name, amount: provider.amount * -1, transactionType: ActionEnum.PURCHASE });
      } else {
        process.push({ name: provider.name, amount: provider.amount, transactionType: ActionEnum.SELL });
      }
    }

    return { move, BuySell: process };
  }
}
