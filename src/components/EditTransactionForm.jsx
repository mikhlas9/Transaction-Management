import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const EditTransactionForm = ({ transaction, onClose }) => {
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);
  const [type, setType] = useState(transaction.type);

  useEffect(() => {
    setAmount(transaction.amount);
    setDescription(transaction.description);
    setType(transaction.type);
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionRef = doc(db, "transactions", transaction.id);
      await updateDoc(transactionRef, {
        amount: Number(amount),
        description,
        type,
      });
      console.log("Transaction updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating transaction: ", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-100">Edit Transaction</h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <div className="mt-2">
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
            <div className="mt-2">
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
            <div className="mt-2">
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
            <div className="items-center px-4 py-3">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Update Transaction
              </button>
            </div>
          </form>
          <button onClick={onClose} className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionForm;
