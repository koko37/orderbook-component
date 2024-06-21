import React, { useEffect, useRef, useState, useMemo } from "react";
import { Centrifuge } from "centrifuge";
import OrderBook from "./orderbook";
import { WSS_ENDPOINT, WSS_JWT } from "./connection";

const Orderbook = ({ symbol = "BTC-USD" }) => {
  const [sequence, setSequence] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  const centrifuge = useRef(null);
  const subscription = useRef(null);
  const orderbook = useMemo(() => new OrderBook(symbol), []);

  useEffect(() => {
    centrifuge.current = new Centrifuge(WSS_ENDPOINT, { token: WSS_JWT });
    subscription.current = centrifuge.current.newSubscription(
      `orderbook:${symbol}`
    );

    centrifuge.current.on("connected", (ctx) => {
      console.log("connected");
    });
    centrifuge.current.on("disconnected", (ctx) => {
      console.log("disconnected");
    });
    centrifuge.current.on("connecting", (ctx) => {
      console.log("connecting ...");
    });
    subscription.current.on("publication", (ctx) => {
      // console.log("publication: ", ctx.data);

      orderbook.update(ctx.data);
      setSequence(ctx.data.sequence);
      setTimestamp(ctx.data.timestamp);
    });

    centrifuge.current.connect();
    subscription.current.subscribe();

    return () => {
      subscription.current.unsubscribe();
      centrifuge.current.disconnect();
    };
  }, []);

  return (
    <div>
      <div>Sequence: {sequence}</div>
      <div>Timestamp: {timestamp}</div>
      <div>Asks: {orderbook.sizeOfAsks}</div>
      <div>
        {orderbook.topAsks(10).map(([price, size, total]) => (
          <div key={price}>
            {price}, {size}, {total.toFixed(2)}
          </div>
        ))}
      </div>
      <div>Bids: {orderbook.sizeOfBids}</div>
      <div>
        {orderbook.topBids(10).map(([price, size, total]) => (
          <div key={price}>
            {price}, {size}, {total.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orderbook;
