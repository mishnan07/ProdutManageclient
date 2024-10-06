import toastr from "toastr";
import { get, post, put } from "../utils/apiHelpers";
import { getToken } from "../utils/commonFunctions";

//Handle submit the user registration form
export const SubmitUserRegister = async (formData) => {
    try {
        const res = await post('/user/register', formData)
        toastr.success(res?.message);
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

//Handle submit the user login form
export const SubmitUserLogin = async (formData) => {
    try {
        const res = await post('/user/login', formData)
        toastr.success(res?.message);
        localStorage.setItem("authUser", JSON.stringify(res?.userResponse))
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};


//Handle submit the add category form
export const AddCategory = async (formData) => {
    try {
        const res = await post('/category', formData)
        toastr.success(res?.message);
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

//Handle submit the add sub category form
export const AddSubCategory = async (formData) => {
    try {
        const res = await post('/sub-category', formData)
        toastr.success(res?.message);

    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

//Handle submit the add  product form
export const AddProduct = async (productData) => {
    try {
        const res = await post('/product', productData)
        toastr.success(res?.message);

    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

//Handle submit the Edit  product form
export const EditProduct = async (productData) => {
    try {
        const res = await put('/product', productData)
        toastr.success(res?.message);
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

//Handle Fetch the category options
export const CategoryOPtions = async () => {
    try {
        const res = await get('/options/category')
        return res?.data

    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

//Handle Fetch the sub category options
export const SubCategoryOPtions = async () => {
    try {
        const res = await get('/options/sub-category')
        return res?.data

    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

// List All products
export const ProductList = async (selectedIds = [], search = '', page, limit) => {
    try {
        const token = getToken();
        let selected = selectedIds?.length ? `${selectedIds.join(',')}` : '';
        const query = `selectedIds=${selected}&search=${search}&page=${page}&limit=${limit}`;
        const baseUrl = token ? `product/auth?${query}` : `product?${query}`;
        const res = await get(baseUrl);
        
        return { data: res?.data, count: res?.count };
        
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occurred");
    }
};


export const ProductListSingle = async (productId = '') => {
    try {
        const res = await get(`/product?productId=${productId}`);
        return res?.data
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};


//Handle Fetch the products
export const ListAllCategory = async () => {
    try {
        const res = await get('/sub-category/list')
        return res?.data
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};


//handle update wishlist
export const UpdateWishList = async (productId) => {
    try {
        const res = await put('/wishList', productId)
        toastr.success(res?.message);
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};


//Handle Fetch the wish list
export const ListUserWishList = async () => {
    try {        
        const res = await get('/wishList')
        return res?.data
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};

//Handle Fetch the products
export const ListUserWishListCount = async () => {
    try {        
        const res = await get('/wishList/count')
        return res?.count
    } catch (error) {
        toastr.error(error?.response?.data?.message || "An Error Occured")
    }
};