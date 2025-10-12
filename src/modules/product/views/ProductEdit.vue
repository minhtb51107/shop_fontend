<template>
  <div>
    <h2 class="mb-4">{{ isEditMode ? 'Chỉnh sửa Sản phẩm' : 'Tạo Sản phẩm mới' }}</h2>

    <div class="card shadow-sm">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#info">Thông tin chung</a>
          </li>
          <li class="nav-item" v-if="isEditMode">
            <a class="nav-link" data-bs-toggle="tab" href="#variants">Biến thể</a>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <div class="tab-content p-2">
          <div class="tab-pane fade show active" id="info">
            <ProductInfoForm :product-id="id" @product-saved="onProductSaved" />
          </div>

          <div class="tab-pane fade" id="variants" v-if="isEditMode">
             <VariantManager :product-id="id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductInfoForm from '../components/ProductInfoForm.vue';
import VariantManager from '../components/VariantManager.vue'; // Import component mới

const props = defineProps({
  id: String // Nhận id từ router
});

const router = useRouter();
const isEditMode = computed(() => !!props.id);

const onProductSaved = (productId) => {
  alert('Lưu sản phẩm thành công!');
  // Nếu là tạo mới, chuyển hướng đến trang sửa để có thể thêm biến thể
  if (!isEditMode.value) {
    router.push({ name: 'product-edit', params: { id: productId } });
  } else {
    router.push({ name: 'products-list' });
  }
}
</script>