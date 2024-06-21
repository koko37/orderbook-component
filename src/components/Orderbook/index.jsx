import React, { useEffect } from "react";
import { Centrifuge } from "centrifuge";

const IS_TEST_MODE = false;
const TEST_WSS_ENDPOINT = "wss://api.testnet.rabbitx.io/ws";
const TEST_WSS_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiZXhwIjo1MjYyNjUyMDEwfQ.x_245iYDEvTTbraw1gt4jmFRFfgMJb-GJ-hsU9HuDik";
const MAINNET_WSS_ENDPOINT = "wss://api.prod.rabbitx.io/ws";
const MAINNET_WSS_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDAwMDAwMDAwIiwiZXhwIjo2NTQ4NDg3NTY5fQ.o_qBZltZdDHBH3zHPQkcRhVBQCtejIuyq8V1yj5kYq8";

const WSS_ENDPOINT = IS_TEST_MODE ? TEST_WSS_ENDPOINT : MAINNET_WSS_ENDPOINT;
const WSS_JWT = IS_TEST_MODE ? TEST_WSS_JWT : MAINNET_WSS_JWT;

const ORDERBOOK_CHANNEL = (symbol) => `orderbook:${symbol}`;

const centrifuge = new Centrifuge(WSS_ENDPOINT, { token: WSS_JWT });
const sub = centrifuge.newSubscription(ORDERBOOK_CHANNEL("BTC-USD"));

const Orderbook = () => {
  useEffect(() => {
    centrifuge.on("connected", (ctx) => {
      console.log("connected");
    });

    centrifuge.on("disconnected", (ctx) => {
      console.log("disconnected");
    });

    centrifuge.on("connecting", (ctx) => {
      console.log("connecting ...");
    });

    sub.on("publication", (ctx) => {
      console.log("publication: ", ctx.data);
    });

    centrifuge.on("message", (ctx) => {
      console.log("message: ", ctx.data);
    });

    centrifuge.connect();
    sub.subscribe();

    return () => {
      sub.unsubscribe();
      centrifuge.disconnect();
    };
  }, []);

  return <div>Buy / Sell</div>;
};

export default Orderbook;
