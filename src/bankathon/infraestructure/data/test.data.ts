export class TestData {
  static getTestData() {
    return {
      data: [
        {
          name: 'binance',
          minimum: 500000,
          threshold: 20000
        },
        {
          name: 'bitstamp',
          minimum: 600000,
          threshold: 50000
        },
        {
          name: 'buda',
          minimum: 700000,
          threshold: 65000
        },
        {
          name: 'kraken',
          minimum: 900000,
          threshold: 100000
        }       
      ]
    }
  }
}
