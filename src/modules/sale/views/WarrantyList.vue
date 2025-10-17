<template>
  <div>
    <h2 class="mb-4">Quản lý Yêu cầu Bảo hành</h2>
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <form class="row g-3" @submit.prevent="fetchWarrantyCases">
          <div class="col-md-4">
            <label class="form-label">Tìm kiếm</label>
            <input v-model="filters.search" type="text" class="form-control" placeholder="Tìm theo mã Y/C, số serial...">
          </div>
          <div class="col-md-4">
            <label class="form-label">Trạng thái</label>
            <select v-model="filters.status" class="form-select">
              <option value="">Tất cả</option>
              <option value="RECEIVED">Đã tiếp nhận</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button type="submit" class="btn btn-primary w-100">
              <i class="bi bi-search me-2"></i>Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <table v-else-if="warrantyCases.length > 0" class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã Y/C</th>
              <th>Khách hàng</th>
              <th>Mã sản phẩm</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="wc in warrantyCases" :key="wc.id">
              <td>#{{ wc.id }}</td>
              <td>Khách hàng #{{ wc.customerId }}</td>
              <td>#{{ wc.orderItemId }}</td>
              <td>{{ wc.description }}</td>
              <td>
                <span :class="['badge', getStatusClass(wc.status)]">
                  {{ getStatusText(wc.status) }}
                </span>
              </td>
              <td class="text-end">
                <router-link :to="{ name: 'warranty-details', params: { id: wc.id } }" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-eye"></i> Xem chi tiết
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center text-muted p-5">Không tìm thấy yêu cầu bảo hành nào.</div>
        
        <nav v-if="totalPages > 1" aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Trước</a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Sau</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { warrantyService } from '../services/saleService';

const warrantyCases = ref([]);
const loading = ref(false);
const error = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({
    search: '',
    status: ''
});

const fetchWarrantyCases = async () => {
    loading.value = true;
    error.value = '';
    try {
        const params = {
            page: currentPage.value - 1,
            size: 10,
            search: filters.value.search || undefined,
            status: filters.value.status || undefined,
        };
        const response = await warrantyService.getWarrantyCases(params);
        warrantyCases.value = response.data.content;
        totalPages.value = response.data.totalPages;
    } catch (err) {
        console.error(err);
        error.value = 'Không thể tải danh sách yêu cầu bảo hành.';
    } finally {
        loading.value = false;
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchWarrantyCases();
    }
};

onMounted(fetchWarrantyCases);

const getStatusClass = (status) => {
    switch (status) {
        case 'RECEIVED': return 'bg-info text-dark';
        case 'IN_PROGRESS': return 'bg-warning text-dark';
        case 'RESOLVED': return 'bg-success';
        case 'CANCELLED': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const getStatusText = (status) => {
    const texts = {
        'RECEIVED': 'Đã tiếp nhận',
        'IN_PROGRESS': 'Đang xử lý',
        'RESOLVED': 'Đã giải quyết',
        'CANCELLED': 'Đã hủy'
    };
    return texts[status] || status;
};
</script>