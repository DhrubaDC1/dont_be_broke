import { useState, useEffect, useMemo } from "react";
import "./App.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { index } from "jupyter-ijavascript-utils/src/group";

function App() {
  const [localData, setLocalData] = useState([]);
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("food");
  const [amount, setAmount] = useState("");
  const [housing, setHousing] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [food, setFood] = useState(0);
  const [healthcare, setHealthcare] = useState(0);
  const [entertainment, setEntertainment] = useState(0);
  const [status, setStatus] = useState("Don't Be Broke");

  ChartJS.register(ArcElement, Tooltip, Legend);

  const categories = [
    "Housing",
    "Transportation",
    "Food",
    "Healthcare",
    "Entertainment",
  ];
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses in different categories",
        data: [housing, transportation, food, healthcare, entertainment],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const data = useMemo(
    () => JSON.parse(localStorage.getItem("expense")) || [],
    []
  );

  async function statusUpdate() {
    setStatus("Please fill all fields");
    setTimeout(() => setStatus("Don't Be Broke"), 3000);
  }

  useEffect(() => {
    // Update localData when data changes
    setLocalData(data);
    // Calculate sums for food and lifestyle expenses
    const housingTotal = localData.reduce(
      (total, expense) =>
        expense.category === "housing" ? total + expense.amount : total,
      0
    );
    const transportationTotal = localData.reduce(
      (total, expense) =>
        expense.category === "transportation" ? total + expense.amount : total,
      0
    );
    const foodTotal = localData.reduce(
      (total, expense) =>
        expense.category === "food" ? total + expense.amount : total,
      0
    );
    const healthcareTotal = localData.reduce(
      (total, expense) =>
        expense.category === "healthcare" ? total + expense.amount : total,
      0
    );
    const entertainmentTotal = localData.reduce(
      (total, expense) =>
        expense.category === "entertainment" ? total + expense.amount : total,
      0
    );

    setHousing(housingTotal);
    setTransportation(transportationTotal);
    setFood(foodTotal);
    setHealthcare(healthcareTotal);
    setEntertainment(entertainmentTotal);
  }, [data]);

  let paragraphElements;

  if (localData.length > 0) {
    paragraphElements = localData.map((item, index) => (
      <div className="flex py-2">
        <div className="flex flex-row justify-between md:text-2xl sm:text-lg w-[95%]">
          <p className="w-[20%] text-center" key={index}>
            {item.item}
          </p>
          <p className=" w-[20%] text-center" key={index}>
            {item.category}
          </p>
          <p className=" w-[20%] text-center" key={index}>
            {item.amount}
          </p>
        </div>
        <div className="w-[5%] flex justify-center items-center">
          <button
            className=""
            onClick={async () => {
              await removeDataFromLocalStorage(index);
            }}
          >
            X
          </button>
        </div>
      </div>
    ));
  } else {
    paragraphElements = (
      <div className="px-4 md:text-3xl text-xl text-center">
        Add new entries to get list here
      </div>
    );
  }

  const handleAddNew = async () => {
    if (category && item && amount) {
      const newItem = {
        category,
        item,
        amount: parseInt(amount),
      };

      if (data) {
        data.push(newItem);
        localStorage.setItem("expense", JSON.stringify(data));
      } else {
        localStorage.setItem("expense", JSON.stringify([newItem]));
      }

      const housingTotal = localData.reduce(
        (total, expense) =>
          expense.category === "housing" ? total + expense.amount : total,
        0
      );
      const transportationTotal = localData.reduce(
        (total, expense) =>
          expense.category === "transportation"
            ? total + expense.amount
            : total,
        0
      );
      const foodTotal = localData.reduce(
        (total, expense) =>
          expense.category === "food" ? total + expense.amount : total,
        0
      );
      const healthcareTotal = localData.reduce(
        (total, expense) =>
          expense.category === "healthcare" ? total + expense.amount : total,
        0
      );
      const entertainmentTotal = localData.reduce(
        (total, expense) =>
          expense.category === "entertainment" ? total + expense.amount : total,
        0
      );

      setHousing(housingTotal);
      setTransportation(transportationTotal);
      setFood(foodTotal);
      setHealthcare(healthcareTotal);
      setEntertainment(entertainmentTotal);

      setItem("");
      setCategory("housing");
      setAmount("");
    } else {
      await statusUpdate();
    }
  };
  const catDrop = categories.map((category) => (
    <option value={category}>{category}</option>
  ));
  async function exportLocalStorageToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Retrieve data from the "expense" key in local storage
    const data = JSON.parse(localStorage.getItem("expense"));

    // Create the header row
    const header = ["category", "item", "amount"];
    csvContent += header.join(",") + "\n";

    // Add the data rows
    data.forEach((item) => {
      const row = [item.category, item.item, item.amount];
      csvContent += row.join(",") + "\n";
    });

    // Create a data URI for the CSV content
    const encodedUri = encodeURI(csvContent);

    // Create a hidden anchor element and trigger a click to download the CSV
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link);
    link.click();
  }

  async function importCSVFromExplorerAndStoreInLocalStorage() {
    // Create an input element for file selection
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = ".csv";

    // Handle the file selection
    inputElement.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvString = e.target.result;

        // Process the CSV data and store it in local storage (same code as before)
        const lines = csvString.split("\n");
        const data = [];
        const headers = lines[0].split(",");

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(",");
          if (currentLine.length === headers.length) {
            const item = {};
            for (let j = 0; j < headers.length; j++) {
              item[headers[j]] = currentLine[j];
            }
            data.push(item);
          }
        }

        // Store the imported data in local storage under the "expense" key
        localStorage.setItem("expense", JSON.stringify(data));

        // Reload the page
        window.location.reload();

        // Optionally, you can return or handle the imported data in your application.
        const importedData = data;
      };

      // Read the selected file as text
      reader.readAsText(file);
    });

    // Trigger a click event on the input element to open the file explorer dialog
    inputElement.click();
  }

  async function removeDataFromLocalStorage(key) {
    console.log("hitted", key);
    // Retrieve the existing data from local storage
    const existingData = JSON.parse(localStorage.getItem("expense"));

    if (existingData) {
      // Find and remove the item with the specified key
      let updatedData = [];
      for (let i in existingData) {
        if (key != i) {
          console.log(i);
          updatedData.push(existingData[i]);
        }
      }
      // Store the updated data in local storage
      localStorage.setItem("expense", JSON.stringify(updatedData));
      // Reload the page
      window.location.reload();
    }
  }

  return (
    <div className=" bg-black min-h-screen" style={{ fontFamily: "Agbalumo" }}>
      <div className="mx-auto flex flex-col px-6 bg-dots bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-600 to-purple-500 ">
        <div className="flex flex-row md:px-6 justify-between md:pr-0">
          <div className="flex items-start justify-start">
            <p className="text-center font-bold animated-gradient md:text-7xl text-4xl mt-6 mb-2">
              {status}
            </p>
          </div>
          <div className="flex justify-end items-end">
            <div
              className={`${
                localData.length > 0 ? "block" : "hidden"
              } flex items-center justify-center py-4 md:px-4`}
            >
              <button
                className="md:text-lg text-sm md:h-10  rounded-lg border-purple-500 text-purple-500 border-2 md:w-28 w-24 text-center pb-1"
                onClick={async () => await exportLocalStorageToCSV()}
              >
                Export Data
              </button>
            </div>
            <div
              className={`${
                localData.length > 0 ? "hidden" : "block"
              } flex items-center justify-center py-4 md:px-4`}
            >
              <button
                className="md:text-lg text-sm md:h-10  rounded-lg border-purple-500 text-purple-500 border-2 md:w-28 w-24 text-center pb-1"
                onClick={async () => {
                  await importCSVFromExplorerAndStoreInLocalStorage();
                }}
              >
                Import Data
              </button>
            </div>
          </div>
        </div>

        {/* <div className="w-[90%] md:w-[30%] ">
        <Doughnut data={chartData} />
      </div> */}
        <div className="flex-row flex items-center justify-between md:p-4 my-6 text-lg md:text-xl">
          <input
            type="text"
            placeholder="Item"
            className="md:w-[30%] w-[25%] h-10 border-2 rounded-lg text-center text-orange-500 placeholder-orange-500 border-orange-500 bg-black pb-1"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <select
            className="md:w-[30%] w-[27%] h-10 border-2 rounded-lg text-center text-pink-500 border-pink-600 bg-black pb-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {catDrop}
          </select>
          <input
            type="text"
            placeholder="Amount"
            className="w-[20%] h-10 border-2 rounded-lg text-center text-purple-500 placeholder-purple-500 border-purple-500 bg-black pb-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="text-lg h-10 px-1 rounded-lg border-purple-500 tex-purple-500 border-2 md:w-28 w-fit pb-1"
            onClick={async () => await handleAddNew()}
          >
            Add new
          </button>
        </div>
        <div
          className={`${
            localData.length > 0 ? "block" : "hidden"
          } flex flex-row justify-between font-bold text-center md:text-3xl sm:text-xl w-[95%]`}
        >
          <p className="w-[20%] text-center">Items</p>
          <p className="w-[20%] text-center">Category</p>
          <p className="w-[20%] text-center">Amount</p>
        </div>
        {paragraphElements}
      </div>
    </div>
  );
}

export default App;
