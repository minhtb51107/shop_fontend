<template>
  <div>
    <h2 class="mb-4">Lịch sử Hoạt động Người dùng</h2>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <form class="row g-3 align-items-end" @submit.prevent="applyFilters">
          <div class="col-md-3">
            <label class="form-label">Email người dùng</label>
            <input v-model="filters.userEmail" type="email" class="form-control">
          </div>
          <div class="col-md-3">
            <label class="form-label">Hành động</label>
            <input v-model="filters.action" type="text" class="form-control">
          </div>
          <div class="col-md-3">
            <label class="form-label">Từ ngày</label>
            <input v-model="filters.startDate" type="datetime-local" class="form-control">
          </div>
          <div class="col-md-3">
            <label class="form-label">Đến ngày</label>
            <input v-model="filters.endDate" type="datetime-local" class="form-control">
          </div>
          <div class="col-12 text-end">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="bi bi-search me-2"></i>Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-sm">
          <thead class="table-light">
            <tr>
              <th style="width: 20%;">Thời gian</th>
              <th style="width: 20%;">Người dùng</th>
              <th style="width: 15%;">Hành động</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="4" class="text-center p-5"><div class="spinner-border"></div></td></tr>
            <tr v-else-if="logs.length === 0"><td colspan="4" class="text-center text-muted p-5">Không tìm thấy kết quả.</td></tr>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ formatDateTime(log.createdAt) }}</td>
              <td>{{ log.userEmail }}</td>
              <td><span class="badge bg-info text-dark">{{ log.action }}</span></td>
              <td><pre class="bg-light p-2 rounded small m-0">{{ log.details }}</pre></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { activityLogService } from '../services/userService';

const logs = ref([]);
const loading = ref(false);
const filters = ref({
  userEmail: '', // Backend dùng userId, nhưng để UX tốt hơn ta sẽ tìm userId từ email
  action: '',
  startDate: '',
  endDate: '',
  page: 0,
  size: 15,
});

onMounted(fetchLogs);

async function fetchLogs() {
  loading.value = true;
  try {
    // Note: Backend API filter by userId, not email. This is a simplification for now.
    // A more advanced version would fetch a list of users to get their ID.
    const params = {
        action: filters.value.action || null,
        startDate: filters.value.startDate ? new Date(filters.value.startDate).toISOString() : null,
        endDate: filters.value.endDate ? new Date(filters.value.endDate).toISOString() : null,
        page: filters.value.page,
        size: filters.value.size
    };
    const response = await activityLogService.search(params);
    logs.value = response.data.content;
    // pagination info is in response.data (totalPages, totalElements, etc.)
  } catch (error) {
    alert('Không thể tải lịch sử hoạt động.');
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
    filters.value.page = 0; // Reset to first page on new search
    fetchLogs();
}

const formatDateTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('vi-VN');
}
</script>

<style scoped>
pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>