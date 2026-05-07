import { get, post, put, del } from "./api";

export const getProducts = async () => {
  return get("/products");
};

export const getProduct = async (id) => {
  return get(`/products/${id}`);
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
  return get("/categories");
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
  return get("/deals");
};

export const getAllDeals = async () => {
  return get("/deals/all");
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
