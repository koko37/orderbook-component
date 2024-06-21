import React, { useEffect, useRef, useState, useMemo } from "react";
import { Centrifuge } from "centrifuge";
import OrderBook from "./orderbook";
import { WSS_ENDPOINT, WSS_JWT } from "./connection";
import style from "./index.module.css";

const Orderbook = ({
  symbol = "BTC-USD",
  depth = 12,
  cleanupInterval = 60 * 1000,
}) => {
  const [tick, unit] = symbol.split("-");
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
      orderbook.cleanupOldOrders((Date.now() - cleanupInterval) * 1000);
    }, cleanupInterval);

    return () => {
      clearInterval(intervalId);
      subscription.current.unsubscribe();
      centrifuge.current.disconnect();
    };
  }, []);

  return (
    <div className={style.orderbook}>
      <div className={style.asks}>
        <div className={style.header}>
          <span className={style.price}>Price({unit})</span>
          <span className={style.size}>Amount({tick})</span>
          <span className={style.total}>Total</span>
        </div>
        {orderbook.topAsks(depth).map(([price, size, total]) => (
          <div key={price} className={style.row}>
            <span className={style.price}>{price.toFixed(2)}</span>
            <span className={style.size}>{size.toFixed(4)}</span>
            <span className={style.total}>{total.toFixed(4)}</span>
          </div>
        ))}
      </div>

      <div className={style.bids}>
        <div className={style.header}>
          <span className={style.price}>Price({unit})</span>
          <span className={style.size}>Amount({tick})</span>
          <span className={style.total}>Total</span>
        </div>
        {orderbook.topBids(depth).map(([price, size, total]) => (
          <div key={price} className={style.row}>
            <span className={style.price}>{price.toFixed(2)}</span>
            <span className={style.size}>{size.toFixed(4)}</span>
            <span className={style.total}>{total.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orderbook;
