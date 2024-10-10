import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faA } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <div className='navbar bg-[#141d1f] text-white flex justify-between items-center p-4 shadow-md'>
      <div className='logo text-2xl font-bold'>INVENTORY</div>
      <div className='flex items-center space-x-6'>
        <FontAwesomeIcon icon={faGear} className='text-2xl cursor-pointer' />
        <FontAwesomeIcon icon={faBell} className='text-2xl cursor-pointer' />
        <div className='flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300'>
          <FontAwesomeIcon icon={faA} className='text-xl' />
        </div>
      </div>
    </div>
  );
}
