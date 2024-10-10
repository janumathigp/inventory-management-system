import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Product from './Product';
import AddProductForm from './AddProduct';
import BulkOrderForm from './BulkOrder';

export default function ProductDisplay() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddProductFormVisible, setIsAddProductFormVisible] = useState(false);
    const [isBulkOrderFormVisible, setIsBulkOrderFormVisible] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/getProducts');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddProductClick = () => {
        setIsAddProductFormVisible(true);
    };

    const handleBulkOrderClick = () => {
        setIsBulkOrderFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsAddProductFormVisible(false);
        setIsBulkOrderFormVisible(false);
    };

    const handleDelete = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const handleUpdate = (updatedProduct) => {
        setProducts(products.map(product => (product.id === updatedProduct.id ? updatedProduct : product)));
    };

    return (
        <div className='productDisplay p-4 flex flex-col items-center w-3/4 mx-auto'>
            <div className='flex items-center mb-4 w-full'>
                <input 
                    type='text' 
                    placeholder='Search Product' 
                    className='border-2 border-gray-500 rounded-md p-2 flex-grow bg-[#101418] text-white'
                />
                <div className='flex items-center ml-4'>
                    <div className='bg-gray-800 p-2 rounded-md mr-2'>
                        <FontAwesomeIcon icon={faFilter} className='text-2xl cursor-pointer' style={{ color: '#2bd672' }} />
                    </div>
                    <button 
                        className='bg-[#2bd672] text-white font-bold rounded-md mr-2 p-2 hover:bg-blue-600 transition' 
                        onClick={handleAddProductClick}
                    >
                        Add Product
                    </button>
                    <button 
                        className='bg-[#2bd672] text-white font-bold rounded-md p-2 hover:bg-blue-600 transition' 
                        onClick={handleBulkOrderClick}
                    >
                        Bulk Order
                    </button>
                </div>
            </div>

            {isAddProductFormVisible && <AddProductForm onClose={handleCloseForm} setProducts={setProducts} />}
            {isBulkOrderFormVisible && <BulkOrderForm onClose={handleCloseForm} />} 

            {loading ? (
                <p>Loading products...</p>
            ) : (
                products.map(product => (
                    <Product 
                        key={product.id} 
                        {...product} 
                        onDelete={handleDelete} 
                        onUpdate={handleUpdate} 
                    />
                ))
            )}
        </div>
    );
}
