// src/modules/product/services/productService.js
import api from '@/services/api';

// API base path is now /api, not /api/v1
const apiProduct = axios.create({
  baseURL: 'http://localhost:8080/api',
  // Interceptors will be inherited from the original api instance if we don't redefine
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