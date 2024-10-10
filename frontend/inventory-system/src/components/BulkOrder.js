import React, { useState } from 'react';
import axios from 'axios';

export default function BulkOrderForm({ onClose }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    console.log('Submitting file:', file);

    try {
      const response = await axios.post('http://localhost:5000/api/bulkOrder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Bulk order processed successfully!');
      onClose();
    } catch (error) {
      console.error('Error processing bulk order:', error.message);
      alert('Error processing bulk order. Please try again.');
    }
  };

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-[#141d1f] p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-center text-white mb-4">Bulk Order</h2>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileChange} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
        <button type="submit" className="bg-[#2bd672] text-white mr-2 font-bold rounded-md p-2 hover:bg-green-600 transition">
          Upload
        </button>
        <button type="button" onClick={onClose} className="bg-red-500 text-white font-bold rounded-md p-2 hover:bg-red-600 transition">
          Cancel
        </button>
      </form>
    </div>
  );
}
