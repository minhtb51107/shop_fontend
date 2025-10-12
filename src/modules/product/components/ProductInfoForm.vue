<template>
    <form @submit.prevent="saveProduct">
        <div class="row">
            <div class="col-md-8 mb-3">
                <label class="form-label">Tên sản phẩm</label>
                <input v-model="product.name" type="text" class="form-control" required>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Tiền tố SKU</label>
                <input v-model="product.skuPrefix" type="text" class="form-control" required>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea v-model="product.description" class="form-control" rows="4"></textarea>
        </div>

        <div class="row">
            <div class="col-md-4 mb-3">
                <label class="form-label">Thương hiệu</label>
                <select v-model="product.brandId" class="form-select" required>
                    <option disabled :value="undefined">-- Chọn thương hiệu --</option>
                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Danh mục</label>
                <select v-model="product.categoryId" class="form-select" required @change="onCategoryChange">
                    <option disabled :value="undefined">-- Chọn danh mục --</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model="product.isActive" class="form-select" required>
                    <option :value="true">Đang bán</option>
                    <option :value="false">Ngừng bán</option>
                </select>
            </div>
        </div>

        <div v-if="specFields.length > 0" class="card card-body mb-3 bg-light border-dashed">
            <h5 class="card-title">Thông số kỹ thuật</h5>
            <div class="row">
                <div v-for="field in specFields" :key="field.key" class="col-md-6 mb-3">
                    <label class="form-label">{{ field.label }}</label>
                    <input v-model="product.specs[field.key]" type="text" class="form-control">
                </div>
            </div>
        </div>
        
        <div class="d-flex justify-content-end">
            <router-link :to="{ name: 'products-list' }" class="btn btn-secondary me-2">Hủy</router-link>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                Lưu sản phẩm
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { brandService, categoryService, productService } from '../services/productService';

const props = defineProps({ productId: String });
const emit = defineEmits(['product-saved']);

const isEditMode = computed(() => !!props.productId);

const product = ref({ 
    name: '',
    skuPrefix: '',
    description: '',
    brandId: undefined,
    categoryId: undefined,
    isActive: true,
    specs: {} 
});
const brands = ref([]);
const categories = ref([]);
const specFields = ref([]);
const isSaving = ref(false);

const specTemplates = {
    'laptop': [
        { key: 'cpu', label: 'CPU' },
        { key: 'ram', label: 'RAM' },
        { key: 'storage', label: 'Ổ cứng' },
        { key: 'gpu', label: 'Card đồ họa' },
        { key: 'screenSize', label: 'Màn hình' },
    ],
    'phone': [
        { key: 'screenSize', label: 'Màn hình' },
        { key: 'ram', label: 'RAM' },
        { key: 'storage', label: 'Bộ nhớ trong' },
        { key: 'battery', label: 'Pin' },
        { key: 'os', label: 'Hệ điều hành' },
    ]
};

onMounted(async () => {
    const [brandRes, catRes] = await Promise.all([brandService.getAll(), categoryService.getAll()]);
    brands.value = brandRes.data;
    categories.value = catRes.data;

    if (isEditMode.value) {
        const productRes = await productService.getById(props.productId);
        const fetchedProduct = productRes.data;
        
        product.value = {
            id: fetchedProduct.id,
            name: fetchedProduct.name,
            skuPrefix: fetchedProduct.skuPrefix,
            description: fetchedProduct.description,
            brandId: fetchedProduct.brand?.id,
            categoryId: fetchedProduct.category?.id,
            isActive: fetchedProduct.isActive,
            specs: fetchedProduct.specs || {}
        };
        updateSpecFields();
    }
});

const onCategoryChange = () => {
    product.value.specs = {};
    updateSpecFields();
};

const updateSpecFields = () => {
    const selectedCategory = categories.value.find(c => c.id === product.value.categoryId);
    if (!selectedCategory) {
        specFields.value = [];
        return;
    }
    const categoryName = selectedCategory.name.toLowerCase();
    if (categoryName.includes('laptop')) {
        specFields.value = specTemplates.laptop;
    } else if (categoryName.includes('phone')) {
        specFields.value = specTemplates.phone;
    } else {
        specFields.value = [];
    }
};

const saveProduct = async () => {
    isSaving.value = true;
    try {
        let savedProduct;
        if (isEditMode.value) {
            const response = await productService.update(product.value.id, product.value);
            savedProduct = response.data;
        } else {
            const response = await productService.create(product.value);
            savedProduct = response.data;
        }
        emit('product-saved', savedProduct.id); // Trả về ID sản phẩm
    } catch (error) {
        console.error("Lưu sản phẩm thất bại:", error);
        alert('Lưu sản phẩm thất bại!');
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
.border-dashed {
    border-style: dashed !important;
}
</style>