import { useState } from "react";
import "./App.css";
import Orderbook from "./components/Orderbook";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Orderbook</h1>
      <button onClick={() => setCount(1)}>Connect</button>
      <button onClick={() => setCount(0)}>Disconnect</button>

      {count > 0 && <Orderbook />}
    </div>
  );
}

export default App;
