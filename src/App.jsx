import React, { useState } from "react";
import "./App.css";
import Orderbook from "./components/Orderbook";

function App() {
  const [symbol, setSymbol] = useState("BTC");

  return (
    <div>
      <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
        <option value="BTC">BTC</option>
        <option value="ETH">ETH</option>
        <option value="SOL">SOL</option>
        <option value="DOGE">DOGE</option>
      </select>

      <Orderbook symbol={symbol + "-USD"} depth={16} />
    </div>
  );
}

export default App;
