// src/modules/product/services/productService.js
import api from '@/services/api';

// Base paths based on backend controllers
const BASE_URL = '/api/v1';

export const brandService = {
  getAll: () => api.get(`${BASE_URL}/brands`),
  getById: (id) => api.get(`${BASE_URL}/brands/${id}`),
  create: (data) => api.post(`${BASE_URL}/brands`, data),
  update: (id, data) => api.put(`${BASE_URL}/brands/${id}`, data),
  delete: (id) => api.delete(`${BASE_URL}/brands/${id}`),
};

export const categoryService = {
  getAll: () => api.get(`${BASE_URL}/categories`),
  getById: (id) => api.get(`${BASE_URL}/categories/${id}`),
  create: (data) => api.post(`${BASE_URL}/categories`, data),
  update: (id, data) => api.put(`${BASE_URL}/categories/${id}`, data),
  delete: (id) => api.delete(`${BASE_URL}/categories/${id}`),
};

export const productService = {
  // Basic CRUD
  getAll: (queryParams = '') => api.get(`${BASE_URL}/products${queryParams}`),
  getById: (id) => api.get(`${BASE_URL}/products/${id}`),
  create: (data) => api.post(`${BASE_URL}/products`, data),
  update: (id, data) => api.put(`${BASE_URL}/products/${id}`, data),
  delete: (id) => api.delete(`${BASE_URL}/products/${id}`),
  
  // Variants
  getVariantsForProduct: (productId) => api.get(`${BASE_URL}/products/${productId}/variants`),
  createVariant: (productId, data) => api.post(`${BASE_URL}/products/${productId}/variants`, data),
  updateVariant: (variantId, data) => api.put(`${BASE_URL}/variants/${variantId}`, data),
  deleteVariant: (variantId) => api.delete(`${BASE_URL}/variants/${variantId}`),
  
  // Inventory (if available)
  getInventory: (variantId) => api.get(`${BASE_URL}/inventory/variant/${variantId}`),
  getInventoryForProduct: (productId) => api.get(`${BASE_URL}/products/${productId}/inventory`),
  
  // Product images
  getImages: (productId) => api.get(`${BASE_URL}/products/${productId}/images`),
  uploadImage: (productId, formData) => api.post(`${BASE_URL}/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (imageId) => api.delete(`${BASE_URL}/images/${imageId}`),
  
  // Search & filters
  search: (query, filters = {}) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    return api.get(`${BASE_URL}/products/search?${params.toString()}`);
  },
};