import React, { useState } from 'react';
import axios from 'axios';

export default function EditProductForm({ product, onClose, onUpdate }) {
  const [quantity, setQuantity] = useState('');
  const [operation, setOperation] = useState('add');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      setErrorMessage('Please enter a valid positive number for stock.');
      return;
    }

    const updatedProduct = {
      quantity: parsedQuantity,
      operation,
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/updateProduct/${product.id}`, updatedProduct);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error.message);
      setErrorMessage('Failed to update stock. Please try again.');
    }
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="bg-[#192227] p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold text-[#2bd672] mb-4">Edit Product Stock</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-white mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            placeholder="Enter stock amount"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setErrorMessage('');
            }}
            required
            className="border border-gray-500 rounded-md p-2 w-full bg-[#101418] text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="operation" className="block text-white mb-1">Operation</label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="border border-gray-500 rounded-md p-2 w-full bg-[#101418] text-white"
          >
            <option value="add">Add to Existing Stock</option>
            <option value="reduce">Reduce from Existing Stock</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-[#2bd672] text-white font-bold rounded-md p-2 hover:bg-blue-600 transition"
          >
            Update Stock
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white font-bold rounded-md p-2 hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
