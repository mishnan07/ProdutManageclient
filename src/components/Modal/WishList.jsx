"use client"
import { ListUserWishList, UpdateWishList } from '@/services/services';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../config';

const WishList = ({ isOpen, setIsOpen, submit, setSubmit }) => {
    const [products, setProducts] = useState([])
    const [state, setState] = useState(false)

    useEffect(() => {
        fetchWishList()
    }, [state, submit])

    //Handle fetch wish list
    const fetchWishList = async () => {
        try {
            const data = await ListUserWishList()
            setProducts(data[0]?.productData)
        } catch (error) {

        }
    }

    const closeModal = () => {
        setIsOpen(false);
    };

    //Handle remove wish list
    const removeToWishlist = async (productId) => {
        try {
            await UpdateWishList({ productId })
            setState(!state)
            setSubmit(!submit)
        } catch (error) {

        }
    }

    return (
        <div>
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50">
                    <div
                        className="fixed top-0 right-0 z-50 w-1/3 h-screen bg-white p-6 transition-transform duration-300"
                        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }} // Translate to the right when hidden
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 8.586l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 1 0 011.414-1.414L10 8.586z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="mt-4">
                            {products?.length < 1 ?
                                <p className="text-gray-500">Your wishlist is currently empty.</p>
                                :
                                <ul className="mt-4 space-y-2">
                                    {products?.map((item, index) => (
                                        <li key={index} className="py-3 sm:py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="w-16 h-16 rounded-full"
                                                        src={`${API_URL}${item?.image[0]}`}
                                                        alt="Neil image"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 ms-4">
                                                    <p className="text-sm  max-w-[250px] text-wrap font-medium text-gray-900 truncate dark:text-white">
                                                        {item?.tittle}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {`$${item?.variants[0]?.price}`}
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    <button onClick={() => removeToWishlist(item?._id)} className="text-red-500 hover:underline">Remove</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default WishList
