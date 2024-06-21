# Orderbook Component

In this React application, I created a simple component `Orderbook` and placed it into the landing page with a simple dropdown of cryptocurrencies to demonstrate the usage of the component.

The component is independent and isolated, only receiving the props of `symbol`, `depth`, and `cleanupInterval` from the parent. Here `symbol` is the pair of cryptocurrency and quote unit, like `BTC-USD`. The `depth` is the order depth in ask and bid prices. `cleanupInterval` is in milliseconds and indicates how often the component will clean up old orders.

The component internally uses WebSocket via the `centrifuge-js` library. Whenever the `symbol` prop is changed, it initializes the WebSocket connection and re-registers event handlers to manage the connection and retrieve order data.

The component internally uses a separate datastore instance that handles the asks/bids order manipulation. If it receives orders having a size of 0, it internally removes the price record; if not zero, it replaces the orders.

For memory efficiency, it provides a cleanup function that removes old price records. In the component, it triggers the cleanup through a regular timer, so it keeps only the fresh orders.

Within the component, it handles network connections and monitors the sequence of order data. If it receives an incorrect sequence from WebSocket, it resets the datastore, reconnects the connection, and reinitializes. Thus, it maintains the correct orders only.

## Major files
- src/components/Orderbook/index.jsx
- src/components/Orderbook/orderbook.js
- src/App.jsx

## Demo version

https://orderbook-rabbitx.netlify.app/