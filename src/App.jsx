import React from "react";
import "./App.css";
import Orderbook from "./components/Orderbook";

function App() {
  return (
    <div>
      <Orderbook depth={16} symbol={"ETH-USD"} />
    </div>
  );
}

export default App;
