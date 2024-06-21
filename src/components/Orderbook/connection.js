const IS_TEST_MODE = false;

const TEST_WSS_ENDPOINT = "wss://api.testnet.rabbitx.io/ws";
const TEST_WSS_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiZXhwIjo1MjYyNjUyMDEwfQ.x_245iYDEvTTbraw1gt4jmFRFfgMJb-GJ-hsU9HuDik";
const MAINNET_WSS_ENDPOINT = "wss://api.prod.rabbitx.io/ws";
const MAINNET_WSS_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDAwMDAwMDAwIiwiZXhwIjo2NTQ4NDg3NTY5fQ.o_qBZltZdDHBH3zHPQkcRhVBQCtejIuyq8V1yj5kYq8";
const WSS_ENDPOINT = IS_TEST_MODE ? TEST_WSS_ENDPOINT : MAINNET_WSS_ENDPOINT;
const WSS_JWT = IS_TEST_MODE ? TEST_WSS_JWT : MAINNET_WSS_JWT;

export { WSS_ENDPOINT, WSS_JWT };
