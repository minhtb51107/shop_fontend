// src/modules/product/services/productService.js
import api from '@/services/api';

// Base paths based on backend controllers
const BASE_URL = '/api/v1';

// ===================================================================
// BRAND SERVICES - Quản lý thương hiệu
// Backend: BrandController.java
// ===================================================================
export const brandService = {
  getAll: (params = {}) => {
    // Backend hỗ trợ phân trang
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `${BASE_URL}/brands${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById: (id) => api.get(`${BASE_URL}/brands/${id}`),
  create: (data) => api.post(`${BASE_URL}/brands`, data),
  update: (id, data) => api.put(`${BASE_URL}/brands/${id}`, data),
  delete: (id) => api.delete(`${BASE_URL}/brands/${id}`),
};

// ===================================================================
// CATEGORY SERVICES - Quản lý danh mục sản phẩm
// Backend: ProductCategoryController.java
// ===================================================================
export const categoryService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `${BASE_URL}/categories${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById: (id) => api.get(`${BASE_URL}/categories/${id}`),
  create: (data) => api.post(`${BASE_URL}/categories`, data),
  update: (id, data) => api.put(`${BASE_URL}/categories/${id}`, data),
  delete: (id) => api.delete(`${BASE_URL}/categories/${id}`),
};

// ===================================================================
// PRODUCT SERVICES - Quản lý sản phẩm
// Backend: ProductController.java
// ===================================================================
export const productService = {
  // Lấy danh sách sản phẩm với phân trang, tìm kiếm, lọc
  // Query params: page, size, sort, search, categoryId, brandId
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.search) queryParams.append('search', params.search);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.brandId) queryParams.append('brandId', params.brandId);
    
    const url = `${BASE_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById: (id) => api.get(`${BASE_URL}/products/${id}`),
  
  // Lấy sản phẩm liên quan
  getRelatedProducts: (productId, limit = 4) => {
    return api.get(`${BASE_URL}/products/${productId}/related?limit=${limit}`);
  },
  
  create: (data) => api.post(`${BASE_URL}/products`, data),
  update: (id, data) => api.put(`${BASE_URL}/products/${id}`, data),
  delete: (id) => api.delete(`${BASE_URL}/products/${id}`),
  
  // ===================================================================
  // VARIANT MANAGEMENT - Quản lý biến thể sản phẩm
  // Backend: ProductVariantController.java
  // ===================================================================
  
  // Lấy tất cả variants của một sản phẩm
  getVariantsForProduct: (productId) => api.get(`${BASE_URL}/products/${productId}/variants`),
  
  // Tạo variant mới cho sản phẩm
  createVariant: (productId, data) => api.post(`${BASE_URL}/products/${productId}/variants`, data),
  
  // Note: Backend chưa có endpoint update/delete variant riêng lẻ
  // Cần thêm vào backend nếu cần chức năng này
  // updateVariant: (variantId, data) => api.put(`${BASE_URL}/variants/${variantId}`, data),
  // deleteVariant: (variantId) => api.delete(`${BASE_URL}/variants/${variantId}`),
  
  // ===================================================================
  // PRODUCT IMAGES - Quản lý hình ảnh sản phẩm
  // Backend: ProductImageController.java
  // Base path: /api (không có /v1)
  // ===================================================================
  
  // Lấy danh sách ảnh của sản phẩm
  getImages: (productId) => api.get(`/api/products/${productId}/images`),
  
  // Upload ảnh cho sản phẩm
  uploadImage: (productId, formData) => {
    return api.post(`/api/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Lấy thông tin ảnh theo ID
  getImageById: (imageId) => api.get(`/api/images/${imageId}`),
  
  // Cập nhật thông tin ảnh
  updateImage: (imageId, data) => api.put(`/api/images/${imageId}`, data),
  
  // Xóa ảnh
  deleteImage: (imageId) => api.delete(`/api/images/${imageId}`),
};