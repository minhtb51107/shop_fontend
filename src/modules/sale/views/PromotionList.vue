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
              <th>Tên chiến dịch</th>
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
              <td>{{ formatDiscount(promo) }}</td> 
              <td>{{ formatDate(promo.startDate) }} - {{ formatDate(promo.endDate) }}</td>
              <td>
                <span :class="['badge', promo.isActive ? 'bg-success' : 'bg-secondary']">
                  {{ promo.isActive ? 'Đang hoạt động' : 'Đã dừng' }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" disabled title="Chức năng chỉnh sửa (Update) chưa được Backend hỗ trợ.">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm" 
                        :class="[promo.isActive ? 'btn-outline-danger' : 'btn-outline-success']" 
                        @click="toggleStatus(promo)">
                  <i :class="['bi', promo.isActive ? 'bi-lock' : 'bi-unlock']"></i>
                  {{ promo.isActive ? ' Dừng' : ' Kích hoạt' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!promotions.length" class="text-center text-muted p-3">
          Không có chiến dịch khuyến mãi nào.
        </div>
      </div>
    </div>

    <div class="modal fade" id="promotionModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm Khuyến mãi mới</h5>
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
                        <option value="PERCENT">Phần trăm (%)</option>
                        <option value="AMOUNT">Số tiền cố định</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Giá trị giảm giá ({{ form.discountType === 'PERCENT' ? '%' : 'VND' }})</label>
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
const isEditMode = ref(false); // Giữ lại nhưng luôn là false

onMounted(() => {
    fetchPromotions();
    modalInstance = new Modal(modalRef.value);
});

const fetchPromotions = async () => {
    try {
        const response = await promotionService.getAll();
        promotions.value = response.data;
    } catch (error) {
        console.error('Lỗi tải danh sách khuyến mãi:', error);
        alert('Lỗi tải danh sách khuyến mãi!');
    }
};

const openModal = (promo = null) => {
    // Chỉ hỗ trợ tạo mới vì Backend không hỗ trợ PUT/UPDATE chi tiết
    isEditMode.value = false;
    form.value = { name: '', discountType: 'AMOUNT', discountValue: 0, startDate: '', endDate: '' };
};

const handleSubmit = async () => {
    // Chuyển đổi ngày tháng local (yyyy-MM-ddThh:mm) sang ISO String (OffsetDateTime)
    // API Backend cần format ISO 8601
    const payload = {
        ...form.value,
        startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : null,
        endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
    };
    
    // Kiểm tra tính hợp lệ đơn giản
    if (payload.startDate && payload.endDate && payload.startDate >= payload.endDate) {
        alert("Ngày bắt đầu phải trước ngày kết thúc!");
        return;
    }

    try {
        // Chỉ gọi API Create vì isEditMode luôn là false
        await promotionService.create(payload);
        fetchPromotions();
        modalInstance.hide();
    } catch (error) {
        console.error('Lưu khuyến mãi thất bại:', error.response?.data || error);
        alert('Lưu thất bại! Vui lòng kiểm tra dữ liệu.');
    }
};

const toggleStatus = async (promo) => {
    const newStatus = !promo.isActive;
    if (confirm(`Bạn có chắc muốn ${newStatus ? 'KÍCH HOẠT' : 'DỪNG'} chiến dịch "${promo.name}"?`)) {
        try {
            await promotionService.updateStatus(promo.id, newStatus);
            promo.isActive = newStatus; // Cập nhật trạng thái ngay trên UI
            alert('Cập nhật trạng thái thành công!');
        } catch (error) {
            console.error('Cập nhật trạng thái thất bại:', error);
            alert('Cập nhật trạng thái thất bại!');
        }
    }
};

// Hàm định dạng giá trị giảm giá (cho bảng)
const formatDiscount = (promo) => {
    if (promo.discountType === 'PERCENT') {
        return `${promo.discountValue}%`;
    }
    // Dùng Intl.NumberFormat để định dạng tiền tệ
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.discountValue || 0);
};

// Hàm định dạng ngày tháng (cho bảng)
const formatDate = (dateString) => {
    if (!dateString) return '';
    // Chỉ hiển thị ngày tháng
    return new Date(dateString).toLocaleDateString('vi-VN');
};
</script>