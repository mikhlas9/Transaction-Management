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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">Transaction Management</h1>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(totalIncome - totalExpenses).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <AddTransactionForm />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <TransactionList />
      </div>
    </div>
  );
}

export default App;
