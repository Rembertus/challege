import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
  // Wait for Wallet Confirmation
  async waitWalletResponse(): Promise<any> {
    return true;
  }
}
