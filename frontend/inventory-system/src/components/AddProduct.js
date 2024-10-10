import React, { useState } from 'react';
import axios from 'axios';

export default function AddProductForm({ onClose }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stockAlert, setStockAlert] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { 
      name, 
      category, 
      sub_category: subCategory, 
      manufacturer_id: manufacturerId, 
      warranty_period: warrantyPeriod, 
      quantity, 
      stock_alert: stockAlert 
    };

    try {
      await axios.post('http://localhost:5000/api/addProduct', productData);
      alert('Product added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-[#141d1f] p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-center text-white mb-4">Add New Product</h2>
        <input 
          type="text" 
          placeholder="Product Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
        <input 
          type="text" 
          placeholder="Sub-Category" 
          value={subCategory} 
          onChange={(e) => setSubCategory(e.target.value)} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
        <input 
          type="text" 
          placeholder="Manufacturer ID" 
          value={manufacturerId} 
          onChange={(e) => setManufacturerId(e.target.value)} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
        <input 
          type="text" 
          placeholder="Warranty Period" 
          value={warrantyPeriod} 
          onChange={(e) => setWarrantyPeriod(e.target.value)} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
      
        <input 
          type="number" 
          placeholder="Stock Alert" 
          value={stockAlert} 
          onChange={(e) => setStockAlert(e.target.value)} 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-[#1c2327] text-white focus:outline-none focus:ring-2 focus:ring-[#2bd672]"
        />
        
        <div className="flex justify-between">
          <button type="submit" className="bg-[#2bd672] text-white font-bold rounded-md p-2 hover:bg-green-600 transition">
            Add Product
          </button>
          <button type="button" onClick={onClose} className="bg-red-500 text-white font-bold rounded-md p-2 hover:bg-red-600 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
