import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddTransactionForm = () => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        amount: Number(amount),
        description,
        type,
        date: new Date()
      });
      setAmount(0);
      setDescription('');
      setType('expense');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-2 border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 px-4 text-white"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-2 border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 px-4 text-white"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-2 border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 px-4 text-white"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <button type="submit" className="w-full inline-flex justify-center items-center h-12 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransactionForm;

