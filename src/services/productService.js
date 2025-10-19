// src/services/productService.js
import api from './api'

export const productService = {
  // Product Management
  async getProducts(params = {}) {
    try {
      const response = await api.get('/api/v1/products', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/api/v1/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/api/v1/products', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/api/v1/products/${id}`, productData)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/api/v1/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  async toggleProductStatus(id) {
    try {
      const response = await api.patch(`/api/v1/products/${id}/toggle-status`)
      return response.data
    } catch (error) {
      console.error('Error toggling product status:', error)
      throw error
    }
  },

  // Product Variants Management
  async getProductVariants(productId) {
    try {
      const response = await api.get(`/api/v1/products/${productId}/variants`)
      return response.data
    } catch (error) {
      console.error('Error fetching product variants:', error)
      throw error
    }
  },

  async getVariantById(id) {
    try {
      const response = await api.get(`/api/v1/variants/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching variant:', error)
      throw error
    }
  },

  async createVariant(variantData) {
    try {
      const response = await api.post('/api/v1/variants', variantData)
      return response.data
    } catch (error) {
      console.error('Error creating variant:', error)
      throw error
    }
  },

  async updateVariant(id, variantData) {
    try {
      const response = await api.put(`/api/v1/variants/${id}`, variantData)
      return response.data
    } catch (error) {
      console.error('Error updating variant:', error)
      throw error
    }
  },

  async deleteVariant(id) {
    try {
      const response = await api.delete(`/api/v1/variants/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting variant:', error)
      throw error
    }
  },

  // Product Categories Management
  async getCategories(params = {}) {
    try {
      const response = await api.get('/api/v1/categories', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.get(`/api/v1/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await api.post('/api/v1/categories', categoryData)
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/api/v1/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/api/v1/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },

  async getCategoryProducts(categoryId) {
    try {
      const response = await api.get(`/api/v1/categories/${categoryId}/products`)
      return response.data
    } catch (error) {
      console.error('Error fetching category products:', error)
      throw error
    }
  },

  // Brand Management
  async getBrands(params = {}) {
    try {
      const response = await api.get('/api/v1/brands', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching brands:', error)
      throw error
    }
  },

  async getBrandById(id) {
    try {
      const response = await api.get(`/api/v1/brands/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching brand:', error)
      throw error
    }
  },

  async createBrand(brandData) {
    try {
      const response = await api.post('/api/v1/brands', brandData)
      return response.data
    } catch (error) {
      console.error('Error creating brand:', error)
      throw error
    }
  },

  async updateBrand(id, brandData) {
    try {
      const response = await api.put(`/api/v1/brands/${id}`, brandData)
      return response.data
    } catch (error) {
      console.error('Error updating brand:', error)
      throw error
    }
  },

  async deleteBrand(id) {
    try {
      const response = await api.delete(`/api/v1/brands/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting brand:', error)
      throw error
    }
  },

  async getBrandProducts(brandId) {
    try {
      const response = await api.get(`/api/v1/brands/${brandId}/products`)
      return response.data
    } catch (error) {
      console.error('Error fetching brand products:', error)
      throw error
    }
  },

  // Product Images Management
  async getProductImages(productId) {
    try {
      const response = await api.get(`/api/v1/products/${productId}/images`)
      return response.data
    } catch (error) {
      console.error('Error fetching product images:', error)
      throw error
    }
  },

  async uploadProductImage(productId, imageData) {
    try {
      const formData = new FormData()
      formData.append('image', imageData)
      formData.append('productId', productId)
      
      const response = await api.post(`/api/v1/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading product image:', error)
      throw error
    }
  },

  async updateProductImage(productId, imageId, imageData) {
    try {
      const response = await api.put(`/api/v1/products/${productId}/images/${imageId}`, imageData)
      return response.data
    } catch (error) {
      console.error('Error updating product image:', error)
      throw error
    }
  },

  async deleteProductImage(productId, imageId) {
    try {
      const response = await api.delete(`/api/v1/products/${productId}/images/${imageId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product image:', error)
      throw error
    }
  },

  async setMainImage(productId, imageId) {
    try {
      const response = await api.patch(`/api/v1/products/${productId}/images/${imageId}/set-main`)
      return response.data
    } catch (error) {
      console.error('Error setting main image:', error)
      throw error
    }
  },

  // Product Specifications Management
  async getProductSpecs(productId) {
    try {
      const response = await api.get(`/api/v1/products/${productId}/specs`)
      return response.data
    } catch (error) {
      console.error('Error fetching product specs:', error)
      throw error
    }
  },

  async updateProductSpecs(productId, specsData) {
    try {
      const response = await api.put(`/api/v1/products/${productId}/specs`, specsData)
      return response.data
    } catch (error) {
      console.error('Error updating product specs:', error)
      throw error
    }
  },

  // Price History Management
  async getPriceHistory(variantId) {
    try {
      const response = await api.get(`/api/v1/variants/${variantId}/price-history`)
      return response.data
    } catch (error) {
      console.error('Error fetching price history:', error)
      throw error
    }
  },

  async updateVariantPrice(variantId, newPrice, reason = '') {
    try {
      const response = await api.patch(`/api/v1/variants/${variantId}/price`, { 
        newPrice, 
        reason 
      })
      return response.data
    } catch (error) {
      console.error('Error updating variant price:', error)
      throw error
    }
  },

  // Inventory Management
  async getProductInventory(productId) {
    try {
      const response = await api.get(`/api/v1/products/${productId}/inventory`)
      return response.data
    } catch (error) {
      console.error('Error fetching product inventory:', error)
      throw error
    }
  },

  async getVariantInventory(variantId) {
    try {
      const response = await api.get(`/api/v1/variants/${variantId}/inventory`)
      return response.data
    } catch (error) {
      console.error('Error fetching variant inventory:', error)
      throw error
    }
  },

  async updateVariantInventory(variantId, warehouseId, quantity) {
    try {
      const response = await api.patch(`/api/v1/variants/${variantId}/inventory`, {
        warehouseId,
        quantity
      })
      return response.data
    } catch (error) {
      console.error('Error updating variant inventory:', error)
      throw error
    }
  },

  // Search and Filter
  async searchProducts(query, filters = {}) {
    try {
      const params = { q: query, ...filters }
      const response = await api.get('/api/v1/products/search', { params })
      return response.data
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  },

  async getProductsByCategory(categoryId, params = {}) {
    try {
      const response = await api.get(`/api/v1/categories/${categoryId}/products`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  async getProductsByBrand(brandId, params = {}) {
    try {
      const response = await api.get(`/api/v1/brands/${brandId}/products`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching products by brand:', error)
      throw error
    }
  },

  async getFeaturedProducts() {
    try {
      const response = await api.get('/api/v1/products/featured')
      return response.data
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }
  },

  async getNewProducts() {
    try {
      const response = await api.get('/api/v1/products/new')
      return response.data
    } catch (error) {
      console.error('Error fetching new products:', error)
      throw error
    }
  },

  async getBestSellingProducts() {
    try {
      const response = await api.get('/api/v1/products/best-selling')
      return response.data
    } catch (error) {
      console.error('Error fetching best selling products:', error)
      throw error
    }
  },

  // Statistics
  async getProductStats() {
    try {
      const response = await api.get('/api/v1/products/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching product stats:', error)
      throw error
    }
  },

  async getCategoryStats() {
    try {
      const response = await api.get('/api/v1/categories/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching category stats:', error)
      throw error
    }
  },

  async getBrandStats() {
    try {
      const response = await api.get('/api/v1/brands/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching brand stats:', error)
      throw error
    }
  },

  async getInventoryStats() {
    try {
      const response = await api.get('/api/v1/inventory/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching inventory stats:', error)
      throw error
    }
  },

  async getLowStockProducts(threshold = 10) {
    try {
      const response = await api.get('/api/v1/products/low-stock', { 
        params: { threshold } 
      })
      return response.data
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      throw error
    }
  },

  async getOutOfStockProducts() {
    try {
      const response = await api.get('/api/v1/products/out-of-stock')
      return response.data
    } catch (error) {
      console.error('Error fetching out of stock products:', error)
      throw error
    }
  }
}

export default productService

