// src/modules/product/services/productService.js
import axios from 'axios';
import api from '@/services/api';

// API base path is /api for product, brand, category based on your backend controllers
const apiProduct = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Use interceptor to add token to this instance as well
apiProduct.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const brandService = {
  getAll: () => apiProduct.get('/brands'),
  create: (data) => apiProduct.post('/brands', data),
  update: (id, data) => apiProduct.put(`/brands/${id}`, data),
  delete: (id) => apiProduct.delete(`/brands/${id}`),
};

export const categoryService = {
  getAll: () => apiProduct.get('/categories'),
  create: (data) => apiProduct.post('/categories', data),
  update: (id, data) => apiProduct.put(`/categories/${id}`, data),
  delete: (id) => apiProduct.delete(`/categories/${id}`),
};

export const productService = {
  getAll: () => apiProduct.get('/products'),
  getById: (id) => apiProduct.get(`/products/${id}`),
  create: (data) => apiProduct.post('/products', data),
  update: (id, data) => apiProduct.put(`/products/${id}`, data),
  delete: (id) => apiProduct.delete(`/products/${id}`),
  
  // Variants
  getVariantsForProduct: (productId) => apiProduct.get(`/products/${productId}/variants`),
  createVariant: (productId, data) => apiProduct.post(`/products/${productId}/variants`, data),
  updateVariant: (variantId, data) => apiProduct.put(`/variants/${variantId}`, data),
  deleteVariant: (variantId) => apiProduct.delete(`/variants/${variantId}`),
};