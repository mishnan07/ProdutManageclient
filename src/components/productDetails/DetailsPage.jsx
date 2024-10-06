"use client";
import { ProductListSingle } from '@/app/services/services';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../config';
import ProductModal from '../Modal/ProductModal';

const DetailsPage = ({ productId }) => {
  const [products, setProducts] = useState({});
  const [price, setPrice] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [openProductModal, setOpenProductModal] = useState(false)
  const [state,setState] = useState(false)

  const changeImage = (newImage) => {
    setCurrentImage(`${API_URL}${newImage}`); 
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId,state]);

//Handle fetch product
  const fetchProduct = async () => {
    try {
      const data = await ProductListSingle(productId);
      setProducts(data[0]);
      setPrice(data[0]?.variants?.[0]?.price);
      setCurrentImage(`${API_URL}${data[0]?.image?.[0] || ''}`);
      setLoading(false); 
    } catch (error) {
      setError('Failed to fetch product details.'); 
      setLoading(false); 
    }
  };

  return (
    <div className="bg-gray-100 ">
      <div className="container mx-auto px-4 py-8">
        <div className="flex  flex-wrap -mx-4">
          {/* Product Images */}
          <div className="w-full md:w-1/2 px-4 mb-8 ">
            {products?.image?.length > 0 && (
              <>
                <img
                  src={currentImage}
                  alt="Product"
                  className="w-full ml-8 h-auto rounded-lg shadow-md mb-4 max-w-[500px] "
                />
                {/* Thumbnail section */}
                <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                  {products.image.map((img, index) => (
                    <img
                      key={index}
                      src={`${API_URL}${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                      onClick={() => changeImage(img)} // Change main image on click
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Product Details */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">{products?.tittle}</h2>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">{`$${price}`}</span>
            </div>
            <p className="text-gray-700 mb-6">{products?.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">RAM:</h3>
              <div className="flex space-x-2">
                {products?.variants?.map((item, index) => (
                  <button onClick={() => setPrice(item?.price)} key={index} className="w-8 h-8 bg-gray-200">
                    {item?.ram}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-lg font-semibold mb-2">Quantity:</label>
              <input type="number" id="quantity" defaultValue="1" className="border border-gray-300 rounded-lg p-2 w-24" />
            </div>
            <button
           onClick={() => setOpenProductModal(true)}
            className="bg-[#EDA415] text-white py-2 px-4 rounded-lg  transition duration-300">Edit Product</button>
          </div>
        </div>
      </div>
      {openProductModal && (
        <ProductModal setOpen={setOpenProductModal} setState={setState} products={products} />
      )}
    </div>
  );
};

export default DetailsPage;
