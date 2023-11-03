import { useState } from "react";
import "./App.css";

function App() {
  const [localData, setLocalData] = useState([]);
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("food");
  const [amount, setAmount] = useState("");

  let data = JSON.parse(localStorage.getItem("expense"));
  let paragraphElements;

  if (localData.length > 0) {
    paragraphElements = localData.map((item, index) => (
      <p key={index}>
        {item.item} {item.category} {item.amount}
      </p>
    ));
  } else {
    paragraphElements =
      data &&
      data.map((item, index) => (
        <p key={index}>
          {item.item} {item.category} {item.amount}
        </p>
      ));
  }

  const handleAddNew = () => {
    const newItem = {
      category,
      item,
      amount: parseInt(amount),
    };

    if (data) {
      localStorage.setItem("expense", JSON.stringify([...data, newItem]));
    } else {
      localStorage.setItem("expense", JSON.stringify([newItem]));
    }

    setLocalData(JSON.parse(localStorage.getItem("expense")));
    setItem("");
    setCategory("");
    setAmount("food");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="food">Food</option>
        <option value="lifestyle">Lifestyle</option>
        {/* Add more categories as needed */}
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="text-lg" onClick={handleAddNew}>
        Add new
      </button>
      {paragraphElements}
    </div>
  );
}

export default App;
