class OrderBook {
  marketId = "";
  bids = new Map();
  asks = new Map();
  sequence = 0;
  timestamp = 0;

  /**
   *
   * @param {*} marketId : `BTC-USD` | `ETH-USD` ...
   */
  constructor(marketId) {
    this.marketId = marketId;
  }

  reset() {
    this.asks.clear();
    this.bids.clear();

    this.sequence = 0;
    this.timestamp = 0;
  }

  /**
   * 
   * @param {*} asks price levels, array of [price, size]
   * @param {*} bids price levels, array of [price, size]
   * @param {*} timestamp 
   * @param {*} sequence 
   * 
   * @example {
      "timestamp": 1718956530395730,
      "sequence": 959377873,
      "market_id": "BTC-USD",
      "asks": [
        ["64375.0","2.9393"]
      ],
      "bids": [
        ["64517.0", "0"]
      ]
    }
   */
  update({ asks, bids, timestamp, sequence }) {
    if (!!this.sequence && sequence !== this.sequence + 1) {
      throw new Error("Invalid sequence");
    }

    for (const [price, size] of asks) {
      if (size == 0) {
        this.asks.delete(price);
      } else {
        this.asks.set(price, [price, size, timestamp]);
      }
    }

    for (const [price, size] of bids) {
      if (size == 0) {
        this.bids.delete(price);
      } else {
        this.bids.set(price, [price, size, timestamp]);
      }
    }

    this.sequence = sequence;
    this.timestamp = timestamp;
  }

  cleanupOldOrders(before) {
    this.asks.forEach(([, , timestamp], key) => {
      if (timestamp < before) {
        this.asks.delete(key);
      }
    });

    this.bids.forEach(([, , timestamp], key) => {
      if (timestamp < before) {
        this.bids.delete(key);
      }
    });
  }

  /**
   * 
   * @param {*} count 
   * @returns top n ask orders as form of [price, size, price * size]
   */
  topAsks(count) {
    return Array.from(this.asks.values())
      .sort(([priceA], [priceB]) => priceA - priceB)
      .slice(0, count)
      .map(([price, size]) => [
        Number(price),
        Number(size),
        Number(price) * Number(size),
      ]);
  }

  /**
   * 
   * @param {*} count 
   * @returns top n bid orders as form of [price, size, price * size]
   */
  topBids(count) {
    return Array.from(this.bids.values())
      .sort(([priceA], [priceB]) => priceA - priceB)
      .slice(0, count)
      .map(([price, size]) => [
        Number(price),
        Number(size),
        Number(price) * Number(size),
      ]);
  }
}

export default OrderBook;
