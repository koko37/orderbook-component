import React, { useEffect, useRef, useState, useMemo } from "react";
import { Centrifuge } from "centrifuge";
import OrderBook from "./orderbook";
import { WSS_ENDPOINT, WSS_JWT } from "./connection";

const Orderbook = ({ symbol = "BTC-USD", coolDownPeriod = 60 * 1000 }) => {
  const [connected, setConnected] = useState(false);
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

    const reconnect = () => {
      subscription.current.unsubscribe();
      centrifuge.current.disconnect();
      orderbook.reset();

      setTimeout(() => {
        centrifuge.current.connect();
        subscription.current.subscribe();
      }, 3000);
    };

    // register event handlers
    centrifuge.current.on("connected", () => {
      console.log("connected");
      setConnected(true);
    });
    centrifuge.current.on("disconnected", () => {
      console.log("disconnected");
      setConnected(false);
    });
    centrifuge.current.on("connecting", () => {
      console.log("connecting");
      setConnected(false);
    });
    subscription.current.on("error", () => {
      console.log("error");
      reconnect();
    });
    subscription.current.on("publication", (ctx) => {
      if (!orderbook.update(ctx.data)) {
        // case of lost packages
        reconnect();
      }

      setSequence(ctx.data.sequence);
      setTimestamp(ctx.data.timestamp);
    });

    // connect & subscribe into channel
    centrifuge.current.connect();
    subscription.current.subscribe();

    // start timer that regularly cleanup old orders
    const intervalId = setInterval(() => {
      orderbook.cleanupOldOrders((Date.now() - coolDownPeriod) * 1000);
    }, coolDownPeriod);

    return () => {
      clearInterval(intervalId);
      subscription.current.unsubscribe();
      centrifuge.current.disconnect();
    };
  }, []);

  return (
    <div>
      <div>Sequence: {sequence}</div>
      <div>Timestamp: {timestamp}</div>
      <div>Connect: {connected ? "ON" : "OFF"}</div>
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
