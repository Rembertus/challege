import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class TowerbankService {
  async getAccountInfo(token: string, userAgent: string): Promise<any> {
    const url = `${process.env.TOWERBANK_URL_ACCOUNT_INFO}`;
    return await fetch(url, {
      method: 'GET',
      credentials: "include",
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'User-Agent': userAgent,
      }
    });
  }

  async getBalanceProviders(token: string, userAgent: string): Promise<any> {
    const url = `${process.env.TOWERBANK_URL_PROVIDERS}`;
    return await fetch(url, {
      method: 'GET',
      credentials: "include",
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'User-Agent': userAgent,
      }
    });
  }

  async processTransaction(
    accountId: string,
    amount: number,
    transactionType: string,
    token: string,
    userAgent: string
  ): Promise<any> {
    const url = `${process.env.TOWERBANK_URL_TRANSACTION}`;
    const data = {
      accountId: accountId,
      amount: amount,
      transactionType: transactionType
    };

    return await fetch(url, {
      method: 'POST',
      credentials: "include",
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'User-Agent': userAgent,
      },
      body: JSON.stringify(data)
    });
  }

  async processProviderTransaction(
    from: string,
    to: string,
    amount: number,
    token: string,
    userAgent: string
  ): Promise<any> {
    const url = `${process.env.TOWERBANK_URL_PROVIDERS_TRANSACTION}`;
    const data = {
      from: from,
      to: to,
      amount: amount
    };

    return await fetch(url, {
      method: 'POST',
      credentials: "include",
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'User-Agent': userAgent,
      },
      body: JSON.stringify(data)
    });
  }
}
