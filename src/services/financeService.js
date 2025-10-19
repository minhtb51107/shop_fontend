// src/services/financeService.js
import api from './api'

export const financeService = {
  // Chart of Accounts Management
  async getAccounts(params = {}) {
    try {
      const response = await api.get('/api/v1/accounts', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching accounts:', error)
      throw error
    }
  },

  async getAccountById(id) {
    try {
      const response = await api.get(`/api/v1/accounts/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching account:', error)
      throw error
    }
  },

  async createAccount(accountData) {
    try {
      const response = await api.post('/api/v1/accounts', accountData)
      return response.data
    } catch (error) {
      console.error('Error creating account:', error)
      throw error
    }
  },

  async updateAccount(id, accountData) {
    try {
      const response = await api.put(`/api/v1/accounts/${id}`, accountData)
      return response.data
    } catch (error) {
      console.error('Error updating account:', error)
      throw error
    }
  },

  async deleteAccount(id) {
    try {
      const response = await api.delete(`/api/v1/accounts/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  },

  async getAccountsByType(type) {
    try {
      const response = await api.get(`/api/v1/accounts/type/${type}`)
      return response.data
    } catch (error) {
      console.error('Error fetching accounts by type:', error)
      throw error
    }
  },

  // Financial Periods Management
  async getPeriods(params = {}) {
    try {
      const response = await api.get('/api/v1/periods', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching periods:', error)
      throw error
    }
  },

  async getPeriodById(id) {
    try {
      const response = await api.get(`/api/v1/periods/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching period:', error)
      throw error
    }
  },

  async createPeriod(periodData) {
    try {
      const response = await api.post('/api/v1/periods', periodData)
      return response.data
    } catch (error) {
      console.error('Error creating period:', error)
      throw error
    }
  },

  async updatePeriod(id, periodData) {
    try {
      const response = await api.put(`/api/v1/periods/${id}`, periodData)
      return response.data
    } catch (error) {
      console.error('Error updating period:', error)
      throw error
    }
  },

  async closePeriod(id) {
    try {
      const response = await api.patch(`/api/v1/periods/${id}/close`)
      return response.data
    } catch (error) {
      console.error('Error closing period:', error)
      throw error
    }
  },

  async reopenPeriod(id) {
    try {
      const response = await api.patch(`/api/v1/periods/${id}/reopen`)
      return response.data
    } catch (error) {
      console.error('Error reopening period:', error)
      throw error
    }
  },

  async getCurrentPeriod() {
    try {
      const response = await api.get('/api/v1/periods/current')
      return response.data
    } catch (error) {
      console.error('Error fetching current period:', error)
      throw error
    }
  },

  // Journal Entries Management
  async getJournalEntries(params = {}) {
    try {
      const response = await api.get('/api/v1/journal-entries', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching journal entries:', error)
      throw error
    }
  },

  async getJournalEntryById(id) {
    try {
      const response = await api.get(`/api/v1/journal-entries/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching journal entry:', error)
      throw error
    }
  },

  async createJournalEntry(entryData) {
    try {
      const response = await api.post('/api/v1/journal-entries', entryData)
      return response.data
    } catch (error) {
      console.error('Error creating journal entry:', error)
      throw error
    }
  },

  async updateJournalEntry(id, entryData) {
    try {
      const response = await api.put(`/api/v1/journal-entries/${id}`, entryData)
      return response.data
    } catch (error) {
      console.error('Error updating journal entry:', error)
      throw error
    }
  },

  async deleteJournalEntry(id) {
    try {
      const response = await api.delete(`/api/v1/journal-entries/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      throw error
    }
  },

  async approveJournalEntry(id) {
    try {
      const response = await api.patch(`/api/v1/journal-entries/${id}/approve`)
      return response.data
    } catch (error) {
      console.error('Error approving journal entry:', error)
      throw error
    }
  },

  async reverseJournalEntry(id, reason) {
    try {
      const response = await api.patch(`/api/v1/journal-entries/${id}/reverse`, { reason })
      return response.data
    } catch (error) {
      console.error('Error reversing journal entry:', error)
      throw error
    }
  },

  // Journal Entry Items Management
  async getJournalEntryItems(entryId) {
    try {
      const response = await api.get(`/api/v1/journal-entries/${entryId}/items`)
      return response.data
    } catch (error) {
      console.error('Error fetching journal entry items:', error)
      throw error
    }
  },

  async addJournalEntryItem(entryId, itemData) {
    try {
      const response = await api.post(`/api/v1/journal-entries/${entryId}/items`, itemData)
      return response.data
    } catch (error) {
      console.error('Error adding journal entry item:', error)
      throw error
    }
  },

  async updateJournalEntryItem(entryId, itemId, itemData) {
    try {
      const response = await api.put(`/api/v1/journal-entries/${entryId}/items/${itemId}`, itemData)
      return response.data
    } catch (error) {
      console.error('Error updating journal entry item:', error)
      throw error
    }
  },

  async removeJournalEntryItem(entryId, itemId) {
    try {
      const response = await api.delete(`/api/v1/journal-entries/${entryId}/items/${itemId}`)
      return response.data
    } catch (error) {
      console.error('Error removing journal entry item:', error)
      throw error
    }
  },

  // General Ledger Management
  async getGeneralLedger(params = {}) {
    try {
      const response = await api.get('/api/v1/general-ledger', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching general ledger:', error)
      throw error
    }
  },

  async getAccountLedger(accountId, params = {}) {
    try {
      const response = await api.get(`/api/v1/accounts/${accountId}/ledger`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching account ledger:', error)
      throw error
    }
  },

  async getTrialBalance(params = {}) {
    try {
      const response = await api.get('/api/v1/trial-balance', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching trial balance:', error)
      throw error
    }
  },

  async getBalanceSheet(params = {}) {
    try {
      const response = await api.get('/api/v1/balance-sheet', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching balance sheet:', error)
      throw error
    }
  },

  async getIncomeStatement(params = {}) {
    try {
      const response = await api.get('/api/v1/income-statement', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching income statement:', error)
      throw error
    }
  },

  async getCashFlowStatement(params = {}) {
    try {
      const response = await api.get('/api/v1/cash-flow-statement', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching cash flow statement:', error)
      throw error
    }
  },

  // Revenue Reports
  async getRevenueReport(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/revenue', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue report:', error)
      throw error
    }
  },

  async getRevenueByPeriod(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/revenue/by-period', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue by period:', error)
      throw error
    }
  },

  async getRevenueByProduct(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/revenue/by-product', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue by product:', error)
      throw error
    }
  },

  async getRevenueByCustomer(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/revenue/by-customer', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue by customer:', error)
      throw error
    }
  },

  async getRevenueByEmployee(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/revenue/by-employee', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue by employee:', error)
      throw error
    }
  },

  // Expense Reports
  async getExpenseReport(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/expenses', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching expense report:', error)
      throw error
    }
  },

  async getExpenseByCategory(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/expenses/by-category', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching expense by category:', error)
      throw error
    }
  },

  async getExpenseByPeriod(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/expenses/by-period', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching expense by period:', error)
      throw error
    }
  },

  // Profit & Loss Reports
  async getProfitLossReport(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/profit-loss', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching profit loss report:', error)
      throw error
    }
  },

  async getProfitMarginReport(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/profit-margin', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching profit margin report:', error)
      throw error
    }
  },

  // Tax Reports
  async getTaxReport(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/tax', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching tax report:', error)
      throw error
    }
  },

  async getVATReport(params = {}) {
    try {
      const response = await api.get('/api/v1/reports/vat', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching VAT report:', error)
      throw error
    }
  },

  // Financial Statistics
  async getFinancialStats(params = {}) {
    try {
      const response = await api.get('/api/v1/finance/stats', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching financial stats:', error)
      throw error
    }
  },

  async getRevenueStats(params = {}) {
    try {
      const response = await api.get('/api/v1/finance/revenue-stats', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue stats:', error)
      throw error
    }
  },

  async getExpenseStats(params = {}) {
    try {
      const response = await api.get('/api/v1/finance/expense-stats', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching expense stats:', error)
      throw error
    }
  },

  async getProfitStats(params = {}) {
    try {
      const response = await api.get('/api/v1/finance/profit-stats', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching profit stats:', error)
      throw error
    }
  },

  // Budget Management
  async getBudgets(params = {}) {
    try {
      const response = await api.get('/api/v1/budgets', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching budgets:', error)
      throw error
    }
  },

  async getBudgetById(id) {
    try {
      const response = await api.get(`/api/v1/budgets/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching budget:', error)
      throw error
    }
  },

  async createBudget(budgetData) {
    try {
      const response = await api.post('/api/v1/budgets', budgetData)
      return response.data
    } catch (error) {
      console.error('Error creating budget:', error)
      throw error
    }
  },

  async updateBudget(id, budgetData) {
    try {
      const response = await api.put(`/api/v1/budgets/${id}`, budgetData)
      return response.data
    } catch (error) {
      console.error('Error updating budget:', error)
      throw error
    }
  },

  async deleteBudget(id) {
    try {
      const response = await api.delete(`/api/v1/budgets/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting budget:', error)
      throw error
    }
  },

  async getBudgetVsActual(budgetId) {
    try {
      const response = await api.get(`/api/v1/budgets/${budgetId}/vs-actual`)
      return response.data
    } catch (error) {
      console.error('Error fetching budget vs actual:', error)
      throw error
    }
  },

  // Export Reports
  async exportReport(reportType, format, params = {}) {
    try {
      const response = await api.get(`/api/v1/reports/${reportType}/export`, {
        params: { format, ...params },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting report:', error)
      throw error
    }
  },

  async downloadReport(reportType, format, params = {}) {
    try {
      const blob = await this.exportReport(reportType, format, params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${reportType}-report.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading report:', error)
      throw error
    }
  }
}

export default financeService

