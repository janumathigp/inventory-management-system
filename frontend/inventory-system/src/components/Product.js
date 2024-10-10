import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios';
import EditProductForm from './EditProductForm';

export default function Product({ id, name, quantity, category, img, onDelete, stock_alert,onUpdate }) {
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const indicator = quantity <= stock_alert; 

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/deleteProduct/${id}`);
            onDelete(id);
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const handleUpdate = async (updatedProduct) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/updateProduct/${id}`, updatedProduct);
            onUpdate(response.data);
        } catch (error) {
            console.error('Error updating product:', error.message);
        }
    };

    return (
        <div className='product bg-[#192227] p-4 rounded-md shadow-lg flex space-x-4 w-[90%] mb-4'>
            {/* <div className='img w-1/3'>
                <img src={img} alt={name} className='object-cover w-full h-32 rounded-md' />
            </div> */}
            <div className='details flex flex-col justify-center w-3/4'>
                <h3 className='font-bold text-xl'>{name}</h3>
                <div className='flex text-base text-gray-500 font-bold'>
                    <p className='mr-4'>Stock: {quantity}</p>
                    <p>Category: {category}</p>
                </div>
                {indicator && (
                    <p className='text-red-500 text-base'>
                        <FontAwesomeIcon icon={faBolt} /> Low stock alert!
                    </p>
                )}
            </div>
            <div className='actions flex justify-around items-center w-1/6'>
                <FontAwesomeIcon icon={faPencil} className='cursor-pointer text-lg' onClick={() => setIsEditFormVisible(true)} />
                <FontAwesomeIcon icon={faTrash} className='cursor-pointer text-lg' onClick={handleDelete} />
            </div>
            {isEditFormVisible && (
                <EditProductForm 
                    product={{ id, name, category, sub_category: '', manufacturer_id: '', warranty_period: '', quantity: quantity, image_link: img, stock_alert: 0 }} 
                    onClose={() => setIsEditFormVisible(false)} 
                    onUpdate={handleUpdate} 
                />
            )}
        </div>
    );
}
