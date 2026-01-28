const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mtnApp", {
  analyzeStockRows: (payload) => ipcRenderer.invoke("stocks:import-analyze", payload),

  version: "0.2.3",
  createBackup: (payload) => ipcRenderer.invoke("backup:create", payload),
  getData: () => ipcRenderer.invoke("data:get"),
  createCustomer: (payload) => ipcRenderer.invoke("customers:create", payload),
  updateCustomer: (payload) => ipcRenderer.invoke("customers:update", payload),
  deleteCustomer: (payload) => ipcRenderer.invoke("customers:delete", payload),
  toggleCustomerStatus: (payload) =>
    ipcRenderer.invoke("customers:toggle-status", payload),
  createCustomerTransaction: (payload) =>
    ipcRenderer.invoke("customers:transaction", payload),
  collectPayment: (payload) => ipcRenderer.invoke("customers:payment", payload),
  addDebt: (payload) => ipcRenderer.invoke("customers:debt", payload),
  addCustomerJob: (payload) => ipcRenderer.invoke("customers:job", payload),
  updateCustomerJob: (payload) => ipcRenderer.invoke("customers:job:update", payload),
  deleteCustomerJob: (payload) => ipcRenderer.invoke("customers:job:delete", payload),
  createAccount: (payload) => ipcRenderer.invoke("accounts:create", payload),
  createUnitConversion: (payload) =>
    ipcRenderer.invoke("unit-conversions:create", payload),
  createStock: (payload) => ipcRenderer.invoke("stocks:create", payload),
  updateStock: (payload) => ipcRenderer.invoke("stocks:update", payload),
  deleteStock: (payload) => ipcRenderer.invoke("stocks:delete", payload),
  toggleStockStatus: (payload) =>
    ipcRenderer.invoke("stocks:toggle-status", payload),
  createStockReceipt: (payload) => ipcRenderer.invoke("stocks:receipt", payload),
  /**
   * Yüklenebilecek mühendislik index dosyasını oku ve HTML içeriğini gönder.
   * İzin verilen isimler: index, demo_index, isitma_index
   * @param {string} name
   */
  loadEngineeringIndex: (name) => ipcRenderer.invoke('engineering:loadIndex', name),
  /**
   * Kayıtlı bir ek dosyayı işletim sistemi tarafından açar (Excel veya başka format).
   * @param {{path: string}} payload
   */
  openAttachmentFile: ({ path }) => ipcRenderer.invoke('attachment:open', { path }),
  previewStockImport: (payload) => ipcRenderer.invoke("stocks:import-preview", payload),
  applyStockImport: (payload) => ipcRenderer.invoke("stocks:import-apply", payload),
  transferStockReceipts: (payload) =>
    ipcRenderer.invoke("stocks:receipt-transfer", payload),
  moveStock: (payload) => ipcRenderer.invoke("stocks:movement", payload),
  createCash: (payload) => ipcRenderer.invoke("cash:create", payload),
  createSale: (payload) => ipcRenderer.invoke("sales:create", payload),
  createInvoice: (payload) => ipcRenderer.invoke("invoices:create", payload),
  deleteInvoice: (payload) => ipcRenderer.invoke("invoices:delete", payload),
  createProposal: (payload) => ipcRenderer.invoke("proposals:create", payload),
  updateProposal: (payload) => ipcRenderer.invoke("proposals:update", payload),
  deleteProposal: (payload) => ipcRenderer.invoke("proposals:delete", payload),
  generateReport: (payload) => ipcRenderer.invoke("report:generate", payload),
  getSettings: () => ipcRenderer.invoke("settings:get"),
  saveSettings: (payload) => ipcRenderer.invoke("settings:save", payload),
  getPeriods: () => ipcRenderer.invoke("periods:list"),
  getPeriodBatches: () => ipcRenderer.invoke("periods:batches"),
  previewPeriodClose: (payload) => ipcRenderer.invoke("periods:preview", payload),
  closePeriod: (payload) => ipcRenderer.invoke("periods:close", payload),
  rollbackPeriod: (payload) => ipcRenderer.invoke("periods:rollback", payload),
  resetData: () => ipcRenderer.invoke("data:reset"),
  restoreBackup: (payload) => ipcRenderer.invoke("backup:restore", payload),
  saveAttachment: (payload) => ipcRenderer.invoke("attachments:save", payload),
  openFile: (payload) => ipcRenderer.invoke("file:open", payload),
  quitApp: () => ipcRenderer.invoke("app:quit")
});
