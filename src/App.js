import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import AddTransactionForm from './components/AddTransactionForm';
import TransactionList from './components/TransactionList';

function App() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "transactions"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let incomeSum = 0;
      let expensesSum = 0;
      querySnapshot.forEach((doc) => {
        const transaction = doc.data();
        if (transaction.type === 'income') {
          incomeSum += transaction.amount;
        } else {
          expensesSum += transaction.amount;
        }
      });
      setTotalIncome(incomeSum);
      setTotalExpenses(expensesSum);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-400">Transaction Management</h1>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">Summary</h2>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Income</p>
                <p className="text-2xl md:text-2xl text-lg font-bold text-green-400">${totalIncome.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Expenses</p>
                <p className="text-2xl md:text-2xl text-lg font-bold text-red-400">${totalExpenses.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Balance</p>
                <p className={`text-2xl md:text-2xl text-lg font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(totalIncome - totalExpenses).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">Add New Transaction</h2>
            <AddTransactionForm />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}

export default App;
