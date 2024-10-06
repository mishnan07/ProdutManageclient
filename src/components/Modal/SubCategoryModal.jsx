import { AddSubCategory, CategoryOPtions } from '@/services/services';
import React, { useEffect, useState } from 'react';
import toastr from 'toastr';

const SubCategoryModal = ({ setOpenCategoryModal ,setSubmitCategory }) => {
  const [categories, setCategories] = useState([]);
  const initial = {
    categoryId: "",
    name: ""
  };
  const [formData, setFormData] = useState(initial);
  const [err, setErr] = useState({ categoryId: false, name: false });

  useEffect(() => {
    const getCategoryOptions = async () => {
      try {
        const categoryOptions = await CategoryOPtions();
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Error fetching category options:', error);
      }
    };
    getCategoryOptions();
  }, []);

 //Handle Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields
    if (!formData.categoryId) {
      setErr({ ...err, categoryId: true });
      return;
    }
    if (!formData.name) {
      setErr({ ...err, name: true });
      return;
    }
    try {
      await AddSubCategory(formData);
      resetAll();
      setOpenCategoryModal(false)
      setSubmitCategory((prev)=>!prev)
    } catch (error) {
      toastr.error('Category Add failed. Please try again');
    }
  };

  // rest form
  const resetAll = () => {
    setFormData(initial);
    setErr({ categoryId: false, name: false });
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black opacity-60 backdrop-blur-sm z-40" />
      <div id="crud-modal" className="fixed top-0 right-0 left-0 z-50 w-full h-full overflow-y-auto overflow-x-hidden flex justify-center items-center">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Category</h3>
              <button
                type="button"
                onClick={() => setOpenCategoryModal(false)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid gap-4 mb-4 grid-cols-1">
                {/* Select for Category */}
                <div className="col-span-2">
                  <select
                    id="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => {
                      setFormData({ ...formData, categoryId: e.target.value });
                      setErr({ ...err, categoryId: false });
                    }}
                    value={formData.categoryId}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories?.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {err.categoryId && <p className="text-red-500 text-sm">Please select a category</p>}
                </div>

                {/* Input for Subcategory Name */}
                <div className="col-span-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Subcategory Name"
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErr({ ...err, name: false });
                    }}
                    value={formData.name}
                  />
                  {err.name && <p className="text-red-500 text-sm">Category Name is required</p>}
                </div>
              </div>
              <div className='flex justify-center gap-3'>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-[#EDA415] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  ADD
                </button>
                <button
                  onClick={resetAll}
                  type="button"
                  className="text-white inline-flex items-center bg-[#3C3C3C] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  DISCARD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryModal;
