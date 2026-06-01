import { get, post, put, del } from "./api";
import {
  getMockProducts,
  getMockProduct,
  getMockCategories,
  getMockDeals,
} from "./mockData";

const withFallback = async (apiCall, mockFn, args = []) => {
  try {
    return await apiCall;
  } catch (err) {
    const isNetworkError = err instanceof TypeError
      && err.message.includes('NetworkError');
    const isCorsError = err instanceof TypeError
      && err.message.includes('Failed to fetch');
    const isAbortError = err.name === 'AbortError'
      || err.message === 'The user aborted a request.';
    const isApiDown = err.message === 'Erreur API'
      || err.message.includes('load');
    if (isNetworkError || isCorsError || isAbortError || isApiDown) {
      return mockFn(...args);
    }
    throw err;
  }
};

export const getProducts = async ({ categoryId, sellerEmail } = {}) => {
  const params = new URLSearchParams();
  if (categoryId) params.append('categoryId', categoryId);
  if (sellerEmail) params.append('sellerEmail', sellerEmail);
  const queryString = params.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';
  return withFallback(get(endpoint), getMockProducts);
};

export const getProduct = async (id) => {
  return withFallback(get(`/products/${id}`), getMockProduct, [id]);
};

export const createProduct = async (productData) => {
  return post("/products", productData);
};

export const updateProduct = async (id, productData) => {
  return put(`/products/${id}`, productData);
};

export const deleteProduct = async (id) => {
  return del(`/products/${id}`);
};

export const getCategories = async () => {
  return withFallback(get("/categories"), getMockCategories);
};

export const createCategory = async (categoryData) => {
  return post("/categories", categoryData);
};

export const updateCategory = async (id, categoryData) => {
  return put(`/categories/${id}`, categoryData);
};

export const deleteCategory = async (id) => {
  return del(`/categories/${id}`);
};

export const getDeals = async () => {
  return withFallback(get("/deals"), getMockDeals);
};

export const getAllDeals = async () => {
  try {
    return await get("/deals/all");
  } catch {
    return getMockDeals();
  }
};

export const createDeal = async (data) => {
  return post("/deals", data);
};

export const updateDeal = async (id, data) => {
  return put(`/deals/${id}`, data);
};

export const deleteDeal = async (id) => {
  return del(`/deals/${id}`);
};
