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
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 text-left">Date</th>
                            <th className="py-2 px-4 text-left">Description</th>
                            <th className="py-2 px-4 text-left">Amount</th>
                            <th className="py-2 px-4 text-left">Type</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b">
                                <td className="py-2 px-4">{transaction.date.toDate().toLocaleDateString()}</td>
                                <td className="py-2 px-4">{transaction.description}</td>
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
                                        className="text-blue-600 hover:text-white bg-transparent hover:bg-blue-600 font-semibold py-1 px-2 border border-blue-600 hover:border-transparent rounded inline-flex items-center mr-2 transition-colors duration-300"
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(transaction.id)}
                                        className="text-red-600 hover:text-white bg-transparent hover:bg-red-600 font-semibold py-1 px-2 border border-red-600 hover:border-transparent rounded inline-flex items-center transition-colors duration-300"
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
