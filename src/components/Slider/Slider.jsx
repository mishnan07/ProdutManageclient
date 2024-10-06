"use client"
import React, { useEffect, useState } from 'react'
import './style.css'
import CategoryModal from '../Modal/CategoryModal'
import SubCategoryModal from '../Modal/SubCategoryModal'
import ProductModal from '../Modal/ProductModal'
import { ListAllCategory, ProductList, UpdateWishList } from '@/app/services/services'
import { API_URL } from '../../../config'
import { useRouter } from 'next/navigation'
import { getToken } from '@/app/utils/commonFunctions'

const Slider = ({ search, submit ,setSubmit }) => {
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openSubCategoryModal, setOpenSubCategoryModal] = useState(false)
  const [openProductModal, setOpenProductModal] = useState(false)
  const [products, setProducts] = useState([])
  const [allCategory, setAllCategory] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const router = useRouter();
  const [state, setState] = useState(false)
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 3
  const [token,setToken] = useState('')


  useEffect(()=>{
    const token = getToken()
    setToken(token)
  },[token])

  useEffect(() => {
    fetchAllCategory()
  }, [])

  useEffect(() => {
    fetchProduct()
  }, [selectedIds, state, submit,page,token])

  //HAndle fetch all products
  const fetchProduct = async () => {
    try {
      const data = await ProductList(selectedIds, search,page,limit)
      setProducts(data?.data)
      const count = data?.count
      const totalPage = Math.ceil(Number(count) / limit)
      setTotalPage(totalPage)
    } catch (error) {

    }
  }

  //Handle fetch all category
  const fetchAllCategory = async () => {
    try {
      const data = await ListAllCategory()
      setAllCategory(data)
    } catch (error) {

    }
  }

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the section
  };

  // Handle the check box
  const handleCheckboxChange = (_id) => {
    if (selectedIds.includes(_id)) {
      setSelectedIds(selectedIds.filter(id => id !== _id));
    } else {
      setSelectedIds([...selectedIds, _id]);
    }
  };

  //Handle Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      if(token){
        await UpdateWishList({ productId })
        setState(!state)
        setSubmit(!submit)
      }else{
        router.push('/login')
      }
    } catch (error) {

    }
  }

  const handleNextPage = () => {
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
};

const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
};

  return (
    <div>
      <div className="slider bg-white">
        <div>
          <main className="mx-auto max-w-7xl ">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Home</h1>
              <div className="flex">
                <button
                  onClick={() => setOpenCategoryModal(true)}
                  type="button" className="btns ml-3">Add Category</button>
                <button
                  onClick={() => setOpenSubCategoryModal(true)}
                  type="button" className="btns ml-3">Add Sub Category</button>
                <button
                  onClick={() => setOpenProductModal(true)}
                  type="button" className="btns ml-3">Add Product</button>
              </div>
            </div>
            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">Products</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                <form className=" lg:block">
                  <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                    <li>
                      <a href="#">Categories</a>
                    </li>
                    <li>
                      <a href="#">All Category</a>
                    </li>
                  </ul>
                  <div className="grid grid-cols-1">
                    {allCategory?.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 py-6">
                        <h3 className="-my-3 flow-root">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                            aria-controls={`filter-section-${index}`}
                            aria-expanded={expandedIndex === index}
                            onClick={() => handleToggle(index)}
                          >
                            <span className="font-medium text-gray-900">{item.category || "Color"}</span>
                            <span className="ml-6 flex items-center">
                              {expandedIndex === index ? (
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                  data-slot="icon"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                  data-slot="icon"
                                >
                                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                </svg>
                              )}
                            </span>
                          </button>
                        </h3>
                        <div className={`pt-6 ${expandedIndex === index ? 'block' : 'hidden'}`} id={`filter-section-${index}`}>
                          <div className="space-y-4">
                            {item?.subCategory?.map((item2, index2) => (
                              <div key={index2} className="flex items-center">
                                <input
                                  id={`filter-color-${index}-${index2}`}
                                  name={`color-${index}[]`}
                                  value={item2?.name}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  checked={selectedIds.includes(item2._id)}
                                  onChange={() => handleCheckboxChange(item2._id)}
                                />
                                <label htmlFor={`filter-color-${index}-${index2}`} className="ml-3 text-sm text-gray-600">
                                  {item2.name || "Unnamed"}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>

                <div className="lg:col-span-3">
                  <div className="font-[sans-serif] bg-gray-100">
                    <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 max-xl:gap-4 gap-6">
                        {products?.map((item, index) => (
                          <div onClick={() => router.push(`/${item?._id}`)} key={index} className="bg-white rounded-2xl p-5 cursor-pointer hover:-translate-y-2 transition-all relative">
                            <div
                              onClick={(e) => {
                                e.stopPropagation(); 
                                addToWishlist(item?._id); 
                              }}
                              className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-4 right-4"
                            >
                              {item?.isInWishList ? (
                               <svg xmlns="http://www.w3.org/2000/svg" width="16px" className="inline-block" viewBox="0 0 64 64">
                               <path
                                 d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                                 fill="#FF0000" 
                                 stroke="none" 
                               ></path>
                             </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" className="fill-gray-800 inline-block" viewBox="0 0 64 64">
                                  <path
                                    d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                                  ></path>
                                </svg>
                              )}
                            </div>


                            <div className="w-5/6 h-[210px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 md:mb-2 mb-4">
                              <img src={`${API_URL}${item?.image[0]}`} alt={item?.title} className="h-full w-full object-contain" />
                            </div>

                            <div>
                              <h3 className="text-lg font-extrabold text-gray-800">{item?.tittle}</h3>
                              <p className="text-gray-600 text-sm mt-2">{item?.description}</p>
                              <h4 className="text-lg text-gray-800 font-bold mt-4">${item?.variants?.[0]?.price}</h4>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center p-4">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={page === 1} 
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Previous
                    </button>
                    <span>{`Page ${page} of ${totalPage}`}</span>
                    <button 
                        onClick={handleNextPage} 
                        disabled={page === totalPage} 
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Next
                    </button>
                </div>
                    </div>
                  </div>
                </div>


              </div>
            </section>
          </main>
        </div>
      </div>

      {openCategoryModal && (
        <CategoryModal setOpenCategoryModal={setOpenCategoryModal} />
      )}

      {openSubCategoryModal && (
        <SubCategoryModal setOpenCategoryModal={setOpenSubCategoryModal} />
      )}
      {openProductModal && (
        <ProductModal setOpen={setOpenProductModal} setState={setState} />
      )}
    </div>


  )
}

export default Slider



