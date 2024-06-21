import { useState } from "react";
import "./App.css";
import Orderbook from "./components/Orderbook";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Exchange Store</h1>
      {count > 0 && <Orderbook />}
      <button onClick={() => setCount(1)}>Connect</button>
      <button onClick={() => setCount(0)}>Disconnect</button>
    </div>
  );
}

export default App;
