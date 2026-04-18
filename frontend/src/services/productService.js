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
