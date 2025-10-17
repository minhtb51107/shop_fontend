<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Khuyến mãi</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#promotionModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm khuyến mãi
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Tên khuyến mãi</th>
              <th>Loại giảm giá</th>
              <th>Giá trị</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="promo in promotions" :key="promo.id">
              <td>{{ promo.id }}</td>
              <td>{{ promo.name }}</td>
              <td>{{ promo.discountType }}</td>
              <td>{{ formatDiscountValue(promo.discountValue) }}</td>
              <td>{{ formatDate(promo.startDate) }} - {{ formatDate(promo.endDate) }}</td>
              <td>
                <span :class="['badge', promo.isActive ? 'bg-success' : 'bg-secondary']">
                  {{ promo.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td class="text-end">
                 <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#promotionModal" @click="openModal(promo)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(promo)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="promotionModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Khuyến mãi' : 'Thêm mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label class="form-label">Tên khuyến mãi</label>
                    <input v-model="form.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Loại giảm giá</label>
                    <select v-model="form.discountType" class="form-select" required>
                        <option value="PERCENTAGE">Phần trăm (%)</option>
                        <option value="FIXED_AMOUNT">Số tiền cố định</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Giá trị giảm giá</label>
                    <input v-model.number="form.discountValue" type="number" class="form-control" min="0" required>
                </div>
                 <div class="mb-3">
                    <label class="form-label">Ngày bắt đầu</label>
                    <input v-model="form.startDate" type="datetime-local" class="form-control" required>
                </div>
                 <div class="mb-3">
                    <label class="form-label">Ngày kết thúc</label>
                    <input v-model="form.endDate" type="datetime-local" class="form-control" required>
                </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { promotionService } from '../services/saleService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);
const promotions = ref([]);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
    fetchPromotions();
    modalInstance = new Modal(modalRef.value);
});

const fetchPromotions = async () => {
    const response = await promotionService.getAll();
    promotions.value = response.data;
};

const openModal = (promo = null) => {
    isEditMode.value = !!promo;
    if (promo) {
        form.value = { 
          ...promo, 
          startDate: new Date(promo.startDate).toISOString().slice(0, 16),
          endDate: new Date(promo.endDate).toISOString().slice(0, 16)
        };
    } else {
        form.value = { name: '', discountType: 'PERCENTAGE', discountValue: 0, startDate: '', endDate: '' };
    }
};

const handleSubmit = async () => {
    try {
        if (isEditMode.value) {
            await promotionService.update(form.value.id, form.value);
        } else {
            await promotionService.create(form.value);
        }
        fetchPromotions();
        modalInstance.hide();
    } catch (error) {
        alert('Lưu thất bại!');
    }
};

const handleDelete = async (promo) => {
    if(confirm(`Xóa khuyến mãi "${promo.name}"?`)) {
        await promotionService.delete(promo.id);
        fetchPromotions();
    }
};

const formatDiscountValue = (value) => {
    if (form.value.discountType === 'PERCENTAGE') {
        return `${value}%`;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};
</script>