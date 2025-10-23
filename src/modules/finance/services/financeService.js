// src/modules/finance/services/financeService.js
import api from '@/services/api';

// ===================================================================
// CHART OF ACCOUNTS SERVICES - Quản lý tài khoản kế toán
// Backend: ChartOfAccountsController.java
// ===================================================================
export const accountService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/finance/accounts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById: (id) => api.get(`/api/v1/finance/accounts/${id}`),
  
  create: (data) => api.post('/api/v1/finance/accounts', data),
  
  update: (id, data) => api.put(`/api/v1/finance/accounts/${id}`, data),
  
  delete: (id) => api.delete(`/api/v1/finance/accounts/${id}`),
  
  // Note: Backend chưa có endpoint deactivate
  // Nếu cần, thêm vào backend
  // deactivate: (id) => api.patch(`/api/v1/finance/accounts/${id}/deactivate`),
};

// ===================================================================
// JOURNAL ENTRY SERVICES - Quản lý bút toán kế toán
// Backend: AccountingController.java
// WARNING: Base path là /finance/journal-entries (KHÔNG CÓ /api/v1)
// ===================================================================
export const journalEntryService = {
  // Note: Backend endpoint là /finance/journal-entries (không có /api/v1)
  // Cần thống nhất với các endpoint khác
  create: (data) => api.post('/finance/journal-entries', data),
  
  // Note: Backend chưa có các endpoint sau:
  // getAll: (params = {}) => {
  //   const queryParams = new URLSearchParams();
  //   if (params.page !== undefined) queryParams.append('page', params.page);
  //   if (params.size !== undefined) queryParams.append('size', params.size);
  //   if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  //   if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  //   
  //   const url = `/finance/journal-entries${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  //   return api.get(url);
  // },
  // getById: (id) => api.get(`/finance/journal-entries/${id}`),
};

// ===================================================================
// FINANCIAL PERIOD SERVICES - Quản lý kỳ kế toán
// Backend: FinancialPeriodController.java
// WARNING: Base path là /finance/periods (KHÔNG CÓ /api/v1)
// ===================================================================
export const financialPeriodService = {
  // Note: Backend endpoint là /finance/periods (không có /api/v1)
  // Cần thống nhất với các endpoint khác
  getAll: () => api.get('/finance/periods'),
  
  create: (data) => api.post('/finance/periods', data),
  
  // Đóng kỳ kế toán
  close: (periodId) => api.post(`/finance/periods/${periodId}/close`),
  
  // Note: Backend chưa có các endpoint sau:
  // getById: (id) => api.get(`/finance/periods/${id}`),
  // update: (id, data) => api.put(`/finance/periods/${id}`, data),
  // delete: (id) => api.delete(`/finance/periods/${id}`),
};

// ===================================================================
// REPORT SERVICES - Báo cáo tài chính
// Backend: ReportController.java
// ===================================================================
export const reportService = {
  // Báo cáo doanh thu
  getRevenueReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.year) queryParams.append('year', params.year);
    if (params.month) queryParams.append('month', params.month);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const url = `/api/v1/finance/reports/revenue${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  // Note: Backend chưa có endpoint profit-loss report
  // Cần thêm vào backend nếu cần
  // getProfitLossReport: (params = {}) => {
  //   const queryParams = new URLSearchParams();
  //   if (params.year) queryParams.append('year', params.year);
  //   if (params.month) queryParams.append('month', params.month);
  //   
  //   const url = `/api/v1/finance/reports/profit-loss${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  //   return api.get(url);
  // },
};