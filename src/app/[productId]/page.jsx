"use client"
import DetailsPage from '@/components/productDetails/DetailsPage';
import React from 'react'

const page = async ({ params })=> {
    const { productId } = params;
    
    const decodedSlug = decodeURIComponent(productId); 
     return (
    <>
        <DetailsPage productId={productId} />
    </>
  )
}

export default page