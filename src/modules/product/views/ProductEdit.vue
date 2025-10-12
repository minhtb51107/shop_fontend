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
        <div class="tab-content">
          <div class="tab-pane fade show active" id="info">
            <h4>Thông tin cơ bản</h4>
            <p>Điền các thông tin chính của sản phẩm.</p>
            </div>

          <div class="tab-pane fade" id="variants" v-if="isEditMode">
             <h4>Quản lý Biến thể</h4>
             <p>Thêm hoặc chỉnh sửa các phiên bản sản phẩm (màu sắc, dung lượng...).</p>
             </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: String // Nhận id từ router
});

const isEditMode = computed(() => !!props.id);
</script>