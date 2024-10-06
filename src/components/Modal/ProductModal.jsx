import { AddProduct, EditProduct, SubCategoryOPtions } from '@/services/services';
import { post } from '@/utils/apiHelpers';
import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
import { API_URL } from '../../../config';

const ProductModal = ({ setOpen,setState, products }) => {
    const initial = {
        tittle: "",
        variants: [
            {
                ram: "",
                price: "",
                quantity: "",
            },
        ],
        description: "",
        image: [],
        subCategoryId: "",
        categoryId: ""
    };
    const [formData, setFormData] = useState(initial);
    const [errData, setErrData] = useState(initial);
    const [files, setFile] = useState([]);
    const [message, setMessage] = useState();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (products?._id) {
            setFormData(products)
        }
    }, [products])

    useEffect(() => {
        const getCategoryOptions = async () => {
            try {
                const categoryOptions = await SubCategoryOPtions();
                setCategories(categoryOptions);
            } catch (error) {
                console.error('Error fetching category options:', error);
            }
        };
        getCategoryOptions();
    }, []);

    // Handle Input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
        setErrData({
            ...errData,
            [name]: ''
        });
    };

    const handleVariantChange = (e, index, field) => {
        const { value } = e.target;

        const updatedVariants = [...formData.variants];

        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: value,
        };

        setFormData({
            ...formData,
            variants: updatedVariants,
        });

        const updatedVariantsErr = [...errData.variants];

        updatedVariantsErr[index] = {
            ...updatedVariantsErr[index],
            [field]: '',
        };

        setErrData({
            ...errData,
            variants: updatedVariantsErr,
        });
    };


    const handleAddVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { ram: "", price: "", quantity: "" }
            ]
        });
    };


    const removeImage = (i) => {
        setFormData({
            ...formData,
            image: formData.image.filter(file => file !== i),
        });
    };

    //Handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;
        const variantErrors = formData.variants.map((variant) => {
            const errors = { ram: '', price: '', quantity: '' };

            if (!variant.ram) {
                errors.ram = "RAM is required";
                isValid = false;
            }
            if (!variant.price) {
                errors.price = "Price is required";
                isValid = false;
            }
            if (!variant.quantity) {
                errors.quantity = "Quantity is required";
                isValid = false;
            }
            return errors;
        });

        const updatedErrData = { ...errData, variants: variantErrors };
        if (!formData.tittle) {
            updatedErrData.tittle = "Tittle is required";
            isValid = false;
        }
        if (!formData.description) {
            updatedErrData.description = "Description is required";
            isValid = false;
        }
        if (!formData.image.length) {
            updatedErrData.image = "Image is required";
            isValid = false;
        }
        if (!formData.subCategoryId) {
            updatedErrData.subCategoryId = "Category is required";
            isValid = false;
        }

        if (!isValid) {
            setErrData(updatedErrData);
            return;
        }

        try {
            if(products?._id){
                await EditProduct(formData)
            }else{
                await AddProduct(formData);
            }
            resetAll();
            setOpen(false)
            setState((prev)=>!prev)
        } catch (error) {
            toastr.error('Product Add failed. Please try again');
        }
    };

    //Handle reset form
    const resetAll = () => {
        setFormData(initial);
        setErrData(initial);
        setFile([]);
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: updatedVariants });
    };

    //Handle upload product image
    const uploadImage = async (e) => {
        const selectedFiles = Array.from(e.target.files); // Handle multiple files
        if (selectedFiles.length > 0) {
            try {
                const validExtensions = ["image/jpeg", "image/png", "image/gif", "image/webp"];
                const validFiles = selectedFiles.filter(file => validExtensions.includes(file.type));

                if (validFiles.length === 0) {
                    return toastr.error("Only image files (jpeg, png, gif) are accepted.");
                }

                for (let file of validFiles) {
                    const fd = new FormData();
                    fd.append("file", file);

                    const response = await post(`/product/image`, fd);
                    if (response.status === 200) {
                        const { image = [] } = formData;
                        setFile([...files, file]);  // Add current file to the state
                        setFormData({ ...formData, image: [...image, response.data.new_filename] });
                    } else {
                        toastr.error(response.data.message || "Upload failed.");
                    }
                }
            } catch (error) {
                toastr.error("An error occurred while uploading the file.");
            } finally {
                e.target.value = "";  // Clear the input after processing
            }
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow dark:bg-gray-700 w-full max-w-xl p-4 overflow-y-auto max-h-screen">
                <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Create New Product
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setOpen(false)}
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
                                d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 md:p-5">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Tittle
                            </label>
                            <input
                                type="text"
                                name="tittle"
                                id="tittleId"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter Tittle"
                                onChange={handleChange}
                                value={formData?.tittle || ""}
                            />
                            {errData.tittle && <p className="text-red-500 text-sm">{errData.tittle}</p>}

                        </div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Variants
                        </label>
                        {formData?.variants?.map((item, index) => (
                            <div key={index} className="col-span-2 grid gap-4 grid-cols-3 w-full relative">
                                <div className="col-span-1">
                                    <label
                                        htmlFor={`ram-${index}`}
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        RAM
                                    </label>
                                    <input
                                        type="text"
                                        name={`ram-${index}`}
                                        id={`ram-${index}`}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter RAM"
                                        onChange={(e) => handleVariantChange(e, index, 'ram')}
                                        value={item.ram || ""}

                                    />
                                    {errData?.variants?.[index]?.ram && (
                                        <p className="text-red-500 text-sm">{errData.variants[index].ram}</p>
                                    )}
                                </div>
                                <div className="col-span-1">
                                    <label
                                        htmlFor={`price-${index}`}
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name={`price-${index}`}
                                        id={`price-${index}`}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter price"
                                        onChange={(e) => handleVariantChange(e, index, 'price')}
                                        value={item.price || ""}

                                    />
                                    {errData?.variants?.[index]?.price && (
                                        <p className="text-red-500 text-sm">{errData.variants[index].price}</p>
                                    )}
                                </div>
                                <div className="col-span-1">
                                    <label
                                        htmlFor={`quantity-${index}`}
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        QTY
                                    </label>
                                    <input
                                        type="number"
                                        name={`quantity-${index}`}
                                        id={`quantity-${index}`}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter quantity"
                                        onChange={(e) => handleVariantChange(e, index, 'quantity')}
                                        value={item.quantity || ""}

                                    />
                                    {errData?.variants?.[index]?.quantity && (
                                        <p className="text-red-500 text-sm">{errData.variants[index].quantity}</p>
                                    )}
                                </div>

                                {formData.variants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(index)}
                                        className="absolute right-0 top-0 mt-2 mr-2 text-red-500 hover:text-red-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="col-span-2">
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                                Add more
                            </button>
                        </div>
                        <div className="col-span-2 ">
                            <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Category
                            </label>
                            <select
                                id="subCategoryId"
                                name='subCategoryId'
                                onChange={handleChange}
                                value={formData.subCategoryId}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            >
                                <option >Select Category</option>
                                {categories?.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            {errData.subCategoryId && <p className="text-red-500 text-sm">{errData.subCategoryId}</p>}

                        </div>


                        <div className="col-span-2">
                            <label
                                htmlFor="description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Product Description
                            </label>
                            <textarea
                                id="description"
                                name='description'
                                rows="1"
                                onChange={handleChange}
                                value={formData?.description || ""}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Write product description here"
                            ></textarea>
                            {errData.description && <p className="text-red-500 text-sm">{errData.description}</p>}
                        </div>
                    </div>
                    <div className="m-4">
                        <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">{message}</span>
                        <div className='flex gap-4'>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData?.image?.map((url, key) => (
                                    <div key={key} className="overflow-hidden relative">
                                        <span onClick={() => removeImage(url)} className="absolute right-1 cursor-pointer hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </span>
                                        <img className="h-24 w-24 rounded-md" src={`${API_URL}${url}`} alt="uploaded" /> {/* Adjust image size */}
                                    </div>
                                ))}                              
                            </div>
                            <div className="flex items-center justify-center w-1/4 ">
                                <label className="flex cursor-pointer flex-col w-full h-40 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300"> {/* Adjust height here */}
                                    <div className="flex flex-col items-center justify-center pt-7 ">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                            Select a photo
                                        </p>
                                    </div>
                                    <input type="file" onChange={uploadImage} className="opacity-0" multiple name="image" />
                                    {errData.image && <p className="text-red-500 text-sm">{errData.image}</p>}

                                </label>

                            </div>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="text-white inline-flex items-center bg-[#EDA415] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        {products?._id ? "Update" : "Add"}
                    </button>
                    <button
                        onClick={resetAll}
                        type="reset"
                        className="ml-3 inline-flex items-center bg-[#EEEEEE] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        DISCARD
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductModal