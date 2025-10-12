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
            <div class="col-md-6 mb-3">
                <label class="form-label">Thương hiệu</label>
                <select v-model="product.brandId" class="form-select" required>
                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">Danh mục</label>
                <select v-model="product.categoryId" class="form-select" required @change="onCategoryChange">
                     <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
            </div>
        </div>

        <div v-if="specFields.length > 0" class="card card-body mb-3">
            <h5>Thông số kỹ thuật</h5>
            <div class="row">
                <div v-for="field in specFields" :key="field.key" class="col-md-6 mb-3">
                    <label class="form-label">{{ field.label }}</label>
                    <input v-model="product.specs[field.key]" type="text" class="form-control">
                </div>
            </div>
        </div>

        <button type="submit" class="btn btn-primary">Lưu sản phẩm</button>
    </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { brandService, categoryService, productService } from '../services/productService';

const props = defineProps({ productId: String });
const product = ref({ specs: {} });
const brands = ref([]);
const categories = ref([]);
const specFields = ref([]);

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
    // Tải dữ liệu cho các dropdown
    const [brandRes, catRes] = await Promise.all([brandService.getAll(), categoryService.getAll()]);
    brands.value = brandRes.data;
    categories.value = catRes.data;

    if (props.productId) {
        const productRes = await productService.getById(props.productId);
        product.value = productRes.data;
        if (!product.value.specs) product.value.specs = {}; // Đảm bảo specs tồn tại
        updateSpecFields();
    }
});

const onCategoryChange = () => {
    product.value.specs = {}; // Reset specs khi đổi category
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

// Logic saveProduct...
</script>