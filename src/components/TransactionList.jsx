import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import EditTransactionForm from './EditTransactionForm';
import { Edit, Trash2 } from 'lucide-react';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "transactions"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const transactionsArray = [];
            querySnapshot.forEach((doc) => {
                transactionsArray.push({ id: doc.id, ...doc.data() });
            });
            setTransactions(transactionsArray);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteDoc(doc(db, "transactions", id));
                console.log("Transaction deleted successfully!");
            } catch (error) {
                console.error("Error deleting transaction: ", error);
            }
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">Transaction History</h2>
            <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
                        <tr>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-700 transition-colors duration-200">
                                <td className="py-2 px-4 text-gray-300">{transaction.date.toDate().toLocaleDateString()}</td>
                                <td className="py-2 px-4 text-gray-300">{transaction.description}</td>
                                <td className={`py-2 px-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    ${transaction.amount.toFixed(2)}
                                </td>
                                <td className="py-2 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                        }`}>
                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                    </span>
                                </td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => setEditingTransaction(transaction)}
                                        className="text-indigo-400 hover:text-white bg-transparent hover:bg-indigo-600 font-semibold py-1 px-2 border border-indigo-400 hover:border-transparent rounded inline-flex items-center transition-colors duration-300"
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(transaction.id)}
                                        className="text-red-400 hover:text-white bg-transparent hover:bg-red-600 font-semibold py-1 px-2 border border-indigo-400 hover:border-transparent rounded inline-flex items-center transition-colors duration-300"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile view - Card layout */}
            <div className="md:hidden space-y-4">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="font-medium text-gray-200">{transaction.description}</h3>
                                <p className="text-sm text-gray-400">{transaction.date.toDate().toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                                }`}>
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                        </div>

                        <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                            ${transaction.amount.toFixed(2)}
                        </div>

                        <div className="flex space-x-2 pt-2 border-t border-gray-700">
                            <button
                                onClick={() => setEditingTransaction(transaction)}
                                className="flex-1 text-indigo-400 hover:text-white bg-transparent hover:bg-indigo-600 font-semibold py-2 border border-indigo-400 hover:border-transparent rounded inline-flex items-center justify-center transition-colors duration-300"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(transaction.id)}
                                className="flex-1 text-red-400 hover:text-white bg-transparent hover:bg-red-600 font-semibold py-2 border border-red-400 hover:border-transparent rounded inline-flex items-center justify-center transition-colors duration-300"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {editingTransaction && (
                <EditTransactionForm
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                />
            )}
        </div>
    );
};

export default TransactionList;
