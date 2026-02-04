if (!window.MTN) window.MTN = {};
window.addEventListener("DOMContentLoaded", () => {
  try { MTN.Toast && MTN.Toast.init(); } catch (_) {}
  try { MTN.Theme && MTN.Theme.init(); } catch (_) {}
  try { MTN.Sound && MTN.Sound.init(); } catch (_) {}
  try { MTN.TTS && MTN.TTS.init(); } catch (_) {}
  try { MTN.Nav && MTN.Nav.init(); } catch (_) {}
  try { MTN.Assistant && MTN.Assistant.init(); } catch (_) {}

  // Topbar saat (Güncelleme menüsü yerine)
  try {
    const clockEl = document.getElementById("topbar-clock");
    if (clockEl) {
      const tick = () => {
        const now = new Date();
        const d = now.toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const t = now.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        clockEl.textContent = `${d}  ${t}`;
        clockEl.title = now.toLocaleString("tr-TR");
      };
      tick();
      setInterval(tick, 1000);
    }
  } catch (_) {}
});

// İşlem butonlarında click sesi
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button, .btn, .mtn-btn, a");
  if (!btn) return;
  const isAction =
    btn.dataset.mtnAction ||
    /kaydet|sil|güncelle|tahsilat|odeme|ödeme|ekle|onay|tamam/i.test(btn.textContent || "");
  if (isAction && window.MTN && MTN.Sound) MTN.Sound.click();
});

const offerBody = document.getElementById("offer-body");
const addRowButton = document.getElementById("add-row");
const totalEl = document.getElementById("offer-total");
const subtotalEl = document.getElementById("offer-subtotal");
const vatTotalEl = document.getElementById("offer-vat-total");
const vatInput = document.getElementById("offer-vat");
const offerPdfButton = document.getElementById("offer-pdf");
const offerCustomerSelect = document.getElementById("offer-customer");
const offerPaymentSelect = document.getElementById("offer-payment");
const offerSaveButton = document.getElementById("offer-save");
const versionEl = document.getElementById("app-version");
const backupButton = document.getElementById("backup-now");
const backupOpenButton = document.getElementById("backup-open");
const lastBackupEl = document.getElementById("last-backup");
const backupPathEl = document.getElementById("backup-path");
const summaryCollectionsEl = document.getElementById("summary-collections");
const summaryCashEl = document.getElementById("summary-cash");
const summaryBalanceEl = document.getElementById("summary-balance");
const summaryAlertsEl = document.getElementById("summary-alerts");
const execReceivablesEl = document.getElementById("exec-receivables");
const execCashEl = document.getElementById("exec-cash");
const execStocksEl = document.getElementById("exec-stocks");
const execLowStocksEl = document.getElementById("exec-low-stocks");
const execPaymentsEl = document.getElementById("exec-payments");
const customerForm = document.getElementById("customer-form");
const customerTransactionForm = document.getElementById(
  "customer-transaction-form"
);
const customerTransactionDateInput = document.getElementById(
  "customer-transaction-date"
);
const customerJobForm = document.getElementById("customer-job-form");
const customerJobDateInput = document.getElementById("customer-job-date");
const customerJobIdInput = document.getElementById("customer-job-id");
const customerJobSubmitBtn = document.getElementById("customer-job-submit");
const customerJobCancelBtn = document.getElementById("customer-job-cancel");

let editingCustomerJobId = "";

const timesheetWorkerSelect = document.getElementById("timesheet-worker");
const timesheetWorkerAddBtn = document.getElementById("timesheet-worker-add");
const timesheetWorkerClearBtn = document.getElementById("timesheet-worker-clear");
const timesheetWorkersListEl = document.getElementById("timesheet-workers-list");
const timesheetWeekStartInput = document.getElementById("timesheet-week-start");
const timesheetWeekEndInput = document.getElementById("timesheet-week-end");
const timesheetRefreshBtn = document.getElementById("timesheet-refresh");
const timesheetAddRowBtn = document.getElementById("timesheet-add-row");
const timesheetBulkBtn = document.getElementById("timesheet-bulk");
const timesheetSaveBtn = document.getElementById("timesheet-save");
const timesheetPdfBtn = document.getElementById("timesheet-pdf");
const timesheetPayBtn = document.getElementById("timesheet-pay");
const timesheetReceiptBtn = document.getElementById("timesheet-receipt");
const timesheetNewBody = document.getElementById("timesheet-new-body");
const timesheetSavedBody = document.getElementById("timesheet-saved-body");
const timesheetStatusEl = document.getElementById("timesheet-status");
const timesheetWeekTotalEl = document.getElementById("timesheet-week-total");
const timesheetWorkerBalanceEl = document.getElementById("timesheet-worker-balance");
const timesheetCountEl = document.getElementById("timesheet-count");
const timesheetSearchInput = document.getElementById("timesheet-search");
const timesheetSearchBtn = document.getElementById("timesheet-search-btn");
const timesheetBulkWrap = document.getElementById("timesheet-bulk-wrap");
const timesheetBulkText = document.getElementById("timesheet-bulk-text");
const timesheetBulkPreviewBtn = document.getElementById("timesheet-bulk-preview");
const timesheetBulkApplyBtn = document.getElementById("timesheet-bulk-apply");
const timesheetBulkPreviewArea = document.getElementById("timesheet-bulk-preview-area");

const transactionCustomerSelect = document.getElementById(
  "transaction-customer"
);
const transactionTypeSelect = document.getElementById("transaction-type");
const transactionHint = document.getElementById("transaction-hint");
const supplierActions = document.getElementById("supplier-actions");
const supplierPaymentAction = document.getElementById("supplier-payment-action");
const customerDetailSupplierPayment = document.getElementById(
  "customer-detail-supplier-payment"
);
const salesPanel = document.getElementById("sales-panel");
const contentScroll = document.querySelector(".content__scroll");
const customerTypeSelect = document.querySelector(
  "#customer-form select[name='type']"
);
const customersTable = document.getElementById("customers-table");
const customerSearchInput = document.getElementById("customer-search");
const customerSearchButton = document.getElementById("customer-search-btn");
const customerSearchSuggestion = document.getElementById(
  "customer-search-suggestion"
);
const customerListSection = document.getElementById("customer-list-section");
const customerFormSection = document.getElementById("customer-form-section");
const customerTransactionSection = document.getElementById(
  "customer-transaction-section"
);
const customerDetailSection = document.getElementById("customer-detail-section");
const customerDetailModule = document.getElementById("customer-detail-module");
const customerFilterButtons = document.querySelectorAll(
  "[data-customer-filter]"
);
const customerFilterAllCount = document.getElementById(
  "customer-filter-all-count"
);
const customerFilterActiveCount = document.getElementById(
  "customer-filter-active-count"
);
const customerFilterInactiveCount = document.getElementById(
  "customer-filter-inactive-count"
);
const customerFilterDebtorsCount = document.getElementById(
  "customer-filter-debtors-count"
);
const customerFilterCreditorsCount = document.getElementById(
  "customer-filter-creditors-count"
);
const customerFilterDueCount = document.getElementById(
  "customer-filter-due-count"
);
const customerDetailCard = document.getElementById("customer-detail-card");
const customerDetailTitle = document.getElementById("customer-detail-title");
const customerDetailClose = document.getElementById("customer-detail-close");
const customerDetailOffer = document.getElementById("customer-detail-offer");
const customerDetailStatement = document.getElementById(
  "customer-detail-statement"
);
const customerDetailCollect = document.getElementById("customer-detail-collect");
const customerDetailJob = document.getElementById("customer-detail-job");
const customerDetailActions = document.getElementById("customer-detail-actions");
const customerDetailEdit = document.getElementById("customer-detail-edit");
const customerDetailDelete = document.getElementById("customer-detail-delete");
const customerDetailAddTransaction = document.getElementById(
  "customer-detail-add-transaction"
);
const customerDetailAddItem = document.getElementById(
  "customer-detail-add-item"
);
const customerDetailAddPayment = document.getElementById(
  "customer-detail-add-payment"
);
const customerDetailAddStock = document.getElementById(
  "customer-detail-add-stock"
);
const customerDetailCreateStatement = document.getElementById(
  "customer-detail-create-statement"
);
const customerDetailDue = document.getElementById("customer-detail-due");
const customerDetailMethod = document.getElementById("customer-detail-method");
const customerDetailSupplierActions = document.getElementById(
  "customer-detail-supplier-actions"
);
const customerDetailBack = document.getElementById("customer-detail-back");
const customerDetailSave = document.getElementById("customer-detail-save");
const customerDetailSearchInput = document.getElementById(
  "customer-detail-search"
);
const customerDetailSearchButton = document.getElementById(
  "customer-detail-search-btn"
);
const supplierDetailAddDebt = document.getElementById(
  "supplier-detail-add-debt"
);
const supplierDetailPay = document.getElementById("supplier-detail-pay");
const supplierDetailInvoice = document.getElementById(
  "supplier-detail-invoice"
);
const stockForm = document.getElementById("stock-form");
const stockCreatedAtInput = document.getElementById("stock-created-at");
const stocksTable = document.getElementById("stocks-table");
const stocksTotalEl = document.getElementById("stocks-total");
const stockReceiptToggle = document.getElementById("stock-receipt-toggle");
const stockReceiptCard = document.getElementById("stock-receipt-card");
const stockReceiptBody = document.getElementById("stock-receipt-body");
const stockReceiptAddRow = document.getElementById("stock-receipt-add-row");
const stockReceiptSubmit = document.getElementById("stock-receipt-submit");
const stockReceiptNote = document.getElementById("stock-receipt-note");
const stockReceiptDateInput = document.getElementById("stock-receipt-date");
const stockReceiptSupplierInput = document.getElementById(
  "stock-receipt-supplier"
);
const stockReceiptWarehouseSelect = document.getElementById(
  "stock-receipt-warehouse"
);
const stockReceiptFileInput = document.getElementById("stock-receipt-file");
const stockSearchInput = document.getElementById("stock-search");
const stockSearchButton = document.getElementById("stock-search-btn");
const stockSearchSuggestion = document.getElementById("stock-search-suggestion");
const stockExportCsvButton = document.getElementById("stock-export-csv");
const stockExportPdfButton = document.getElementById("stock-export-pdf");
const stockImportFileInput = document.getElementById("stock-import-file");
const stockImportWarehouseSelect = document.getElementById(
  "stock-import-warehouse"
);
const stockImportPreviewButton = document.getElementById(
  "stock-import-preview"
);
const stockImportApplyButton = document.getElementById("stock-import-apply");
const stockImportResetButton = document.getElementById("stock-import-reset");
const stockImportSummaryEl = document.getElementById("stock-import-summary");
const stockImportTable = document.getElementById("stock-import-table");
const stockReceiptsTable = document.getElementById("stock-receipts-table");
const stockReceiptsTransferButton = document.getElementById(
  "stock-receipts-transfer"
);
const receiptFilterStartInput = document.getElementById("receipt-filter-start");
const receiptFilterEndInput = document.getElementById("receipt-filter-end");
const receiptFilterSupplierInput = document.getElementById(
  "receipt-filter-supplier"
);
const receiptFilterWarehouseSelect = document.getElementById(
  "receipt-filter-warehouse"
);
const receiptFilterStatusSelect = document.getElementById(
  "receipt-filter-status"
);
const stockListSearchInput = document.getElementById("stock-list-search");
const stockListSearchButton = document.getElementById("stock-list-search-btn");
const stockListNewButton = document.getElementById("stock-list-new");
const stockListUnitFilter = document.getElementById("stock-list-unit-filter");
const stockListWarehouseFilter = document.getElementById(
  "stock-list-warehouse-filter"
);
const stockListAddToSaleButton = document.getElementById(
  "stock-list-add-to-sale"
);
const stockListTable = document.getElementById("stock-list-table");
const stockListEmptyEl = document.getElementById("stock-list-empty");
const inventoryCountCard = document.getElementById("inventory-count-card");
const inventoryCountAddRow = document.getElementById("inventory-count-add-row");
const inventoryCountBody = document.getElementById("inventory-count-body");
const inventoryCountTransfer = document.getElementById(
  "inventory-count-transfer"
);
const inventoryCountWarehouse = document.getElementById(
  "inventory-count-warehouse"
);
const inventoryCountDate = document.getElementById("inventory-count-date");
const inventoryCountNote = document.getElementById("inventory-count-note");
const unitConversionForm = document.getElementById("unit-conversion-form");
const unitConversionTable = document.getElementById("unit-conversion-table");
const cashForm = document.getElementById("cash-form");
const cashTable = document.getElementById("cash-table");
const cashStartInput = document.getElementById("cash-start");
const cashEndInput = document.getElementById("cash-end");
const cashTypeSelect = document.getElementById("cash-type");
const cashDateInput = document.getElementById("cash-date");
const cashTypeButtons = document.querySelectorAll("[data-cash-type]");
const cashTypeInput = document.getElementById("cash-type-input");
const cashCustomerSelect = document.getElementById("cash-customer");
const cashPaymentMethodSelect = document.getElementById("cash-payment-method");
const cashReceiptToggle = document.getElementById("cash-receipt-toggle");
const salesTable = document.getElementById("sales-table");
const reportCustomersButton = document.getElementById("report-customers");
const reportStocksButton = document.getElementById("report-stocks");
const reportCashButton = document.getElementById("report-cash");
const reportStockMovementsButton = document.getElementById(
  "report-stock-movements"
);
const reportCashSummaryButton = document.getElementById("report-cash-summary");
const customerBalanceReportButton = document.getElementById(
  "customer-balance-report"
);
const reportPathEl = document.getElementById("report-path");
const assistantDailyEl = document.getElementById("assistant-daily");
const assistantRemindersEl = document.getElementById("assistant-reminders");
const assistantSuggestionsEl = document.getElementById("assistant-suggestions");
const assistantRefreshButton = document.getElementById("assistant-refresh");
const assistantStatusEl = document.getElementById("assistant-status");
const assistantDock = document.getElementById("assistant-dock");
const assistantDockClose = document.getElementById("assistant-dock-close");
const assistantDockTabs = document.querySelectorAll("[data-assistant-tab]");
const assistantDockPanes = document.querySelectorAll("[data-assistant-pane]");
const assistantDockDailyEl = document.getElementById("assistant-dock-daily");
const assistantDockRemindersEl = document.getElementById("assistant-dock-reminders");
const assistantDockInput = document.getElementById("assistant-dock-input");
const assistantDockSend = document.getElementById("assistant-dock-send");
const assistantDockLog = document.getElementById("assistant-dock-log");
const assistantFab = document.getElementById("assistant-fab");
const detailCustomerSelect = document.getElementById("detail-customer");
const detailTable = document.getElementById("detail-table");
const detailReportButton = document.getElementById("detail-report");
const detailSummaryEl = document.getElementById("detail-summary");
const customerPaymentsTable = document.getElementById("customer-payments-table");
const detailTabButtons = document.querySelectorAll("[data-detail-tab]");
const detailTabPanels = document.querySelectorAll("[data-detail-tab-panel]");
const detailTabCountLedgerEl = document.getElementById("detail-tab-count-ledger");
const detailTabCountJobsEl = document.getElementById("detail-tab-count-jobs");
const detailTabCountPaymentsEl = document.getElementById("detail-tab-count-payments");

const customerJobsTable = document.getElementById("customer-jobs-table");
const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const appShell = document.getElementById("app-shell");
const stockMovementForm = document.getElementById("stock-movement-form");
const movementStockSelect = document.getElementById("movement-stock");
const stockMovementDateInput = document.getElementById("stock-movement-date");
const stockMovementsTable = document.getElementById("stock-movements-table");
const settingsForm = document.getElementById("settings-form");
const autoSyncPathInput = document.getElementById("auto-sync-path");
const autoSyncEnabledSelect = document.getElementById("auto-sync-enabled");
const cloudBackupPathInput = document.getElementById("cloud-backup-path");
const cloudBackupEnabledSelect = document.getElementById("cloud-backup-enabled");
const autoBackupEnabledSelect = document.getElementById("auto-backup-enabled");
const stockValuationSelect = document.getElementById("stock-valuation");
const autoUpdateToggle = document.getElementById("auto-update-enabled");
const checkUpdatesButton = document.getElementById("check-updates");
const updateStatusEl = document.getElementById("update-status");
const tourEnabledToggle = document.getElementById("tour-enabled");
const tourStatusEl = document.getElementById("tour-status");
const lastAutoBackupEl = document.getElementById("last-auto-backup");
const settingsStatusEl = document.getElementById("settings-status");
const resetDataButton = document.getElementById("reset-data");
const userTableBody = document.getElementById("user-table");
const userForm = document.getElementById("user-form");
const userFormError = document.getElementById("user-form-error");
const firstRunScreen = document.getElementById("first-run-screen");
const firstRunForm = document.getElementById("first-run-form");
const helpMenuToggle = document.getElementById("help-menu-toggle");
const helpMenuPanel = document.getElementById("help-menu-panel");
const helpDescribeScreenButton = document.getElementById("help-describe-screen");
const helpGeneralTourButton = document.getElementById("help-general-tour");
const helpQuickGuideButton = document.getElementById("help-quick-guide");
const helpMenuWrap = document.querySelector(".help-menu");
const periodYearInput = document.getElementById("period-year-input");
const periodLockToggle = document.getElementById("period-lock-toggle");
const periodPreviewButton = document.getElementById("period-preview");
const periodCloseButton = document.getElementById("period-close");
const periodRollbackButton = document.getElementById("period-rollback");
const periodPreviewOutput = document.getElementById("period-preview-output");
const periodLog = document.getElementById("period-log");
const onboardingWizard = document.getElementById("onboarding-wizard");
const onboardingSteps = document.querySelectorAll(".onboarding__step");
const onboardingNext = document.getElementById("onboarding-next");
const onboardingBack = document.getElementById("onboarding-back");
const onboardingSkip = document.getElementById("onboarding-skip");
const onboardingChecks = document.getElementById("onboard-checks");
const onboardingCompanyName = document.getElementById("onboard-company-name");
const onboardingTaxNumber = document.getElementById("onboard-tax-number");
const onboardingCompanyPhone = document.getElementById("onboard-company-phone");
const onboardingCompanyAddress = document.getElementById("onboard-company-address");
const onboardingCompanyLogo = document.getElementById("onboard-company-logo");
const onboardingPeriodYear = document.getElementById("onboard-period-year");
const onboardingHasCarryover = document.getElementById("onboard-has-carryover");
const onboardingAdminName = document.getElementById("onboard-admin-name");
const onboardingAdminUsername = document.getElementById("onboard-admin-username");
const onboardingAdminPassword = document.getElementById("onboard-admin-password");
const onboardingBackupFolder = document.getElementById("onboard-backup-folder");
const onboardingAutoBackup = document.getElementById("onboard-auto-backup");
const tourOverlay = document.getElementById("tour-overlay");
const tourTitle = document.getElementById("tour-title");
const tourDescription = document.getElementById("tour-description");
const tourBack = document.getElementById("tour-back");
const tourNext = document.getElementById("tour-next");
const tourSkip = document.getElementById("tour-skip");
const quickGuide = document.getElementById("quick-guide");
const quickGuideClose = document.getElementById("quick-guide-close");
const logoFileInput = document.getElementById("logo-file");
const logoPreview = document.getElementById("logo-preview");
const brandTitle = document.getElementById("brand-title");
const brandLogo = document.getElementById("brand-logo");
const topbarLogo = document.getElementById("topbar-logo");
const userRoleEl = document.getElementById("user-role");
const userNameEl = document.getElementById("user-name");
const dashboardUserEl = document.getElementById("dashboard-user");
const companyForm = document.getElementById("company-form");
const companyNameInput = document.getElementById("company-name");
const companyOwnerInput = document.getElementById("company-owner");
const companyTaxOfficeInput = document.getElementById("company-tax-office");
const companyTaxNumberInput = document.getElementById("company-tax-number");
const companyPhoneInput = document.getElementById("company-phone");
const companyIbanInput = document.getElementById("company-iban");
const companyBankInput = document.getElementById("company-bank");
const companyAddressInput = document.getElementById("company-address");
const footerCompanyName = document.getElementById("footer-company-name");
const footerCompanyOwner = document.getElementById("footer-company-owner");
const themeForm = document.getElementById("theme-form");
const themePrimaryInput = document.getElementById("theme-primary");
const themeAccentInput = document.getElementById("theme-accent");
const themeStatusEl = document.getElementById("theme-status");
const loginPasswordInput = document.getElementById("login-password");
const loginToggleButton = document.getElementById("login-toggle");
const logoutButton = document.getElementById("logout-button");
const backupSecondaryButton = document.getElementById("backup-now-secondary");
const exitAppButton = document.getElementById("exit-app");
const toggleSoundButton = document.getElementById("toggle-sound");
const licenseKeyInput = document.getElementById("license-key");
const licenseCheckButton = document.getElementById("license-check");
const invoiceForm = document.getElementById("invoice-form");
const invoiceDateInput = document.getElementById("invoice-date");
const invoiceFileInput = document.getElementById("invoice-file");
const invoicesTable = document.getElementById("invoices-table");
const invoiceTypeSelect = document.getElementById("invoice-type");
const customerTabButtons = document.querySelectorAll("[data-customer-tab]");
const customerTabPanels = document.querySelectorAll(
  "[data-customer-tab-panel]"
);
const aiReminderForm = document.getElementById("ai-reminder-form");
const aiReminderList = document.getElementById("ai-reminder-list");
const assistantPaymentsEl = document.getElementById("assistant-payments");
const offerMarginInput = document.getElementById("offer-margin");
const offerApplyMarginButton = document.getElementById("offer-apply-margin");
const stockSuggestions = document.getElementById("stock-suggestions");
const stockColumnToggles = document.querySelectorAll("[data-stock-column]");
const accountForm = document.getElementById("account-form");
const accountsTable = document.getElementById("accounts-table");
const ledgerTable = document.getElementById("ledger-table");
const auditLogTable = document.getElementById("audit-log-table");
const splashScreen = document.getElementById("splash-screen");
const splashLogo = document.getElementById("splash-logo");
const loginLogo = document.getElementById("login-logo");
const offerTabs = document.querySelectorAll("[data-offer-tab]");
const offerPanels = document.querySelectorAll("[data-offer-tab-panel]");
const offerTitleInput = document.getElementById("offer-title");
const offerDateInput = document.getElementById("offer-date");
const offerWaybillInput = document.getElementById("offer-waybill");
const offerVatManualInput = document.getElementById("offer-vat-manual");
const offerSaveProposalButton = document.getElementById("offer-save-proposal");
const offerLogo = document.getElementById("offer-logo");
const offerCompanyName = document.getElementById("offer-company-name");
const offerCompanyMeta = document.getElementById("offer-company-meta");
const offerCompanyAddress = document.getElementById("offer-company-address");
const offerBodyIndustrial = document.getElementById("offer-body-industrial");
const offerVatIndustrial = document.getElementById("offer-vat-industrial");
const offerVatManualIndustrial = document.getElementById("offer-vat-manual-industrial");
const offerSubtotalIndustrial = document.getElementById("offer-subtotal-industrial");
const offerVatTotalIndustrial = document.getElementById("offer-vat-total-industrial");
const offerTotalIndustrial = document.getElementById("offer-total-industrial");
const offerPdfIndustrialButton = document.getElementById("offer-pdf-industrial");
const addRowIndustrialButton = document.getElementById("add-row-industrial");
const offerSaveProposalIndustrialButton = document.getElementById("offer-save-proposal-industrial");
const offerLogoIndustrial = document.getElementById("offer-logo-industrial");
const offerCompanyNameIndustrial = document.getElementById("offer-company-name-industrial");
const offerCompanyMetaIndustrial = document.getElementById("offer-company-meta-industrial");
const offerCompanyAddressIndustrial = document.getElementById("offer-company-address-industrial");
const offerTitleIndustrial = document.getElementById("offer-title-industrial");
const offerDateIndustrial = document.getElementById("offer-date-industrial");
const offerWaybillIndustrial = document.getElementById("offer-waybill-industrial");
const offerTableBody = document.getElementById("offer-table");
const offerRefreshButton = document.getElementById("offer-refresh");
const offerSearchInput = document.getElementById("offer-search");
let offerSearchQuery = "";
const offerHome = document.getElementById("offer-home");
const offerWorkspace = document.getElementById("offer-workspace");
const offerWorkspaceTitle = document.getElementById("offer-workspace-title");
const offerHomeButtons = document.querySelectorAll("[data-offer-home]");
const offerBackButtons = document.querySelectorAll("[data-offer-back]");
const offerStockSearchInput = document.getElementById("offer-stock-search");
const offerStockSearchButton = document.getElementById("offer-stock-search-btn");
const offerStockList = document.getElementById("offer-stock-list");
const offerStockSearchInputIndustrial = document.getElementById(
  "offer-stock-search-industrial"
);
const offerStockSearchButtonIndustrial = document.getElementById(
  "offer-stock-search-industrial-btn"
);
const offerStockListIndustrial = document.getElementById(
  "offer-stock-list-industrial"
);
const restoreBackupFileInput = document.getElementById("restore-backup-file");
const restoreBackupButton = document.getElementById("restore-backup");
const restoreBackupStatus = document.getElementById("restore-backup-status");
const globalStatusEl = document.getElementById("global-status");
const centerStatusEl = document.getElementById("center-status");
const openingDebtField = document.getElementById("opening-debt-field");
const openingCreditField = document.getElementById("opening-credit-field");

// Live assistant elements
const assistantCommandInput = document.getElementById("assistant-command-input");
const assistantLog = document.getElementById("assistant-log");
const assistantLiveHint = document.getElementById('assistant-live-hint');

// Engineering panel elements
const engineeringIndexInput = document.getElementById('engineering-index-input');
const engineeringIndexOpen = document.getElementById('engineering-index-open');
const engineeringIndexResult = document.getElementById('engineering-index-result');
const engineeringFileUpload = document.getElementById('engineering-file-upload');
const engineeringFileList = document.getElementById('engineering-file-list');

// Security reset elements
const resetPasswordInput = document.getElementById('reset-password');
const resetStatusEl = document.getElementById('reset-status');

// New customer detail buttons (invoice and passive)
const customerDetailInvoice = document.getElementById("customer-detail-invoice");
const customerDetailPassive = document.getElementById("customer-detail-passive");

// Inline customer operation panel elements
const customerInlinePanel = document.getElementById('customer-inline-panel');
const inlineCustomerTitle = document.getElementById('inline-customer-title');
const inlineCustomerClose = document.getElementById('inline-customer-close');
const inlineCustomerTahsilat = document.getElementById('inline-customer-tahsilat');
const inlineCustomerOffer = document.getElementById('inline-customer-offer');
const inlineCustomerInvoice = document.getElementById('inline-customer-invoice');
const inlineCustomerPayment = document.getElementById('inline-customer-payment');
const inlineCustomerJob = document.getElementById('inline-customer-job');
const inlineCustomerMaterial = document.getElementById('inline-customer-material');
const inlineFormContainer = document.getElementById('inline-form-container');

// Active customer ID for inline operations
let activeCustomerId = null;

const ROLE_LABELS = {
  admin: "Yönetici",
  accountant: "Muhasebeci"
};
const DEFAULT_THEME = {
  primary: "#0B1E3B",
  accent: "#D4AF37"
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2
  }).format(value || 0);

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");


// === MTN: Usta / Personel Puantaj Modülü ===
let timesheetNewRows = [];
let timesheetEditingId = "";
let timesheetSearchTerm = "";

// MTN: Puantaj - Çoklu usta seçimi (aynı satırları birden fazla ustaya ekle)
let timesheetSelectedWorkerIds = [];

const uniqIds = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

const getTimesheetWorkerLabel = (workers = [], id = "") => {
  const w = (workers || []).find((x) => x.id === id);
  if (!w) return id;
  return `${w.code || ""} - ${w.name || ""}`.trim();
};

const ensureTimesheetWorkerInList = (id = "") => {
  if (!id) return;
  if (!Array.isArray(timesheetSelectedWorkerIds)) timesheetSelectedWorkerIds = [];
  if (!timesheetSelectedWorkerIds.includes(id)) timesheetSelectedWorkerIds.push(id);
  timesheetSelectedWorkerIds = uniqIds(timesheetSelectedWorkerIds);
};

const getTimesheetTargetWorkerIds = () => {
  const ids = uniqIds(timesheetSelectedWorkerIds);
  if (ids.length) return ids;

  const current = timesheetWorkerSelect?.value || "";
  return current ? [current] : [];
};

const renderTimesheetWorkerMulti = (workers = []) => {
  if (!timesheetWorkersListEl) return;
  const ids = uniqIds(timesheetSelectedWorkerIds);
  timesheetWorkersListEl.innerHTML = "";
  if (!ids.length) {
    const empty = document.createElement("span");
    empty.className = "muted small";
    empty.textContent = "Liste boş.";
    timesheetWorkersListEl.appendChild(empty);
    return;
  }
  const frag = document.createDocumentFragment();
  ids.forEach((id) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.dataset.tsWorkerChip = id;

    const label = document.createElement("span");
    label.textContent = getTimesheetWorkerLabel(workers, id);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "chip__remove";
    removeBtn.textContent = "×";
    removeBtn.dataset.tsWorkerRemove = id;
    removeBtn.setAttribute("aria-label", "Kaldır");

    chip.appendChild(label);
    chip.appendChild(removeBtn);
    frag.appendChild(chip);
  });
  timesheetWorkersListEl.appendChild(frag);
};

const toIsoDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const addDaysIso = (iso, days) => {
  const base = iso ? new Date(iso + "T00:00:00") : new Date();
  const d = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
  return toIsoDate(d);
};

const getThisWeekMonday = () => {
  const now = new Date();
  const day = now.getDay(); // 0 sunday
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
  return toIsoDate(monday);
};

const getTimesheetWeekRange = () => {
  const start = timesheetWeekStartInput?.value || getThisWeekMonday();
  const end = addDaysIso(start, 6);
  return { start, end, note: `Puantaj: ${start} - ${end}` };
};

const parseTimesheetBulkLines = (text) => {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows = [];
  for (const line of lines) {
    const clean = line.replace(/[,;]/g, " ").replace(/\s+/g, " ").trim();
    const nums = clean.match(/\d+(?:[\.,]\d+)?/g) || [];
    const lastNum = nums.length ? nums[nums.length - 1] : "";
    const firstNum = nums.length ? nums[0] : "";

    let qty = 1;
    let price = 0;

    if (firstNum && nums.length >= 2) {
      qty = Number(String(firstNum).replace(",", ".")) || 1;
      price = Number(String(lastNum).replace(",", ".")) || 0;
    } else if (lastNum) {
      price = Number(String(lastNum).replace(",", ".")) || 0;
    }

    const title = clean
      .replace(firstNum, "")
      .replace(lastNum, "")
      .replace(/\b(adet|adet\.|m|metre|mt)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    rows.push({
      title: title || clean,
      quantity: qty || 1,
      unit: "Adet",
      unitPrice: price || 0
    });
  }
  return rows;
};

const renderTimesheetNewTable = () => {
  if (!timesheetNewBody) return;

  timesheetNewBody.innerHTML = "";
  const frag = document.createDocumentFragment();

  timesheetNewRows.forEach((row, idx) => {
    const qty = Number(row.quantity || 0);
    const price = Number(row.unitPrice || 0);
    const total = qty * price;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input value="${escapeHtml(row.title || "")}" data-ts-idx="${idx}" data-ts-field="title" placeholder="İş kalemi" /></td>
      <td><input type="number" min="0" step="0.01" value="${qty || 0}" data-ts-idx="${idx}" data-ts-field="quantity" /></td>
      <td><input value="${escapeHtml(row.unit || "Adet")}" data-ts-idx="${idx}" data-ts-field="unit" placeholder="Adet / m" /></td>
      <td><input type="number" min="0" step="0.01" value="${price || 0}" data-ts-idx="${idx}" data-ts-field="unitPrice" /></td>
      <td class="ts-total">${formatCurrency(total || 0)}</td>
      <td class="row-actions">
        <button class="ghost" type="button" data-ts-remove="${idx}">Sil</button>
      </td>
    `;
    frag.appendChild(tr);
  });

  timesheetNewBody.appendChild(frag);

  // Event delegation: hızlı, yeniden çizim yok
  if (!timesheetNewBody.dataset.bound) {
    timesheetNewBody.dataset.bound = "1";

    timesheetNewBody.addEventListener("input", (e) => {
      const target = e.target;
      if (!target || !target.dataset) return;
      const idx = Number(target.dataset.tsIdx || -1);
      const field = target.dataset.tsField || "";
      if (idx < 0 || !timesheetNewRows[idx]) return;

      if (field === "quantity" || field === "unitPrice") {
        timesheetNewRows[idx][field] = Number(String(target.value || "0").replace(",", ".")) || 0;
      } else if (field) {
        timesheetNewRows[idx][field] = target.value;
      }

      // sadece satır toplamını güncelle
      const row = timesheetNewRows[idx];
      const qty = Number(row.quantity || 0);
      const price = Number(row.unitPrice || 0);
      const total = qty * price;

      const tr = target.closest("tr");
      const totalEl = tr?.querySelector(".ts-total");
      if (totalEl) totalEl.textContent = formatCurrency(total || 0);
    });

    timesheetNewBody.addEventListener("click", (e) => {
      const btn = e.target?.closest?.("button[data-ts-remove]");
      if (!btn) return;
      const idx = Number(btn.dataset.tsRemove || -1);
      if (idx < 0) return;
      timesheetNewRows = timesheetNewRows.filter((_, i) => i !== idx);
      try { playUiSound("nav"); } catch (_) {}
      renderTimesheetNewTable();
    });
  }
};

const renderTimesheetSavedTable = (data, jobs) => {
  if (!timesheetSavedBody) return;

  // Cache latest data for delegated handlers
  window.__mtnTimesheetLastData = data;
  window.__mtnTimesheetLastJobs = jobs;

  timesheetSavedBody.innerHTML = "";

  const filtered = timesheetSearchTerm
    ? jobs.filter((j) => normalizeText(j.title).includes(timesheetSearchTerm))
    : jobs;

  const frag = document.createDocumentFragment();

  filtered.forEach((job) => {
    const qty = Number(job.quantity || 0);
    const price = Number(job.unitPrice || 0);
    const total = Number(job.total || 0);

    const tr = document.createElement("tr");
    if (timesheetEditingId === job.id) {
      tr.innerHTML = `
        <td>${escapeHtml(toIsoDate(job.createdAt || ""))}</td>
        <td><input value="${escapeHtml(job.title || "")}" data-ts-edit="${job.id}" data-ts-field="title" /></td>
        <td><input type="number" min="0" step="0.01" value="${qty}" data-ts-edit="${job.id}" data-ts-field="quantity" /></td>
        <td><input value="${escapeHtml(job.unit || "Adet")}" data-ts-edit="${job.id}" data-ts-field="unit" /></td>
        <td><input type="number" min="0" step="0.01" value="${price}" data-ts-edit="${job.id}" data-ts-field="unitPrice" /></td>
        <td>${formatCurrency(total)}</td>
        <td>${escapeHtml(job.note || "")}</td>
        <td class="row-actions">
          <button class="primary" type="button" data-ts-edit-save="${job.id}">Kaydet</button>
          <button class="ghost" type="button" data-ts-edit-cancel="${job.id}">İptal</button>
        </td>
      `;
    } else {
      tr.innerHTML = `
        <td>${escapeHtml(toIsoDate(job.createdAt || ""))}</td>
        <td>${escapeHtml(job.title || "")}</td>
        <td>${qty || 0}</td>
        <td>${escapeHtml(job.unit || "-")}</td>
        <td>${formatCurrency(price || 0)}</td>
        <td>${formatCurrency(total || 0)}</td>
        <td>${escapeHtml(job.note || "")}</td>
        <td class="row-actions">
          <button class="ghost" type="button" data-ts-view="${job.id}">Detay</button>
          <button class="ghost" type="button" data-ts-edit-open="${job.id}">Düzenle</button>
          <button class="ghost" type="button" data-ts-delete="${job.id}">Sil</button>
        </td>
      `;
    }
    frag.appendChild(tr);
  });

  timesheetSavedBody.appendChild(frag);

  // Delegated handlers (çok daha hızlı)
  if (!timesheetSavedBody.dataset.mtnBound) {
    timesheetSavedBody.dataset.mtnBound = "1";
    timesheetSavedBody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const lastData = window.__mtnTimesheetLastData || {};
      const lastJobs = window.__mtnTimesheetLastJobs || [];
      const id =
        btn.dataset.tsView ||
        btn.dataset.tsEditOpen ||
        btn.dataset.tsEditSave ||
        btn.dataset.tsEditCancel ||
        btn.dataset.tsDelete ||
        "";

      if (!id) return;

      // Detay
      if (btn.dataset.tsView) {
        const job = (lastData.customerJobs || []).find((j) => j.id === id);
        if (!job) return;
        setStatus(`Detay: ${job.title} • ${formatCurrency(job.total || 0)}`);
        try { speakUi(`${job.title}. Tutar ${Math.round(Number(job.total || 0))} lira.`); } catch (_) {}
        try { playUiSound("nav"); } catch (_) {}
        return;
      }

      // Düzenle aç
      if (btn.dataset.tsEditOpen) {
        timesheetEditingId = id;
        renderTimesheetSavedTable(lastData, lastJobs);
        try { playUiSound("click"); } catch (_) {}
        return;
      }

      // Düzenle iptal
      if (btn.dataset.tsEditCancel) {
        timesheetEditingId = null;
        renderTimesheetSavedTable(lastData, lastJobs);
        try { playUiSound("click"); } catch (_) {}
        return;
      }

      // Kaydet
      if (btn.dataset.tsEditSave) {
        const row = btn.closest("tr");
        if (!row) return;

        const update = { id };
        row.querySelectorAll(`input[data-ts-edit="${id}"]`).forEach((input) => {
          const f = input.dataset.tsField || "";
          if (!f) return;
          if (f === "quantity" || f === "unitPrice") {
            update[f] = Number(String(input.value || "0").replace(",", ".")) || 0;
          } else {
            update[f] = input.value;
          }
        });

        const qty = Number(update.quantity || 0);
        const price = Number(update.unitPrice || 0);
        update.total = qty * price;

        if (!window.mtnApp?.updateCustomerJob) {
          setStatus("Düzenleme servisi hazır değil.", "warning");
          return;
        }

        await window.mtnApp.updateCustomerJob(update);
        const refreshed = await window.mtnApp.getData();
        setStatus("Puantaj güncellendi.");
        try { playUiSound("success"); } catch (_) {}
        timesheetEditingId = null;
        renderTimesheet(refreshed);
        return;
      }

      // Sil
      if (btn.dataset.tsDelete) {
        if (!window.mtnApp?.deleteCustomerJob) {
          setStatus("Silme servisi hazır değil.", "warning");
          return;
        }
        await window.mtnApp.deleteCustomerJob({ id });
        const refreshed = await window.mtnApp.getData();
        setStatus("Kayıt silindi.");
        try { playUiSound("success"); } catch (_) {}
        renderTimesheet(refreshed);
        return;
      }
    });
  }
};

const renderTimesheet = (data) => {
  if (!timesheetWorkerSelect || !timesheetWeekStartInput || !timesheetWeekEndInput) return;

  // Workers list
  const workers = (data.customers || []).filter((c) => String(c.type || "").toUpperCase().includes("USTA"));
  window.__mtnTimesheetWorkersCache = workers;

  // Seçili ustayı koru (render sırasında dropdown ilk elemana dönmesin)
  const prevWorkerId = timesheetWorkerSelect.value || "";

  timesheetWorkerSelect.innerHTML = "";
  workers.forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w.id;
    opt.textContent = `${w.code || ""} - ${w.name || ""}`.trim();
    timesheetWorkerSelect.appendChild(opt);
  });

  // Seçimi geri yükle
  if (prevWorkerId && workers.some((w) => w.id === prevWorkerId)) {
    timesheetWorkerSelect.value = prevWorkerId;
  } else if (workers[0]?.id) {
    timesheetWorkerSelect.value = workers[0].id;
  }

  if (!timesheetWeekStartInput.value) {
    timesheetWeekStartInput.value = getThisWeekMonday();
  }
  const { start, end, note } = getTimesheetWeekRange();
  timesheetWeekEndInput.value = end;

  const workerId = timesheetWorkerSelect.value || "";
  // Çoklu seçim listesi güncelle
  // Not: Listeyi tamamen kullanıcı yönetir. Otomatik ekleme YOK.
  timesheetSelectedWorkerIds = (timesheetSelectedWorkerIds || []).filter((id) => workers.some((w) => w.id === id));
  renderTimesheetWorkerMulti(workers);


  const selected = (data.customers || []).find((c) => c.id === workerId);
  const balance = Number(selected?.balance || 0);
  if (timesheetWorkerBalanceEl) timesheetWorkerBalanceEl.textContent = formatCurrency(balance);

  // Jobs in week
  const jobs = (data.customerJobs || []).filter((j) => {
    if (j.customerId !== workerId) return false;
    const d = toIsoDate(j.createdAt || "");
    if (!d) return false;
    if (d < start || d > end) return false;
    return String(j.note || "").includes("Puantaj:");
  });

  const sum = jobs.reduce((acc, j) => acc + Number(j.total || 0), 0);
  if (timesheetWeekTotalEl) timesheetWeekTotalEl.textContent = formatCurrency(sum);
  if (timesheetCountEl) timesheetCountEl.textContent = String(jobs.length);

  renderTimesheetNewTable();
  renderTimesheetSavedTable(data, jobs);
};

const openTimesheetPdfPreview = (data, workerId) => {
  const { start, end } = getTimesheetWeekRange();
  const worker = (data.customers || []).find((c) => c.id === workerId);
  const jobs = (data.customerJobs || []).filter((j) => {
    if (j.customerId !== workerId) return false;
    const d = toIsoDate(j.createdAt || "");
    if (!d) return false;
    if (d < start || d > end) return false;
    return String(j.note || "").includes("Puantaj:");
  });

  const total = jobs.reduce((acc, j) => acc + Number(j.total || 0), 0);

  const rowsHtml = jobs
    .map(
      (j) => `
    <tr>
      <td>${escapeHtml(toIsoDate(j.createdAt || ""))}</td>
      <td>${escapeHtml(j.title || "")}</td>
      <td style="text-align:right">${Number(j.quantity || 0)}</td>
      <td>${escapeHtml(j.unit || "")}</td>
      <td style="text-align:right">${formatCurrency(Number(j.unitPrice || 0))}</td>
      <td style="text-align:right">${formatCurrency(Number(j.total || 0))}</td>
    </tr>`
    )
    .join("");

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Puantaj</title>
      <style>
        body{font-family:Arial, sans-serif; padding:24px;}
        h2{margin:0 0 6px 0;}
        .meta{color:#444; margin-bottom:16px;}
        table{width:100%; border-collapse:collapse; margin-top:10px;}
        th,td{border:1px solid #ddd; padding:8px; font-size:12px;}
        th{background:#f4f6fb; text-align:left;}
        tfoot td{font-weight:bold;}
      </style>
    </head>
    <body>
      <h2>USTA / Personel Puantaj</h2>
      <div class="meta">
        <div><strong>Usta:</strong> ${escapeHtml(worker?.name || "-")}</div>
        <div><strong>Hafta:</strong> ${start} - ${end}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>İş</th>
            <th>Miktar</th>
            <th>Birim</th>
            <th>Birim Fiyat</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>${rowsHtml || ""}</tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="text-align:right">GENEL TOPLAM</td>
            <td style="text-align:right">${formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
      <script>setTimeout(()=>{ try{ window.print(); }catch(e){} }, 300);</script>
    </body>
  </html>`;

  const w = window.open("", "_blank", "width=950,height=720");
  if (!w) {
    setStatus("PDF önizleme açılamadı.", "warning");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
};

// Timesheet listeners
if (timesheetWeekStartInput) {
  timesheetWeekStartInput.addEventListener("change", async () => {
    const data = await window.mtnApp.getData();
    renderTimesheet(data);
  });
}
if (timesheetWorkerSelect) {
  timesheetWorkerSelect.addEventListener("change", async () => {
    const data = await window.mtnApp.getData();
    renderTimesheet(data);
  });
}
if (timesheetWorkerAddBtn) {
  timesheetWorkerAddBtn.addEventListener("click", async () => {
    const id = timesheetWorkerSelect?.value || "";
    if (!id) {
      setStatus("Usta seçin.", "warning");
      return;
    }
    ensureTimesheetWorkerInList(id);
    renderTimesheetWorkerMulti(window.__mtnTimesheetWorkersCache || []);
    setStatus("Usta listeye eklendi.");
    try { playUiSound("nav"); } catch (_) {}
  });
}
if (timesheetWorkerClearBtn) {
  timesheetWorkerClearBtn.addEventListener("click", () => {
    // Kullanıcı listeyi tamamen temizleyebilmeli.
    // Dropdown'daki mevcut seçimi değiştirmiyoruz; sadece çoklu listeyi sıfırlıyoruz.
    timesheetSelectedWorkerIds = [];
    renderTimesheetWorkerMulti(window.__mtnTimesheetWorkersCache || []);
    setStatus("Usta listesi temizlendi.");
    try { playUiSound("nav"); } catch (_) {}
  });
}
if (timesheetWorkersListEl) {
  timesheetWorkersListEl.addEventListener("click", (ev) => {
    const btn = ev.target?.closest?.("[data-ts-worker-remove]");
    const id = btn?.dataset?.tsWorkerRemove || "";
    if (!id) return;

    // Çoklu liste ayrı bir seçimdir; dropdown'daki "görüntülenen usta"yı değiştirmeyiz.
    // Böylece kullanıcı son ustayı da silebilir ve liste boş kalabilir.
    timesheetSelectedWorkerIds = uniqIds(timesheetSelectedWorkerIds).filter((x) => x !== id);

    renderTimesheetWorkerMulti(window.__mtnTimesheetWorkersCache || []);
    setStatus("Usta listeden kaldırıldı.");
    try { playUiSound("nav"); } catch (_) {}
  });
}

if (timesheetRefreshBtn) {
  timesheetRefreshBtn.addEventListener("click", async () => {
    const data = await window.mtnApp.getData();
    renderTimesheet(data);
    setStatus("Puantaj yenilendi.");
    try { playUiSound("nav"); } catch (_) {}
  });
}
if (timesheetAddRowBtn) {
  timesheetAddRowBtn.addEventListener("click", () => {
    timesheetNewRows.push({ title: "", quantity: 1, unit: "Adet", unitPrice: 0 });
    try { playUiSound("nav"); } catch (_) {}
    renderTimesheetNewTable();
  });
}
if (timesheetBulkBtn) {
  timesheetBulkBtn.addEventListener("click", () => {
    if (!timesheetBulkWrap) return;
    timesheetBulkWrap.classList.toggle("is-hidden");
    try { playUiSound("nav"); } catch (_) {}
  });
}
if (timesheetBulkPreviewBtn) {
  timesheetBulkPreviewBtn.addEventListener("click", () => {
    const parsed = parseTimesheetBulkLines(timesheetBulkText?.value || "");
    if (!timesheetBulkPreviewArea) return;
    const preview = parsed.slice(0, 50).map((r) => `${r.title} | ${r.quantity} | ${r.unit} | ${formatCurrency(r.unitPrice || 0)}`).join("<br/>");
    timesheetBulkPreviewArea.innerHTML = `<div class="muted">${preview || "Ön izleme boş."}</div>`;
    try { playUiSound("nav"); } catch (_) {}
  });
}
if (timesheetBulkApplyBtn) {
  timesheetBulkApplyBtn.addEventListener("click", () => {
    const parsed = parseTimesheetBulkLines(timesheetBulkText?.value || "");
    timesheetNewRows = [...timesheetNewRows, ...parsed];
    timesheetBulkText.value = "";
    if (timesheetBulkPreviewArea) timesheetBulkPreviewArea.innerHTML = "";
    if (timesheetBulkWrap) timesheetBulkWrap.classList.add("is-hidden");
    try { playUiSound("success"); } catch (_) {}
    renderTimesheetNewTable();
    setStatus("Toplu satırlar eklendi.");
  });
}
if (timesheetSearchInput) {
  timesheetSearchInput.addEventListener("input", async () => {
    timesheetSearchTerm = normalizeText(timesheetSearchInput.value);
    const data = await window.mtnApp.getData();
    renderTimesheet(data);
  });
}
if (timesheetSearchBtn) {
  timesheetSearchBtn.addEventListener("click", async () => {
    timesheetSearchTerm = normalizeText(timesheetSearchInput?.value);
    const data = await window.mtnApp.getData();
    renderTimesheet(data);
  });
}
if (timesheetSaveBtn) {
  timesheetSaveBtn.addEventListener("click", async () => {
    const workerId = timesheetWorkerSelect?.value || "";
    if (!workerId) {
      setStatus("Usta seçin.", "warning");
      return;
    }
    if (!window.mtnApp?.addCustomerJob) {
      setStatus("İş kalemi servisi hazır değil.", "warning");
      return;
    }
    if (!timesheetNewRows.length) {
      setStatus("Yeni satır yok.", "warning");
      return;
    }
    const { start, end, note } = getTimesheetWeekRange();
    let ok = 0;
    const workerIds = getTimesheetTargetWorkerIds();
    if (!workerIds.length) {
      setStatus("Usta seçin.", "warning");
      return;
    }
    for (const row of timesheetNewRows) {
      const title = String(row.title || "").trim();
      if (!title) continue;
      const qty = Number(row.quantity || 0);
      const price = Number(row.unitPrice || 0);
      const total = qty * price;
      for (const wid of workerIds) {
        await window.mtnApp.addCustomerJob({
          customerId: wid,
          title,
          quantity: qty,
          unit: row.unit || "Adet",
          unitPrice: price,
          total,
          note,
          createdAt: start
        });
        ok += 1;
      }
    }
    timesheetNewRows = [];
    renderTimesheetNewTable();
    const data = await window.mtnApp.getData();
    renderTimesheet(data);
    setStatus(`Puantaj kaydedildi: ${ok} satır.`);
    try { playUiSound("success"); } catch (_) {}
    try { speakUi(`Puantaj kaydedildi. ${ok} satır eklendi.`); } catch (_) {}
  });
}
if (timesheetPdfBtn) {
  timesheetPdfBtn.addEventListener("click", async () => {
    const data = await window.mtnApp.getData();
    const workerId = timesheetWorkerSelect?.value || "";
    if (!workerId) {
      setStatus("Usta seçin.", "warning");
      return;
    }
    openTimesheetPdfPreview(data, workerId);
    try { playUiSound("nav"); } catch (_) {}
  });
}
if (timesheetPayBtn) {
  timesheetPayBtn.addEventListener("click", async () => {
    const workerId = timesheetWorkerSelect?.value || "";
    if (!workerId) {
      setStatus("Usta seçin.", "warning");
      return;
    }
    const data = await window.mtnApp.getData();
    renderTimesheet(data);
    const weekTotal = Number(
      String(timesheetWeekTotalEl?.textContent || "").replace(/[^0-9,\.]/g, "").replace(",", ".")
    ) || 0;
    const amountText = await window.mtnPromptModal("Haftalık ödeme tutarı", String(weekTotal || 0), { type: "number", placeholder: "Tutar" });
    const amount = Number(String(amountText || "0").replace(",", ".")) || 0;
    if (!amount || amount <= 0) {
      setStatus("Ödeme iptal.", "warning");
      return;
    }
    await window.mtnApp.collectPayment({
      customerId: workerId,
      amount,
      note: `Haftalık ödeme (${getTimesheetWeekRange().start} - ${getTimesheetWeekRange().end})`,
      paymentMethod: "EFT"
    });
    const refreshed = await window.mtnApp.getData();
    renderTimesheet(refreshed);
    setStatus("Haftalık ödeme işlendi.");
    try { playUiSound("success"); } catch (_) {}
  });
}
if (timesheetReceiptBtn) {
  timesheetReceiptBtn.addEventListener("click", async () => {
    const data = await window.mtnApp.getData();
    const workerId = timesheetWorkerSelect?.value || "";
    if (!workerId) {
      setStatus("Usta seçin.", "warning");
      return;
    }
    openTimesheetPdfPreview(data, workerId);
    try { playUiSound("nav"); } catch (_) {}
  });
}

let statusTimeout = null;
// Counter for assigning unique identifiers to stock receipt rows. Each time a new
// row is created, this counter is incremented and the value is stored on
// the row element via `dataset.rowId`. This allows later logic to reference
// specific rows when editing or cancelling.
let receiptRowIdCounter = 0;

// Tracks the currently opened customer in the detail panel. When a user
// double-clicks a customer row to view details, this variable is updated
// with that customer's ID. It is used as a fallback for actions such as
// "Tahsilat Yap" when the corresponding select element has not yet been
// synchronised.
let currentCustomerDetailId = null;
const setStatus = (message) => {
  if (reportPathEl) {
    reportPathEl.textContent = message;
  }
  if (!globalStatusEl) {
    return;
  }
  globalStatusEl.textContent = message;
  globalStatusEl.classList.add("is-visible");
  if (centerStatusEl) {
    centerStatusEl.textContent = message;
    centerStatusEl.classList.add("is-visible");
  }
  if (statusTimeout) {
    window.clearTimeout(statusTimeout);
  }
  statusTimeout = window.setTimeout(() => {
    globalStatusEl.classList.remove("is-visible");
    centerStatusEl?.classList.remove("is-visible");
  }, 4500);
};

const toggleHelpMenu = (open) => {
  if (currentSettings?.enableTour === false) {
    return;
  }
  if (!helpMenuPanel || !helpMenuToggle) {
    return;
  }
  const nextState = typeof open === "boolean" ? open : !helpMenuPanel.classList.contains("is-open");
  helpMenuPanel.classList.toggle("is-open", nextState);
  helpMenuToggle.setAttribute("aria-expanded", String(nextState));
};

const setAssistantDockTab = (tabId) => {
  assistantDockTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.assistantTab === tabId);
  });
  assistantDockPanes.forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.assistantPane === tabId);
  });
};

const appendAssistantDockLog = (text) => {
  if (!assistantDockLog) return;
  const entry = document.createElement("div");
  entry.textContent = text;
  assistantDockLog.appendChild(entry);
};

const openAssistantDock = (open = true) => {
  if (!assistantDock) return;
  assistantDock.classList.toggle("is-open", open);
};

let onboardingStepIndex = 1;
const renderOnboardingStep = (step) => {
  onboardingSteps.forEach((panel) => {
    const isActive = Number(panel.dataset.step) === step;
    panel.classList.toggle("is-active", isActive);
  });
  if (onboardingBack) {
    onboardingBack.disabled = step <= 1;
  }
  if (onboardingNext) {
    onboardingNext.textContent = step >= onboardingSteps.length ? "Bitir" : "İleri";
  }
};

const openOnboardingWizard = (step = 1) => {
  if (!onboardingWizard) return;
  onboardingStepIndex = step;
  onboardingWizard.classList.add("is-visible");
  onboardingWizard.setAttribute("aria-hidden", "false");
  renderOnboardingStep(onboardingStepIndex);
};

const closeOnboardingWizard = () => {
  if (!onboardingWizard) return;
  onboardingWizard.classList.remove("is-visible");
  onboardingWizard.setAttribute("aria-hidden", "true");
};

const getTourSteps = (pageId) => {
  const config = window.MTN_TOUR_CONFIG || {};
  if (pageId && config[pageId]) {
    return config[pageId];
  }
  return config.general || [];
};

let tourSteps = [];
let tourStepIndex = 0;
const renderTourStep = () => {
  if (!tourOverlay || !tourTitle || !tourDescription) return;
  const step = tourSteps[tourStepIndex];
  if (!step) {
    tourOverlay.classList.remove("is-visible");
    tourOverlay.setAttribute("aria-hidden", "true");
    return;
  }
  tourTitle.textContent = step.title || "Tur";
  tourDescription.textContent = step.description || "";
  tourOverlay.classList.add("is-visible");
  tourOverlay.setAttribute("aria-hidden", "false");
  if (tourBack) tourBack.disabled = tourStepIndex === 0;
  if (tourNext) tourNext.textContent = tourStepIndex === tourSteps.length - 1 ? "Bitir" : "İleri";
};

const startTour = (pageId) => {
  if (currentSettings?.enableTour === false) {
    setStatus("Tur özelliği kapalı.");
    return;
  }
  const allSteps = getTourSteps(pageId);
  const missingSteps = allSteps.filter(
    (step) => !document.querySelector(step.selector)
  );
  tourSteps = allSteps.filter((step) => document.querySelector(step.selector));
  if (missingSteps.length) {
    console.warn("Tur adımı atlandı (selector bulunamadı):", missingSteps);
  }
  tourStepIndex = 0;
  if (!tourSteps.length) {
    setStatus("Bu ekran için tur tanımı bulunamadı.");
    return;
  }
  renderTourStep();
};


// MTN_KPI_RENDER
const renderKpis = (data) => {
  try {
    // Cari KPI: toplam cari, toplam alacak/borç
    const customers = data?.customers || [];
    let receivable = 0; // müşteriden alacak
    let payable = 0;    // tedarikçi/usta borç
    customers.forEach((c) => {
      const bal = Number(c.balance || 0);
      if (bal > 0) receivable += bal;
      if (bal < 0) payable += Math.abs(bal);
    });
    const kpiCustomers = document.getElementById("kpi-customers");
    if (kpiCustomers) {
      const boxes = kpiCustomers.querySelectorAll(".kpi__value");
      if (boxes[0]) boxes[0].textContent = `${customers.length} Cari`;
      if (boxes[1]) boxes[1].textContent = `Alacak ${formatCurrency(receivable)}`;
      if (boxes[2]) boxes[2].textContent = `Borç ${formatCurrency(payable)}`;
    }

    // Stok KPI: toplam ürün, yaklaşık stok değeri
    const stocks = data?.stocks || [];
    let totalQty = 0;
    let stockValue = 0;
    stocks.forEach((s) => {
      const qty = Number(s.quantity || 0);
      totalQty += qty;
      const price = Number(s.purchasePrice || s.salePrice || 0);
      stockValue += qty * price;
    });
    const kpiStocks = document.getElementById("kpi-stocks");
    if (kpiStocks) {
      const boxes = kpiStocks.querySelectorAll(".kpi__value");
      if (boxes[0]) boxes[0].textContent = `${stocks.length} Ürün`;
      if (boxes[1]) boxes[1].textContent = `Adet ${Number(totalQty || 0).toLocaleString("tr-TR")}`;
      if (boxes[2]) boxes[2].textContent = `Değer ${formatCurrency(stockValue)}`;
    }

    // Teklif KPI: teklif sayısı ve toplam tutar
    const offers = data?.offers || [];
    const offersTotal = offers.reduce((s, o) => s + Number(o.total || 0), 0);
    const kpiOffers = document.getElementById("kpi-offers");
    if (kpiOffers) {
      const boxes = kpiOffers.querySelectorAll(".kpi__value");
      if (boxes[0]) boxes[0].textContent = `${offers.length} Teklif`;
      if (boxes[1]) boxes[1].textContent = `Toplam ${formatCurrency(offersTotal)}`;
      if (boxes[2]) boxes[2].textContent = `Durum Aktif`;
    }

    // Kasa KPI: kasa toplamı ve bugün hareketi
    const tx = data?.cashTransactions || [];
    const today = new Date().toLocaleDateString("tr-TR");
    const income = tx.filter(x => x.type === "gelir").reduce((s,x)=>s+Number(x.amount||0),0);
    const expense = tx.filter(x => x.type === "gider").reduce((s,x)=>s+Number(x.amount||0),0);
    const todayIncome = tx.filter(x => new Date(x.date || x.createdAt || Date.now()).toLocaleDateString("tr-TR") === today && x.type === "gelir").reduce((s,x)=>s+Number(x.amount||0),0);
    const todayExpense = tx.filter(x => new Date(x.date || x.createdAt || Date.now()).toLocaleDateString("tr-TR") === today && x.type === "gider").reduce((s,x)=>s+Number(x.amount||0),0);
    const kpiCash = document.getElementById("kpi-cash");
    if (kpiCash) {
      const boxes = kpiCash.querySelectorAll(".kpi__value");
      if (boxes[0]) boxes[0].textContent = `Kasa ${formatCurrency(income - expense)}`;
      if (boxes[1]) boxes[1].textContent = `Bugün +${formatCurrency(todayIncome)} / -${formatCurrency(todayExpense)}`;
      if (boxes[2]) boxes[2].textContent = `Net ${formatCurrency((income - expense))}`;
    }
  } catch (_) {}
};

let users = [
  {
    username: "mtn",
    password: "1453",
    role: "admin",
    displayName: "MTN Yönetici"
  },
  {
    username: "muhasebe",
    password: "1453",
    role: "accountant",
    displayName: "Muhasebeci"
  }
];
let currentSettings = {};
let currentUser = null;
let cachedCustomers = [];
let cachedStocks = [];
let cachedStockMovements = [];
let cachedCustomerDebts = [];
let cachedCustomerJobs = [];
let cachedCashTransactions = [];
let cachedSales = [];
let cachedProposals = [];
let offerCustomerFilterName = "";
let currentPanelId = null;

let cachedStockReceipts = [];
let lastManualBackupDir = "";
let cachedInvoices = [];
let cachedImportRows = [];
let editingStockId = "";
let editingCustomerId = "";
let activeCustomerFilter = "all";
let isCustomerDetailMode = false;
let returnToListAfterSave = false;
let returnToListAfterAction = "";
let detailSearchTerm = "";
const activeOfferRows = {
  internal: null,
  industrial: null
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

// === MTN: Sayfa geçiş sesi ===
let uiSoundEnabled = true;
try {
  if (window.MTN?.Sound?.isEnabled) uiSoundEnabled = window.MTN.Sound.isEnabled();
} catch (_) {}

function playUiSound(kind = "nav") {
  if (!uiSoundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = window.__mtnAudioCtx || (window.__mtnAudioCtx = new AudioCtx());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value =
      kind === "error" ? 180 : kind === "success" ? 540 : 440;
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (_) {}
}

// MTN: Electron uyumlu Prompt (window.prompt yasak) - Modal Input
function mtnPromptModal(title = "Bilgi", defaultValue = "", opts = {}) {
  const { type = "text", placeholder = "", okText = "Tamam", cancelText = "İptal" } = opts || {};
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "mtn-overlay";
    overlay.dataset.mtnOverlay = "prompt";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,.35)";
    overlay.style.backdropFilter = "blur(6px)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";

    const box = document.createElement("div");
    box.className = "card";
    box.style.width = "min(520px, 92vw)";
    box.style.padding = "16px";
    box.style.borderRadius = "16px";

    const h = document.createElement("div");
    h.style.fontWeight = "800";
    h.style.marginBottom = "10px";
    h.textContent = title;

    const input = document.createElement("input");
    input.type = type === "number" ? "number" : "text";
    input.value = String(defaultValue ?? "");
    input.placeholder = placeholder || "";
    input.style.width = "100%";
    input.style.padding = "12px 12px";
    input.style.borderRadius = "14px";
    input.style.outline = "none";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "10px";
    row.style.marginTop = "12px";
    row.style.justifyContent = "flex-end";

    const cancel = document.createElement("button");
    cancel.className = "ghost";
    cancel.type = "button";
    cancel.textContent = cancelText;

    const ok = document.createElement("button");
    ok.className = "primary";
    ok.type = "button";
    ok.textContent = okText;

    const close = (value) => {
      try { overlay.remove(); } catch (_) {}
      resolve(value);
    };

    cancel.addEventListener("click", () => close(null));
    ok.addEventListener("click", () => close(input.value));

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(null);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") close(input.value);
      if (e.key === "Escape") close(null);
    });

    row.appendChild(cancel);
    row.appendChild(ok);

    box.appendChild(h);
    box.appendChild(input);
    box.appendChild(row);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(() => {
      try { input.focus(); input.select(); } catch (_) {}
    }, 0);
  });
}
// MTN: Global erişim (modül scope hatası yaşamamak için)
try { window.mtnPromptModal = mtnPromptModal; } catch (_) {}

let voiceEnabled = uiSoundEnabled;
const speakUi = (text) => {
  try {
    if (!voiceEnabled) return;

    // MTN TTS açıksa onu kullan
    if (voiceEnabled && window.MTN?.TTS && window.MTN.TTS.isEnabled()) {
      window.MTN.TTS.speak(String(text || ""));
      return;
    }
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(String(text || ""));
    utter.lang = "tr-TR";
    utter.rate = 1.05;
    utter.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (_) {}
};



const DAYS_IN_MS = 24 * 60 * 60 * 1000;
const getRoleLabel = (role) => ROLE_LABELS[role] || role || "kullanıcı";

const normalizeUsers = (list = []) =>
  list
    .map((user) => {
      const username = String(user?.username || "").trim();
      if (!username) {
        return null;
      }
      const inferredRole =
        user?.role ||
        (["admin", "mtn"].includes(username.toLowerCase())
          ? "admin"
          : "accountant");
      return {
        username,
        password: user?.password || "",
        role: inferredRole,
        displayName: user?.displayName || username
      };
    })
    .filter(Boolean);

const getCustomerDueDate = (customer) => {
  const dueDays = Number(customer?.dueDays || 0);
  if (!dueDays) {
    return null;
  }
  const lastDebt = cachedCustomerDebts
    .filter((entry) => entry.customerId === customer.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  if (!lastDebt?.createdAt) {
    return null;
  }
  const baseDate = new Date(lastDebt.createdAt);
  if (Number.isNaN(baseDate.getTime())) {
    return null;
  }
  return new Date(baseDate.getTime() + dueDays * DAYS_IN_MS);
};

// Varsayım: "Şunu mu demek istediniz?" için basit karakter benzerliği yeterlidir.
const similarityScore = (term, target) => {
  const source = normalizeText(term);
  const candidate = normalizeText(target);
  if (!source || !candidate) {
    return 0;
  }
  if (candidate.includes(source)) {
    return 1;
  }
  const sourceChars = new Set(source);
  const candidateChars = new Set(candidate);
  const intersection = [...sourceChars].filter((ch) =>
    candidateChars.has(ch)
  ).length;
  const union = new Set([...sourceChars, ...candidateChars]).size || 1;
  return intersection / union;
};

const getSuggestion = (term, items, getLabel) => {
  if (!term) {
    return "";
  }
  let best = "";
  let bestScore = 0;
  items.forEach((item) => {
    const label = getLabel(item);
    const score = similarityScore(term, label);
    if (score > bestScore) {
      bestScore = score;
      best = label;
    }
  });
  return bestScore >= 0.3 ? best : "";
};

const applyBranding = (settings) => {
  const companyName = settings.companyName || "MTN Masaüstü";
  if (brandTitle) {
    brandTitle.textContent = companyName.toUpperCase();
  }
  if (document?.title) {
    document.title = companyName;
  }
  if (brandLogo) {
    if (settings.logoDataUrl) {
      brandLogo.src = settings.logoDataUrl;
      brandLogo.style.display = "block";
    } else {
      brandLogo.src = "assets/brand-placeholder.svg";
      brandLogo.style.display = "block";
    }
  }
  if (splashLogo) {
    splashLogo.src = settings.logoDataUrl || "assets/brand-placeholder.svg";
  }
  if (loginLogo) {
    loginLogo.src = settings.logoDataUrl || "assets/brand-placeholder.svg";
  }
  if (topbarLogo) {
    topbarLogo.src = brandLogo?.src || "assets/brand-placeholder.svg";
    topbarLogo.style.display = "block";
  }
  if (footerCompanyName) {
    footerCompanyName.textContent = companyName;
  }
  if (footerCompanyOwner) {
    footerCompanyOwner.textContent = settings.companyOwner || "Metin Döş";
  }
  if (offerLogo) {
    offerLogo.src = brandLogo?.src || "assets/brand-placeholder.svg";
  }
  if (offerCompanyName) {
    offerCompanyName.textContent = companyName;
  }
  if (offerCompanyMeta) {
    offerCompanyMeta.textContent = `Vergi Dairesi: ${settings.taxOffice || ""} • Vergi No: ${settings.taxNumber || ""}`;
  }
  if (offerCompanyAddress) {
    offerCompanyAddress.textContent = settings.companyAddress || "";
  }
  if (offerLogoIndustrial) {
    offerLogoIndustrial.src = brandLogo?.src || "assets/brand-placeholder.svg";
  }
  if (offerCompanyNameIndustrial) {
    offerCompanyNameIndustrial.textContent = companyName;
  }
  if (offerCompanyMetaIndustrial) {
    offerCompanyMetaIndustrial.textContent = `Vergi Dairesi: ${settings.taxOffice || ""} • Vergi No: ${settings.taxNumber || ""}`;
  }
  if (offerCompanyAddressIndustrial) {
    offerCompanyAddressIndustrial.textContent = settings.companyAddress || "";
  }
};

const shadeColor = (hex, percent) => {
  const safeHex = String(hex || "").replace("#", "");
  if (safeHex.length !== 6) {
    return hex;
  }
  const num = parseInt(safeHex, 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x00ff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const applyTheme = (settings) => {
  const theme = settings.theme || {};
  const primary = theme.primary || DEFAULT_THEME.primary;
  const accent = theme.accent || DEFAULT_THEME.accent;
  const root = document.documentElement;
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-dark", shadeColor(primary, -18));
  root.style.setProperty("--accent-orange", primary);
  root.style.setProperty("--accent-orange-dark", shadeColor(primary, -18));
  root.style.setProperty("--accent-warm", accent);
  root.style.setProperty("--accent-warm-glow", `${accent}59`);
  if (themePrimaryInput) {
    themePrimaryInput.value = primary;
  }
  if (themeAccentInput) {
    themeAccentInput.value = accent;
  }
};

const applyUserProfile = (profile) => {
  const displayName = profile?.displayName || profile?.username || "Kullanıcı";
  currentUser = profile || null;
  if (userNameEl) {
    userNameEl.textContent = displayName;
  }
  if (dashboardUserEl) {
    dashboardUserEl.textContent = displayName.toUpperCase();
  }
  if (userRoleEl) {
    userRoleEl.textContent = getRoleLabel(profile?.role);
  }
};

const applyRoleAccess = (role) => {
  const normalizedRole = role || "accountant";
  document.querySelectorAll("[data-role]").forEach((element) => {
    const allowedRoles = (element.dataset.role || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const isAllowed = allowedRoles.includes(normalizedRole);
    element.classList.toggle("is-hidden", !isAllowed);
  });
  if (document.querySelector(".panel.panel--active.is-hidden")) {
    showPanel("dashboard-panel", "Ana Menü");
    activateMenuByPanel("dashboard-panel");
  }
};

const setCustomerWorkspace = (mode, options = {}) => {
  try { playUiSound('nav'); } catch (_) {}

  const isDetail = mode === "detail";
  isCustomerDetailMode = isDetail;
  customerListSection?.classList.toggle("is-hidden", isDetail);
  customerDetailSection?.classList.toggle("is-hidden", !isDetail);
  customerTransactionSection?.classList.toggle("is-hidden", !isDetail);
  customerDetailModule?.classList.toggle("is-hidden", !isDetail);
  if (customerFormSection) {
    const hideForm = isDetail && !options.showForm;
    customerFormSection.classList.toggle("is-hidden", hideForm);
  }
  if (!isDetail) {
    customerDetailCard?.classList.add("is-hidden");
    returnToListAfterSave = false;
    detailSearchTerm = "";
    if (customerDetailSearchInput) {
      customerDetailSearchInput.value = "";
    }
  }
};

const renderUsers = (list = users) => {
  if (!userTableBody) {
    return;
  }
  const normalizedUsers = normalizeUsers(list);
  userTableBody.innerHTML = "";
  if (!normalizedUsers.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">Henüz kullanıcı yok.</td>`;
    userTableBody.appendChild(row);
    return;
  }
  const adminCount = normalizedUsers.filter((user) => user.role === "admin")
    .length;
  normalizedUsers.forEach((user) => {
    const row = document.createElement("tr");
    const isCurrent = user.username === currentUser?.username;
    const isLastAdmin = user.role === "admin" && adminCount === 1;
    const statusLabel = isCurrent ? "Oturum açık" : "Aktif";
    row.innerHTML = `
      <td>
        <strong>${escapeHtml(user.displayName)}</strong>
        <div class="muted">${escapeHtml(user.username)}</div>
      </td>
      <td>
        <select data-user-role data-username="${escapeHtml(user.username)}"${
          isLastAdmin ? " disabled" : ""
        }>
          <option value="admin"${user.role === "admin" ? " selected" : ""}>
            Yönetici
          </option>
          <option value="accountant"${
            user.role === "accountant" ? " selected" : ""
          }>
            Muhasebeci
          </option>
        </select>
      </td>
      <td>${statusLabel}</td>
      <td>
        <button class="ghost" data-user-remove="${escapeHtml(
          user.username
        )}" ${isCurrent || isLastAdmin ? "disabled" : ""}>
          Sil
        </button>
      </td>
      <td>
        <button class="ghost ghost--sm" type="button" data-action="customer-detail">Detay</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });

  userTableBody.querySelectorAll("[data-user-role]").forEach((select) => {
    select.addEventListener("change", async (event) => {
      const target = event.target;
      const username = target.dataset.username;
      const nextRole = target.value;
      const nextUsers = normalizeUsers(users).map((entry) =>
        entry.username === username ? { ...entry, role: nextRole } : entry
      );
      const adminCountNext = nextUsers.filter(
        (entry) => entry.role === "admin"
      ).length;
      if (adminCountNext === 0) {
        setStatus("En az bir yönetici hesabı olmalı.");
        target.value = "admin";
        return;
      }
      await persistUsers(nextUsers);
      setStatus("Kullanıcı rolü güncellendi.");
    });
  });

  userTableBody.querySelectorAll("[data-user-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      const username = button.dataset.userRemove;
      const approved = window.confirm(
        `${username} hesabı silinsin mi?`
      );
      if (!approved) {
        return;
      }
      const nextUsers = normalizeUsers(users).filter(
        (entry) => entry.username !== username
      );
      const adminCountNext = nextUsers.filter(
        (entry) => entry.role === "admin"
      ).length;
      if (adminCountNext === 0) {
        setStatus("En az bir yönetici hesabı olmalı.");
        return;
      }
      await persistUsers(nextUsers);
      setStatus("Kullanıcı kaldırıldı.");
    });
  });
};

const persistUsers = async (nextUsers) => {
  if (!window.mtnApp?.saveSettings) {
    setStatus("Kullanıcı servisleri hazır değil.");
    return;
  }
  const existingSettings = await window.mtnApp.getSettings();
  const normalizedUsers = normalizeUsers(nextUsers);
  const nextSettings = { ...existingSettings, users: normalizedUsers };
  await window.mtnApp.saveSettings(nextSettings);
  currentSettings = nextSettings;
  users = normalizedUsers;
  if (currentUser) {
    currentUser =
      normalizedUsers.find(
        (entry) => entry.username === currentUser.username
      ) || currentUser;
    applyUserProfile(currentUser);
    applyRoleAccess(currentUser?.role);
  }
  renderUsers(normalizedUsers);
};

const reminderStorageKey = "mtn-payment-reminders";

const loadReminders = () => {
  try {
    const raw = localStorage.getItem(reminderStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveReminders = (items) => {
  localStorage.setItem(reminderStorageKey, JSON.stringify(items));
};

const formatReminderDate = (value) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("tr-TR");
};

const getReminderLabel = (reminder) =>
  `${reminder.category || "Şahsi Ödeme"} • ${formatReminderDate(
    reminder.dueDate
  )}`;

const renderReminderList = (targetEl, reminders, emptyMessage) => {
  if (!targetEl) {
    return;
  }
  targetEl.innerHTML = "";
  if (!reminders.length) {
    const li = document.createElement("li");
    li.textContent = emptyMessage;
    targetEl.appendChild(li);
    return;
  }
  reminders.forEach((reminder) => {
    if (targetEl === aiReminderList) {
      const item = document.createElement("li");
      item.className = "ai-reminder-item";
      item.innerHTML = `
        <strong>${escapeHtml(reminder.title || "Hatırlatma")}</strong>
        <div class="ai-reminder-meta">
          <span>${escapeHtml(reminder.category || "Şahsi Ödeme")}</span>
          <span>${formatReminderDate(reminder.dueDate)}</span>
        </div>
        <div class="ai-reminder-actions">
          <button class="ai-reminder-delete" data-reminder-id="${reminder.id}">
            Sil
          </button>
        </div>
      `;
      item
        .querySelector("[data-reminder-id]")
        ?.addEventListener("click", () => {
          const next = loadReminders().filter(
            (entry) => entry.id !== reminder.id
          );
          saveReminders(next);
          updateReminderUI();
        });
      targetEl.appendChild(item);
      return;
    }
    const li = document.createElement("li");
    li.textContent = `${reminder.title} (${getReminderLabel(reminder)})`;
    targetEl.appendChild(li);
  });
};

const updateReminderUI = () => {
  const reminders = loadReminders().sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );
  renderReminderList(
    aiReminderList,
    reminders,
    "Henüz ödeme hatırlatıcısı yok."
  );
  renderReminderList(
    assistantPaymentsEl,
    reminders,
    "Ödeme takvimi boş."
  );
  return reminders;
};

const loginAnimationMs = 350;
const splashDurationMs = 3200;

const resetLoginFeedback = () => {
  if (loginError) {
    loginError.textContent = "";
  }
  if (loginPasswordInput) {
    loginPasswordInput.type = "password";
  }
  if (loginToggleButton) {
    loginToggleButton.textContent = "👁️";
  }
};

const hideSplash = () => {
  if (!splashScreen) {
    return;
  }
  splashScreen.style.opacity = "0";
  setTimeout(() => {
    splashScreen.remove();
  }, 800);
};

const showLoginScreen = () => {
  if (!loginScreen) {
    return;
  }
  resetLoginFeedback();
  loginScreen.style.display = "grid";
  requestAnimationFrame(() => {
    loginScreen.classList.add("login--ready");
    loginScreen.classList.remove("login--leaving");
  });
};

const hideLoginScreen = () => {
  if (!loginScreen) {
    return;
  }
  loginScreen.classList.add("login--leaving");
  loginScreen.classList.remove("login--ready");
  setTimeout(() => {
    loginScreen.style.display = "none";
  }, loginAnimationMs);
};

const showCustomerTab = (tabId) => {
  if (!customerTabButtons.length || !customerTabPanels.length) {
    return;
  }
  customerTabButtons.forEach((button) => {
    button.classList.toggle(
      "tab-button--active",
      button.dataset.customerTab === tabId
    );
  });
  customerTabPanels.forEach((panel) => {
    panel.classList.toggle(
      "tab-panel--hidden",
      panel.dataset.customerTabPanel !== tabId
    );
  });
};


const getInitialDetailTab = () => {
  try {
    const stored = localStorage.getItem("mtn_detail_tab");
    if (stored === "jobs" || stored === "payments" || stored === "ledger") {
      return stored;
    }
  } catch (err) {
    // ignore
  }
  return "ledger";
};

let activeDetailTab = getInitialDetailTab();

const showDetailTab = (tabId) => {
  if (!detailTabButtons.length || !detailTabPanels.length) {
    return;
  }
  activeDetailTab = tabId || "ledger";
  detailTabButtons.forEach((button) => {
    button.classList.toggle(
      "tab-button--active",
      button.dataset.detailTab === activeDetailTab
    );
  });
  detailTabPanels.forEach((panel) => {
    panel.classList.toggle(
      "tab-panel--hidden",
      panel.dataset.detailTabPanel !== activeDetailTab
    );
  });
  try {
    localStorage.setItem("mtn_detail_tab", activeDetailTab);
  } catch (err) {
    // ignore
  }
};

if (detailTabButtons && detailTabButtons.length) {
  detailTabButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      showDetailTab(button.dataset.detailTab);
    });
  });
  // İlk yüklemede son seçimi göster (varsayılan: Hareketler)
  showDetailTab(activeDetailTab);
}



const handleLogin = (event) => {
  event.preventDefault();
  resetLoginFeedback();
  const formData = new FormData(loginForm);
  const { username, password } = Object.fromEntries(formData.entries());
  const trimmedUsername = String(username || "").trim();
  const trimmedPassword = String(password || "").trim();
  const matchedUser = users.find(
    (user) =>
      user.username === trimmedUsername &&
      String(user.password || "") === trimmedPassword
  );

  if (matchedUser) {
    appShell.classList.remove("app--hidden");
    hideLoginScreen();
    applyUserProfile(matchedUser);
    applyRoleAccess(matchedUser?.role);
    try {
      localStorage.setItem("mtn-last-user", matchedUser.username);
    } catch (error) {
      // ignore localStorage errors
    }
  } else if (loginError) {
    loginError.textContent = "Kullanıcı adı veya şifre hatalı.";
  }
};

if (loginToggleButton && loginPasswordInput) {
  loginToggleButton.addEventListener("click", () => {
    const isHidden = loginPasswordInput.type === "password";
    loginPasswordInput.type = isHidden ? "text" : "password";
    loginToggleButton.textContent = isHidden ? "🙈" : "👁️";
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    appShell.classList.add("app--hidden");
    showLoginScreen();
    applyRoleAccess("accountant");
    setCustomerWorkspace("list");
    try {
      localStorage.removeItem("mtn-last-user");
    } catch (error) {
      // ignore localStorage errors
    }
  });
}

if (userForm) {
  userForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (userFormError) {
      userFormError.textContent = "";
    }
    const formData = new FormData(userForm);
    const payload = Object.fromEntries(formData.entries());
    const username = String(payload.username || "").trim();
    const password = String(payload.password || "").trim();
    const displayName = String(payload.displayName || "").trim() || username;
    const role = payload.role || "accountant";
    if (!username || !password) {
      if (userFormError) {
        userFormError.textContent =
          "Kullanıcı adı ve şifre zorunludur.";
      }
      return;
    }
    const existing = normalizeUsers(users).find(
      (entry) => entry.username === username
    );
    if (existing) {
      if (userFormError) {
        userFormError.textContent =
          "Bu kullanıcı adı zaten kullanılıyor.";
      }
      return;
    }
    const nextUsers = normalizeUsers([
      ...users,
      { username, password, role, displayName }
    ]);
    await persistUsers(nextUsers);
    userForm.reset();
    setStatus("Yeni kullanıcı eklendi.");
  });
}

if (transactionCustomerSelect) {
  transactionCustomerSelect.addEventListener("change", () => {
    updateSupplierUI(transactionCustomerSelect.value);

    // MTN: Cari tipine göre işlem türünü otomatik sınırla
    try {
      const txTypeSel = document.getElementById("transaction-type");
      if (!txTypeSel) return;
      const id = transactionCustomerSelect.value;
      const cust = (cachedCustomers || []).find((c) => c.id === id) || {};
      const t = String(cust.type || "musteri").toLowerCase();
      const isMusteri = t === "musteri";
      Array.from(txTypeSel.options).forEach((opt) => {
        if (opt.value === "tahsilat") opt.disabled = !isMusteri;
        if (opt.value === "odeme") opt.disabled = isMusteri;
      });
      txTypeSel.value = isMusteri ? "tahsilat" : "odeme";
    } catch (_) {}
  });
}

if (supplierPaymentAction) {
  supplierPaymentAction.addEventListener("click", () => {
    setCustomerWorkspace("detail");
    if (transactionCustomerSelect) {
      transactionCustomerSelect.focus();
    }
    setStatus("Tedarikçi ödemesi için cari seçin.");
  });
}

if (customerDetailSupplierPayment) {
  customerDetailSupplierPayment.addEventListener("click", () => {
    setCustomerWorkspace("detail");
    if (transactionCustomerSelect) {
      transactionCustomerSelect.value = detailCustomerSelect?.value || "";
      updateSupplierUI(transactionCustomerSelect.value);
    }
    setStatus("Tedarikçiye ödeme işlemi başlatıldı.");
  });
}

if (customerTypeSelect && supplierActions) {
  const syncSupplierActions = () => {
    supplierActions.classList.toggle(
      "is-hidden",
      customerTypeSelect.value !== "tedarikci"
    );
  };

  const syncCariDefaults = () => {
    const t = String(customerTypeSelect.value || "musteri");
    try {
      if (customerForm?.elements?.code && window.MTN?.Codes) {
        const cur = String(customerForm.elements.code.value || "").trim();
        const okFormat = window.MTN.Codes.validateCariCode(t, cur);
        if (!cur || !okFormat) {
          customerForm.elements.code.value = window.MTN.Codes.nextCariCode(t, cachedCustomers, editingCustomerId);
        }
      }
      if (t === "musteri" && customerForm?.elements?.dueDays && window.MTN?.Rules) {
        const curDue = Number(customerForm.elements.dueDays.value || 0);
        if (!curDue) customerForm.elements.dueDays.value = window.MTN.Rules.getDefaultDueDays();
      }
    } catch (_) {}
  };

  customerTypeSelect.addEventListener("change", () => {
    syncSupplierActions();
    syncCariDefaults();
  });
  syncSupplierActions();
  syncCariDefaults();
}


const calculateTotal = () => {
  const rows = Array.from(offerBody.querySelectorAll("tr"));
  const subtotal = rows.reduce((sum, row) => {
    const quantity = Number(
      row.querySelector("[data-field='quantity']")?.value || 0
    );
    const price = Number(
      row.querySelector("[data-field='price']")?.value || 0
    );
    const totalInput = row.querySelector("[data-field='total']");
    const rowTotal = quantity * price;
    if (totalInput) {
      totalInput.value = rowTotal ? rowTotal.toFixed(2) : "";
    }
    return sum + rowTotal;
  }, 0);

  const vatRate = Number(vatInput?.value || 0) / 100;
  const vatManual = Number(offerVatManualInput?.value || 0);
  const vatTotal = vatManual || subtotal * vatRate;
  const total = subtotal + vatTotal;

  subtotalEl.textContent = formatCurrency(subtotal);
  vatTotalEl.textContent = formatCurrency(vatTotal);
  totalEl.textContent = formatCurrency(total);
};

const calculateIndustrialTotals = () => {
  if (!offerBodyIndustrial) {
    return;
  }
  const rows = Array.from(offerBodyIndustrial.querySelectorAll("tr"));
  const subtotal = rows.reduce((sum, row) => {
    const quantity = Number(
      row.querySelector("[data-field='quantity']")?.value || 0
    );
    const price = Number(
      row.querySelector("[data-field='price']")?.value || 0
    );
    const totalInput = row.querySelector("[data-field='total']");
    const rowTotal = quantity * price;
    if (totalInput) {
      totalInput.value = rowTotal ? rowTotal.toFixed(2) : "";
    }
    return sum + rowTotal;
  }, 0);

  const vatRate = Number(offerVatIndustrial?.value || 0) / 100;
  const vatManual = Number(offerVatManualIndustrial?.value || 0);
  const vatTotal = vatManual || subtotal * vatRate;
  const total = subtotal + vatTotal;

  if (offerSubtotalIndustrial) {
    offerSubtotalIndustrial.textContent = formatCurrency(subtotal);
  }
  if (offerVatTotalIndustrial) {
    offerVatTotalIndustrial.textContent = formatCurrency(vatTotal);
  }
  if (offerTotalIndustrial) {
    offerTotalIndustrial.textContent = formatCurrency(total);
  }
};

const findStockMatch = (value) => {
  const raw = String(value || "").trim();
  const codePart = raw.includes("-") ? raw.split("-")[0].trim() : "";
  const term = normalizeText(raw);
  const codeTerm = normalizeText(codePart);
  if (!term) {
    return null;
  }
  return (
    cachedStocks.find(
      (stock) => normalizeText(stock.code) === term
    ) ||
    cachedStocks.find(
      (stock) => codeTerm && normalizeText(stock.code) === codeTerm
    ) ||
    cachedStocks.find(
      (stock) => normalizeText(stock.normalizedName || stock.name) === term
    ) ||
    cachedStocks.find((stock) =>
      normalizeText(stock.normalizedName || stock.name).includes(term)
    )
  );
};

const setActiveOfferRow = (panel, row) => {
  if (activeOfferRows[panel]) {
    activeOfferRows[panel].classList.remove("offer-row--active");
  }
  activeOfferRows[panel] = row;
  row.classList.add("offer-row--active");
};

const createRow = () => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input data-field="name" placeholder="Malzeme adı" /></td>
    <td><input data-field="quantity" type="number" min="0" step="1" /></td>
    <td><input data-field="unit" placeholder="Birim" /></td>
    <td><input data-field="price" type="number" min="0" step="0.01" /></td>
    <td><input data-field="total" type="number" min="0" step="0.01" /></td>
    <td><button type="button" class="ghost ghost--danger" data-offer-row-remove>Sil</button></td>
  `;

  const inputs = row.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", calculateTotal);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const newRow = createRow();
        offerBody.appendChild(newRow);
        newRow.querySelector("input")?.focus();
      }
    });
  });

  const nameInput = row.querySelector("[data-field='name']");
  if (nameInput) {
    nameInput.addEventListener("focus", () => {
      setActiveOfferRow("internal", row);
    });
    nameInput.addEventListener("change", () => {
      const matched = findStockMatch(nameInput.value);
      if (!matched) {
        return;
      }
      const unitInput = row.querySelector("[data-field='unit']");
      const priceInput = row.querySelector("[data-field='price']");
      if (unitInput && !unitInput.value) {
        unitInput.value = matched.unit || "";
      }
      if (priceInput) {
        priceInput.value = matched.salePrice || matched.purchasePrice || "";
      }
      calculateTotal();
    });
  }

  row.querySelector("[data-offer-row-remove]")?.addEventListener("click", () => {
    row.remove();
    calculateTotal();
  });

  return row;
};

const createIndustrialRow = () => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input data-field="name" placeholder="Malzeme adı" /></td>
    <td><input data-field="quantity" type="number" min="0" step="1" /></td>
    <td><input data-field="unit" placeholder="Birim" /></td>
    <td><input data-field="price" type="number" min="0" step="0.01" /></td>
    <td><input data-field="total" type="number" min="0" step="0.01" /></td>
    <td><button type="button" class="ghost ghost--danger" data-offer-row-remove>Sil</button></td>
  `;
  row.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", calculateIndustrialTotals);
  });
  const nameInput = row.querySelector("[data-field='name']");
  if (nameInput) {
    nameInput.addEventListener("focus", () => {
      setActiveOfferRow("industrial", row);
    });
    nameInput.addEventListener("change", () => {
      const matched = findStockMatch(nameInput.value);
      if (!matched) {
        return;
      }
      const unitInput = row.querySelector("[data-field='unit']");
      const priceInput = row.querySelector("[data-field='price']");
      if (unitInput && !unitInput.value) {
        unitInput.value = matched.unit || "";
      }
      if (priceInput) {
        priceInput.value = matched.salePrice || matched.purchasePrice || "";
      }
      calculateIndustrialTotals();
    });
  }
  row.querySelector("[data-offer-row-remove]")?.addEventListener("click", () => {
    row.remove();
    calculateIndustrialTotals();
  });
  return row;
};

addRowButton.addEventListener("click", () => {
  const newRow = createRow();
  offerBody.appendChild(newRow);
  newRow.querySelector("input")?.focus();
});

offerBody.appendChild(createRow());
calculateTotal();

if (offerBodyIndustrial) {
  offerBodyIndustrial.appendChild(createIndustrialRow());
  calculateIndustrialTotals();
}

if (vatInput) {
  vatInput.addEventListener("input", calculateTotal);
}
if (offerVatManualInput) {
  offerVatManualInput.addEventListener("input", calculateTotal);
}
if (offerVatIndustrial) {
  offerVatIndustrial.addEventListener("input", calculateIndustrialTotals);
}
if (offerVatManualIndustrial) {
  offerVatManualIndustrial.addEventListener("input", calculateIndustrialTotals);
}

if (window.mtnApp) {
  versionEl.textContent = window.mtnApp.version;
}

const renderCustomers = (items) => {
  cachedCustomers = items;
  customersTable.innerHTML = "";
  const searchTerm = normalizeText(customerSearchInput?.value);
  let filtered = searchTerm
    ? items.filter((item) => {
        const name = normalizeText(item.name);
        const code = normalizeText(item.code);
        const normalized = normalizeText(item.normalizedName);
        return (
          name.includes(searchTerm) ||
          code.includes(searchTerm) ||
          normalized.includes(searchTerm)
        );
      })
    : items;
  if (activeCustomerFilter === "debtors") {
    filtered = filtered.filter((item) => Number(item.balance || 0) > 0);
  }
  if (activeCustomerFilter === "creditors") {
    filtered = filtered.filter((item) => Number(item.balance || 0) < 0);
  }
  if (activeCustomerFilter === "active") {
    filtered = filtered.filter((item) => item.isActive !== false);
  }
  if (activeCustomerFilter === "inactive") {
    filtered = filtered.filter((item) => item.isActive === false);
  }
  if (activeCustomerFilter === "due") {
    const now = Date.now();
    const horizon = now + 7 * DAYS_IN_MS;
    filtered = filtered.filter((item) => {
      const dueDate = getCustomerDueDate(item);
      return (
        Number(item.balance || 0) > 0 &&
        dueDate &&
        dueDate.getTime() >= now &&
        dueDate.getTime() <= horizon
      );
    });
  }
  if (customerFilterAllCount) {
    customerFilterAllCount.textContent = items.length;
  }
  if (customerFilterActiveCount) {
    customerFilterActiveCount.textContent = items.filter(
      (item) => item.isActive !== false
    ).length;
  }
  if (customerFilterInactiveCount) {
    customerFilterInactiveCount.textContent = items.filter(
      (item) => item.isActive === false
    ).length;
  }
  if (customerFilterDebtorsCount) {
    customerFilterDebtorsCount.textContent = items.filter(
      (item) => Number(item.balance || 0) > 0
    ).length;
  }
  if (customerFilterCreditorsCount) {
    customerFilterCreditorsCount.textContent = items.filter(
      (item) => Number(item.balance || 0) < 0
    ).length;
  }
  if (customerFilterDueCount) {
    const now = Date.now();
    const horizon = now + 7 * DAYS_IN_MS;
    customerFilterDueCount.textContent = items.filter((item) => {
      const dueDate = getCustomerDueDate(item);
      return (
        Number(item.balance || 0) > 0 &&
        dueDate &&
        dueDate.getTime() >= now &&
        dueDate.getTime() <= horizon
      );
    }).length;
  }
  if (offerCustomerSelect) {
    offerCustomerSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Genel";
    offerCustomerSelect.appendChild(defaultOption);
  }
  if (transactionCustomerSelect) {
    transactionCustomerSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Cari Seç";
    transactionCustomerSelect.appendChild(defaultOption);
  }
  if (detailCustomerSelect) {
    detailCustomerSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Cari Seç";
    detailCustomerSelect.appendChild(defaultOption);
  }
  if (cashCustomerSelect) {
    cashCustomerSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Cari Seç";
    cashCustomerSelect.appendChild(defaultOption);
  }
  filtered.forEach((item) => {
    const isActive = item.isActive !== false;
    const isSupplier = item.type === "tedarikci";
    const isUsta = item.type === "usta";
    const balanceValue = Number(item.balance || 0);
    const balanceBadgeClass =
      balanceValue > 0
        ? "badge badge--expense"
        : balanceValue < 0
          ? "badge badge--income"
          : "badge";
    const dueDate = getCustomerDueDate(item);
    const dueLabel = dueDate ? dueDate.toLocaleDateString("tr-TR") : "";
    const isDueSoon =
      balanceValue > 0 &&
      dueDate &&
      dueDate.getTime() <= Date.now() + 7 * DAYS_IN_MS;
    const row = document.createElement("tr");
    row.dataset.customerId = item.id || "";
    // Apply row-level colour coding based on balance
    if (balanceValue > 0) {
      row.classList.add("row--receivable");
    }
    if (balanceValue < 0) {
      row.classList.add("row--payable");
    }
    // Supplier rows keep existing highlight
    row.classList.toggle("row--supplier", isSupplier);
    // Determine the label for the customer type
    let typeLabel = "Müşteri";
    if (isSupplier) typeLabel = "Tedarikçi";
    else if (isUsta) typeLabel = "Usta/Personel";
    row.innerHTML = `
      <td>${item.code || "-"}</td>
      <td>${item.name || "-"}</td>
      <td>
        <span class="badge ${isSupplier ? "badge--supplier" : isUsta ? "badge--info" : "badge--info"}">
          ${typeLabel}
        </span>
      </td>
      <td>${item.phone || "-"}</td>
      <td>${item.taxNumber || "-"}</td>
      <td>${item.email || "-"}</td>
      <td><span class="${balanceBadgeClass}">${formatCurrency(balanceValue)}</span></td>
      <td>
        <div class="status-badges">
          <span class="badge ${isActive ? "badge--income" : "badge--expense"}">
            ${isActive ? "Aktif" : "Pasif"}
          </span>
          ${
            isDueSoon
              ? `<span class="badge badge--warning">Vade Yakın</span>`
              : ""
          }
          ${dueLabel ? `<span class="badge badge--info">Vade: ${dueLabel}</span>` : ""}
        </div>
      </td>
      <td>
        <button class="ghost ghost--sm" type="button" data-action="customer-detail">Detay</button>
      </td>
    `;
    // Clicking or double clicking on a row should open the inline customer panel
    row.addEventListener("click", () => {
      openCustomerInlinePanel(item);
    });
    row.addEventListener("dblclick", (ev) => {
      ev.preventDefault();
      try {
        customerInlinePanel?.classList.add('is-hidden');
        if (inlineFormContainer) inlineFormContainer.innerHTML = '';
      } catch (_) {}
      openCustomerDetail(item);
    });

    const detailBtn = row.querySelector('[data-action="customer-detail"]');
    if (detailBtn) {
      detailBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        try {
          customerInlinePanel?.classList.add('is-hidden');
          if (inlineFormContainer) inlineFormContainer.innerHTML = '';
        } catch (_) {}
        openCustomerDetail(item);
      });
    }
    customersTable.appendChild(row);
  });
  items.forEach((item) => {
    if (item.isActive === false) {
      return;
    }
    if (offerCustomerSelect) {
      const option = document.createElement("option");
      option.value = item.id || item.name || "";
      option.textContent = item.code
        ? `${item.code} - ${item.name || "Cari"}`
        : item.name || "Cari";
      offerCustomerSelect.appendChild(option);
    }
    if (transactionCustomerSelect) {
      const option = document.createElement("option");
      option.value = item.id || item.name || "";
      option.textContent = item.code
        ? `${item.code} - ${item.name || "Cari"}`
        : item.name || "Cari";
      transactionCustomerSelect.appendChild(option);
    }
    if (detailCustomerSelect) {
      const option = document.createElement("option");
      option.value = item.id || item.name || "";
      option.textContent = item.code
        ? `${item.code} - ${item.name || "Cari"}`
        : item.name || "Cari";
      detailCustomerSelect.appendChild(option);
    }
    if (cashCustomerSelect) {
      const option = document.createElement("option");
      option.value = item.id || item.name || "";
      option.textContent = item.code
        ? `${item.code} - ${item.name || "Cari"}`
        : item.name || "Cari";
      cashCustomerSelect.appendChild(option);
    }
  });
  if (customerSearchSuggestion) {
    const suggestion = getSuggestion(
      searchTerm,
      items,
      (item) => item.name || ""
    );
    customerSearchSuggestion.textContent =
      searchTerm && !filtered.length && suggestion
        ? `Şunu mu demek istediniz: ${suggestion}`
        : "";
  }
};

const updateSupplierUI = (customerId) => {
  const customer = cachedCustomers.find((item) => item.id === customerId);
  const isSupplier = customer?.type === "tedarikci";
  if (transactionTypeSelect) {
    transactionTypeSelect.value = isSupplier ? "odeme" : "tahsilat";
  }
  if (transactionHint) {
    transactionHint.textContent = isSupplier
      ? "Tedarikçi için ödeme kaydı giriyorsunuz."
      : "Müşteri için tahsilat kaydı giriyorsunuz.";
  }
  if (customerDetailSupplierPayment) {
    customerDetailSupplierPayment.classList.toggle("is-hidden", !isSupplier);
  }
  if (customerForm?.elements?.type) {
    customerForm.elements.type.value = isSupplier ? "tedarikci" : "musteri";
  }
  enforceOpeningBalanceRules();
  if (customerDetailActions) {
    customerDetailActions.classList.toggle("is-hidden", isSupplier);
  }
  if (customerDetailSupplierActions) {
    customerDetailSupplierActions.classList.toggle("is-hidden", !isSupplier);
  }
  if (openingDebtField) {
    openingDebtField.classList.toggle("is-hidden", isSupplier);
    const input = openingDebtField.querySelector("input");
    if (input && isSupplier) {
      input.value = "0";
    }
    if (input) {
      input.disabled = isSupplier;
    }
  }
  if (openingCreditField) {
    openingCreditField.classList.toggle("is-hidden", !isSupplier);
    const input = openingCreditField.querySelector("input");
    if (input && !isSupplier) {
      input.value = "0";
    }
    if (input) {
      input.disabled = !isSupplier;
    }
  }
};

const openCustomerTransaction = (customerId, type) => {
  if (transactionCustomerSelect) {
    transactionCustomerSelect.value = customerId;
  }
  if (transactionTypeSelect) {
    transactionTypeSelect.value = type || transactionTypeSelect.value || "tahsilat";
  }
  updateSupplierUI(customerId);
  setCustomerWorkspace("detail");
  customerTransactionForm?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

const openCustomerDetail = (customer) => {
  if (!customer) {
    return;
  }
  // Update the currently selected customer ID so that actions like
  // "Tahsilat Yap" can reference it even if the dropdown has not yet been
  // populated.
  currentCustomerDetailId = customer.id || null;
  setCustomerWorkspace("detail");
  if (detailCustomerSelect) {
    detailCustomerSelect.value = customer.id;
  }
  if (customerDetailSearchInput) {
    customerDetailSearchInput.value = "";
  }
  detailSearchTerm = "";
  renderCustomerDetail({
    customers: cachedCustomers,
    customerDebts: cachedCustomerDebts,
    customerJobs: cachedCustomerJobs,
    cashTransactions: cachedCashTransactions,
    sales: cachedSales
  });
  if (customerDetailCard) {
    customerDetailCard.classList.remove("is-hidden");
  }
  if (customerDetailTitle) {
    customerDetailTitle.textContent = `${customer.code || ""} ${customer.name || ""}`.trim();
  }
  customerDetailCard?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const populateCustomerForm = (customer) => {
  if (!customerForm) {
    return;
  }
  editingCustomerId = customer.id || "";
  if (isCustomerDetailMode) {
    setCustomerWorkspace("detail", { showForm: true });
  }
  const fields = customerForm.elements;
  if (fields.code) {
    fields.code.value = customer.code || "";
  }
  if (fields.type) {
    fields.type.value = customer.type || "musteri";
  }
  if (fields.name) {
    fields.name.value = customer.name || "";
  }
  if (fields.identityNumber) {
    fields.identityNumber.value = customer.identityNumber || "";
  }
  if (fields.phone) {
    fields.phone.value = customer.phone || "";
  }
  if (fields.taxNumber) {
    fields.taxNumber.value = customer.taxNumber || "";
  }
  if (fields.email) {
    fields.email.value = customer.email || "";
  }
  if (fields.riskLimit) {
    fields.riskLimit.value = customer.riskLimit || "";
  }
  if (fields.dueDays) {
    fields.dueDays.value = customer.dueDays || "";
  }
  if (fields.address) {
    fields.address.value = customer.address || "";
  }
  if (fields.note) {
    fields.note.value = customer.note || "";
  }
  if (openingDebtField?.querySelector("input")) {
    openingDebtField.querySelector("input").value = "0";
  }
  if (openingCreditField?.querySelector("input")) {
    openingCreditField.querySelector("input").value = "0";
  }
  document
    .getElementById("customer-form-section")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
  setStatus("Cari düzenleme modunda.");
};

const enforceOpeningBalanceRules = () => {
  if (!customerForm) {
    return;
  }
  const typeValue = customerForm.elements.type?.value || "musteri";
  const debtInput = customerForm.elements.openingDebt;
  const creditInput = customerForm.elements.openingCredit;
  const isSupplier = typeValue === "tedarikci";
  if (openingDebtField) {
    openingDebtField.classList.toggle("is-hidden", isSupplier);
  }
  if (openingCreditField) {
    openingCreditField.classList.toggle("is-hidden", !isSupplier);
  }
  if (debtInput) {
    debtInput.disabled = isSupplier;
    if (isSupplier) {
      debtInput.value = "0";
    }
  }
  if (creditInput) {
    creditInput.disabled = !isSupplier;
    if (!isSupplier) {
      creditInput.value = "0";
    }
  }
};

const updateStockSuggestions = (items) => {
  if (!stockSuggestions) {
    return;
  }
  stockSuggestions.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.code
      ? `${item.code} - ${item.normalizedName || item.name || ""}`.trim()
      : item.normalizedName || item.name || "";
    stockSuggestions.appendChild(option);
  });
};

const renderOfferStockPicker = (panel, items) => {
  const listEl =
    panel === "industrial" ? offerStockListIndustrial : offerStockList;
  const searchInput =
    panel === "industrial" ? offerStockSearchInputIndustrial : offerStockSearchInput;
  if (!listEl) {
    return;
  }
  const term = normalizeText(searchInput?.value || "");
  const filtered = term
    ? items.filter((item) => {
        const name = normalizeText(item.normalizedName || item.name || "");
        const code = normalizeText(item.code || "");
        return name.includes(term) || code.includes(term);
      })
    : items;
  listEl.innerHTML = "";
  filtered.slice(0, 60).forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "offer-stock-item";
    button.innerHTML = `
      <span>${item.normalizedName || item.name || "Malzeme"}</span>
      <span class="muted">${item.code || item.unit || ""}</span>
    `;
    button.addEventListener("click", () => {
      let targetRow = activeOfferRows[panel];
      if (!targetRow) {
        targetRow =
          panel === "industrial" && offerBodyIndustrial
            ? offerBodyIndustrial.appendChild(createIndustrialRow())
            : offerBody.appendChild(createRow());
      }
      setActiveOfferRow(panel, targetRow);
      const nameInput = targetRow.querySelector("[data-field='name']");
      const unitInput = targetRow.querySelector("[data-field='unit']");
      const priceInput = targetRow.querySelector("[data-field='price']");
      if (nameInput) {
        nameInput.value = item.normalizedName || item.name || "";
      }
      if (unitInput) {
        unitInput.value = item.unit || "";
      }
      if (priceInput) {
        priceInput.value = item.salePrice || item.purchasePrice || "";
      }
      panel === "industrial" ? calculateIndustrialTotals() : calculateTotal();
    });
    listEl.appendChild(button);
  });
};

const renderStocks = (items) => {
  cachedStocks = items;
  stocksTable.innerHTML = "";
  const searchTerm = normalizeText(stockSearchInput?.value);
  const filtered = searchTerm
    ? items.filter((item) => {
        const name = normalizeText(item.name);
        const code = normalizeText(item.code);
        return name.includes(searchTerm) || code.includes(searchTerm);
      })
    : items;
  if (movementStockSelect) {
    movementStockSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Malzeme Seç";
    movementStockSelect.appendChild(defaultOption);
  }
  filtered.forEach((item) => {
    const quantity = Number(item.quantity || 0);
    const threshold = Number(item.threshold || 0);
    const isLow = threshold > 0 && quantity <= threshold;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.code || "-"}</td>
      <td>${item.normalizedName || item.name || "-"}</td>
      <td>${item.diameter || "-"}</td>
      <td>${item.unit || "-"}</td>
      <td>${quantity}</td>
      <td data-stock-col="purchase">${formatCurrency(Number(item.purchasePrice || 0))}</td>
      <td data-stock-col="sale">${formatCurrency(Number(item.salePrice || 0))}</td>
      <td data-stock-col="vat">${Number(item.vatRate || 0)}</td>
      <td>${threshold || 0}</td>
      <td>
        <span class="badge ${isLow ? "badge--danger" : "badge--income"}">
          ${isLow ? "Kritik" : "Normal"} • ${quantity}
        </span>
      </td>
      <td>
        <button class="ghost" data-edit-stock="${item.id}">Düzenle</button>
        <button class="ghost ghost--danger" data-delete-stock="${item.id}">Sil</button>
      </td>
    `;
    row.querySelector("[data-edit-stock]")?.addEventListener("click", () => {
      editingStockId = item.id;
      if (!stockForm) {
        return;
      }
      stockForm.elements.code.value = item.code || "";
      stockForm.elements.name.value = item.name || "";
      stockForm.elements.diameter.value = item.diameter || "";
      stockForm.elements.unit.value = item.unit || "";
      stockForm.elements.quantity.value = item.quantity || 0;
      stockForm.elements.purchasePrice.value = item.purchasePrice || "";
      stockForm.elements.salePrice.value = item.salePrice || "";
      stockForm.elements.vatRate.value = item.vatRate || "";
      stockForm.elements.description.value = item.description || "";
      stockForm.elements.threshold.value = item.threshold || "";
      stockForm.elements.createdAt.value = item.createdAt || "";
      setStatus("Stok düzenleme modunda. Güncellemek için kaydet.");
    });
    row.querySelector("[data-delete-stock]")?.addEventListener("click", async () => {
      if (!window.confirm("Bu stoğu silmek istiyor musunuz?")) {
        return;
      }
      if (!window.mtnApp?.deleteStock) {
        setStatus("Stok silme servisi hazır değil.");
        return;
      }
      const result = await window.mtnApp.deleteStock({ stockId: item.id });
      renderStocks(result || []);
      setStatus("Stok silindi.");
    });
    stocksTable.appendChild(row);
  });
  items.forEach((item) => {
    if (item.isActive === false) {
      return;
    }
    if (movementStockSelect) {
      const option = document.createElement("option");
      option.value = item.normalizedName || item.name || "";
      option.textContent = item.code
        ? `${item.code} - ${item.normalizedName || item.name || "Malzeme"}`
        : item.normalizedName || item.name || "Malzeme";
      movementStockSelect.appendChild(option);
    }
  });
  if (stocksTotalEl) {
    const total = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
    stocksTotalEl.textContent = total;
  }
  if (stockSearchSuggestion) {
    const suggestion = getSuggestion(
      searchTerm,
      items,
      (item) => item.normalizedName || item.name || ""
    );
    stockSearchSuggestion.textContent =
      searchTerm && !filtered.length && suggestion
        ? `Şunu mu demek istediniz: ${suggestion}`
        : "";
  }
  updateStockSuggestions(items);
  renderOfferStockPicker("internal", items);
  renderOfferStockPicker("industrial", items);
  applyStockColumnVisibility();
  renderStockList(items);
};

const renderStockList = (items) => {
  if (!stockListTable) {
    return;
  }
  stockListTable.innerHTML = "";
  const searchTerm = normalizeText(stockListSearchInput?.value);
  const unitTerm = normalizeText(stockListUnitFilter?.value);
  const warehouseTerm = normalizeText(stockListWarehouseFilter?.value);
  const filtered = searchTerm
    ? items.filter((item) => {
        const name = normalizeText(item.name);
        const code = normalizeText(item.code);
        const normalized = normalizeText(item.normalizedName);
        return (
          name.includes(searchTerm) ||
          code.includes(searchTerm) ||
          normalized.includes(searchTerm)
        );
      })
    : items;
  const refined = filtered.filter((item) => {
    const unit = normalizeText(item.unit);
    const warehouse = normalizeText(item.warehouse);
    const unitOk = unitTerm ? unit.includes(unitTerm) : true;
    const warehouseOk = warehouseTerm ? warehouse.includes(warehouseTerm) : true;
    return unitOk && warehouseOk;
  });
  refined.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" data-stock-id="${item.id || ""}" /></td>
      <td>${item.code || "-"}</td>
      <td>${item.normalizedName || item.name || "-"}</td>
      <td>${item.warehouse || "Ana Depo"}</td>
      <td>${item.quantity || 0}</td>
      <td>${item.unit || "-"}</td>
      <td>${item.isActive === false ? "Pasif" : "Aktif"}</td>
      <td>${
        item.updatedAt
          ? new Date(item.updatedAt).toLocaleDateString("tr-TR")
          : "-"
      }</td>
    `;
    stockListTable.appendChild(row);
  });
  if (stockListEmptyEl) {
    const hasFilters = Boolean(searchTerm || unitTerm || warehouseTerm);
    stockListEmptyEl.textContent =
      hasFilters && !refined.length
        ? "Aradığınız kriterlere uygun stok bulunamadı."
        : "";
  }
};

const applyStockColumnVisibility = () => {
  if (!stockColumnToggles.length) {
    return;
  }
  stockColumnToggles.forEach((toggle) => {
    const column = toggle.dataset.stockColumn;
    if (!column) {
      return;
    }
    const cells = document.querySelectorAll(`[data-stock-col='${column}']`);
    cells.forEach((cell) => {
      cell.classList.toggle("is-hidden", !toggle.checked);
    });
  });
};

const renderStockReceipts = (items) => {
  cachedStockReceipts = items || [];
  if (!stockReceiptsTable) {
    return;
  }
  stockReceiptsTable.innerHTML = "";
  const supplierTerm = normalizeText(receiptFilterSupplierInput?.value);
  const warehouseFilter = receiptFilterWarehouseSelect?.value || "";
  const statusFilter = receiptFilterStatusSelect?.value || "";
  const startDate = receiptFilterStartInput?.value
    ? new Date(receiptFilterStartInput.value)
    : null;
  const endDate = receiptFilterEndInput?.value
    ? new Date(receiptFilterEndInput.value)
    : null;
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }
  const filtered = cachedStockReceipts.filter((receipt) => {
    if (
      supplierTerm &&
      !normalizeText(receipt.supplier).includes(supplierTerm)
    ) {
      return false;
    }
    if (warehouseFilter && receipt.warehouse !== warehouseFilter) {
      return false;
    }
    if (statusFilter === "transferred" && !receipt.transferredAt) {
      return false;
    }
    if (statusFilter === "pending" && receipt.transferredAt) {
      return false;
    }
    const createdAt = receipt.createdAt ? new Date(receipt.createdAt) : null;
    if (startDate && createdAt && createdAt < startDate) {
      return false;
    }
    if (endDate && createdAt && createdAt > endDate) {
      return false;
    }
    return true;
  });
  filtered.forEach((receipt) => {
    const row = document.createElement("tr");
    const total = (receipt.items || []).reduce(
      (sum, item) =>
        sum + Number(item.purchasePrice || 0) * Number(item.quantity || 0),
      0
    );
    row.innerHTML = `
      <td><input type="checkbox" data-receipt-id="${receipt.id}" ${
        receipt.transferredAt ? "disabled" : ""
      } /></td>
      <td>${new Date(receipt.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${receipt.warehouse || "Ana Depo"}</td>
      <td>${receipt.supplier || "-"}</td>
      <td>${receipt.items?.length || 0}</td>
      <td>${formatCurrency(total)}</td>
      <td>${
        receipt.transferredAt ? "Aktarıldı" : "Bekliyor"
      }</td>
    `;
    row.addEventListener("dblclick", async () => {
      if (!receipt.attachment?.path) {
        return;
      }
      const result = await window.mtnApp?.openFile?.(receipt.attachment.path);
      if (result && !result.ok) {
        setStatus("Dosya açılamadı.");
      }
    });
    stockReceiptsTable.appendChild(row);
  });
};

const renderInvoices = (items) => {
  cachedInvoices = items || [];
  if (!invoicesTable) {
    return;
  }
  invoicesTable.innerHTML = "";
  const sorted = [...cachedInvoices].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  sorted.forEach((invoice) => {
    const row = document.createElement("tr");
    const fileLabel = invoice.attachment?.name || "-";
    const typeLabel =
      invoice.invoiceType === "satis"
        ? "Satış"
        : invoice.invoiceType === "alis"
          ? "Alış"
          : invoice.type || "-";
    row.innerHTML = `
      <td>${typeLabel}</td>
      <td>${new Date(invoice.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${invoice.vendor || "-"}</td>
      <td>${formatCurrency(Number(invoice.amount || 0))}</td>
      <td><button class="ghost" data-open-path="${
        invoice.attachment?.path || ""
      }">${fileLabel}</button></td>
      <td>${invoice.note || "-"}</td>
      <td>
        <button class="ghost ghost--danger" data-delete-invoice="${invoice.id}">
          Sil
        </button>
      </td>
    `;
    row
      .querySelector("[data-open-path]")
      ?.addEventListener("click", async () => {
        if (!invoice.attachment?.path) {
          return;
        }
        const result = await window.mtnApp?.openFile?.(invoice.attachment.path);
        if (result && !result.ok) {
          setStatus("Dosya açılamadı.");
        }
      });
    row
      .querySelector("[data-delete-invoice]")
      ?.addEventListener("click", async () => {
        if (!window.mtnApp?.deleteInvoice) {
          setStatus("Fatura silme servisi hazır değil.");
          return;
        }
        if (!confirm("Fatura kaydını silmek istiyor musunuz?")) {
          return;
        }
        const result = await window.mtnApp.deleteInvoice({
          invoiceId: invoice.id
        });
        renderInvoices(result.invoices || []);
        setStatus("Fatura silindi.");
      });
    invoicesTable.appendChild(row);
  });
};

const renderAccounts = (items) => {
  if (!accountsTable) {
    return;
  }
  accountsTable.innerHTML = "";
  (items || []).forEach((account) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${account.code || "-"}</td>
      <td>${account.name || "-"}</td>
      <td>${account.type || "-"}</td>
      <td>${account.description || "-"}</td>
    `;
    accountsTable.appendChild(row);
  });
};

const renderLedgerEntries = (items) => {
  const itemsToRender = items || [];

  if (!ledgerTable) {
    return;
  }
  ledgerTable.innerHTML = "";
  const sorted = [...(itemsToRender || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  sorted.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(entry.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${entry.accountCode || ""} ${entry.accountName || ""}</td>
      <td>${formatCurrency(Number(entry.debit || 0))}</td>
      <td>${formatCurrency(Number(entry.credit || 0))}</td>
      <td>${entry.note || "-"}</td>
    `;
    ledgerTable.appendChild(row);
  });
};

const renderUnitConversions = (items) => {
  if (!unitConversionTable) {
    return;
  }
  unitConversionTable.innerHTML = "";
  (items || []).forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.baseUnit || "-"}</td>
      <td>${item.targetUnit || "-"}</td>
      <td>${Number(item.factor || 0)}</td>
      <td>${item.note || "-"}</td>
    `;
    unitConversionTable.appendChild(row);
  });
};

const renderAuditLogs = (items) => {
  const itemsToRender = items || [];

  if (!auditLogTable) {
    return;
  }
  auditLogTable.innerHTML = "";
  const sorted = [...(itemsToRender || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  sorted.slice(0, 200).forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(log.createdAt).toLocaleString("tr-TR")}</td>
      <td>${log.module || "-"}</td>
      <td>${log.action || "-"}</td>
      <td>${log.message || "-"}</td>
    `;
    auditLogTable.appendChild(row);
  });
};

const refreshAccountingPanels = (data) => {
  if (!data) {
    return;
  
  renderKpis(data);
}
  renderAccounts(data.accounts || []);
  renderLedgerEntries(data.ledgerEntries || []);
  renderUnitConversions(data.unitConversions || []);
  renderAuditLogs(data.auditLogs || []);
};


const parseCurrencyValue = (value) => {
  if (value == null) return 0;
  const s = String(value).replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const computeProposalTotal = (proposal) => {
  if (!proposal) return 0;
  const direct = parseCurrencyValue(proposal.total);
  if (direct > 0) return direct;
  const items = Array.isArray(proposal.items) ? proposal.items : [];
  const sum = items.reduce((acc, it) => acc + parseCurrencyValue(it.total ?? (Number(it.quantity||0) * Number(it.price||0))), 0);
  return sum;
};

const renderProposalStatus = (proposal, isCustomerContext, filterNorm) => {
  const hasCustomer = !!(proposal.customerId || proposal.customerName);
  if (!hasCustomer) return '<span class="pill">GENEL</span>';
  const linked = isCustomerContext && normalizeText(proposal.customerName || "") === filterNorm;
  if (isCustomerContext) return linked ? '<span class="pill pill--ok">BAĞLI</span>' : '<span class="pill">ATANDI</span>';
  return `<span class="pill pill--ok">ATANDI</span>`;
};

const renderOffers = (items) => {
  cachedProposals = items || [];
  const filterNorm = offerCustomerFilterName ? normalizeText(offerCustomerFilterName) : "";
  const isCustomerContext = !!filterNorm;

  if (!offerTableBody) return;

  const list = Array.isArray(cachedProposals) ? cachedProposals : [];
  const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const searchNorm = offerSearchQuery ? normalizeText(offerSearchQuery) : "";


  offerTableBody.innerHTML = "";
  const filtered = searchNorm
    ? sorted.filter((item) => {
        const hay = [item.title, item.customerName, item.waybillNo, item.offerNo, item.type].filter(Boolean).join(" ");
        return normalizeText(hay).includes(searchNorm);
      })
    : sorted;

  filtered.forEach((item) => {
    const linked = isCustomerContext && normalizeText(item.customerName || "") === filterNorm;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(item.createdAt).toLocaleString("tr-TR")}</td>
      <td>${item.title || "-"}</td>
      <td>
        ${item.customerName || "Genel"}
        ${isCustomerContext ? (linked ? '<span class="pill pill--ok">BAĞLI</span>' : '<span class="pill">GENEL</span>') : ""}
      </td>
      <td>${renderProposalStatus(item, isCustomerContext, filterNorm)}</td>
      <td>${formatCurrency(computeProposalTotal(item))}</td>
      <td><button class="ghost" data-open-path="${item.pdfPath || ""}" data-offer-id="${item.id}">PDF</button></td>
      <td>
        <div class="offer-assign">
          <select class="input input--sm" data-offer-customer="${item.id}">
            <option value="">-</option>
            ${cachedCustomers
              .filter((c) => c && c.status !== "passive")
              .map((c) => `<option value="${c.id}" ${c.id === item.customerId ? "selected" : ""}>${escapeHtml(c.name || "-")}</option>`)
              .join("")}
          </select>
          <button class="ghost ghost--sm" data-offer-assign="${item.id}">Ata</button>
          ${item.customerId ? `<button class="ghost ghost--danger ghost--sm" data-offer-unassign="${item.id}">Kaldır</button>` : ""}
        </div>
      </td>
      <td><button class="ghost ghost--danger" data-delete-offer="${item.id}">Sil</button></td>
    `;
    offerTableBody.appendChild(tr);
  });

  // Tek seferlik delegasyon (yeniden render’da butonlar ölmesin)
  if (!window.mtnOfferDelegationBound) {
    window.mtnOfferDelegationBound = true;
    offerTableBody.addEventListener("click", async (ev) => {
      const openBtn = ev.target.closest("[data-open-path]");
      const delBtn = ev.target.closest("[data-delete-offer]");
      const assignBtn = ev.target.closest("[data-offer-assign]");
      const unassignBtn = ev.target.closest("[data-offer-unassign]");

      if (openBtn) {
        const path = openBtn.getAttribute("data-open-path") || "";
        if (!path) {
          setStatus("PDF yolu bulunamadı.");
          return;
        }
        try {
          await window.mtnApp?.openFile?.(path);
        } catch (_) {
          setStatus("Dosya açılamadı.");
        }
        return;
      }

      if (delBtn) {
        const id = delBtn.getAttribute("data-delete-offer");
        if (!id) return;
        if (!window.confirm("Bu teklifi silmek istiyor musunuz?")) return;
        try {
          const result = await window.mtnApp.deleteProposal({ proposalId: id });
          cachedProposals = result.proposals || [];
          setStatus("Teklif silindi.");
          renderOffers(cachedProposals);
        } catch (_) {
          setStatus("Silme sırasında hata oluştu.");
        }
        return;
      }

      if (assignBtn) {
        const id = assignBtn.getAttribute("data-offer-assign");
        if (!id) return;
        const selectEl = offerTableBody.querySelector(`[data-offer-customer="${id}"]`);
        const customerId = selectEl?.value || "";
        if (!customerId) {
          setStatus("Cari seçilmedi.");
          return;
        }
        const customer = (cachedCustomers || []).find((c) => c.id === customerId);
        try {
          const result = await window.mtnApp.updateProposal({
            proposalId: id,
            patch: {
              customerId,
              customerName: customer?.name || ""
            }
          });
          cachedProposals = result.proposals || [];
          setStatus("Teklif cariye atandı.");
          renderOffers(cachedProposals);
        } catch (_) {
          setStatus("Atama sırasında hata oluştu.");
        }
        return;
      }

      if (unassignBtn) {
        const id = unassignBtn.getAttribute("data-offer-unassign");
        if (!id) return;
        if (!window.confirm("Bu teklif cariden kaldırılsın mı?")) return;
        try {
          const result = await window.mtnApp.updateProposal({
            proposalId: id,
            patch: {
              customerId: "",
              customerName: ""
            }
          });
          cachedProposals = result.proposals || [];
          setStatus("Teklif cariden kaldırıldı.");
          renderOffers(cachedProposals);
        } catch (_) {
          setStatus("Kaldırma sırasında hata oluştu.");
        }
        return;
      }
    });
  }
};

const renderStockMovements = (items) => {
  cachedStockMovements = items;
  if (!stockMovementsTable) {
    return;
  }
  stockMovementsTable.innerHTML = "";
  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  sorted.forEach((item) => {
    const row = document.createElement("tr");
    const typeLabel =
      item.type === "giris"
        ? "Giriş"
        : item.type === "cikis"
          ? "Çıkış"
          : item.type || "-";
    row.innerHTML = `
      <td>${new Date(item.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${item.stockName || "-"}</td>
      <td>${typeLabel}</td>
      <td>${Number(item.quantity || 0)}</td>
      <td>${item.note || "-"}</td>
    `;
    stockMovementsTable.appendChild(row);
  });
};

const createReceiptRow = () => {
  const row = document.createElement("tr");
  // assign a unique row id for tracking
  row.dataset.rowId = `row-${receiptRowIdCounter++}`;
  row.innerHTML = `
    <td><input data-field="name" placeholder="Malzeme adı" /></td>
    <td><input data-field="diameter" placeholder="Çap" /></td>
    <td><input data-field="unit" placeholder="Birim" /></td>
    <td><input data-field="quantity" type="number" min="0" step="1" /></td>
    <td><input data-field="purchasePrice" type="number" min="0" step="0.01" /></td>
    <td><input data-field="threshold" type="number" min="0" step="1" /></td>
    <td>
      <button type="button" class="ghost" data-receipt-edit title="Düzenle">✏️</button>
      <button type="button" class="ghost ghost--danger" data-receipt-delete title="Sil">🗑️</button>
    </td>
  `;
  const editBtn = row.querySelector('[data-receipt-edit]');
  const deleteBtn = row.querySelector('[data-receipt-delete]');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // focus on the first input when editing
      const firstInput = row.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    });
  }
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      // if row already saved, mark as cancelled instead of removing
      if (row.dataset.saved === 'true') {
        row.dataset.cancelled = 'true';
        row.classList.add('is-cancelled');
      } else {
        row.remove();
        if (!stockReceiptBody?.children.length) {
          stockReceiptBody?.appendChild(createReceiptRow());
        }
      }
    });
  }
  return row;
};

const createInventoryCountRow = () => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input data-field="name" placeholder="Malzeme adı" list="stock-suggestions" /></td>
    <td><input data-field="unit" placeholder="Birim" /></td>
    <td><input data-field="quantity" type="number" min="0" step="1" /></td>
    <td><input data-field="purchasePrice" type="number" min="0" step="0.01" /></td>
    <td><input data-field="salePrice" type="number" min="0" step="0.01" /></td>
  `;
  const nameInput = row.querySelector("[data-field='name']");
  if (nameInput) {
    nameInput.addEventListener("change", () => {
      const matched = findStockMatch(nameInput.value);
      if (!matched) {
        return;
      }
      const unitInput = row.querySelector("[data-field='unit']");
      const purchaseInput = row.querySelector("[data-field='purchasePrice']");
      const saleInput = row.querySelector("[data-field='salePrice']");
      if (unitInput && !unitInput.value) {
        unitInput.value = matched.unit || "";
      }
      if (purchaseInput && !purchaseInput.value) {
        purchaseInput.value = matched.purchasePrice || "";
      }
      if (saleInput && !saleInput.value) {
        saleInput.value = matched.salePrice || "";
      }
    });
  }
  return row;
};

const renderCustomerJobs = (items, customerId, searchTerm = "") => {
  if (!customerJobsTable) {
    return;
  }
  customerJobsTable.innerHTML = "";
  const normalizedTerm = normalizeText(searchTerm);
  const filtered = (items || []).filter((job) => {
    if (job.customerId !== customerId) {
      return false;
    }
    if (!normalizedTerm) {
      return true;
    }
    const haystack = [job.title, job.note, job.unit, job.createdAt]
      .filter(Boolean)
      .map((value) => normalizeText(value))
      .join(" ");
    return haystack.includes(normalizedTerm);
  });

  filtered.forEach((job) => {
    const isActive = job.isActive !== false;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(job.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${job.title || "-"}</td>
      <td>${Number(job.quantity || 0)}</td>
      <td>${job.unit || "-"}</td>
      <td>${formatCurrency(Number(job.unitPrice || 0))}</td>
      <td>${formatCurrency(Number(job.total || 0))}</td>
      <td>${job.note || "-"}</td>
      <td><span class="badge ${isActive ? "badge--income" : "badge--expense"}">${isActive ? "Aktif" : "Pasif"}</span></td>
      <td>
        <div class="table-actions-inline">
          <button class="ghost ghost--sm" type="button" data-action="job-edit">Düzelt</button>
          <button class="ghost ghost--sm" type="button" data-action="job-toggle">${isActive ? "Pasif Yap" : "Aktif Yap"}</button>
        </div>
      </td>
    `;

    const editBtn = row.querySelector('[data-action="job-edit"]');
    if (editBtn) {
      editBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        // Edit mode
        editingCustomerJobId = job.id || "";
        if (customerJobIdInput) customerJobIdInput.value = editingCustomerJobId;
        try {
          if (customerJobForm) {
            customerJobForm.elements.createdAt.value = (job.createdAt || "").slice(0, 10);
            customerJobForm.elements.title.value = job.title || "";
            customerJobForm.elements.quantity.value = String(job.quantity ?? "");
            customerJobForm.elements.unit.value = job.unit || "";
            customerJobForm.elements.unitPrice.value = String(job.unitPrice ?? "");
            updateJobTotal();
            customerJobForm.elements.note.value = job.note || "";
          }
        } catch (_) {}
        if (customerJobSubmitBtn) customerJobSubmitBtn.textContent = "İş Kalemi Güncelle";
        if (customerJobCancelBtn) customerJobCancelBtn.classList.remove('is-hidden');
        setStatus('İş kalemi düzenleme modunda.');
        try { customerJobForm?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
      });
    }

    const toggleBtn = row.querySelector('[data-action="job-toggle"]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!window.mtnApp?.updateCustomerJob) {
          setStatus('İş kalemi güncelleme servisi yok.');
          return;
        }
        const result = await window.mtnApp.updateCustomerJob({
          id: job.id,
          isActive: !isActive
        });
        cachedCustomerJobs = result.customerJobs || [];
        renderCustomers(result.customers || []);
        renderSummary(result);
        renderCustomerDetail(result);
        refreshCustomerDetailIfOpen(result, customerId);
        refreshAccountingPanels(result);
        setStatus(isActive ? 'İş kalemi pasif yapıldı.' : 'İş kalemi aktif yapıldı.');
      });
    }

    customerJobsTable.appendChild(row);
  });
};

const renderCash = (items) => {
  cachedCashTransactions = items;
  let filtered = items;
  const startValue = cashStartInput?.value;
  const endValue = cashEndInput?.value;
  const typeValue = cashTypeSelect?.value;

  if (startValue) {
    const startDate = new Date(startValue);
    filtered = filtered.filter(
      (item) => new Date(item.createdAt) >= startDate
    );
  }
  if (endValue) {
    const endDate = new Date(endValue);
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((item) => new Date(item.createdAt) <= endDate);
  }
  if (typeValue) {
    filtered = filtered.filter((item) => item.type === typeValue);
  }

  cashTable.innerHTML = "";
  filtered.forEach((item) => {
    const row = document.createElement("tr");
    const badgeClass =
      item.type === "gider" ? "badge badge--expense" : "badge badge--income";
    row.innerHTML = `
      <td>${new Date(item.createdAt).toLocaleDateString("tr-TR")}</td>
      <td><span class="${badgeClass}">${item.type || "-"}</span></td>
      <td>${item.customerName || "-"}</td>
      <td>${item.paymentMethod || "-"}</td>
      <td>${formatCurrency(Number(item.amount) || 0)}</td>
      <td>${item.note || "-"}</td>
    `;
    cashTable.appendChild(row);
  });
};

const renderSales = (items) => {
  cachedSales = items;
  if (!salesTable) {
    return;
  }
  salesTable.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(item.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${item.customerName || "Genel"}</td>
      <td>${formatCurrency(Number(item.total) || 0)}</td>
      <td>${Number(item.vatRate || 0)}</td>
    `;
    salesTable.appendChild(row);
  });
};

const renderCustomerDetail = (data) => {
  if (!detailTable) {
    return;
  }
  const customerId = detailCustomerSelect?.value;
  if (!customerId) {
    detailTable.innerHTML = "";
  if (customerPaymentsTable) {
    customerPaymentsTable.innerHTML = "";
  }
    if (detailSummaryEl) {
      detailSummaryEl.innerHTML = "";
    }
    return;
  }
  const sales = (data.sales || []).filter(
    (sale) => sale.customerId === customerId
  );
  const payments = (data.cashTransactions || []).filter(
    (entry) => entry.customerId === customerId
  );
  const debts = (data.customerDebts || []).filter(
    (entry) => entry.customerId === customerId
  );
  const jobs = (data.customerJobs || []).filter(
    (entry) => entry.customerId === customerId
  );
  const customer = (data.customers || []).find(
    (item) => item.id === customerId
  );
  if (customer?.id) {
    updateSupplierUI(customer.id);
  }
  if (customerDetailSupplierPayment) {
    customerDetailSupplierPayment.classList.toggle(
      "is-hidden",
      customer?.type !== "tedarikci"
    );
  }
  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );
  const totalPayments = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );
  const totalDebts = debts.reduce(
    (sum, debt) => sum + Number(debt.amount || 0),
    0
  );
  const totalJobs = jobs.reduce(
    (sum, job) => sum + Number(job.total || 0),
    0
  );
  const totalItems = sales.reduce((sum, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return (
      sum +
      items.reduce(
        (itemSum, item) => itemSum + Number(item.quantity || 0),
        0
      )
    );
  }, 0);
  const normalizedTerm = normalizeText(detailSearchTerm);
  detailTable.innerHTML = "";
  const entries = [
    ...sales.map((sale) => ({
      createdAt: sale.createdAt,
      type: "Satış",
      amount: Number(sale.total || 0),
      note: "Satış faturası"
    })),
    
    ...jobs.map((job) => ({
      createdAt: job.createdAt,
      type: "İş Kalemi",
      amount: Number(job.total || 0),
      note: job.title || "İş Kalemi",
      method: "-"
    })),
...debts.map((debt) => ({
      createdAt: debt.createdAt,
      type: "Borç",
      amount: Number(debt.amount || 0),
      note: debt.note || "Cari Borç"
    })),
    ...payments.map((payment) => ({
      createdAt: payment.createdAt,
      type: payment.type === "gelir" ? "Tahsilat" : "Ödeme",
      method: payment.paymentMethod || "nakit",
      amount: Number(payment.amount || 0),
      note:
        payment.note ||
        (payment.type === "gelir" ? "Cari Tahsilat" : "Cari Ödeme")
    }))
  ]
    .filter((entry) => {
      if (!normalizedTerm) {
        return true;
      }
      const haystack = [
        entry.type,
        entry.note,
        entry.method,
        entry.createdAt,
        formatCurrency(Number(entry.amount || 0))
      ]
        .filter(Boolean)
        .map((value) => normalizeText(value))
        .join(" ");
      return haystack.includes(normalizedTerm);
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let runningBalance = 0;

  entries.forEach((entry) => {
    const amount = Number(entry.amount || 0);
    const delta = (entry.type === "Tahsilat" || entry.type === "Ödeme") ? -amount : amount;
    runningBalance = runningBalance + delta;
    entry.balanceAfter = runningBalance;

    const row = document.createElement("tr");
    const statusLabel =
      entry.type === "Tahsilat"
        ? "Gelir"
        : entry.type === "Ödeme"
        ? "Gider"
        : "-";
    row.innerHTML = `
      <td>${new Date(entry.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${entry.type}</td>
      <td>${String(entry.method || "-").toUpperCase()}</td>
      <td>${formatCurrency(Number(entry.amount) || 0)}</td>
      <td>${formatCurrency(Number(runningBalance) || 0)}</td>
      <td>${entry.note}</td>
      <td>${statusLabel}</td>
      <td>-</td>
    `;
    detailTable.appendChild(row);
  });

  
  // MTN_LEDGER_TOTAL_ROW
  const sumSales = entries.filter(e => e.type === "Satış").reduce((s,e)=>s+Number(e.amount||0),0);
  const sumJobs = entries.filter(e => e.type === "İş Kalemi").reduce((s,e)=>s+Number(e.amount||0),0);
  const sumDebt = entries.filter(e => e.type === "Borç").reduce((s,e)=>s+Number(e.amount||0),0);
  const sumTahsilat = entries.filter(e => e.type === "Tahsilat").reduce((s,e)=>s+Number(e.amount||0),0);
  const sumOdeme = entries.filter(e => e.type === "Ödeme").reduce((s,e)=>s+Number(e.amount||0),0);
  const net = (sumSales + sumJobs + sumDebt) - (sumTahsilat + sumOdeme);

  const totalRow = document.createElement("tr");
  totalRow.className = "table-total-row";
  totalRow.innerHTML = `
    <td colspan="8">
      GENEL TOPLAM • Satış: <strong>${formatCurrency(sumSales)}</strong> • İş Kalemi: <strong>${formatCurrency(sumJobs)}</strong> •
      Borç: <strong>${formatCurrency(sumDebt)}</strong> • Tahsilat: <strong>${formatCurrency(sumTahsilat)}</strong> •
      Ödeme: <strong>${formatCurrency(sumOdeme)}</strong> • Net Bakiye: <strong>${formatCurrency(net)}</strong>
    </td>
  `;
  detailTable.appendChild(totalRow);
if (customerPaymentsTable) {
  const paymentEntries = entries.filter(
    (entry) => entry.type === "Tahsilat" || entry.type === "Ödeme"
  );
  paymentEntries.forEach((entry) => {
    const row = document.createElement("tr");
    const statusLabel = entry.type === "Tahsilat" ? "Gelir" : "Gider";
    row.innerHTML = `
      <td>${new Date(entry.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>${entry.type}</td>
      <td>${String(entry.method || "-").toUpperCase()}</td>
      <td>${formatCurrency(Number(entry.amount) || 0)}</td>
      <td>${formatCurrency(Number(entry.balanceAfter) || 0)}</td>
      <td>${entry.note}</td>
      <td>${statusLabel}</td>
      <td>-</td>
    `;
    customerPaymentsTable.appendChild(row);
  });

  const sumTahsilat = paymentEntries
    .filter((e) => e.type === "Tahsilat")
    .reduce((s, e) => s + Number(e.amount || 0), 0);
  const sumOdeme = paymentEntries
    .filter((e) => e.type === "Ödeme")
    .reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalRow = document.createElement("tr");
  totalRow.className = "table-total-row";
  totalRow.innerHTML = `
    <td colspan="8">
      ÖDEME ÖZETİ • Tahsilat: <strong>${formatCurrency(sumTahsilat)}</strong> •
      Ödeme: <strong>${formatCurrency(sumOdeme)}</strong>
    </td>
  `;
  customerPaymentsTable.appendChild(totalRow);
}

if (detailTabCountLedgerEl) detailTabCountLedgerEl.textContent = String(entries.length);
if (detailTabCountJobsEl) detailTabCountJobsEl.textContent = String(jobs.length);
if (detailTabCountPaymentsEl)
  detailTabCountPaymentsEl.textContent = String(
    entries.filter((e) => e.type === "Tahsilat" || e.type === "Ödeme").length
  );

if (detailSummaryEl) {
    detailSummaryEl.innerHTML = `
      <div>
        Toplam Satış
        <strong>${formatCurrency(totalSales)}</strong>
      </div>
      <div>
        Toplam İş Kalemi
        <strong>${formatCurrency(totalJobs)}</strong>
      </div>
      <div>
        Toplam Borç (Açılış + İşlem)
        <strong>${formatCurrency(totalDebts)}</strong>
      </div>
      <div>
        Toplam Tahsilat
        <strong>${formatCurrency(payments.filter(p => p.type === "gelir").reduce((s,p)=>s+Number(p.amount||0),0))}</strong>
      </div>
      <div>
        Toplam Ödeme
        <strong>${formatCurrency(payments.filter(p => p.type === "gider").reduce((s,p)=>s+Number(p.amount||0),0))}</strong>
      </div>
      <div>
        Net Bakiye
        <strong>${formatCurrency((totalSales + totalJobs + totalDebts) - (payments.filter(p => p.type === "gelir").reduce((s,p)=>s+Number(p.amount||0),0) + payments.filter(p => p.type === "gider").reduce((s,p)=>s+Number(p.amount||0),0)))}</strong>
      </div>
      <div>
        İş Kalemi Adedi
        <strong>${jobs.length}</strong>
      </div>
      <div>
        Toplam Kalem (Satış)
        <strong>${totalItems}</strong>
      </div>
    `;
  }
  renderCustomerJobs(data.customerJobs || [], customerId, detailSearchTerm);
};

const renderSummary = (data) => {
  if (!summaryCollectionsEl || !summaryCashEl || !summaryBalanceEl) {
    return;
  }
  const cashTransactions = data.cashTransactions || [];
  const totalCollections = cashTransactions
    .filter((item) => item.type === "gelir")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const cashBalance = cashTransactions.reduce((sum, item) => {
    const amount = Number(item.amount || 0);
    return item.type === "gider" ? sum - amount : sum + amount;
  }, 0);
  const totalBalance = (data.customers || []).reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  );
  const totalReceivables = (data.customers || []).reduce((sum, item) => {
    const balance = Number(item.balance || 0);
    return balance > 0 ? sum + balance : sum;
  }, 0);
  const totalStocks = (data.stocks || []).length;
  const lowStocks = (data.stocks || []).filter((item) => {
    const threshold = Number(item.threshold || 0);
    return threshold > 0 && Number(item.quantity || 0) <= threshold;
  });
  const paymentReminders = loadReminders();
  const today = new Date().toISOString().split("T")[0];
  const dueToday = paymentReminders.filter(
    (reminder) => reminder.dueDate === today
  );

  summaryCollectionsEl.textContent = formatCurrency(totalCollections);
  summaryCashEl.textContent = formatCurrency(cashBalance);
  summaryBalanceEl.textContent = formatCurrency(totalBalance);
  renderAssistant(data);

  if (summaryAlertsEl) {
    summaryAlertsEl.innerHTML = "";
    const pendingBalances = (data.customers || [])
      .filter((item) => Number(item.balance || 0) > 0)
      .slice(0, 3);

    lowStocks.slice(0, 3).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `Kritik stok: ${item.name} (${item.quantity || 0})`;
      summaryAlertsEl.appendChild(li);
    });

    pendingBalances.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `Cari bakiye: ${item.name} ${formatCurrency(
        Number(item.balance || 0)
      )}`;
      summaryAlertsEl.appendChild(li);
    });

    if (!summaryAlertsEl.children.length) {
      const li = document.createElement("li");
      li.textContent = "Yeni hatırlatıcı yok.";
      summaryAlertsEl.appendChild(li);
    }
  }

  if (execReceivablesEl) {
    execReceivablesEl.textContent = formatCurrency(totalReceivables);
  }
  if (execCashEl) {
    execCashEl.textContent = formatCurrency(cashBalance);
  }
  if (execStocksEl) {
    execStocksEl.textContent = totalStocks;
  }
  if (execLowStocksEl) {
    execLowStocksEl.textContent = lowStocks.length;
  }
  if (execPaymentsEl) {
    execPaymentsEl.textContent = dueToday.length;
  }
};

const renderAssistantList = (el, items) => {
  if (!el) {
    return;
  }
  el.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "Henüz veri yok.";
    el.appendChild(li);
    return;
  }
  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    el.appendChild(li);
  });
};

const renderAssistant = (data) => {
  if (!assistantDailyEl || !assistantRemindersEl || !assistantSuggestionsEl) {
    return;
  }
  const cashTransactions = data.cashTransactions || [];
  const stockMovements = data.stockMovements || [];
  const totalIncome = cashTransactions
    .filter((item) => item.type === "gelir")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpense = cashTransactions
    .filter((item) => item.type === "gider")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const cashBalance = totalIncome - totalExpense;
  const totalCustomers = (data.customers || []).length;
  const totalStocks = (data.stocks || []).length;
  const totalStockQty = (data.stocks || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const now = Date.now();
  const staleCutoff = now - 90 * DAYS_IN_MS;
  const movementMap = new Map();
  stockMovements.forEach((movement) => {
    const key = normalizeText(movement.stockName || "");
    if (!key || !movement.createdAt) {
      return;
    }
    const date = new Date(movement.createdAt);
    const prev = movementMap.get(key);
    if (!prev || date > prev) {
      movementMap.set(key, date);
    }
  });

  const daily = [
    `Kasa neti: ${formatCurrency(cashBalance)}`,
    `Toplam cari: ${totalCustomers}`,
    `Toplam stok kartı: ${totalStocks}`,
    `Depo toplam adedi: ${totalStockQty}`
  ];

  const lowStocks = (data.stocks || []).filter((item) => {
    const threshold = Number(item.threshold || 0);
    return threshold > 0 && Number(item.quantity || 0) <= threshold;
  });
  const overdueCustomers = (data.customers || [])
    .map((item) => ({
      ...item,
      dueDate: getCustomerDueDate(item)
    }))
    .filter(
      (item) =>
        Number(item.balance || 0) > 0 &&
        item.dueDate &&
        item.dueDate.getTime() < now
    )
    .sort((a, b) => a.dueDate - b.dueDate);
  const staleStocks = (data.stocks || []).filter((item) => {
    const qty = Number(item.quantity || 0);
    if (qty <= 0) {
      return false;
    }
    const key = normalizeText(item.normalizedName || item.name || "");
    if (!key) {
      return false;
    }
    const lastMove = movementMap.get(key);
    if (!lastMove) {
      return true;
    }
    return lastMove.getTime() < staleCutoff;
  });
  const pendingBalances = (data.customers || [])
    .filter((item) => Number(item.balance || 0) > 0)
    .slice(0, 5);
  const negativeStocks = (data.stocks || []).filter(
    (item) => Number(item.quantity || 0) < 0
  );
  const inactiveWithBalance = (data.customers || [])
    .filter((item) => item.isActive === false && Number(item.balance || 0) !== 0)
    .slice(0, 5);

  const reminders = [
    ...lowStocks.slice(0, 5).map(
      (item) => `Kritik stok: ${item.name} (${item.quantity || 0})`
    ),
    ...negativeStocks.slice(0, 3).map(
      (item) => `Negatif stok: ${item.name} (${item.quantity || 0})`
    ),
    ...overdueCustomers.slice(0, 4).map((item) => {
      const dueLabel = item.dueDate
        ? item.dueDate.toLocaleDateString("tr-TR")
        : "-";
      return `Vadesi geçen cari: ${item.name} (${dueLabel})`;
    }),
    ...staleStocks.slice(0, 4).map(
      (item) => `Hareketsiz stok: ${item.name} (${item.quantity || 0})`
    ),
    ...pendingBalances.map(
      (item) => `Tahsilat bekleyen cari: ${item.name} (${formatCurrency(
        Number(item.balance || 0)
      )})`
    )
  ];
  reminders.push(
    ...inactiveWithBalance.map(
      (item) => `Pasif cari bakiyesi: ${item.name} (${formatCurrency(
        Number(item.balance || 0)
      )})`
    )
  );
  const paymentReminders = loadReminders().slice(0, 5).map(
    (item) => `Ödeme: ${item.title} (${getReminderLabel(item)})`
  );
  reminders.push(...paymentReminders);

  const suggestions = [];
  if (!currentSettings.enableAutoBackup) {
    suggestions.push("Otomatik yedeklemeyi aktif ederek veri güvenliğini artırın.");
  }
  if (cashBalance < 0) {
    suggestions.push("Kasa bakiyesi negatif. Gider planı ve tahsilat takibini sıklaştırın.");
  }
  if (overdueCustomers.length) {
    suggestions.push(
      `Vadesi geçmiş ${overdueCustomers.length} cari var. Tahsilat planı oluşturun.`
    );
  }
  if (staleStocks.length) {
    suggestions.push(
      `Hareket görmeyen ${staleStocks.length} stok kartı var. Devir/indirim planı yapın.`
    );
  }
  if (negativeStocks.length) {
    suggestions.push(
      `Negatif stok (${negativeStocks.length}) bulundu. Depo hareketlerini kontrol edin.`
    );
  }
  if (inactiveWithBalance.length) {
    suggestions.push("Pasif carilerde bakiye var. Hesap durumlarını netleştirin.");
  }
  if (!lowStocks.length && totalStocks > 0) {
    suggestions.push("Kritik stok yok, periyodik sayım raporu almayı unutmayın.");
  }
  if (totalCustomers === 0) {
    suggestions.push("Cari kartlarınızı ekleyerek tahsilat akışını yönetin.");
  }
  if (!suggestions.length) {
    suggestions.push("Tüm modüller güncel görünüyor. Raporları düzenli alın.");
  }

  renderAssistantList(assistantDailyEl, daily);
  renderAssistantList(assistantRemindersEl, reminders);
  renderAssistantList(assistantSuggestionsEl, suggestions);
  renderAssistantList(assistantDockDailyEl, daily);
  renderAssistantList(assistantDockRemindersEl, reminders);

  if (assistantStatusEl) {
    assistantStatusEl.textContent = `Son güncelleme: ${new Date().toLocaleString(
      "tr-TR"
    )}`;
  }
};

const loadInitialData = async () => {
  if (!window.mtnApp?.getData) {
    return;
  }
  const data = await window.mtnApp.getData();
  renderKpis(data);

  renderCustomers(data.customers || []);
  try { renderTimesheet(data); } catch (_) {}

  renderStocks(data.stocks || []);
  renderStockList(data.stocks || []);
  renderCash(data.cashTransactions || []);
  renderSales(data.sales || []);
  renderStockMovements(data.stockMovements || []);
  renderAccounts(data.accounts || []);
  renderLedgerEntries(data.ledgerEntries || []);
  renderUnitConversions(data.unitConversions || []);
  renderAuditLogs(data.auditLogs || []);
  cachedCustomerDebts = data.customerDebts || [];
  cachedCustomerJobs = data.customerJobs || [];
  cachedStockReceipts = data.stockReceipts || [];
  cachedInvoices = data.invoices || [];
  renderSummary(data);
  renderCustomerDetail(data);
  renderStockReceipts(data.stockReceipts || []);
  renderInvoices(data.invoices || []);
  renderOffers(data.proposals || []);
};

const readLogoFile = (file) =>
  new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.readAsDataURL(file);
  });

const setTodayDate = () => {
  const today = new Date().toISOString().split("T")[0];
  if (cashDateInput) {
    cashDateInput.value = today;
  }
  if (stockMovementDateInput) {
    stockMovementDateInput.value = today;
  }
  if (stockCreatedAtInput) {
    stockCreatedAtInput.value = today;
  }
  if (stockReceiptDateInput) {
    stockReceiptDateInput.value = today;
  }
  if (customerJobDateInput) {
    customerJobDateInput.value = today;
  }
  if (customerTransactionDateInput) {
    customerTransactionDateInput.value = today;
  }
  if (invoiceDateInput) {
    invoiceDateInput.value = today;
  }
  if (inventoryCountDate) {
    inventoryCountDate.value = today;
  }
  if (offerDateInput) {
    offerDateInput.value = today;
  }
  if (offerDateIndustrial) {
    offerDateIndustrial.value = today;
  }
};

const buildLocalCode = (prefix) => {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
  const random = Math.floor(Math.random() * 900 + 100);
  return `${prefix}-${stamp}-${random}`;
};

const setAutoCodes = () => {
  if (customerForm?.elements?.code) {
    // Cari kodu otomatik (UST / MALZMCİ / CARİ)
    if (window.MTN?.Codes) {
      const type = String(customerForm.elements.type?.value || "musteri");
      try { customerForm.elements.code.readOnly = false; } catch (_) {}
      // Düzenleme modunda (editingCustomerId dolu) mevcut kodu zorla değiştirmeyelim.
      const cur = String(customerForm.elements.code.value || "").trim();
      if (!editingCustomerId && !cur) {
        customerForm.elements.code.value = window.MTN.Codes.nextCariCode(type, cachedCustomers, editingCustomerId);
      }
    } else {
      customerForm.elements.code.value = buildLocalCode("CAR");
    }
  }
  if (stockForm?.elements?.code) {
    stockForm.elements.code.value = buildLocalCode("STK");
  }
};

const initApp = async () => {
  if (!window.mtnApp?.getSettings) {
    return;
  }
  const settings = await window.mtnApp.getSettings();
  currentSettings = settings;
  applyBranding(settings);
  applyTheme(settings);
  if (settings.users?.length) {
    users = normalizeUsers(settings.users);
  }
  if (!settings.users?.length) {
    users = normalizeUsers(users);
  }
  renderUsers(users);
  if (stockReceiptWarehouseSelect) {
    stockReceiptWarehouseSelect.value =
      settings.defaultWarehouse || "Ana Depo";
  }
  if (stockImportWarehouseSelect) {
    stockImportWarehouseSelect.value =
      settings.defaultWarehouse || "Ana Depo";
  }
  if (licenseKeyInput) {
    licenseKeyInput.value = settings.licenseKey || "";
  }
  if (companyNameInput) {
    companyNameInput.value = settings.companyName || "";
  }
  if (companyOwnerInput) {
    companyOwnerInput.value = settings.companyOwner || "";
  }
  if (companyTaxOfficeInput) {
    companyTaxOfficeInput.value = settings.taxOffice || "";
  }
  if (companyTaxNumberInput) {
    companyTaxNumberInput.value = settings.taxNumber || "";
  }
  if (companyPhoneInput) {
    companyPhoneInput.value = settings.companyPhone || "";
  }
  if (companyIbanInput) {
    companyIbanInput.value = settings.companyIban || "";
  }
  if (companyBankInput) {
    companyBankInput.value = settings.companyBank || "";
  }
  if (companyAddressInput) {
    companyAddressInput.value = settings.companyAddress || "";
  }
  if (autoSyncPathInput) {
    autoSyncPathInput.value = settings.autoSyncPath || "";
  }
  if (autoSyncEnabledSelect) {
    autoSyncEnabledSelect.value = String(settings.enableAutoSync);
  }
  if (cloudBackupPathInput) {
    cloudBackupPathInput.value = settings.cloudBackupPath || "";
  }
  if (cloudBackupEnabledSelect) {
    cloudBackupEnabledSelect.value = String(settings.enableCloudBackup);
  }
  if (autoBackupEnabledSelect) {
    autoBackupEnabledSelect.value = String(settings.enableAutoBackup);
  }
  if (stockValuationSelect) {
    stockValuationSelect.value = settings.stockValuationMethod || "ortalama";
  }
  if (autoUpdateToggle) {
    autoUpdateToggle.checked = settings.autoUpdateEnabled !== false;
  }
  if (tourEnabledToggle) {
    tourEnabledToggle.checked = settings.enableTour !== false;
  }
  if (helpMenuWrap) {
    helpMenuWrap.classList.toggle(
      "is-hidden",
      settings.enableTour === false
    );
  }
  if (tourStatusEl) {
    tourStatusEl.textContent =
      settings.enableTour === false
        ? "Tur özelliği pasif."
        : "Tur özelliği aktif.";
  }
  if (updateStatusEl) {
    updateStatusEl.textContent = settings.autoUpdateLastCheckedAt
      ? `Son kontrol: ${new Date(settings.autoUpdateLastCheckedAt).toLocaleString("tr-TR")}`
      : "Henüz kontrol edilmedi.";
  }
  if (periodYearInput) {
    periodYearInput.value = settings.currentPeriodYear || new Date().getFullYear();
  }
  if (lastAutoBackupEl) {
    lastAutoBackupEl.textContent = settings.lastAutoBackupAt
      ? new Date(settings.lastAutoBackupAt).toLocaleString("tr-TR")
      : "Henüz yok";
  }
  if (settings.hasOnboarded && loginScreen && appShell) {
    try {
      const rememberedUser = localStorage.getItem("mtn-last-user");
      const matchedUser = users.find((user) => user.username === rememberedUser);
      if (matchedUser) {
        appShell.classList.remove("app--hidden");
        hideLoginScreen();
        applyUserProfile(matchedUser);
        applyRoleAccess(matchedUser?.role);
      }
    } catch (error) {
      // ignore localStorage errors
    }
  }
  setTodayDate();
  setAutoCodes();
  setCustomerWorkspace("list");

  if (!settings.hasOnboarded && onboardingWizard) {
    firstRunScreen?.classList.add("first-run--hidden");
    loginScreen.style.display = "none";
    loginScreen.classList.remove("login--ready", "login--leaving");
    if (onboardingCompanyName) onboardingCompanyName.value = settings.companyName || "";
    if (onboardingCompanyPhone) onboardingCompanyPhone.value = settings.companyPhone || "";
    if (onboardingCompanyAddress) onboardingCompanyAddress.value = settings.companyAddress || "";
    if (onboardingTaxNumber) onboardingTaxNumber.value = settings.taxNumber || "";
    if (onboardingPeriodYear) onboardingPeriodYear.value = settings.currentPeriodYear || new Date().getFullYear();
    if (onboardingAutoBackup) onboardingAutoBackup.value = String(settings.enableAutoBackup ?? true);
    if (onboardingBackupFolder) onboardingBackupFolder.value = settings.backupFolder || "";
    openOnboardingWizard(settings.onboardingStep || 1);
  }
};

const buildDocNo = (prefix, dateValue = new Date()) => {
  const date = new Date(dateValue);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const datePart = safeDate.toISOString().slice(0, 10).replace(/-/g, "");
  const timePart = safeDate.toISOString().slice(11, 16).replace(":", "");
  return `${prefix}-${datePart}${timePart}`;
};

const buildReportTable = (title, headers, rows, options = {}) => {
  const headerCells = headers.map((header) => `<th>${header}</th>`).join("");
  const rowHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(cell)}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const { includeWatermark = false } = options;
  const reportDateValue = options.reportDate || new Date();
  const reportDate = new Date(reportDateValue).toLocaleString("tr-TR");
  const reportNo = options.docNo || buildDocNo("RPR", reportDateValue);
  const companyName = currentSettings.companyName || "MTN Enerji";
  const taxOffice = currentSettings.taxOffice || "Vergi Dairesi";
  const taxNumber = currentSettings.taxNumber || "0000000000";
  const logoSrc = currentSettings.logoDataUrl || "";
  const logoHtml = logoSrc
    ? `<img class="report-logo-img" src="${logoSrc}" alt="Firma logosu" />`
    : `<div class="report-logo">MTN</div>`;
  const companyHtml = `
    <div class="report-frame">
      <div class="report-header">
        <div class="report-logo-block">${logoHtml}</div>
        <div class="report-meta">
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(companyName)}</p>
          <p>Vergi Dairesi: ${escapeHtml(taxOffice)} • Vergi No: ${escapeHtml(
            taxNumber
          )}</p>
          <p>Belge No: ${escapeHtml(reportNo)}</p>
          <p>Rapor Tarihi: ${escapeHtml(reportDate)}</p>
        </div>
      </div>
  `;
  const watermark = includeWatermark
    ? `<div class="report-watermark">${
        logoSrc
          ? `<img src="${logoSrc}" alt="Firma logosu" />`
          : escapeHtml(companyName)
      }</div>`
    : "";
  return `
    ${companyHtml}
      ${watermark}
      <table>
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${rowHtml}</tbody>
      </table>
    </div>
  `;
};

const buildInvoiceHtml = (title, rows, meta = {}) => {
  const rowHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(cell)}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const reportDateValue = meta.reportDate || new Date();
  const reportDate = new Date(reportDateValue).toLocaleString("tr-TR");
  const reportNo = meta.docNo || buildDocNo("SAT", reportDateValue);
  const companyName = currentSettings.companyName || "MTN Enerji";
  const taxOffice = currentSettings.taxOffice || "Vergi Dairesi";
  const taxNumber = currentSettings.taxNumber || "0000000000";
  const logoSrc = currentSettings.logoDataUrl || "";
  const logoHtml = logoSrc
    ? `<img class="report-logo-img" src="${logoSrc}" alt="Firma logosu" />`
    : `<div class="report-logo">MTN</div>`;
  return `
    <div class="report-frame">
      <div class="report-header">
        <div class="report-logo-block">${logoHtml}</div>
        <div class="report-meta">
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(companyName)}</p>
          <p>Vergi Dairesi: ${escapeHtml(taxOffice)} • Vergi No: ${escapeHtml(
            taxNumber
          )}</p>
          <p>Belge No: ${escapeHtml(reportNo)}</p>
          <p>Tarih: ${escapeHtml(reportDate)}</p>
        </div>
      </div>
      <div class="report-watermark">${
        logoSrc ? `<img src="${logoSrc}" alt="Firma logosu" />` : escapeHtml(companyName)
      }</div>
      <table>
        <thead>
          <tr>
            <th>Malzeme</th>
            <th>Miktar</th>
            <th>Birim</th>
            <th>Birim Fiyat</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>${rowHtml}</tbody>
      </table>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <table style="width:260px;border-collapse:collapse;">
          <tr><td>Ara Toplam</td><td style="text-align:right;">${escapeHtml(
            subtotalEl.textContent
          )}</td></tr>
          <tr><td>KDV</td><td style="text-align:right;">${escapeHtml(
            vatTotalEl.textContent
          )}</td></tr>
          <tr><td><strong>Genel Toplam</strong></td><td style="text-align:right;"><strong>${escapeHtml(
            totalEl.textContent
          )}</strong></td></tr>
        </table>
      </div>
    </div>
  `;
};

const buildReceiptHtml = ({
  customerName,
  amount,
  paymentMethod,
  note,
  createdAt,
  title,
  docNo
}) => {
  const reportDateValue = createdAt || new Date();
  const reportDate = new Date(reportDateValue).toLocaleString("tr-TR");
  const reportNo = docNo || buildDocNo("MKZ", reportDateValue);
  const companyName = currentSettings.companyName || "MTN Enerji";
  const taxOffice = currentSettings.taxOffice || "Vergi Dairesi";
  const taxNumber = currentSettings.taxNumber || "0000000000";
  const logoSrc = currentSettings.logoDataUrl || "";
  const logoHtml = logoSrc
    ? `<img class="report-logo-img" src="${logoSrc}" alt="Firma logosu" />`
    : `<div class="report-logo">MTN</div>`;
  return `
    <div class="report-frame">
      <div class="report-header">
        <div class="report-logo-block">${logoHtml}</div>
        <div class="report-meta">
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(companyName)}</p>
          <p>Vergi Dairesi: ${escapeHtml(taxOffice)} • Vergi No: ${escapeHtml(
            taxNumber
          )}</p>
          <p>Belge No: ${escapeHtml(reportNo)}</p>
          <p>Tarih: ${escapeHtml(reportDate)}</p>
        </div>
      </div>
      <table>
        <tbody>
          <tr><th>İşlem Tarihi</th><td>${escapeHtml(reportDate)}</td></tr>
          <tr><th>Cari</th><td>${escapeHtml(customerName || "-")}</td></tr>
          <tr><th>Ödeme Türü</th><td>${escapeHtml(paymentMethod || "-")}</td></tr>
          <tr><th>Tutar</th><td>${escapeHtml(formatCurrency(amount))}</td></tr>
          <tr><th>Açıklama</th><td>${escapeHtml(note || "-")}</td></tr>
        </tbody>
      </table>
    </div>
  `;
};

const buildOfferHtml = (title, rows, totals) => {
  const rowHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(cell)}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const companyName = currentSettings.companyName || "MTN Enerji";
  const taxOffice = currentSettings.taxOffice || "Vergi Dairesi";
  const taxNumber = currentSettings.taxNumber || "0000000000";
  const logoSrc = currentSettings.logoDataUrl || "";
  const companyOwner = currentSettings.companyOwner || "";
  const companyPhone = currentSettings.companyPhone || "";
  const companyAddress = currentSettings.companyAddress || "";
  const companyIban = currentSettings.companyIban || "";
  const logoHtml = logoSrc
    ? `<img class="report-logo-img report-logo-img--mono" src="${logoSrc}" alt="Firma logosu" />`
    : `<div class="report-logo">MTN</div>`;
  return `
    <div class="report-frame">
      <div class="report-header report-header--offer">
        <div class="report-logo-block">${logoHtml}</div>
        <div class="report-meta">
          <h1>${escapeHtml(companyName)}</h1>
          <p>${escapeHtml(title)}</p>
          <p><strong>Teklif No:</strong> ${escapeHtml(totals.offerNo || "-")}</p>
          <p><strong>İrsaliye No:</strong> ${escapeHtml(totals.waybillNo || "-")}</p>
          <p><strong>Tarih:</strong> ${escapeHtml(totals.offerDate || "-")}</p>
          <p><strong>Cari:</strong> ${escapeHtml(totals.customerName || "Genel")}</p>

          <p><strong>Vergi Dairesi:</strong> ${escapeHtml(taxOffice)}</p>
          <p><strong>Vergi No:</strong> ${escapeHtml(taxNumber)}</p>
          <p><strong>Yetkili:</strong> ${escapeHtml(companyOwner || "-")}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(companyPhone || "-")}</p>
          <p><strong>IBAN:</strong> ${escapeHtml(companyIban || "-")}</p>
          <p><strong>Adres:</strong> ${escapeHtml(companyAddress || "-")}</p>
        </div>
      </div>
      <div class="report-watermark">${
        logoSrc ? `<img src="${logoSrc}" alt="Firma logosu" />` : escapeHtml(companyName)
      }</div>
      <table>
        <thead>
          <tr>
            <th>Malzeme</th>
            <th>Miktar</th>
            <th>Birim</th>
            <th>Birim Fiyat</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>${rowHtml}</tbody>
      </table>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <table style="width:260px;border-collapse:collapse;">
          <tr><td>Ara Toplam</td><td style="text-align:right;">${escapeHtml(
            totals.subtotal
          )}</td></tr>
          <tr><td>KDV</td><td style="text-align:right;">${escapeHtml(
            totals.vat
          )}</td></tr>
          <tr><td><strong>Genel Toplam</strong></td><td style="text-align:right;"><strong>${escapeHtml(
            totals.total
          )}</strong></td></tr>
        </table>
      </div>
    </div>
  `;
};


const buildCustomerFullReportHtml = (customerName, ledgerRows, jobRows, totals) => {
  const companyName = currentSettings.companyName || "MTN Enerji";
  const taxOffice = currentSettings.taxOffice || "Vergi Dairesi";
  const taxNumber = currentSettings.taxNumber || "0000000000";
  const logoSrc = currentSettings.logoDataUrl || "";
  const reportDate = new Date();
  const reportNo = buildDocNo("CARI", reportDate);
  const logoHtml = logoSrc
    ? `<img class="report-logo-img" src="${logoSrc}" alt="Firma logosu" />`
    : `<div class="report-logo">MTN</div>`;
  const watermark = logoSrc
    ? `<div class="report-watermark"><img src="${logoSrc}" alt="Firma logosu" /></div>`
    : `<div class="report-watermark">${escapeHtml(companyName)}</div>`;

  const ledgerHeader = ["Tarih", "Tür", "Ödeme Türü", "Tutar", "Bakiye", "Açıklama"];
  const jobHeader = ["Tarih", "İş Kalemi", "Miktar", "Birim", "Birim Fiyat", "Tutar", "Açıklama"];

  const mkTable = (headers, rows) => {
    const th = headers.map(h => `<th>${h}</th>`).join("");
    const tr = (rows || []).map(r => `<tr>${r.map(c => `<td>${escapeHtml(String(c))}</td>`).join("")}</tr>`).join("");
    return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
  };

  return `
    <div class="report-frame">
      <div class="report-header">
        ${logoHtml}
        <div class="report-company">
          <h1>${escapeHtml(companyName)}</h1>
          <p>${escapeHtml(customerName)}</p>
          <p>Vergi Dairesi: ${escapeHtml(taxOffice)} • Vergi No: ${escapeHtml(taxNumber)}</p>
          <p>Belge No: ${escapeHtml(reportNo)}</p>
          <p>${reportDate.toLocaleString("tr-TR")}</p>
        </div>
      </div>
      ${watermark}

      <h2 style="margin:14px 0 10px 0;">Cari Ekstre</h2>
      ${mkTable(ledgerHeader, ledgerRows)}

      <div style="margin-top:18px;"></div>
      <h2 style="margin:14px 0 10px 0;">İş Kalemleri</h2>
      ${mkTable(jobHeader, jobRows)}

      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <table style="width:340px;border-collapse:collapse;">
          <tr><td>Toplam Satış</td><td style="text-align:right;">${escapeHtml(totals.sales)}</td></tr>
          <tr><td>Toplam İş Kalemi</td><td style="text-align:right;">${escapeHtml(totals.jobs || "-")}</td></tr>
          <tr><td>Toplam Borç</td><td style="text-align:right;">${escapeHtml(totals.debt)}</td></tr>
          <tr><td>Toplam Tahsilat</td><td style="text-align:right;">${escapeHtml(totals.collect)}</td></tr>
          <tr><td>Toplam Ödeme</td><td style="text-align:right;">${escapeHtml(totals.pay)}</td></tr>
          <tr><td><strong>Net Bakiye</strong></td><td style="text-align:right;"><strong>${escapeHtml(totals.net)}</strong></td></tr>
        </table>
      </div>
    </div>
  `;
};

const buildCustomerJobsInvoiceHtml = (customerName, jobs, totals) => {
  const rowHtml = jobs
    .map(
      (job) =>
        `<tr>
          <td>${escapeHtml(job.title)}</td>
          <td>${escapeHtml(job.quantity)}</td>
          <td>${escapeHtml(job.unit)}</td>
          <td>${escapeHtml(job.unitPrice)}</td>
          <td>${escapeHtml(job.total)}</td>
        </tr>`
    )
    .join("");
  const companyName = currentSettings.companyName || "MTN Enerji";
  const taxOffice = currentSettings.taxOffice || "Vergi Dairesi";
  const taxNumber = currentSettings.taxNumber || "0000000000";
  const reportDate = new Date();
  const reportNo = buildDocNo("IS", reportDate);
  const logoSrc = currentSettings.logoDataUrl || "";
  const logoHtml = logoSrc
    ? `<img class="report-logo-img" src="${logoSrc}" alt="Firma logosu" />`
    : `<div class="report-logo">MTN</div>`;
  const watermark = logoSrc
    ? `<div class="report-watermark"><img src="${logoSrc}" alt="Firma logosu" /></div>`
    : `<div class="report-watermark">${escapeHtml(companyName)}</div>`;
  return `
    <div class="report-frame">
      <div class="report-header">
        <div class="report-logo-block">${logoHtml}</div>
        <div class="report-meta">
          <h1>${escapeHtml(customerName)} - Cari Ekstre</h1>
          <p>${escapeHtml(companyName)}</p>
          <p>Vergi Dairesi: ${escapeHtml(taxOffice)} • Vergi No: ${escapeHtml(
            taxNumber
          )}</p>
          <p>Belge No: ${escapeHtml(reportNo)}</p>
          <p>Tarih: ${escapeHtml(reportDate.toLocaleString("tr-TR"))}</p>
        </div>
      </div>
      ${watermark}
      <table>
        <thead>
          <tr>
            <th>İş Kalemi</th>
            <th>Miktar</th>
            <th>Birim</th>
            <th>Birim Fiyat</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>${rowHtml}</tbody>
      </table>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <table style="width:260px;border-collapse:collapse;">
          <tr><td>İş Kalemleri Toplamı</td><td style="text-align:right;">${escapeHtml(
            totals.jobsTotal
          )}</td></tr>
          <tr><td>Tahsilat Toplamı</td><td style="text-align:right;">${escapeHtml(
            totals.paymentsTotal
          )}</td></tr>
          <tr><td><strong>Genel Bakiye</strong></td><td style="text-align:right;"><strong>${escapeHtml(
            totals.balanceTotal
          )}</strong></td></tr>
        </table>
      </div>
    </div>
  `;
};

const handleReportResult = (result, statusEl, label = "Rapor") => {
  if (!result) {
    return false;
  }
  if (result.error) {
    const message = `${label} oluşturulamadı.`;
    if (statusEl) {
      statusEl.textContent = message;
    }
    setStatus(message);
    console.error("PDF oluşturma hatası:", result.error);
    return false;
  }
  if (statusEl && result.reportFile) {
    statusEl.textContent = `Rapor kaydedildi: ${result.reportFile}`;
  }
  return true;
};

const generateReport = async (type) => {
  if (!window.mtnApp?.getData || !window.mtnApp?.generateReport) {
    reportPathEl.textContent = "Rapor servisi hazır değil.";
    return;
  }
  const data = await window.mtnApp.getData();
  let title = "";
  let headers = [];
  let rows = [];

  if (type === "customers") {
    title = "Cari Ekstre";
    headers = ["Kod", "Ünvan", "Telefon", "Vergi No", "E-posta", "Bakiye"];
    rows = (data.customers || []).map((item) => [
      item.code || "-",
      item.name || "-",
      item.phone || "-",
      item.taxNumber || "-",
      item.email || "-",
      formatCurrency(Number(item.balance) || 0)
    ]);
  }

  if (type === "stocks") {
    title = "Stok Raporu";
    headers = ["Kod", "Malzeme", "Çap", "Birim", "Stok", "Kritik Seviye"];
    rows = (data.stocks || []).map((item) => [
      item.code || "-",
      item.normalizedName || item.name || "-",
      item.diameter || "-",
      item.unit || "-",
      item.quantity || 0,
      item.threshold || 0
    ]);
  }

  if (type === "cash") {
    title = "Satış Raporu";
    headers = ["Tarih", "Cari", "Tutar", "KDV (%)"];
    rows = (data.sales || []).map((item) => [
      new Date(item.createdAt).toLocaleDateString("tr-TR"),
      item.customerName || "Genel",
      formatCurrency(Number(item.total) || 0),
      Number(item.vatRate || 0)
    ]);
  }

  if (type === "stock-movements") {
    title = "Stok Hareket Raporu";
    headers = ["Tarih", "Malzeme", "Tür", "Miktar", "Açıklama"];
    rows = (data.stockMovements || []).map((item) => [
      new Date(item.createdAt).toLocaleDateString("tr-TR"),
      item.stockName || "-",
      item.type || "-",
      Number(item.quantity || 0),
      item.note || "-"
    ]);
  }

  if (type === "cash-summary") {
    title = "Kasa Özet Raporu";
    const totalIncome = (data.cashTransactions || [])
      .filter((item) => item.type === "gelir")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalExpense = (data.cashTransactions || [])
      .filter((item) => item.type === "gider")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const net = totalIncome - totalExpense;
    headers = ["Kalem", "Tutar"];
    rows = [
      ["Toplam Gelir", formatCurrency(totalIncome)],
      ["Toplam Gider", formatCurrency(totalExpense)],
      ["Net", formatCurrency(net)]
    ];
  }

  if (type === "customer-balance") {
    title = "Borçlular Listesi";
    headers = ["Cari Adı", "Borç", "Alacak", "Net"];
    const balances = (data.customers || []).map((customer) => {
      const balance = Number(customer.balance || 0);
      return [
        customer.name || "-",
        balance > 0 ? formatCurrency(balance) : formatCurrency(0),
        balance < 0 ? formatCurrency(Math.abs(balance)) : formatCurrency(0),
        formatCurrency(balance)
      ];
    });
    const totalNet = (data.customers || []).reduce(
      (sum, customer) => sum + Number(customer.balance || 0),
      0
    );
    rows = [
      ...balances,
      ["GENEL TOPLAM", "-", "-", formatCurrency(totalNet)]
    ];
  }

  const html = buildReportTable(title, headers, rows, {
    includeWatermark:
      type === "customers" || type === "cash" || type === "customer-balance"
  });
  const result = await window.mtnApp.generateReport({ title, html });
  const ok = handleReportResult(result, reportPathEl, title);
  if (ok) {
    await window.mtnApp?.openFile?.(result.reportFile);
  }
};

if (customerForm) {
  enforceOpeningBalanceRules();
  customerForm.elements.type?.addEventListener("change", enforceOpeningBalanceRules);
  customerForm.elements.openingDebt?.addEventListener("input", enforceOpeningBalanceRules);
  customerForm.elements.openingCredit?.addEventListener("input", enforceOpeningBalanceRules);
  customerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(customerForm);
    const payload = Object.fromEntries(formData.entries());

// MTN: Kod format + unique + müşteri varsayılan vade
try {
  if (window.MTN?.Codes) {
    let okFormat = window.MTN.Codes.validateCariCode(payload.type, payload.code);
    if (!okFormat) {
      // Kod boş/yanlışsa otomatik düzelt (kullanıcıyı bloklamasın)
      try {
        const fixed = window.MTN.Codes.nextCariCode(payload.type, cachedCustomers, editingCustomerId);
        payload.code = fixed;
        try { customerForm.elements.code.value = fixed; } catch (_) {}
        okFormat = true;
      } catch (_) {}
    }
    if (!okFormat) {
      window.MTN.Toast ? window.MTN.Toast.warn("Cari kod formatı hatalı. Örn: CARİ0001 / MALZMCİ0001 / UST0001") : setStatus("Cari kod formatı hatalı.");
      return;
    }

    // Benzersizlik: gerekiyorsa otomatik bir sonraki boş kodu üret
    let okUniqueLocal = window.MTN.Codes.ensureUnique(payload.code, cachedCustomers, editingCustomerId);
    let guard = 0;
    while (!okUniqueLocal && guard < 50) {
      const fixed2 = window.MTN.Codes.nextCariCode(payload.type, cachedCustomers, editingCustomerId);
      payload.code = fixed2;
      try { customerForm.elements.code.value = fixed2; } catch (_) {}
      okUniqueLocal = window.MTN.Codes.ensureUnique(payload.code, cachedCustomers, editingCustomerId);
      guard++;
    }
    const okUnique = okUniqueLocal;
    if (!okUnique) {
      window.MTN.Toast ? window.MTN.Toast.warn("Cari kodu benzersiz olmalı. Bu kod zaten var.") : setStatus("Cari kodu zaten var.");
      return;
    }
  }
  if (window.MTN?.Rules) {
    const t = window.MTN.Rules.normalizeCariType(payload.type);
    if (t === "musteri" && (!payload.dueDays || Number(payload.dueDays) === 0)) {
      payload.dueDays = window.MTN.Rules.getDefaultDueDays();
    }
  }
} catch (_) {}
    const normalizedName = normalizeText(payload.name);
    const hasDuplicate = cachedCustomers.some(
      (customer) =>
        normalizeText(customer.name) === normalizedName &&
        customer.id !== editingCustomerId
    );
    if (hasDuplicate) {
      setStatus("Bu cari daha önce eklenildi.");
      return;
    }
    if (editingCustomerId && window.mtnApp?.updateCustomer) {
      await window.mtnApp.updateCustomer({
        customerId: editingCustomerId,
        ...payload
      });
      editingCustomerId = "";
      const data = await window.mtnApp.getData();
      renderCustomers(data.customers || []);
      renderSummary(data);
      refreshAccountingPanels(data);
      customerForm.reset();
      setAutoCodes();
      setStatus("Cari güncellendi.")
    try { forceKeyboardFocus("customers-panel"); } catch (_) {};
      if (returnToListAfterSave) {
        setCustomerWorkspace("list");
        returnToListAfterSave = false;
      }
    } else {
      await window.mtnApp.createCustomer(payload);
      const data = await window.mtnApp.getData();
      renderCustomers(data.customers || []);
      renderSummary(data);
      refreshAccountingPanels(data);
      customerForm.reset();
      setAutoCodes();
      setStatus("Cari kaydedildi.")
    try { forceKeyboardFocus("customers-panel"); } catch (_) {};
      if (returnToListAfterSave) {
        setCustomerWorkspace("list");
        returnToListAfterSave = false;
      }
    }
  });
}

if (customerTransactionForm) {
  customerTransactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createCustomerTransaction) {
      setStatus("Cari işlem servisi hazır değil.");
      returnToListAfterAction = "";
      return;
    }
    const formData = new FormData(customerTransactionForm);
    const payload = Object.fromEntries(formData.entries());
    const customerId = transactionCustomerSelect?.value || "";
    if (!customerId) {
      setStatus("Lütfen cari seçin.");
      returnToListAfterAction = "";
      return;
    }
    
// MTN: Cari para akışı kuralı (müşteri=tahsilat, tedarikçi/usta=ödeme)
try {
  const cust = (cachedCustomers || []).find((c) => c.id === customerId) || {};
  const cariType = String(cust.type || "musteri");
  if (window.MTN?.Rules) {
    const ok = window.MTN.Rules.guardTransaction(cariType, payload.type);
    if (!ok) {
      returnToListAfterAction = "";
      return;
    }
  }
} catch (_) {}
const result = await window.mtnApp.createCustomerTransaction({
      customerId,
      type: payload.type,
      amount: payload.amount,
      paymentMethod: payload.paymentMethod,
      note: payload.note,
      createdAt: payload.createdAt
    });
    cachedCustomerDebts = result.customerDebts || [];
      cachedCustomers = result.customers || [];
      cachedCashTransactions = result.cashTransactions || [];

    renderCustomers(result.customers || []);
    renderCash(result.cashTransactions || []);
    renderSummary(result);
    renderCustomerDetail(result);
    refreshCustomerDetailIfOpen(result, customerId);
    refreshAccountingPanels(result);
    setStatus("Cari işlem kaydedildi.");
    customerTransactionForm.reset();
    setTodayDate();
    if (returnToListAfterAction === "transaction") {
      setCustomerWorkspace("list");
    }
    returnToListAfterAction = "";
  });
}


function refreshCustomerDetailIfOpen(data, customerId){
  try{
    const workspace = document.getElementById('customer-detail-module');
    const isVisible = workspace && !workspace.classList.contains('is-hidden');
    if (!isVisible) return;
    const id = customerId || detailCustomerSelect?.value || currentCustomerDetailId;
    if (!id) return;
    const cust = (data.customers || []).find(c => c.id === id) || (cachedCustomers || []).find(c => c.id === id);
    if (cust) openCustomerDetail(cust);
  }catch(_){}
}

const updateJobTotal = () => {
  if (!customerJobForm) {
    return;
  }
  const quantity = Number(customerJobForm.elements.quantity?.value || 0);
  const unitPrice = Number(customerJobForm.elements.unitPrice?.value || 0);
  if (customerJobForm.elements.total) {
    customerJobForm.elements.total.value = (quantity * unitPrice || 0).toFixed(
      2
    );
  }
};

if (customerJobForm) {
  ["quantity", "unitPrice"].forEach((field) => {
    customerJobForm.elements[field]?.addEventListener("input", updateJobTotal);
  });
  customerJobForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isEdit = Boolean(editingCustomerJobId || customerJobIdInput?.value);
    const apiFn = isEdit ? window.mtnApp?.updateCustomerJob : window.mtnApp?.addCustomerJob;
    if (!apiFn) {
      reportPathEl.textContent = isEdit
        ? "İş kalemi güncelleme servisi hazır değil."
        : "İş kalemi servisi hazır değil.";
      returnToListAfterAction = "";
      return;
    }
    const customerId = detailCustomerSelect?.value || "";
    if (!customerId) {
      reportPathEl.textContent = "Lütfen cari seçin.";
      returnToListAfterAction = "";
      return;
    }
    updateJobTotal();
    const formData = new FormData(customerJobForm);
    const payload = Object.fromEntries(formData.entries());

    // Zorunlu alanlar
    if (!payload.title || Number(payload.quantity || 0) <= 0) {
      setStatus("İş kalemi için zorunlu alanları doldurun.");
      returnToListAfterAction = "";
      return;
    }

    let result;
    if (isEdit) {
      const id = editingCustomerJobId || payload.jobId || customerJobIdInput?.value || "";
      result = await window.mtnApp.updateCustomerJob({
        id,
        title: payload.title,
        quantity: payload.quantity,
        unit: payload.unit,
        unitPrice: payload.unitPrice,
        total: payload.total,
        note: payload.note,
        createdAt: payload.createdAt
      });
    } else {
      result = await window.mtnApp.addCustomerJob({
        customerId,
        title: payload.title,
        quantity: payload.quantity,
        unit: payload.unit,
        unitPrice: payload.unitPrice,
        total: payload.total,
        note: payload.note,
        createdAt: payload.createdAt
      });
    }

    cachedCustomerJobs = result.customerJobs || [];
    renderCustomers(result.customers || []);
    renderSummary(result);
    renderCustomerDetail(result);
    refreshCustomerDetailIfOpen(result, customerId);
    refreshAccountingPanels(result);

    reportPathEl.textContent = isEdit ? "İş kalemi güncellendi." : "İş kalemi kaydedildi.";

    // Edit modundan çık
    editingCustomerJobId = "";
    if (customerJobIdInput) customerJobIdInput.value = "";
    if (customerJobSubmitBtn) customerJobSubmitBtn.textContent = "İş Kalemi Ekle";
    if (customerJobCancelBtn) customerJobCancelBtn.classList.add("is-hidden");

    customerJobForm.reset();
    setTodayDate();

    if (returnToListAfterAction === "job") {
      setCustomerWorkspace("list");
    }
    returnToListAfterAction = "";
  });
  if (customerJobCancelBtn) {
    customerJobCancelBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      editingCustomerJobId = "";
      try { if (customerJobIdInput) customerJobIdInput.value = ""; } catch (_) {}
      try { customerJobForm.reset(); } catch (_) {}
      try { setTodayDate(); } catch (_) {}
      try { if (customerJobSubmitBtn) customerJobSubmitBtn.textContent = "İş Kalemi Ekle"; } catch (_) {}
      try { customerJobCancelBtn.classList.add('is-hidden'); } catch (_) {}
      setStatus('İş kalemi düzenleme iptal edildi.');
    });
  }
}


if (accountForm) {

  accountForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createAccount) {
      setStatus("Hesap planı servisi hazır değil.");
      return;
    }
    const formData = new FormData(accountForm);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.code || !payload.name) {
      setStatus("Hesap kodu ve adı zorunludur.");
      return;
    }
    const result = await window.mtnApp.createAccount(payload);
    renderAccounts(result || []);
    const data = await window.mtnApp.getData();
    renderAuditLogs(data.auditLogs || []);
    setStatus("Hesap planı güncellendi.");
    accountForm.reset();
  });
}

if (unitConversionForm) {
  unitConversionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createUnitConversion) {
      setStatus("Birim dönüşüm servisi hazır değil.");
      return;
    }
    const formData = new FormData(unitConversionForm);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.baseUnit || !payload.targetUnit || !payload.factor) {
      setStatus("Birim dönüşüm için tüm alanları doldurun.");
      return;
    }
    const result = await window.mtnApp.createUnitConversion(payload);
    renderUnitConversions(result || []);
    const data = await window.mtnApp.getData();
    renderAuditLogs(data.auditLogs || []);
    setStatus("Birim dönüşüm kaydedildi.");
    unitConversionForm.reset();
  });
}

if (stockForm) {
  stockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(stockForm);
    const payload = Object.fromEntries(formData.entries());
    if (editingStockId) {
      if (!window.mtnApp?.updateStock) {
        setStatus("Stok güncelleme servisi hazır değil.");
        return;
      }
      const result = await window.mtnApp.updateStock({
        stockId: editingStockId,
        updates: payload
      });
      renderStocks(result || []);
      const data = await window.mtnApp.getData();
      renderStockMovements(data.stockMovements || []);
      renderSummary(data);
      refreshAccountingPanels(data);
      setStatus("Stok güncellendi.");
      editingStockId = "";
      stockForm.reset();
      setAutoCodes();
      setTodayDate();
      return;
    }
    const normalizedName = normalizeText(payload.name);
    const existingStock = cachedStocks.find(
      (item) => normalizeText(item.name) === normalizedName
    );
    if (existingStock && window.mtnApp?.createStockReceipt) {
      const approved = window.confirm(
        "Bu malzeme zaten mevcut. Sayımı depoya aktarıp stoğu güncellemek ister misiniz?"
      );
      if (!approved) {
        return;
      }
      const result = await window.mtnApp.createStockReceipt({
        items: [
          {
            name: payload.name,
            unit: payload.unit,
            quantity: payload.quantity,
            purchasePrice: payload.purchasePrice,
            salePrice: payload.salePrice,
            threshold: payload.threshold
          }
        ],
        note: payload.description || "Manuel stok güncelleme",
        supplier: "",
        warehouse: existingStock.warehouse || "Ana Depo",
        createdAt: payload.createdAt || new Date().toISOString().split("T")[0]
      });
      renderStocks(result.stocks || []);
      renderStockMovements(result.stockMovements || []);
      renderStockReceipts(result.stockReceipts || []);
      renderSummary(result);
      renderCustomerDetail(result);
      refreshCustomerDetailIfOpen(result, activeCustomerId);
      refreshAccountingPanels(result);
      setStatus("Stok güncellendi.");
      stockForm.reset();
      setAutoCodes();
      setTodayDate();
      return;
    }
    await window.mtnApp.createStock(payload);
    const data = await window.mtnApp.getData();
    renderStocks(data.stocks || []);
    renderStockMovements(data.stockMovements || []);
    renderSummary(data);
    refreshAccountingPanels(data);
    setStatus("Stok kaydedildi.");
    try { forceKeyboardFocus("stocks-panel"); } catch (_) {}
    stockForm.reset();
    setAutoCodes();
    setTodayDate();
  });

  stockForm.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    stockForm.requestSubmit();
  });
}

if (stockReceiptToggle && stockReceiptCard) {
  stockReceiptToggle.addEventListener("click", () => {
    stockReceiptCard.classList.toggle("is-hidden");
    if (!stockReceiptCard.classList.contains("is-hidden") && stockReceiptBody) {
      if (!stockReceiptBody.children.length) {
        stockReceiptBody.appendChild(createReceiptRow());
      }
    }
  });
}

if (stockReceiptAddRow && stockReceiptBody) {
  stockReceiptAddRow.addEventListener("click", (event) => {
    event.preventDefault();
    stockReceiptBody.appendChild(createReceiptRow());
  });
}

if (stockReceiptSubmit && stockReceiptBody) {
  stockReceiptSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createStockReceipt) {
      setStatus("Fiş servisi hazır değil.");
      return;
    }
    const rows = Array.from(stockReceiptBody.querySelectorAll("tr")).map(
      (row) => ({
        name: row.querySelector("[data-field='name']")?.value || "",
        diameter: row.querySelector("[data-field='diameter']")?.value || "",
        unit: row.querySelector("[data-field='unit']")?.value || "",
        quantity: row.querySelector("[data-field='quantity']")?.value || "",
        purchasePrice:
          row.querySelector("[data-field='purchasePrice']")?.value || "",
        threshold: row.querySelector("[data-field='threshold']")?.value || ""
      })
    );
    const items = rows.filter((item) => item.name && Number(item.quantity) > 0);
    if (!items.length) {
      setStatus("Fiş için en az bir malzeme girin.");
      return;
    }
    const approved = window.confirm("Fiş kaydedilsin ve depoya aktarılsın mı?");
    if (!approved) {
      return;
    }
    const supplierName = stockReceiptSupplierInput?.value?.trim();
    const warehouseName = stockReceiptWarehouseSelect?.value || "Ana Depo";
    const noteParts = [];
    if (supplierName) {
      noteParts.push(`Malzemeci: ${supplierName}`);
    }
    if (stockReceiptNote?.value) {
      noteParts.push(stockReceiptNote.value);
    }
    let attachment = null;
    const file = stockReceiptFileInput?.files?.[0];
    if (file && window.mtnApp?.saveAttachment) {
      attachment = await window.mtnApp.saveAttachment({
        path: file.path,
        name: file.name,
        category: "stock-receipt"
      });
    }
    const result = await window.mtnApp.createStockReceipt({
      items,
      note: noteParts.join(" • "),
      supplier: supplierName,
      warehouse: warehouseName,
      attachment,
      createdAt:
        stockReceiptDateInput?.value || new Date().toISOString().split("T")[0]
    });
    renderStocks(result.stocks || []);
    renderStockMovements(result.stockMovements || []);
    renderStockReceipts(result.stockReceipts || []);
    renderSummary(result);
    refreshAccountingPanels(result);
    setStatus("Fiş kaydedildi ve depoya aktarıldı.");
    stockReceiptBody.innerHTML = "";
    stockReceiptBody.appendChild(createReceiptRow());
    if (stockReceiptNote) {
      stockReceiptNote.value = "";
    }
    if (stockReceiptSupplierInput) {
      stockReceiptSupplierInput.value = "";
    }
    if (stockReceiptFileInput) {
      stockReceiptFileInput.value = "";
    }
  });
}

if (cashForm) {
  cashForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(cashForm);
    const payload = Object.fromEntries(formData.entries());
    const customerOption = cashCustomerSelect?.selectedOptions?.[0];
    payload.customerName = customerOption?.textContent || "";
    payload.paymentMethod = payload.paymentMethod || cashPaymentMethodSelect?.value || "";
    payload.type = payload.type || cashTypeInput?.value || "gelir";
    // Zorunlu alan kontrolü
    if (!payload.customerId) {
      setStatus("Cari seçmeden işlem yapılamaz.", "warning");
      try { cashCustomerSelect?.focus?.(); } catch (_) {}
      return;
    }
    const amt = Number(payload.amount || 0);
    if (!amt || amt <= 0) {
      setStatus("Tutar girin.", "warning");
      try { cashForm?.querySelector('input[name="amount"]')?.focus?.(); } catch (_) {}
      return;
    }

    await window.mtnApp.createCash(payload);
    if (payload.type === "gelir" && cashReceiptToggle?.checked) {
      const html = buildReceiptHtml({
        customerName: payload.customerName,
        amount: Number(payload.amount || 0),
        paymentMethod: payload.paymentMethod,
        note: payload.note,
        createdAt: payload.createdAt || new Date().toISOString(),
        title: "Tahsilat Makbuzu"
      });
      const result = await window.mtnApp?.generateReport?.({
        title: "Tahsilat-Makbuz",
        html
      });
      if (result?.reportFile) {
        await window.mtnApp?.openFile?.(result.reportFile);
        setStatus("Makbuz hazır.");
      }
    }
    const data = await window.mtnApp.getData();
    renderCash(data.cashTransactions || []);
    renderSummary(data);
    refreshAccountingPanels(data);
    setStatus("Kasa işlemi kaydedildi.");
    cashForm.reset();
    setTodayDate();
    if (cashTypeInput) {
      cashTypeInput.value = "gelir";
    }
    cashTypeButtons.forEach((button) => {
      button.classList.toggle(
        "toggle-button--active",
        button.dataset.cashType === "gelir"
      );
    });
  });
}

if (invoiceForm) {
  invoiceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createInvoice) {
      setStatus("Fatura servisi hazır değil.");
      return;
    }
    const formData = new FormData(invoiceForm);
    const payload = Object.fromEntries(formData.entries());
    const file = invoiceFileInput?.files?.[0];
    if (!file) {
      setStatus("Fatura dosyası seçin.");
      return;
    }
    const attachment = await window.mtnApp.saveAttachment({
      path: file.path,
      name: file.name,
      category: "invoice"
    });
    const result = await window.mtnApp.createInvoice({
      invoiceType: payload.invoiceType || invoiceTypeSelect?.value || "alis",
      vendor: payload.vendor,
      amount: payload.amount,
      note: payload.note,
      createdAt: payload.createdAt,
      attachment
    });
    renderInvoices(result.invoices || []);
    refreshAccountingPanels(result);
    setStatus("Fatura kaydedildi.");
    invoiceForm.reset();
    setTodayDate();
  });
}

if (cashStartInput) {
  [cashStartInput, cashEndInput, cashTypeSelect].forEach((input) => {
    input?.addEventListener("input", async () => {
      const data = await window.mtnApp.getData();
      renderCash(data.cashTransactions || []);
    });
  });
}

if (cashTypeButtons.length && cashTypeInput) {
  cashTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextType = button.dataset.cashType || "gelir";
      cashTypeInput.value = nextType;
      cashTypeButtons.forEach((btn) =>
        btn.classList.toggle(
          "toggle-button--active",
          btn.dataset.cashType === nextType
        )
      );
      if (cashReceiptToggle) {
        cashReceiptToggle.checked = nextType === "gelir" && cashReceiptToggle.checked;
      }
    });
  });
}

const handleCustomerSearch = () => {
  renderCustomers(cachedCustomers);
};

if (customerSearchInput) {
  customerSearchInput.addEventListener("input", handleCustomerSearch);
}

if (customerSearchButton) {
  customerSearchButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleCustomerSearch();
  });
}

if (customerFilterButtons.length) {
  customerFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCustomerFilter = button.dataset.customerFilter || "all";
      customerFilterButtons.forEach((btn) =>
        btn.classList.toggle(
          "chip--active",
          btn.dataset.customerFilter === activeCustomerFilter
        )
      );
      renderCustomers(cachedCustomers);
    });
  });
}

if (customerDetailClose) {
  customerDetailClose.addEventListener("click", () => {
    setCustomerWorkspace("list");
  });
}

if (customerDetailBack) {
  customerDetailBack.addEventListener("click", () => {
    setCustomerWorkspace("list");
  });
}

const handleCustomerDetailSearch = () => {
  detailSearchTerm = customerDetailSearchInput?.value || "";
  renderCustomerDetail({
    customers: cachedCustomers,
    customerDebts: cachedCustomerDebts,
    customerJobs: cachedCustomerJobs,
    cashTransactions: cachedCashTransactions,
    sales: cachedSales
  });
};

if (customerDetailSearchButton) {
  customerDetailSearchButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleCustomerDetailSearch();
  });
}

if (customerDetailSearchInput) {
  customerDetailSearchInput.addEventListener("input", handleCustomerDetailSearch);
  customerDetailSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCustomerDetailSearch();
    }
  });
}

if (customerDetailOffer) {
  customerDetailOffer.addEventListener("click", async () => {
    const customerId = detailCustomerSelect?.value || currentCustomerDetailId;
    if (!customerId) {
      setStatus("Önce cari seçin.");
      return;
    }
    await openCustomerSavedOffers(customerId);
  });
}

if (customerDetailStatement) {
  customerDetailStatement.addEventListener("click", () => {
    setCustomerWorkspace("detail");
    document.getElementById("customer-detail-module")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

if (customerDetailCollect) {
  customerDetailCollect.addEventListener("click", () => {
    // Prefer the selected value from the detail-customer select, but fall back
    // to the currently opened customer ID if the select is not yet bound.
    const customerId = detailCustomerSelect?.value || currentCustomerDetailId;
    if (customerId) {
      openCustomerTransaction(customerId, "tahsilat");
    } else {
      setStatus("Önce cari seçin.");
    }
  });
}

if (customerDetailJob) {
  customerDetailJob.addEventListener("click", () => {
    setCustomerWorkspace("detail");
    customerJobForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (customerDetailEdit) {
  customerDetailEdit.addEventListener("click", () => {
    const customerId = detailCustomerSelect?.value;
    const customer = cachedCustomers.find((item) => item.id === customerId);
    if (customer) {
      populateCustomerForm(customer);
    }
  });
}

if (customerDetailAddTransaction) {
  customerDetailAddTransaction.addEventListener("click", () => {
    const customerId = detailCustomerSelect?.value;
    if (customerId) {
      openCustomerTransaction(customerId, transactionTypeSelect?.value);
      setStatus("Cari için işlem ekleme ekranı açıldı.");
    }
  });
}

if (customerDetailDelete) {
  customerDetailDelete.addEventListener("click", async () => {
    const customerId = detailCustomerSelect?.value;
    if (!customerId || !window.mtnApp?.deleteCustomer) {
      setStatus("Silme servisi hazır değil.");
      return;
    }
    const approved = window.confirm(
      "Cari kalıcı olarak silinsin mi? Bu işlem geri alınamaz."
    );
    if (!approved) {
      return;
    }
    const result = await window.mtnApp.deleteCustomer({ customerId });
    renderCustomers(result.customers || []);
    cachedCustomerDebts = result.customerDebts || [];
      cachedCustomers = result.customers || [];
      cachedCashTransactions = result.cashTransactions || [];

    cachedCustomerJobs = result.customerJobs || [];
    setCustomerWorkspace("list");
    setStatus("Cari silindi.");
  });
}

if (customerDetailSave) {
  customerDetailSave.addEventListener("click", () => {
    if (editingCustomerId && customerForm) {
      returnToListAfterSave = true;
      customerForm.requestSubmit();
      return;
    }
    if (customerTransactionForm) {
      const amount = Number(
        customerTransactionForm.elements.amount?.value || 0
      );
      if (amount > 0) {
        returnToListAfterAction = "transaction";
        customerTransactionForm.requestSubmit();
        return;
      }
    }
    if (customerJobForm) {
      const title = customerJobForm.elements.title?.value || "";
      if (title.trim()) {
        returnToListAfterAction = "job";
        customerJobForm.requestSubmit();
        return;
      }
    }
    setCustomerWorkspace("list");
  });
}

if (customerDetailAddItem) {
  customerDetailAddItem.addEventListener("click", () => {
    customerJobForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    setStatus("İş kalemi ekleme ekranı açıldı.");
  });
}

if (customerDetailAddPayment) {
  customerDetailAddPayment.addEventListener("click", () => {
    const customerId = detailCustomerSelect?.value;
    if (customerId) {
      openCustomerTransaction(customerId, "tahsilat");
      setStatus("Tahsilat ekranı açıldı.");
    }
  });
}

if (customerDetailAddStock) {
  customerDetailAddStock.addEventListener("click", async () => {
    const customerId = detailCustomerSelect?.value;
    const customer = cachedCustomers.find((item) => item.id === customerId);
    if (!customerId || !customer) {
      setStatus("Önce cari seçin.");
      return;
    }
    if (!cachedStocks.length) {
      setStatus("Stok kartı bulunamadı.");
      return;
    }
    const stockName = await window.mtnPromptModal("Stoktan çıkış yapılacak malzeme adı/kodu", cachedStocks[0]?.name || "", { type: "text", placeholder: "Malzeme adı veya kodu" });
    if (!stockName) {
      return;
    }
    const matched = cachedStocks.find((stock) => {
      const name = normalizeText(stock.name);
      const code = normalizeText(stock.code);
      const term = normalizeText(stockName);
      return name.includes(term) || code.includes(term);
    });
    if (!matched) {
      setStatus("Stok bulunamadı.");
      return;
    }
    const qtyText = await window.mtnPromptModal("Miktar", "1", { type: "number", placeholder: "Miktar" });
    const quantity = Number(String(qtyText || "0").replace(",", ".")) || 0;
    if (!quantity || quantity <= 0) {
      setStatus("Geçerli bir miktar girin.");
      return;
    }
    const unitPrice = Number(matched.salePrice || matched.purchasePrice || 0);
    const total = quantity * unitPrice;
    const note = `Stok çıkış: ${matched.name}`;
    await Promise.all([
      window.mtnApp?.moveStock?.({
        stockName: matched.name,
        type: "cikis",
        quantity,
        createdAt: new Date().toISOString().split("T")[0],
        note: `${customer.name} için stok çıkışı`
      }),
      window.mtnApp?.addCustomerJob?.({
        customerId,
        title: matched.name,
        quantity,
        unit: matched.unit || "adet",
        unitPrice,
        total,
        note,
        createdAt: new Date().toISOString().split("T")[0]
      })
    ])
      .then(async () => {
        const data = await window.mtnApp.getData();
        renderStocks(data.stocks || []);
        renderStockMovements(data.stockMovements || []);
        cachedCustomerJobs = data.customerJobs || [];
        renderCustomerDetail(data);
        renderSummary(data);
        refreshAccountingPanels(data);
        setStatus("Stoktan düşüm ve cari hareketi işlendi.");
      })
      .catch(() => {
        setStatus("Stoktan malzeme eklenemedi.");
      });
  });
}

if (customerDetailCreateStatement) {
  customerDetailCreateStatement.addEventListener("click", () => {
    detailReportButton?.click();
  });
}

if (customerDetailDue) {
  customerDetailDue.addEventListener("click", () => {
    const customerId = detailCustomerSelect?.value;
    const customer = cachedCustomers.find((item) => item.id === customerId);
    if (!customer) {
      return;
    }
    const dueDate = getCustomerDueDate(customer);
    setStatus(
      dueDate
        ? `Ödeme vadesi: ${dueDate.toLocaleDateString("tr-TR")}`
        : "Ödeme vadesi tanımlı değil."
    );
  });
}

if (customerDetailMethod) {
  customerDetailMethod.addEventListener("click", () => {
    const customerId = detailCustomerSelect?.value;
    const lastPayment = cachedCashTransactions
      .filter((entry) => entry.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    setStatus(
      lastPayment?.paymentMethod
        ? `Son ödeme şekli: ${lastPayment.paymentMethod}`
        : "Ödeme şekli bilgisi bulunamadı."
    );
  });
}

if (supplierDetailAddDebt) {
  supplierDetailAddDebt.addEventListener("click", () => {
    openCustomerTransaction(detailCustomerSelect?.value, "odeme");
    setStatus("Alınan malzeme için borç kaydı ekleyebilirsiniz.");
  });
}

if (supplierDetailPay) {
  supplierDetailPay.addEventListener("click", () => {
    const customerId = detailCustomerSelect?.value;
    if (customerId) {
      openCustomerTransaction(customerId, "odeme");
      setStatus("Tedarikçi ödeme ekranı açıldı.");
    }
  });
}

if (supplierDetailInvoice) {
  supplierDetailInvoice.addEventListener("click", () => {
    const customerId = detailCustomerSelect?.value;
    const customer = cachedCustomers.find((item) => item.id === customerId);
    if (!customer) {
      return;
    }
    showPanel("invoices-panel", "Fatura");
    activateMenuByPanel("invoices-panel");
    if (invoiceTypeSelect) {
      invoiceTypeSelect.value = customer.type === "tedarikci" ? "alis" : "satis";
    }
    if (invoiceForm?.elements?.vendor) {
      invoiceForm.elements.vendor.value = customer.name || "";
    }
    setStatus("Fiş/Fatura paneli açıldı. Belgeyi ekleyin.");
  });
}

// Customer detail invoice and passive actions
if (customerDetailInvoice) {
  customerDetailInvoice.addEventListener("click", () => {
    // Determine the selected customer ID, falling back to the currently
    // opened customer if the select has not been updated.
    const selectedId = detailCustomerSelect?.value || currentCustomerDetailId;
    const customer = cachedCustomers.find((item) => item.id === selectedId);
    if (!customer) {
      setStatus("Önce cari seçin.");
      return;
    }
    showPanel("invoices-panel", "Fatura");
    activateMenuByPanel("invoices-panel");
    if (invoiceTypeSelect) {
      // set invoice type based on customer type (supplier vs customer)
      invoiceTypeSelect.value = customer.type === "tedarikci" ? "alis" : "satis";
    }
    if (invoiceForm?.elements?.vendor) {
      invoiceForm.elements.vendor.value = customer.name || "";
    }
    setStatus("Fiş/Fatura paneli açıldı.");
  });
}

if (customerDetailPassive) {
  customerDetailPassive.addEventListener("click", async () => {
    // Use the currently opened customer ID if the select value is empty.
    const customerId = detailCustomerSelect?.value || currentCustomerDetailId;
    if (!customerId || !window.mtnApp?.toggleCustomerStatus) {
      setStatus("Cari pasif yapma servisi hazır değil.");
      return;
    }
    const result = await window.mtnApp.toggleCustomerStatus({ customerId });
    // refresh customer lists after status change
    renderCustomers(result?.customers || []);
    cachedCustomerDebts = result?.customerDebts || [];
    cachedCustomerJobs = result?.customerJobs || [];
    setCustomerWorkspace("list");
    setStatus("Cari pasif yapıldı.");
  });
}

const handleStockSearch = () => {
  renderStocks(cachedStocks);
};

if (stockSearchInput) {
  stockSearchInput.addEventListener("input", handleStockSearch);
}

if (stockSearchButton) {
  stockSearchButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleStockSearch();
  });
}

const resetStockImport = () => {
  cachedImportRows = [];
  if (stockImportSummaryEl) {
    stockImportSummaryEl.textContent = "Dosya seçilmedi.";
  }
  if (stockImportTable) {
    stockImportTable.innerHTML = "";
  }
  if (stockImportFileInput) {
    stockImportFileInput.value = "";
  }
};

const renderStockImportPreview = (report) => {
  if (!stockImportTable) {
    return;
  }
  stockImportTable.innerHTML = "";
  if (stockImportSummaryEl) {
    stockImportSummaryEl.textContent = `Yeni: ${report.summary.newCount}, Güncellenecek: ${report.summary.updateCount}, Hatalı: ${report.summary.errorCount}`;
  }
  report.rows.forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
      <td>${row.statusLabel}</td>
      <td>${row.code || "-"}</td>
      <td>${row.name || "-"}</td>
      <td>${row.quantity || "-"}</td>
      <td>${row.unit || "-"}</td>
    `;
    stockImportTable.appendChild(tableRow);
  });
};

if (stockImportPreviewButton) {
  stockImportPreviewButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.previewStockImport) {
      setStatus("Toplu aktarım servisi hazır değil.");
      return;
    }
    const file = stockImportFileInput?.files?.[0];
    if (!file) {
      setStatus("Lütfen bir dosya seçin.");
      return;
    }
    const result = await window.mtnApp.previewStockImport({
      path: file.path,
      warehouse: stockImportWarehouseSelect?.value || "Ana Depo"
    });
    if (result.error) {
      setStatus(result.error);
      return;
    }
    cachedImportRows = result.rows || [];
    renderStockImportPreview(result.report);
  });
}

if (stockImportApplyButton) {
  stockImportApplyButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.applyStockImport) {
      setStatus("Toplu aktarım servisi hazır değil.");
      return;
    }
    if (!cachedImportRows.length) {
      setStatus("Önce önizleme alın.");
      return;
    }
    const approved = window.confirm("Toplu aktarım onaylansın mı?");
    if (!approved) {
      return;
    }
    const result = await window.mtnApp.applyStockImport({
      rows: cachedImportRows,
      warehouse: stockImportWarehouseSelect?.value || "Ana Depo"
    });
    renderStocks(result.stocks || []);
    renderStockMovements(result.stockMovements || []);
    renderStockReceipts(result.stockReceipts || []);
    renderSummary(result);
    refreshAccountingPanels(result);
    renderStockImportPreview(result.report);
    setStatus("Toplu aktarım tamamlandı.");
  });
}

if (stockImportResetButton) {
  stockImportResetButton.addEventListener("click", (event) => {
    event.preventDefault();
    resetStockImport();
  });
}

const handleStockListSearch = () => {
  renderStockList(cachedStocks);
};

if (stockListSearchInput) {
  stockListSearchInput.addEventListener("input", handleStockListSearch);
}

if (stockListSearchButton) {
  stockListSearchButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleStockListSearch();
  });
}

if (stockListUnitFilter) {
  stockListUnitFilter.addEventListener("input", handleStockListSearch);
}

if (stockListWarehouseFilter) {
  stockListWarehouseFilter.addEventListener("input", handleStockListSearch);
}

if (stockListNewButton) {
  stockListNewButton.addEventListener("click", () => {
    showPanel("stocks-panel", panelTitles["stocks-panel"]);
    activateMenuByPanel("stocks-panel");
    try {
      stockForm?.elements?.name?.focus?.();
    } catch (_) {}
  });
}

if (stockColumnToggles.length) {
  stockColumnToggles.forEach((toggle) => {
    toggle.addEventListener("change", applyStockColumnVisibility);
  });
}

const addOfferRowFromStock = (stock) => {
  if (!stock || !offerBody) {
    return;
  }
  const row = createRow();
  offerBody.appendChild(row);
  const nameInput = row.querySelector("[data-field='name']");
  const unitInput = row.querySelector("[data-field='unit']");
  const priceInput = row.querySelector("[data-field='price']");
  const qtyInput = row.querySelector("[data-field='quantity']");
  if (nameInput) {
    nameInput.value = stock.code
      ? `${stock.code} - ${stock.normalizedName || stock.name || ""}`.trim()
      : stock.normalizedName || stock.name || "";
  }
  if (unitInput) {
    unitInput.value = stock.unit || "";
  }
  if (priceInput) {
    priceInput.value = stock.salePrice || stock.purchasePrice || "";
  }
  if (qtyInput && !qtyInput.value) {
    qtyInput.value = 1;
  }
  calculateTotal();
};

if (stockListAddToSaleButton) {
  stockListAddToSaleButton.addEventListener("click", () => {
    const selectedIds = Array.from(
      stockListTable?.querySelectorAll("input[type='checkbox']:checked") || []
    ).map((input) => input.dataset.stockId);
    if (!selectedIds.length) {
      setStatus("Toplu satış için stok seçin.");
      return;
    }
    selectedIds.forEach((id) => {
      const stock = cachedStocks.find((item) => String(item.id) === String(id));
      addOfferRowFromStock(stock);
    });
    showPanel("sales-panel", "Teklif");
    activateMenuByPanel("sales-panel");
  });
}

if (inventoryCountAddRow && inventoryCountBody) {
  inventoryCountAddRow.addEventListener("click", (event) => {
    event.preventDefault();
    inventoryCountBody.appendChild(createInventoryCountRow());
  });
}

if (inventoryCountBody && inventoryCountBody.children.length === 0) {
  inventoryCountBody.appendChild(createInventoryCountRow());
}

if (inventoryCountTransfer) {
  inventoryCountTransfer.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createStockReceipt) {
      setStatus("Depo sayım servisi hazır değil.");
      return;
    }
    const rows = Array.from(
      inventoryCountBody?.querySelectorAll("tr") || []
    ).map((row) => ({
      name: row.querySelector("[data-field='name']")?.value || "",
      unit: row.querySelector("[data-field='unit']")?.value || "",
      quantity: row.querySelector("[data-field='quantity']")?.value || "",
      purchasePrice:
        row.querySelector("[data-field='purchasePrice']")?.value || "",
      salePrice: row.querySelector("[data-field='salePrice']")?.value || ""
    }));
    const items = rows.filter((item) => item.name && Number(item.quantity) > 0);
    if (!items.length) {
      setStatus("Sayım listesi için en az bir malzeme girin.");
      return;
    }
    const result = await window.mtnApp.createStockReceipt({
      items,
      note: inventoryCountNote?.value || "Depo sayım listesi",
      supplier: "",
      warehouse: inventoryCountWarehouse?.value || "Ana Depo",
      createdAt:
        inventoryCountDate?.value || new Date().toISOString().split("T")[0]
    });
    renderStocks(result.stocks || []);
    renderStockMovements(result.stockMovements || []);
    renderStockReceipts(result.stockReceipts || []);
    renderSummary(result);
    refreshAccountingPanels(result);
    setStatus("Depo sayımı aktarıldı.");
    inventoryCountBody.innerHTML = "";
    inventoryCountBody.appendChild(createInventoryCountRow());
    if (inventoryCountNote) {
      inventoryCountNote.value = "";
    }
    setTodayDate();
  });
}

const handleReceiptFilter = () => {
  renderStockReceipts(cachedStockReceipts);
};

[
  receiptFilterStartInput,
  receiptFilterEndInput,
  receiptFilterSupplierInput,
  receiptFilterWarehouseSelect,
  receiptFilterStatusSelect
].forEach((input) => {
  input?.addEventListener("input", handleReceiptFilter);
  input?.addEventListener("change", handleReceiptFilter);
});

if (stockReceiptsTransferButton) {
  stockReceiptsTransferButton.addEventListener("click", async () => {
    if (!window.mtnApp?.transferStockReceipts) {
      setStatus("Depo aktarım servisi hazır değil.");
      return;
    }
    const selectedIds = Array.from(
      stockReceiptsTable?.querySelectorAll("input[type='checkbox']:checked") ||
        []
    ).map((input) => input.dataset.receiptId);
    if (!selectedIds.length) {
      setStatus("Aktarım için fiş seçin.");
      return;
    }
    const result = await window.mtnApp.transferStockReceipts({
      receiptIds: selectedIds
    });
    renderStocks(result.stocks || []);
    renderStockMovements(result.stockMovements || []);
    renderStockReceipts(result.stockReceipts || []);
    renderSummary(result);
    refreshAccountingPanels(result);
    setStatus(result.message || "Fişler depoya aktarıldı.");
  });
}

if (stockMovementForm) {
  stockMovementForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.moveStock) {
      reportPathEl.textContent = "Stok hareket servisi hazır değil.";
      return;
    }
    const formData = new FormData(stockMovementForm);
    const payload = Object.fromEntries(formData.entries());
    const stockName = movementStockSelect?.value || "";
    if (!stockName) {
      reportPathEl.textContent = "Lütfen malzeme seçin.";
      return;
    }
    
// MTN: Stok negatife düşmesin
try {
  const qty = Number(payload.quantity || 0);
  const type = String(payload.type || "").toLowerCase();
  if (type === "cikis" && qty > 0) {
    const item = (cachedStocks || []).find((s) => String(s.name || "") === String(stockName || ""));
    const currentQty = Number(item && item.quantity) || 0;
    if (currentQty - qty < 0) {
      const msg = `Stok negatife düşüyor. Mevcut: ${currentQty} | Çıkış: ${qty}`;
      window.MTN?.Toast ? window.MTN.Toast.warn(msg) : (reportPathEl.textContent = msg);
      return;
    }
  }
} catch (_) {}
const result = await window.mtnApp.moveStock({
      stockName,
      type: payload.type,
      quantity: payload.quantity,
      createdAt: payload.createdAt,
      note: payload.note
    });
    renderStocks(result.stocks || []);
    renderStockMovements(result.stockMovements || []);
    renderSummary(result);
    refreshAccountingPanels(result);
    reportPathEl.textContent = "Stok hareketi kaydedildi.";
    stockMovementForm.reset();
    setTodayDate();
  });
}

if (settingsForm) {
  settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.saveSettings) {
      settingsStatusEl.textContent = "Ayar servisi hazır değil.";
      return;
    }
    const payload = {
      autoSyncPath: autoSyncPathInput?.value || "",
      cloudBackupPath: cloudBackupPathInput?.value || "",
      enableAutoSync: autoSyncEnabledSelect?.value === "true",
      enableCloudBackup: cloudBackupEnabledSelect?.value === "true",
      enableAutoBackup: autoBackupEnabledSelect?.value === "true",
      stockValuationMethod: stockValuationSelect?.value || "ortalama",
      autoUpdateEnabled: autoUpdateToggle?.checked ?? true
    };
    const existingSettings = await window.mtnApp.getSettings();
    const nextSettings = { ...existingSettings, ...payload };
    await window.mtnApp.saveSettings(nextSettings);
    currentSettings = nextSettings;
    settingsStatusEl.textContent = "Ayarlar kaydedildi.";
  });
}

if (checkUpdatesButton) {
  checkUpdatesButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.saveSettings) {
      if (updateStatusEl) updateStatusEl.textContent = "Güncelleme servisi hazır değil.";
      return;
    }
    const now = new Date();
    const existingSettings = await window.mtnApp.getSettings();
    const nextSettings = {
      ...existingSettings,
      autoUpdateLastCheckedAt: now.toISOString()
    };
    await window.mtnApp.saveSettings(nextSettings);
    currentSettings = nextSettings;
    if (updateStatusEl) {
      updateStatusEl.textContent = `Güncelleme kontrolü tamamlandı. Sürüm: ${window.mtnApp?.version || "0.2.x"}`;
    }
  });
}

if (tourEnabledToggle) {
  tourEnabledToggle.addEventListener("change", async () => {
    if (!window.mtnApp?.saveSettings) {
      if (tourStatusEl) tourStatusEl.textContent = "Tur servisi hazır değil.";
      return;
    }
    const existingSettings = await window.mtnApp.getSettings();
    const nextSettings = {
      ...existingSettings,
      enableTour: tourEnabledToggle.checked
    };
    await window.mtnApp.saveSettings(nextSettings);
    currentSettings = nextSettings;
    if (helpMenuWrap) {
      helpMenuWrap.classList.toggle(
        "is-hidden",
        nextSettings.enableTour === false
      );
    }
    if (tourStatusEl) {
      tourStatusEl.textContent = nextSettings.enableTour
        ? "Tur özelliği aktif."
        : "Tur özelliği pasif.";
    }
  });
}

if (companyForm) {
  companyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.saveSettings) {
      settingsStatusEl.textContent = "Firma servisi hazır değil.";
      return;
    }
    const formData = new FormData(companyForm);
    const payload = Object.fromEntries(formData.entries());
    const existingSettings = await window.mtnApp.getSettings();
    const nextSettings = { ...existingSettings, ...payload };
    await window.mtnApp.saveSettings(nextSettings);
    currentSettings = nextSettings;
    applyBranding(nextSettings);
    settingsStatusEl.textContent = "Firma bilgileri kaydedildi.";
  });
}

const renderPeriodPreview = (preview) => {
  if (!periodPreviewOutput) return;
  if (!preview) {
    periodPreviewOutput.innerHTML = "";
    return;
  }
  periodPreviewOutput.innerHTML = `
    <strong>${preview.periodYear} → ${preview.toYear}</strong><br/>
    Cari: ${preview.customerCount} kayıt • Net bakiye: ${formatCurrency(
      preview.customerBalances.reduce((sum, item) => sum + Number(item.balance || 0), 0)
    )}<br/>
    Kasa: ${formatCurrency(preview.cashBalance)} (Gelir ${formatCurrency(
      preview.cashIncome
    )} / Gider ${formatCurrency(preview.cashExpense)})<br/>
    Stok: ${preview.stockCount} kalem • Değer ${formatCurrency(preview.stockValue)}
  `;
};

if (periodPreviewButton) {
  periodPreviewButton.addEventListener("click", async () => {
    if (!window.mtnApp?.previewPeriodClose) {
      if (periodLog) periodLog.textContent = "Devir servisi hazır değil.";
      return;
    }
    const year = Number(periodYearInput?.value) || new Date().getFullYear();
    const result = await window.mtnApp.previewPeriodClose({ year });
    if (!result.ok) {
      if (periodLog) periodLog.textContent = result.error || "Önizleme başarısız.";
      return;
    }
    renderPeriodPreview(result.preview);
    if (periodLog) periodLog.textContent = "Simülasyon hazır.";
  });
}

if (periodCloseButton) {
  periodCloseButton.addEventListener("click", async () => {
    if (!window.mtnApp?.closePeriod) {
      if (periodLog) periodLog.textContent = "Devir servisi hazır değil.";
      return;
    }
    const year = Number(periodYearInput?.value) || new Date().getFullYear();
    const result = await window.mtnApp.closePeriod({
      year,
      lockPeriod: periodLockToggle?.checked
    });
    if (!result.ok) {
      if (periodLog) periodLog.textContent = result.error || "Devir tamamlanamadı.";
      return;
    }
    if (periodLog) periodLog.textContent = "Devir kaydı oluşturuldu.";
    const updated = await window.mtnApp.getSettings();
    currentSettings = updated;
    if (periodYearInput) periodYearInput.value = updated.currentPeriodYear || year + 1;
  });
}

if (periodRollbackButton) {
  periodRollbackButton.addEventListener("click", async () => {
    if (!window.mtnApp?.getPeriodBatches || !window.mtnApp?.rollbackPeriod) {
      if (periodLog) periodLog.textContent = "Geri alma servisi hazır değil.";
      return;
    }
    const batches = await window.mtnApp.getPeriodBatches();
    const latest = batches?.batches?.at(-1);
    if (!latest) {
      if (periodLog) periodLog.textContent = "Geri alınacak devir bulunamadı.";
      return;
    }
    const result = await window.mtnApp.rollbackPeriod({ batchId: latest.id });
    if (!result.ok) {
      if (periodLog) periodLog.textContent = result.error || "Geri alma başarısız.";
      return;
    }
    if (periodLog) periodLog.textContent = "Devir geri alındı.";
    renderPeriodPreview(null);
  });
}

const updateOnboardingChecks = () => {
  if (!onboardingChecks) return;
  const items = [
    { label: "Firma adı", ok: Boolean(onboardingCompanyName?.value?.trim()) },
    { label: "Yönetici kullanıcı", ok: Boolean(onboardingAdminUsername?.value?.trim()) },
    { label: "Dönem yılı", ok: Boolean(onboardingPeriodYear?.value) },
    { label: "Yedek klasörü", ok: Boolean(onboardingBackupFolder?.value?.trim()) }
  ];
  onboardingChecks.innerHTML = items
    .map((item) => `<div>${item.ok ? "✔" : "○"} ${item.label}</div>`)
    .join("");
};

const saveOnboardingSettings = async () => {
  if (!window.mtnApp?.saveSettings) {
    setStatus("Kurulum servisi hazır değil.");
    return false;
  }
  const existingSettings = await window.mtnApp.getSettings();
  const logoFile = onboardingCompanyLogo?.files?.[0];
  const logoDataUrl = await readLogoFile(logoFile);
  const adminUser = onboardingAdminUsername?.value?.trim()
    ? [
        {
          username: onboardingAdminUsername.value.trim(),
          password: onboardingAdminPassword?.value || "1453",
          role: "admin",
          displayName: onboardingAdminName?.value || onboardingAdminUsername.value.trim()
        }
      ]
    : existingSettings.users || [];
  const payload = {
    companyName: onboardingCompanyName?.value?.trim() || existingSettings.companyName,
    companyPhone: onboardingCompanyPhone?.value?.trim() || existingSettings.companyPhone,
    companyAddress: onboardingCompanyAddress?.value?.trim() || existingSettings.companyAddress,
    taxNumber: onboardingTaxNumber?.value?.trim() || existingSettings.taxNumber,
    logoDataUrl: logoDataUrl || existingSettings.logoDataUrl,
    currentPeriodYear: Number(onboardingPeriodYear?.value) || existingSettings.currentPeriodYear,
    enableAutoBackup: onboardingAutoBackup?.value === "true",
    backupFolder: onboardingBackupFolder?.value?.trim() || existingSettings.backupFolder,
    users: adminUser,
    hasOnboarded: true,
    onboardingStep: 0,
    onboardingCompletedAt: new Date().toISOString()
  };
  await window.mtnApp.saveSettings({ ...existingSettings, ...payload });
  currentSettings = { ...existingSettings, ...payload };
  applyBranding(currentSettings);
  closeOnboardingWizard();
  showLoginScreen();
  return true;
};

if (onboardingNext) {
  onboardingNext.addEventListener("click", async () => {
    if (onboardingStepIndex === onboardingSteps.length) {
      await saveOnboardingSettings();
      return;
    }
    if (onboardingStepIndex === onboardingSteps.length - 1) {
      updateOnboardingChecks();
      onboardingStepIndex += 1;
      renderOnboardingStep(onboardingStepIndex);
      return;
    }
    onboardingStepIndex += 1;
    renderOnboardingStep(onboardingStepIndex);
  });
}

if (onboardingBack) {
  onboardingBack.addEventListener("click", () => {
    if (onboardingStepIndex <= 1) return;
    onboardingStepIndex -= 1;
    renderOnboardingStep(onboardingStepIndex);
  });
}

if (onboardingSkip) {
  onboardingSkip.addEventListener("click", async () => {
    const existingSettings = await window.mtnApp.getSettings();
    await window.mtnApp.saveSettings({
      ...existingSettings,
      onboardingStep: onboardingStepIndex
    });
    currentSettings = { ...existingSettings, onboardingStep: onboardingStepIndex };
    closeOnboardingWizard();
    showLoginScreen();
  });
}

if (themeForm) {
  themeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.saveSettings) {
      if (themeStatusEl) {
        themeStatusEl.textContent = "Tema servisi hazır değil.";
      }
      return;
    }
    const theme = {
      primary: themePrimaryInput?.value || DEFAULT_THEME.primary,
      accent: themeAccentInput?.value || DEFAULT_THEME.accent
    };
    const existingSettings = await window.mtnApp.getSettings();
    const nextSettings = { ...existingSettings, theme };
    await window.mtnApp.saveSettings(nextSettings);
    currentSettings = nextSettings;
    applyTheme(nextSettings);
    if (themeStatusEl) {
      themeStatusEl.textContent = "Tema güncellendi.";
    }
  });
}

if (licenseCheckButton) {
  licenseCheckButton.addEventListener("click", (event) => {
    event.preventDefault();
    settingsStatusEl.textContent =
      "Lisans kontrol servisi henüz aktif değil.";
  });
}

if (resetDataButton) {
  resetDataButton.addEventListener("click", async () => {
    // Use password input if present
    const pwd = resetPasswordInput ? (resetPasswordInput.value || '') : '1453';
    const statusEl = resetStatusEl || settingsStatusEl;
    if (pwd !== '1453') {
      if (statusEl) statusEl.textContent = 'Şifre hatalı.';
      return;
    }
    if (!window.mtnApp?.resetData) {
      if (statusEl) statusEl.textContent = 'Sıfırlama servisi hazır değil.';
      return;
    }
    const approved = window.confirm('Tüm verileri silmek üzeresiniz. Emin misiniz?');
    if (!approved) {
      if (statusEl) statusEl.textContent = 'İşlem iptal edildi.';
      return;
    }
    const data = await window.mtnApp.resetData();
    renderCustomers(data.customers || []);
    renderStocks(data.stocks || []);
    renderCash(data.cashTransactions || []);
    renderSales(data.sales || []);
    renderStockMovements(data.stockMovements || []);
    cachedCustomerDebts = data.customerDebts || [];
    cachedCustomerJobs = data.customerJobs || [];
    renderSummary(data);
    renderCustomerDetail(data);
    if (statusEl) statusEl.textContent = '✔ Veriler sıfırlandı.';
  });
}

if (logoFileInput && logoPreview) {
  logoFileInput.addEventListener("change", async () => {
    const file = logoFileInput.files?.[0];
    const previewUrl = await readLogoFile(file);
    if (previewUrl) {
      logoPreview.src = previewUrl;
    }
  });
}

if (firstRunForm) {
  firstRunForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.saveSettings) {
      settingsStatusEl.textContent = "Kurulum servisi hazır değil.";
      return;
    }
    const formData = new FormData(firstRunForm);
    const payload = Object.fromEntries(formData.entries());
    const logoFile = logoFileInput?.files?.[0];
    const logoDataUrl = await readLogoFile(logoFile);
    const nextSettings = {
      // Varsayım: varsayılan kasa adı ileride kasa kartı eklendiğinde kullanılacak.
      companyName: payload.companyName,
      companyOwner: payload.companyOwner || "",
      companyAddress: payload.companyAddress || "",
      companyPhone: payload.companyPhone || "",
      companyIban: payload.companyIban || "",
      companyBank: payload.companyBank || "",
      taxOffice: payload.taxOffice || "",
      taxNumber: payload.taxNumber || "",
      logoDataUrl,
      defaultCashName: payload.defaultCashName,
      hasOnboarded: true,
      users: [
        {
          username: payload.adminUsername,
          password: payload.adminPassword,
          role: payload.adminRole,
          displayName: payload.adminUsername
        }
      ],
      licenseKey: ""
    };
    const existingSettings = await window.mtnApp.getSettings();
    await window.mtnApp.saveSettings({ ...existingSettings, ...nextSettings });
    currentSettings = { ...existingSettings, ...nextSettings };
    applyBranding(nextSettings);
    applyTheme(nextSettings);
    users = nextSettings.users;
    firstRunScreen.classList.add("first-run--hidden");
    loginScreen.style.display = "";
    loginError.textContent = "Kurulum tamamlandı. Giriş yapabilirsiniz.";
  });
}

window.addEventListener("error", () => {
  if (settingsStatusEl) {
    settingsStatusEl.textContent =
      "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
  }
});

const buildBackupPayload = () => {
  const rows = Array.from(offerBody.querySelectorAll("tr")).map((row) => {
    const getValue = (field) =>
      row.querySelector(`[data-field='${field}']`)?.value || "";
    return {
      name: getValue("name"),
      quantity: getValue("quantity"),
      unit: getValue("unit"),
      price: getValue("price"),
      total: getValue("total")
    };
  });

  return window.mtnApp?.getData
    ? window.mtnApp.getData().then((data) => ({
        meta: {
          appVersion: window.mtnApp?.version || "0.2.3",
          module: "teklif"
        },
        teklif: rows,
        toplam: totalEl.textContent,
        data
      }))
    : {
        meta: {
          appVersion: window.mtnApp?.version || "0.2.1",
          module: "teklif"
        },
        teklif: rows,
        toplam: totalEl.textContent
      };
};

const handleBackup = async () => {
  if (!window.mtnApp?.createBackup) {
    if (backupPathEl) {
      backupPathEl.textContent = "Yedekleme servisi hazır değil.";
    }
    return;
  }

  const payload = await buildBackupPayload();
  const result = await window.mtnApp.createBackup(payload);
  lastManualBackupDir = result.backupDir || "";
  if (lastBackupEl) {
    lastBackupEl.textContent = new Date(result.createdAt).toLocaleString("tr-TR");
  }
  if (backupPathEl) {
    backupPathEl.textContent = `Yedek klasörü: ${result.backupDir}`;
  }
  if (backupOpenButton) {
    backupOpenButton.disabled = !lastManualBackupDir;
  }
};

if (backupButton) {
  backupButton.addEventListener("click", handleBackup);
}

if (backupSecondaryButton) {
  backupSecondaryButton.addEventListener("click", handleBackup);
}

if (toggleSoundButton) {
  const refreshSoundToggleLabel = () => {
    const on = !!uiSoundEnabled;
    toggleSoundButton.textContent = on ? "Ses: Açık" : "Ses: Kapalı";
    toggleSoundButton.classList.toggle("is-off", !on);
  };

  refreshSoundToggleLabel();

  toggleSoundButton.addEventListener("click", () => {
    uiSoundEnabled = !uiSoundEnabled;
    voiceEnabled = uiSoundEnabled;

    // Ses efektleri
    try { window.MTN?.Sound?.setEnabled?.(uiSoundEnabled); } catch (_) {}

    // Konuşma / TTS (varsa) durdur
    if (!uiSoundEnabled) {
      try { window.MTN?.TTS?.stop?.(); } catch (_) {}
      try { window.speechSynthesis?.cancel?.(); } catch (_) {}
    }

    refreshSoundToggleLabel();
    try { (uiSoundEnabled ? playUiSound("nav") : null); } catch (_) {}
  });;
}

if (helpMenuToggle && helpMenuPanel) {
  helpMenuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleHelpMenu();
  });
  document.addEventListener("click", (event) => {
    if (!helpMenuPanel.contains(event.target) && event.target !== helpMenuToggle) {
      toggleHelpMenu(false);
    }
  });
}

if (helpDescribeScreenButton) {
  helpDescribeScreenButton.addEventListener("click", () => {
    toggleHelpMenu(false);
    startTour(currentPanelId);
  });
}
if (helpGeneralTourButton) {
  helpGeneralTourButton.addEventListener("click", () => {
    toggleHelpMenu(false);
    startTour("general");
  });
}
if (helpQuickGuideButton) {
  helpQuickGuideButton.addEventListener("click", () => {
    toggleHelpMenu(false);
    quickGuide?.classList.add("is-visible");
    quickGuide?.setAttribute("aria-hidden", "false");
  });
}

if (assistantFab) {
  assistantFab.addEventListener("click", () => {
    openAssistantDock(!assistantDock?.classList.contains("is-open"));
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    openAssistantDock(true);
  }
});
if (assistantDockClose) {
  assistantDockClose.addEventListener("click", () => openAssistantDock(false));
}
assistantDockTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setAssistantDockTab(tab.dataset.assistantTab);
  });
});
if (assistantDockSend && assistantDockInput) {
  assistantDockSend.addEventListener("click", () => {
    const value = assistantDockInput.value.trim();
    if (!value) return;
    appendAssistantDockLog(`Talep alındı: ${value}`);
    assistantDockInput.value = "";
  });
}

if (quickGuideClose) {
  quickGuideClose.addEventListener("click", () => {
    quickGuide.classList.remove("is-visible");
    quickGuide.setAttribute("aria-hidden", "true");
  });
}

if (tourSkip) {
  tourSkip.addEventListener("click", () => {
    tourOverlay.classList.remove("is-visible");
    tourOverlay.setAttribute("aria-hidden", "true");
  });
}
if (tourNext) {
  tourNext.addEventListener("click", () => {
    if (tourStepIndex >= tourSteps.length - 1) {
      tourOverlay.classList.remove("is-visible");
      tourOverlay.setAttribute("aria-hidden", "true");
      return;
    }
    tourStepIndex += 1;
    renderTourStep();
  });
}
if (tourBack) {
  tourBack.addEventListener("click", () => {
    if (tourStepIndex <= 0) return;
    tourStepIndex -= 1;
    renderTourStep();
  });
}

if (backupOpenButton) {
  backupOpenButton.addEventListener("click", async () => {
    if (!window.mtnApp?.openFile) {
      if (backupPathEl) {
        backupPathEl.textContent = "Klasör açma servisi hazır değil.";
      }
      return;
    }
    if (!lastManualBackupDir) {
      if (backupPathEl) {
        backupPathEl.textContent = "Önce bir yedek alın.";
      }
      return;
    }
    const result = await window.mtnApp.openFile(lastManualBackupDir);
    if (!result.ok && backupPathEl) {
      backupPathEl.textContent = result.error || "Klasör açılamadı.";
    }
  });
}

if (exitAppButton) {
  exitAppButton.addEventListener("click", async () => {
    const shouldBackup = confirm(
      "Çıkış yapmadan önce yedek almak ister misiniz?"
    );
    if (shouldBackup) {
      await handleBackup();
      setStatus("Yedek alındı. Uygulama kapatılıyor.");
    }
    if (window.mtnApp?.quitApp) {
      window.mtnApp.quitApp();
    } else {
      window.close();
    }
  });
}

const downloadCsv = (filename, headers, rows) => {
  const escapeValue = (value) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const content = [
    headers.map(escapeValue).join(","),
    ...rows.map((row) => row.map(escapeValue).join(","))
  ].join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

if (stockExportCsvButton) {
  stockExportCsvButton.addEventListener("click", (event) => {
    event.preventDefault();
    const headers = [
      "Kod",
      "Malzeme",
      "Çap",
      "Birim",
      "Adet",
      "Kritik Seviye"
    ];
    const rows = (cachedStocks || []).map((item) => [
      item.code || "",
      item.normalizedName || item.name || "",
      item.diameter || "",
      item.unit || "",
      item.quantity || 0,
      item.threshold || 0
    ]);
    downloadCsv("stok-listesi.csv", headers, rows);
  });
}

if (stockExportPdfButton) {
  stockExportPdfButton.addEventListener("click", (event) => {
    event.preventDefault();
    generateReport("stocks");
  });
}

if (reportCustomersButton) {
  reportCustomersButton.addEventListener("click", () =>
    generateReport("customers")
  );
}

if (reportStocksButton) {
  reportStocksButton.addEventListener("click", () => generateReport("stocks"));
}

if (reportCashButton) {
  reportCashButton.addEventListener("click", () => generateReport("cash"));
}

if (reportStockMovementsButton) {
  reportStockMovementsButton.addEventListener("click", () =>
    generateReport("stock-movements")
  );
}

if (reportCashSummaryButton) {
  reportCashSummaryButton.addEventListener("click", () =>
    generateReport("cash-summary")
  );
}

if (customerBalanceReportButton) {
  customerBalanceReportButton.addEventListener("click", () =>
    generateReport("customer-balance")
  );
}

if (assistantRefreshButton) {
  assistantRefreshButton.addEventListener("click", async () => {
    if (!window.mtnApp?.getData) {
      if (assistantStatusEl) {
        assistantStatusEl.textContent = "Veri servisi hazır değil.";
      }
      return;
    }
    const data = await window.mtnApp.getData();
    renderAssistant(data);
  });
}

if (detailCustomerSelect) {
  detailCustomerSelect.addEventListener("change", async () => {
    const data = await window.mtnApp.getData();
    renderCustomerDetail(data);
    const customerId = detailCustomerSelect?.value;
    const selectedCustomer = (data.customers || []).find(
      (customer) => customer.id === customerId
    );
    if (selectedCustomer && customerDetailTitle) {
      customerDetailTitle.textContent = `${selectedCustomer.code || ""} ${selectedCustomer.name || ""}`.trim();
    }
    if (selectedCustomer) {
      updateSupplierUI(selectedCustomer.id);
    }
  });
}

if (detailReportButton) {
  detailReportButton.addEventListener("click", async () => {
    if (!window.mtnApp?.generateReport) {
      reportPathEl.textContent = "Rapor servisi hazır değil.";
      return;
    }
    const customerId = detailCustomerSelect?.value;
    if (!customerId) {
      reportPathEl.textContent = "Lütfen cari seçin.";
      return;
    }
    const data = await window.mtnApp.getData();
    const customerName =
      detailCustomerSelect?.selectedOptions?.[0]?.textContent || "Cari";

    const sales = (data.sales || []).filter((sale) => sale.customerId === customerId);
    const payments = (data.cashTransactions || []).filter((entry) => entry.customerId === customerId);
    const debts = (data.customerDebts || []).filter((entry) => entry.customerId === customerId);
    const jobs = (data.customerJobs || []).filter((entry) => entry.customerId === customerId);

    const entries = [
      ...sales.map((sale) => ({
        createdAt: sale.createdAt,
        type: "Satış",
        amount: Number(sale.total || 0),
        note: "Satış faturası",
        method: "-"
      })),
      
      ...jobs.map((job) => ({
        createdAt: job.createdAt,
        type: "İş Kalemi",
        amount: Number(job.total || 0),
        note: job.title || "İş Kalemi",
        method: "-"
      })),
...debts.map((debt) => ({
        createdAt: debt.createdAt,
        type: "Borç",
        amount: Number(debt.amount || 0),
        note: debt.note || "Cari Borç",
        method: "-"
      })),
      ...payments.map((payment) => ({
        createdAt: payment.createdAt,
        type: payment.type === "gelir" ? "Tahsilat" : "Ödeme",
        amount: Number(payment.amount || 0),
        note: payment.note || "Cari İşlem",
        method: String(payment.paymentMethod || "NAKIT").toUpperCase()
      }))
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let running = 0;
    const ledgerRows = entries.map((e) => {
      if (e.type === "Tahsilat" || e.type === "Ödeme") running -= Number(e.amount || 0);
      else running += Number(e.amount || 0);
      return [
        new Date(e.createdAt).toLocaleDateString("tr-TR"),
        e.type,
        e.method || "-",
        formatCurrency(Number(e.amount || 0)),
        formatCurrency(Number(running || 0)),
        e.note || "-"
      ];
    });

    const jobRows = (jobs || [])
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((job) => [
        new Date(job.createdAt).toLocaleDateString("tr-TR"),
        job.title || "-",
        String(job.quantity || 0),
        String(job.unit || "-").toUpperCase(),
        formatCurrency(Number(job.unitPrice || 0)),
        formatCurrency(Number(job.total || 0)),
        job.note || "-"
      ]);

    const sumSales = sales.reduce((s, x) => s + Number(x.total || 0), 0);
    const sumJobs = jobs.reduce((s, x) => s + Number(x.total || 0), 0);
    const sumDebt = debts.reduce((s, x) => s + Number(x.amount || 0), 0);
    const sumCollect = payments.filter(p => p.type === "gelir").reduce((s, x) => s + Number(x.amount || 0), 0);
    const sumPay = payments.filter(p => p.type !== "gelir").reduce((s, x) => s + Number(x.amount || 0), 0);
    const net = (sumSales + sumJobs + sumDebt) - (sumCollect + sumPay);

    const html = buildCustomerFullReportHtml(customerName, ledgerRows, jobRows, {
      sales: formatCurrency(sumSales),
      jobs: formatCurrency(sumJobs),
      debt: formatCurrency(sumDebt),
      collect: formatCurrency(sumCollect),
      pay: formatCurrency(sumPay),
      net: formatCurrency(net)
    });

    const result = await window.mtnApp.generateReport({
      title: `Cari-Rapor-${customerName.replace(/\s+/g, "-")}`,
      html,
      docNo: customerId
    });
    const ok = handleReportResult(result, reportPathEl, "Cari Raporu");
    if (ok) {
      await window.mtnApp?.openFile?.(result.reportFile);
    }
  });
}

if (offerPdfButton) {
  offerPdfButton.addEventListener("click", async () => {
    if (!window.mtnApp?.generateReport) {
      reportPathEl.textContent = "Rapor servisi hazır değil.";
      return;
    }
    const rows = Array.from(offerBody.querySelectorAll("tr")).map((row) => [
      row.querySelector("[data-field='name']")?.value || "-",
      row.querySelector("[data-field='quantity']")?.value || "0",
      row.querySelector("[data-field='unit']")?.value || "-",
      row.querySelector("[data-field='price']")?.value || "0",
      row.querySelector("[data-field='total']")?.value || "0"
    ]);
    const html = buildOfferHtml("İç Tesisat Teklif", rows, {
      subtotal: subtotalEl.textContent,
      vat: vatTotalEl.textContent,
      total: totalEl.textContent
    });
    const result = await window.mtnApp.generateReport({
      title: "Satis-Faturasi",
      html
    });
    handleReportResult(result, reportPathEl, "Satış PDF");
  });
}

if (offerSaveButton) {
  offerSaveButton.addEventListener("click", async () => {
    if (!window.mtnApp?.createSale) {
      reportPathEl.textContent = "Satış servisi hazır değil.";
      return;
    }
    const customerId = offerCustomerSelect?.value || "";
    const customerName =
      offerCustomerSelect?.selectedOptions?.[0]?.textContent || "Genel";
    const vatRate = Number(vatInput?.value || 0);
    const items = Array.from(offerBody.querySelectorAll("tr")).map((row) => ({
      name: row.querySelector("[data-field='name']")?.value || "",
      quantity: Number(row.querySelector("[data-field='quantity']")?.value || 0),
      unit: row.querySelector("[data-field='unit']")?.value || "",
      price: Number(row.querySelector("[data-field='price']")?.value || 0),
      total: Number(row.querySelector("[data-field='total']")?.value || 0)
    }));
    const total = Number(
      totalEl.textContent.replace(/[^\d,.-]/g, "").replace(",", ".")
    );
    const result = await window.mtnApp.createSale({
      customerId,
      customerName,
      vatRate,
      paymentType: offerPaymentSelect?.value || "nakit",
      total,
      items
    });
    renderStocks(result.stocks || []);
    renderStockMovements(result.stockMovements || []);
    renderCash(result.cashTransactions || []);
    renderSales(result.sales || []);
    renderCustomers(result.customers || []);
    renderSummary(result);
    renderCustomerDetail(result);
    refreshCustomerDetailIfOpen(result, customerId);
    refreshAccountingPanels(result);
    reportPathEl.textContent = "Satış kaydedildi ve stok güncellendi.";
  });
}

if (offerPdfIndustrialButton) {
  offerPdfIndustrialButton.addEventListener("click", async () => {
    if (!window.mtnApp?.generateReport) {
      reportPathEl.textContent = "Rapor servisi hazır değil.";
      return;
    }
    const rows = Array.from(offerBodyIndustrial?.querySelectorAll("tr") || []).map(
      (row) => [
        row.querySelector("[data-field='name']")?.value || "-",
        row.querySelector("[data-field='quantity']")?.value || "0",
        row.querySelector("[data-field='unit']")?.value || "-",
        row.querySelector("[data-field='price']")?.value || "0",
        row.querySelector("[data-field='total']")?.value || "0"
      ]
    );
    const html = buildOfferHtml("Endüstriyel Teklif", rows, {
      subtotal: offerSubtotalIndustrial?.textContent || "₺0,00",
      vat: offerVatTotalIndustrial?.textContent || "₺0,00",
      total: offerTotalIndustrial?.textContent || "₺0,00"
    });
    const result = await window.mtnApp.generateReport({
      title: "Endustriyel-Teklif",
      html
    });
    handleReportResult(result, reportPathEl, "Teklif PDF");
  });
}

const saveProposal = async (type) => {
  if (!window.mtnApp?.createProposal || !window.mtnApp?.generateReport) {
    setStatus("Teklif servisi hazır değil.");
    return;
  }
  const isIndustrial = type === "industrial";
  const rowsSource = isIndustrial ? offerBodyIndustrial : offerBody;
  const titleInput = isIndustrial ? offerTitleIndustrial : offerTitleInput;
  const dateInput = isIndustrial ? offerDateIndustrial : offerDateInput;
  const waybillInput = isIndustrial ? offerWaybillIndustrial : offerWaybillInput;
  const vatRateInput = isIndustrial ? offerVatIndustrial : vatInput;
  const vatManualInput = isIndustrial ? offerVatManualIndustrial : offerVatManualInput;
  const totalElTarget = isIndustrial ? offerTotalIndustrial : totalEl;

  const rows = Array.from(rowsSource?.querySelectorAll("tr") || []).map((row) => [
    row.querySelector("[data-field='name']")?.value || "-",
    row.querySelector("[data-field='quantity']")?.value || "0",
    row.querySelector("[data-field='unit']")?.value || "-",
    row.querySelector("[data-field='price']")?.value || "0",
    row.querySelector("[data-field='total']")?.value || "0"
  ]);
  const items = Array.from(rowsSource?.querySelectorAll("tr") || []).map((row) => {
    const name = row.querySelector("[data-field='name']")?.value || "-";
    const quantity = row.querySelector("[data-field='quantity']")?.value || "0";
    const unit = row.querySelector("[data-field='unit']")?.value || "-";
    const price = row.querySelector("[data-field='price']")?.value || "0";
    const total = row.querySelector("[data-field='total']")?.value || "0";
    return { name, quantity, unit, price, total };
  });

  const safeVatRate = Number(vatRateInput?.value || 0);
  const safeVatManual = Number(vatManualInput?.value || 0);

  const dataBefore = await window.mtnApp.getData();
  const existingProposals = dataBefore?.proposals || [];

  const nextSerial = (prefix, values) => {
    const rx = new RegExp(`^${prefix}(\\d{4})$`);
    const max = (values || []).reduce((acc, v) => {
      const m = String(v || "").match(rx);
      const n = m ? Number(m[1]) : 0;
      return Math.max(acc, n);
    }, 0);
    return `${prefix}${String(max + 1).padStart(4, "0")}`;
  };

  const offerNo = nextSerial("TEK", existingProposals.map((p) => p.offerNo));
  const waybillAuto = nextSerial("IRSL", existingProposals.map((p) => p.waybillNo));

  const waybillNo = (waybillInput?.value || "").trim() || waybillAuto;
  if (waybillInput && !waybillInput.value) waybillInput.value = waybillNo;

  const customerId = offerCustomerSelect?.value || "";
  const customerName = offerCustomerSelect?.selectedOptions?.[0]?.textContent || "";


  const html = buildOfferHtml(
    isIndustrial ? "Endüstriyel Teklif" : "İç Tesisat Teklif",
    rows,
    {
      subtotal: isIndustrial
        ? offerSubtotalIndustrial?.textContent || "₺0,00"
        : subtotalEl.textContent,
      vat: isIndustrial
        ? offerVatTotalIndustrial?.textContent || "₺0,00"
        : vatTotalEl.textContent,
      total: isIndustrial
        ? offerTotalIndustrial?.textContent || "₺0,00"
        : totalEl.textContent,
      offerNo,
      waybillNo,
      offerDate: dateInput?.value || "",
      customerName
    }
  );
  const report = await window.mtnApp.generateReport({
    title: isIndustrial ? "Endustriyel-Teklif" : "Ic-Tesisat-Teklif",
    html,
    docNo: offerNo
  });
  const pdfOk = handleReportResult(report, reportPathEl, "Teklif PDF");
  const data = await window.mtnApp.createProposal({
    title: titleInput?.value || (isIndustrial ? "Endüstriyel Teklif" : "İç Tesisat Teklif"),
    type: isIndustrial ? "industrial" : "internal",
    offerNo,
    waybillNo,
    customerId,
    customerName: customerName || "Genel",
    items,
    totals: {
      subtotal: isIndustrial ? (offerSubtotalIndustrial?.textContent || "₺0,00") : (subtotalEl.textContent || "₺0,00"),
      vat: isIndustrial ? (offerVatTotalIndustrial?.textContent || "₺0,00") : (vatTotalEl.textContent || "₺0,00"),
      total: isIndustrial ? (offerTotalIndustrial?.textContent || "₺0,00") : (totalEl.textContent || "₺0,00")
    },
    total: parseCurrencyValue(totalElTarget?.textContent || "0"),
    vatRate: safeVatRate,
    vatManual: safeVatManual,
    createdAt: dateInput?.value
      ? `${dateInput.value}T${new Date().toTimeString().slice(0, 8)}`
      : new Date().toISOString(),
    pdfPath: pdfOk ? report.reportFile : ""
  });
  renderOffers(data.proposals || []);
  refreshAccountingPanels(data);
  setStatus("Teklif kaydedildi.");
};

if (offerSaveProposalButton) {
  offerSaveProposalButton.addEventListener("click", () => saveProposal("internal"));
}
if (offerSaveProposalIndustrialButton) {
  offerSaveProposalIndustrialButton.addEventListener("click", () => saveProposal("industrial"));
}

if (offerApplyMarginButton) {
  offerApplyMarginButton.addEventListener("click", (event) => {
    event.preventDefault();
    const margin = Number(offerMarginInput?.value || 0);
    if (!margin) {
      return;
    }
    const rows = Array.from(offerBody.querySelectorAll("tr"));
    rows.forEach((row) => {
      const priceInput = row.querySelector("[data-field='price']");
      const current = Number(priceInput?.value || 0);
      if (priceInput && current) {
        priceInput.value = (current * (1 + margin / 100)).toFixed(2);
      }
    });
    calculateTotal();
  });
}

const offerTitles = {
  internal: "İç Tesisat Teklif",
  industrial: "Endüstriyel Teklif",
  saved: "Tekliflerim"
};

const openOfferWorkspace = (target) => {
  if (offerHome) {
    offerHome.classList.add("is-hidden");
  }
  if (offerWorkspace) {
    offerWorkspace.classList.remove("is-hidden");
  }
  if (salesPanel) {
    salesPanel.classList.add("sales-panel--workspace");
  }
  if (contentScroll) {
    contentScroll.scrollTop = 0;
  }
  if (offerWorkspaceTitle) {
    offerWorkspaceTitle.textContent = offerTitles[target] || "Teklif";
  }
  offerTabs.forEach((btn) => {
    btn.classList.toggle("tab-button--active", btn.dataset.offerTab === target);
  });
  offerPanels.forEach((panel) => {
    panel.classList.toggle(
      "tab-panel--hidden",
      panel.dataset.offerTabPanel !== target
    );
  });
};

const showOfferHome = () => {
  if (offerWorkspace) {
    offerWorkspace.classList.add("is-hidden");
  }
  if (offerHome) {
    offerHome.classList.remove("is-hidden");
  }
  if (salesPanel) {
    salesPanel.classList.remove("sales-panel--workspace");
  }
  if (contentScroll) {
    contentScroll.scrollTop = 0;
  }
};

offerHomeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.offerHome;
    if (target) {
      openOfferWorkspace(target);
      if (button.dataset.offerLabel) {
        setStatus(`Teklif menüsü açıldı: ${button.dataset.offerLabel}.`);
      }
    }
  });
});

offerBackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showOfferHome();
    setStatus("Teklif menüsüne dönüldü.");
  });
});

if (offerTabs.length) {
  offerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.offerTab;
      openOfferWorkspace(target);
    });
  });
}

if (addRowIndustrialButton && offerBodyIndustrial) {
  addRowIndustrialButton.addEventListener("click", () => {
    offerBodyIndustrial.appendChild(createIndustrialRow());
  });
}

if (offerRefreshButton) {
  offerRefreshButton.addEventListener("click", async () => {
    const data = await window.mtnApp?.getData?.();
    renderOffers(data?.proposals || []);
    setStatus("Teklif listesi güncellendi.");
  });

if (offerSearchInput) {
  offerSearchInput.addEventListener("input", () => {
    offerSearchQuery = offerSearchInput.value || "";
    renderOffers(cachedProposals || []);
  });
}
}

if (offerStockSearchButton) {
  offerStockSearchButton.addEventListener("click", (event) => {
    event.preventDefault();
    renderOfferStockPicker("internal", cachedStocks);
  });
}

if (offerStockSearchInput) {
  offerStockSearchInput.addEventListener("input", () => {
    renderOfferStockPicker("internal", cachedStocks);
  });
}

if (offerStockSearchButtonIndustrial) {
  offerStockSearchButtonIndustrial.addEventListener("click", (event) => {
    event.preventDefault();
    renderOfferStockPicker("industrial", cachedStocks);
  });
}

if (offerStockSearchInputIndustrial) {
  offerStockSearchInputIndustrial.addEventListener("input", () => {
    renderOfferStockPicker("industrial", cachedStocks);
  });
}

if (restoreBackupButton) {
  restoreBackupButton.addEventListener("click", async () => {
    if (!window.mtnApp?.restoreBackup) {
      setStatus("Geri yükleme servisi hazır değil.");
      return;
    }
    const file = restoreBackupFileInput?.files?.[0];
    if (!file) {
      setStatus("Lütfen yedek dosyası seçin.");
      return;
    }
    const result = await window.mtnApp.restoreBackup({ path: file.path });
    if (!result.ok) {
      setStatus(result.error || "Geri yükleme başarısız.");
      return;
    }
    renderCustomers(result.data.customers || []);
    renderStocks(result.data.stocks || []);
    renderStockList(result.data.stocks || []);
    renderCash(result.data.cashTransactions || []);
    renderSales(result.data.sales || []);
    renderStockMovements(result.data.stockMovements || []);
    renderInvoices(result.data.invoices || []);
    renderOffers(result.data.proposals || []);
    refreshAccountingPanels(result.data);
    renderSummary(result.data);
    if (restoreBackupStatus) {
      restoreBackupStatus.textContent = "Yedek başarıyla geri yüklendi.";
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
  loginForm.addEventListener("input", () => {
    if (loginError?.textContent) {
      loginError.textContent = "";
    }
  });
}

if (aiReminderForm) {
  aiReminderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(aiReminderForm);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.title || !payload.dueDate) {
      setStatus("Hatırlatma başlığı ve ödeme tarihini girin.");
      return;
    }
    const reminders = loadReminders();
    const reminder = {
      id: `REM-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      title: payload.title.trim(),
      dueDate: payload.dueDate,
      category: payload.category || "Şahsi Ödeme"
    };
    reminders.push(reminder);
    saveReminders(reminders);
    aiReminderForm.reset();
    updateReminderUI();
  });
  updateReminderUI();
}

if (loginScreen) {
  showLoginScreen();
}

if (splashScreen) {
  setTimeout(hideSplash, splashDurationMs);
}

if (customerTabButtons.length) {
  customerTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.customerTab;
      if (!tabId) {
        return;
      }
      showCustomerTab(tabId);
    });
  });
  showCustomerTab("list");
}

// Menu click handler
const menuItems = document.querySelectorAll(".menu__item, .menu__subitem");
const menuActionItems = document.querySelectorAll(".menu__action[data-panel]");
const panels = document.querySelectorAll(".panel");
const quickActionButtons = document.querySelectorAll(
  ".action-card, .quick-pill"
);
const panelTitleEl = document.getElementById("panel-title");

// MTN: Collapsible sidebar groups (ERP menü)
const setupMenuGroups = () => {
  const groups = document.querySelectorAll(".menu__group");
  groups.forEach((group) => {
    const key = group.dataset.group || "";
    const header = group.querySelector(".menu__group-header");
    const saved = localStorage.getItem("mtn_menu_group_" + key);
    if (saved !== "open") group.classList.add("is-collapsed");

    if (header) {
      header.addEventListener("click", () => {
        const willOpen = group.classList.contains("is-collapsed");
        if (willOpen) {
          groups.forEach((g) => {
            if (g !== group) {
              g.classList.add("is-collapsed");
              const k = g.dataset.group || "";
              localStorage.setItem("mtn_menu_group_" + k, "collapsed");
            }
          });
        }
        group.classList.toggle("is-collapsed");
        localStorage.setItem(
          "mtn_menu_group_" + key,
          group.classList.contains("is-collapsed") ? "collapsed" : "open"
        );
      });
    }
  });
};

setupMenuGroups();


const panelTitles = {
  "dashboard-panel": "Ana Menü",
  "customers-panel": "Cari",
  "stocks-panel": "Stok",
  "stock-list-panel": "Malzeme Stok Listesi",
  "sales-panel": "Teklif",
  "invoices-panel": "Fatura",
  "cash-panel": "Kasa",
  "reports-panel": "Raporlar",
  "assistant-panel": "Asistan",
  "engineering-panel": "Mühendislik",
  "settings-panel": "Ayarlar"
};

const panelSubnavConfig = {
  "stocks-panel": [
    { id: "stok", label: "Stok", selectors: ["#stock-form"] },
    { id: "stok-listesi", label: "Stok Listesi", selectors: ["#stock-list-card"] },
    { id: "fis-ekle", label: "Fiş Ekle", selectors: ["#stock-receipt-card"] },
    {
      id: "birim-donusum",
      label: "Birim Dönüşüm Tanımları",
      selectors: ["#unit-conversion-card"]
    },
    {
      id: "toplu-aktarim",
      label: "Toplu Malzeme Aktarımı",
      selectors: ["#stock-import-card"]
    },
    { id: "fis-listesi", label: "Fiş Listesi", selectors: ["#stock-receipts-list-card"] },
    { id: "stok-hareket", label: "Stok Hareketi", selectors: ["#stock-movement-module"] },
    { id: "depo-stok", label: "Depo Stok", panelTarget: "stock-list-panel" }
  ],
  "customers-panel": [
    { id: "cari-listesi", label: "Cari Listesi", selectors: ["#customer-list-section"] },
    { id: "cari-ekleme", label: "Cari Ekleme", selectors: ["#customer-form-section"] },
    { id: "cari-islem", label: "Cari İşlem", selectors: ["#customer-transaction-section"] },
    { id: "cari-detay", label: "Cari Detay", selectors: ["#customer-detail-section"] },
    { id: "cari-ekstre", label: "Cari Ekstre", selectors: ["#customer-detail-module"] },
    { id: "usta-puantaj", label: "Usta Puantaj", selectors: ["#worker-timesheet-module"] }
  ],

  "sales-panel": [
    { id: "menu", label: "Teklif Menüsü", action: "offer-home" },
    { id: "internal", label: "İç Tesisat", action: "offer-workspace" },
    { id: "industrial", label: "Endüstriyel", action: "offer-workspace" },
    { id: "saved", label: "Tekliflerim", action: "offer-workspace" }
  ]
};


function closeAllOverlays() {
  try { document.querySelectorAll('.mtn-overlay').forEach((el)=>el.remove()); } catch (_) {}

  try {
    document.getElementById('mtn-bulk-modal')?.classList.remove('show');
    document.getElementById('mtn-stock-picker')?.classList.remove('show');
  } catch (_) {}
  try {
    if (typeof customerInlinePanel !== 'undefined' && customerInlinePanel) {
      customerInlinePanel.classList.add('is-hidden');
    }
    if (typeof inlineFormContainer !== 'undefined' && inlineFormContainer) {
      inlineFormContainer.innerHTML = '';
    }
  } catch (_) {}
  try {
    if (typeof setCustomerWorkspace === 'function') {
      setCustomerWorkspace('list');
    }
  } catch (_) {}
  try {
    if (typeof showOfferHome === 'function') {
      showOfferHome();
    }
  } catch (_) {}
  try { offerCustomerFilterName = ""; } catch (_) {}

  try { if (currentPanelId) forceKeyboardFocus(currentPanelId); } catch (_) {}
}

function forceKeyboardFocus(panelId) {
  try {
    // Kapanmış/üstte kalan modallar focus kilitlemesin
    document.activeElement?.blur?.();
  } catch (_) {}
  try {
    // Görünür paneldeki ilk inputa odaklan
    const panel = document.getElementById(panelId) || document.querySelector(".panel:not(.is-hidden)");
    if (!panel) return;
    const input = panel.querySelector(
      "input:not([type=hidden]):not([disabled]):not([readonly]), textarea:not([disabled]), select:not([disabled])"
    );
    if (input) {
      input.focus();
      input.select?.();
    }
  } catch (_) {}
}


const showPanel = (panelId, title) => {
  if (currentPanelId && currentPanelId !== panelId) {
    closeAllOverlays();
  }
  currentPanelId = panelId;
  try { playUiSound("nav"); } catch (_) {}
  try { if (title) speakUi(title); } catch (_) {}

  panels.forEach((panel) => panel.classList.remove("panel--active"));
  const target = document.getElementById(panelId);
  if (target) {
    target.classList.add("panel--active");
    setupPanelSubnav(target);
  }
  if (panelTitleEl) {
    panelTitleEl.textContent = title || panelTitles[panelId] || "Panel";
  }

  try { forceKeyboardFocus(panelId); } catch (_) {}
};

const activateSubpanel = (panel, subpanelId) => {
  const config = panelSubnavConfig[panel.id];
  if (config) {
    const target = config.find((item) => item.id === subpanelId);
    if (panel.id === "sales-panel" && target?.action === "offer-home") {
      showOfferHome();
    }
    if (panel.id === "sales-panel" && target?.action === "offer-workspace") {
      openOfferWorkspace(subpanelId);
    }
    if (target?.panelTarget) {
      showPanel(target.panelTarget, panelTitles[target.panelTarget]);
      activateMenuByPanel(target.panelTarget);
      return;
    }
    const selectors = config.flatMap((item) => item.selectors || []);
    selectors.forEach((selector) => {
      panel.querySelectorAll(selector).forEach((el) => el.classList.add("subpanel--hidden"));
    });
    (target?.selectors || []).forEach((selector) => {
      panel.querySelectorAll(selector).forEach((el) => {
        el.classList.remove("subpanel--hidden");
        el.classList.remove("is-hidden");
      });
    });
  } else {
    const modules = panel.querySelectorAll(":scope > .module");
    modules.forEach((module) => {
      module.classList.toggle(
        "subpanel--hidden",
        module.dataset.subpanelId !== subpanelId
      );
    });
  }
  const buttons = panel.querySelectorAll(".panel-subnav__btn");
  buttons.forEach((button) => {
    button.classList.toggle(
      "panel-subnav__btn--active",
      button.dataset.subpanelId === subpanelId
    );
  });
};

const setupPanelSubnav = (panel) => {
  const config = panelSubnavConfig[panel.id];
  const modules = Array.from(panel.querySelectorAll(":scope > .module"));
  if (!config && modules.length <= 1) {
    return;
  }
  let subnav = panel.querySelector(".panel-subnav");
  if (!subnav) {
    subnav = document.createElement("div");
    subnav.className = "panel-subnav";
    panel.insertBefore(subnav, modules[0]);
  }
  subnav.innerHTML = "";
  const entries = config
    ? config.map((item) => ({
        subpanelId: item.id,
        label: item.label
      }))
    : modules.map((module, index) => {
        const titleEl =
          module.querySelector(".module__header h2") ||
          module.querySelector(".table-actions h3") ||
          module.querySelector("h2") ||
          module.querySelector("h3");
        const label = titleEl?.textContent?.trim() || `Bölüm ${index + 1}`;
        const subpanelId =
          module.dataset.subpanelId || `${panel.id}-section-${index + 1}`;
        module.dataset.subpanelId = subpanelId;
        return { subpanelId, label };
      });
  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "panel-subnav__btn";
    button.textContent = entry.label;
    button.dataset.subpanelId = entry.subpanelId;
    button.addEventListener("click", () => activateSubpanel(panel, entry.subpanelId));
    subnav.appendChild(button);
  });
  if (entries.length) {
    activateSubpanel(panel, entries[0].subpanelId);
  }
};

const activateMenuByPanel = (panelId) => {
  menuItems.forEach((el) => {
    // üst menü (Ana Menü gibi)
    if (el.classList.contains("menu__item")) {
      if (el.dataset.panel === panelId) el.classList.add("menu__item--active");
      else el.classList.remove("menu__item--active");
      return;
    }
    // alt menüler
    if (el.classList.contains("menu__subitem")) {
      if (el.dataset.panel === panelId) el.classList.add("is-active");
      else el.classList.remove("is-active");
    }
  });
};
menuItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const panelId = item.dataset.panel;
    if (!panelId) return;

    const title = item.dataset.title || panelTitles[panelId] || item.textContent.trim();
    const subpanelId = item.dataset.subpanel || "";

    const parentGroup = item.closest(".menu__group");
    const parentKey = parentGroup?.dataset.group || "";
    const collapseParentGroup = () => {
      if (!parentGroup) return;
      parentGroup.classList.add("is-collapsed");
      localStorage.setItem("mtn_menu_group_" + parentKey, "collapsed");
    };
    if (item.classList.contains("menu__subitem")) collapseParentGroup();

    // Aynı panelde: sadece işlem/sekme değiştir
    const runSamePanelAction = () => {
      if (panelId === "sales-panel" && subpanelId) {
        if (subpanelId === "menu") showOfferHome();
        else openOfferWorkspace(subpanelId);
        setStatus(`Açıldı: ${title}`);
        return true;
      }
      if (panelId === "cash-panel" && subpanelId) {
        const nextType = subpanelId === "gider" ? "gider" : "gelir";
        if (cashTypeInput) cashTypeInput.value = nextType;
        cashTypeButtons.forEach((btn) =>
          btn.classList.toggle("toggle-button--active", btn.dataset.cashType === nextType)
        );
        setStatus(`Açıldı: ${title}`);
        try { cashCustomerSelect?.focus?.(); } catch (_) {}
        return true;
      }
      // standart: subpanel varsa aktif et
      if (subpanelId) {
        const panelEl = document.getElementById(panelId);
        if (panelEl) {
          activateSubpanel(panelEl, subpanelId);
          try { forceKeyboardFocus(panelId); } catch (_) {}
        }
        setStatus(`Açıldı: ${title}`);
        return true;
      }
      return false;
    };

    if (currentPanelId === panelId) {
      if (runSamePanelAction()) {
        activateMenuByPanel(panelId);
        return;
      }
    }

    // Panel değiştir
    showPanel(panelId, title);
    activateMenuByPanel(panelId);

    // Panel açıldıktan sonra hedef alt menü işlemi
    if (subpanelId) {
      setTimeout(() => {
        // Teklif sekmeleri
        if (panelId === "sales-panel") {
          if (subpanelId === "menu") showOfferHome();
          else openOfferWorkspace(subpanelId);
          setStatus(`Açıldı: ${title}`);
          return;
        }
        // Kasa tür seçimi
        if (panelId === "cash-panel") {
          const nextType = subpanelId === "gider" ? "gider" : "gelir";
          if (cashTypeInput) cashTypeInput.value = nextType;
          cashTypeButtons.forEach((btn) =>
            btn.classList.toggle("toggle-button--active", btn.dataset.cashType === nextType)
          );
          try { cashCustomerSelect?.focus?.(); } catch (_) {}
          setStatus(`Açıldı: ${title}`);
          return;
        }
        // Diğer panellerde alt ekran
        const panelEl = document.getElementById(panelId);
        if (panelEl) {
          try {
            setupPanelSubnav(panelEl);
            activateSubpanel(panelEl, subpanelId);
            forceKeyboardFocus(panelId);
          } catch (_) {}
        }
        setStatus(`Açıldı: ${title}`);
      }, 0);
    }
  });
});



if (panels.length) {
  panels.forEach((panel) => setupPanelSubnav(panel));
}

menuActionItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const panelId = item.dataset.panel;
    if (!panelId) {
      return;
    }
    const title = item.dataset.title || panelTitles[panelId] || item.textContent.trim();
    const subpanelId = item.dataset.subpanel || "";
    // Aynı panelde alt menü geçişi
    if (currentPanelId === panelId && subpanelId) {
      const panelEl = document.getElementById(panelId);
      if (panelEl) {
        activateSubpanel(panelEl, subpanelId);
        try { forceKeyboardFocus(panelId); } catch (_) {}
      }
      activateMenuByPanel(panelId);
      return;
    }
    showPanel(panelId, title);
    activateMenuByPanel(panelId);
    // panel içinde alt bölüm seçilecekse
    if (subpanelId) {
      const panelEl = document.getElementById(panelId);
      if (panelEl) {
        setTimeout(() => {
          try {
            setupPanelSubnav(panelEl);
            activateSubpanel(panelEl, subpanelId);
            forceKeyboardFocus(panelId);
          } catch (_) {}
        }, 0);
      }
    }
  });
});


quickActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetPanel = button.dataset.panel;
    if (!targetPanel) {
      return;
    }
    const subpanelId = button.dataset.subpanel || "";
    const title =
      document.querySelector(`[data-panel='${targetPanel}']`)?.dataset.title ||
      panelTitles[targetPanel] ||
      "";
    showPanel(targetPanel, title);
    activateMenuByPanel(targetPanel);
    if (subpanelId) {
      const panelEl = document.getElementById(targetPanel);
      if (panelEl) {
        setTimeout(() => {
          try {
            setupPanelSubnav(panelEl);
            activateSubpanel(panelEl, subpanelId);
            forceKeyboardFocus(targetPanel);
          } catch (_) {}
        }, 0);
      }
    }
  });
});


// -----------------------------------------------------------------------------
// Live Assistant functionality
//
// The assistant provides a simple command interface within the dashboard.
// Users can type short instructions such as "stoklara 30 adet kombi ekle" and
// receive a confirmation message. Commands are currently handled locally by
// matching against regular expressions. When recognised, a short summary
// message prefaced with a check mark (✔) is appended to the log. Unrecognised
// commands are flagged with a cross (⨯).

/**
 * Append a message to the live assistant log and keep the scroll at the
 * bottom. The log is a simple list of div elements that record user
 * commands and system responses. Messages are inserted as plain text.
 *
 * @param {string} message The message to append
 */
const appendAssistantLog = (message) => {
  if (!assistantLog) {
    return;
  }
  const entry = document.createElement('div');
  entry.textContent = message;
  assistantLog.appendChild(entry);
  assistantLog.scrollTop = assistantLog.scrollHeight;

  // MTN: Yapay zeka paneli konuşması (kadın ses, ayardan kontrol)
  try {
    if (voiceEnabled && window.MTN?.TTS && window.MTN.TTS.isEnabled()) {
      const txt = String(message || "").replace(/^[•⨯✔]\s*/g, "").trim();
      if (txt) window.MTN.TTS.speak(txt);
    }
  } catch (_) {}
};

/**
 * Parses a given assistant command string and performs the corresponding
 * action. For now actions are limited to appending a confirmation message
 * to the log. Commands are matched using regular expressions. If no
 * command matches, a generic error message is logged.
 *
 * @param {string} command The raw command entered by the user
 */
const handleAssistantCommand = async (command) => {
  const raw = String(command || '').trim();
  const input = raw.toLowerCase();
  if (!input) {
    return;
  }
  // Detect multi-line stock import commands and create a draft stock receipt.
  if (raw.includes('\n')) {
    // Each line should represent an item with a quantity and name, e.g. "30 kombi"
    const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const receiptItems = [];
    for (const line of lines) {
      // Try to parse "qty name" or "name qty"
      const parts = line.split(/\s+/);
      if (!parts.length) continue;
      let qty;
      let name;
      // if first part is number
      if (!Number.isNaN(parseFloat(parts[0]))) {
        qty = parseFloat(parts[0]);
        name = parts.slice(1).join(' ');
      } else if (!Number.isNaN(parseFloat(parts[parts.length - 1]))) {
        qty = parseFloat(parts[parts.length - 1]);
        name = parts.slice(0, -1).join(' ');
      }
      if (qty && name) {
        receiptItems.push({ name: name.trim(), quantity: qty, unit: 'adet', warehouse: 'Ana Depo' });
      }
    }
    if (receiptItems.length) {
      const proceed = window.confirm('Çok satırlı depo giriş fişi oluşturmak üzeresiniz. Her satır depoya aktarılmadan taslak kaydedilecek. Devam etmek ister misiniz?');
      if (!proceed) {
        appendAssistantLog('⨯ İşlem iptal edildi.');
        return;
      }
      try {
        const today = new Date().toISOString();
        await window.mtnApp.createStockReceipt({
          items: receiptItems,
          createdAt: today,
          supplier: '',
          warehouse: 'Ana Depo',
          note: 'Taslak Depo Giriş',
          draft: true
        });
        const data = await window.mtnApp.getData();
        renderStocks(data.stocks || []);
        renderStockMovements(data.stockMovements || []);
        renderSummary(data);
        refreshAccountingPanels(data);
        appendAssistantLog(`✔ Taslak depo fişi oluşturuldu (${receiptItems.length} satır). Depoya aktarmak için fişi onaylayın.`);
      } catch (err) {
        appendAssistantLog('⨯ Taslak fiş oluşturulamadı.');
      }
    } else {
      appendAssistantLog('⨯ Geçerli satır bulunamadı. Her satır "miktar malzeme" olmalıdır.');
    }
    return;
  }
  let match;
  // 1) Stok ekleme komutları ("ana depoya" varyasyonları)
  match = input.match(/^ana depoya\s+(\d+)\s+(.+)\s*ekle$/) || input.match(/^ana depoya\s+(.+?)\s+(\d+)\s*(?:adet\s*)?(?:ekle)?$/) || input.match(/^ana depoya\s+(\d+)\s*(?:adet\s*)?(.+?)\s*(?:ekle)?$/);
  if (match) {
    let qty;
    let itemName;
    if (isNaN(parseInt(match[1], 10))) {
      itemName = match[1].trim();
      qty = parseInt(match[2], 10);
    } else {
      qty = parseInt(match[1], 10);
      itemName = match[2].trim();
    }
    if (!isNaN(qty) && itemName) {
      const approved = window.confirm(`${qty} adet ${itemName.toUpperCase()} stoğa eklensin mi?`);
      if (!approved) {
        appendAssistantLog('⨯ İşlem iptal edildi.');
        return;
      }
      try {
        const today = new Date().toISOString().split('T')[0];
        await window.mtnApp.createStock({
          name: itemName,
          unit: 'adet',
          quantity: qty,
          warehouse: 'Ana Depo',
          createdAt: today
        });
        const data = await window.mtnApp.getData();
        renderStocks(data.stocks || []);
        renderStockMovements(data.stockMovements || []);
        renderSummary(data);
        refreshAccountingPanels(data);
        appendAssistantLog(`✔ Ana Depo’ya ${qty} adet ${itemName.toUpperCase()} eklendi.`);
      } catch (err) {
        appendAssistantLog('⨯ Stok eklenemedi.');
      }
    } else {
      appendAssistantLog('⨯ Geçersiz stok komutu.');
    }
    return;
  }
  // 2) Genel stok ekleme komutları ("stoklara ... ekle")
  match = input.match(/^stoklara\s+(\d+)\s+adet\s+(.+)\s*ekle$/) || input.match(/^stoklara\s+(.+?)\s+(\d+)\s*(?:adet\s*)?(?:ekle)?$/) || input.match(/^stoklara\s+(\d+)\s*(?:adet\s*)?(.+?)\s*(?:ekle)?$/);
  if (match) {
    let qty;
    let itemName;
    if (isNaN(parseInt(match[1], 10))) {
      itemName = match[1].trim();
      qty = parseInt(match[2], 10);
    } else {
      qty = parseInt(match[1], 10);
      itemName = match[2].trim();
    }
    if (!isNaN(qty) && itemName) {
      const approved = window.confirm(`${qty} adet ${itemName.toUpperCase()} stoklara eklensin mi?`);
      if (!approved) {
        appendAssistantLog('⨯ İşlem iptal edildi.');
        return;
      }
      try {
        const today = new Date().toISOString().split('T')[0];
        await window.mtnApp.createStock({
          name: itemName,
          unit: 'adet',
          quantity: qty,
          warehouse: 'Ana Depo',
          createdAt: today
        });
        const data = await window.mtnApp.getData();
        renderStocks(data.stocks || []);
        renderStockMovements(data.stockMovements || []);
        renderSummary(data);
        refreshAccountingPanels(data);
        appendAssistantLog(`✔ ${qty} adet ${itemName.toUpperCase()} stoklara eklendi.`);
      } catch (err) {
        appendAssistantLog('⨯ Stok eklenemedi.');
      }
    } else {
      appendAssistantLog('⨯ Geçersiz stok komutu.');
    }
    return;
  }
  // 3) Kritik stokları göster
  if (input === 'kritik stokları göster') {
    const low = (cachedStocks || []).filter((s) => {
      return Number(s.quantity || 0) <= Number(s.threshold || 0);
    });
    if (low.length) {
      const names = low.map((s) => `${s.name} (${s.quantity})`).join(', ');
      appendAssistantLog(`✔ Kritik stoklar: ${names}`);
    } else {
      appendAssistantLog('✔ Kritik stok bulunmuyor.');
    }
    return;
  }
  // 4) Stok durumu göster: "<item> stok durumunu göster"
  match = input.match(/^(.+)\s+stok durumunu göster$/);
  if (match) {
    const itemNameRaw = match[1].trim();
    const normalized = normalizeText(itemNameRaw);
    const stock = (cachedStocks || []).find((s) => normalizeText(s.name || '') === normalized || normalizeText(s.code || '') === normalized);
    if (stock) {
      appendAssistantLog(`✔ ${stock.name.toUpperCase()} stok durumu: ${stock.quantity} ${stock.unit || ''}`);
    } else {
      appendAssistantLog('⨯ Stok bulunamadı.');
    }
    return;
  }
  // 5) Cari açma komutları
  match = input.match(/^(.+)\s+carisini aç$/) || input.match(/^(.+)\s+cari(?:yi)?\s+aç$/);
  if (match) {
    const nameRaw = match[1].trim();
    const normalized = normalizeText(nameRaw);
    const cust = (cachedCustomers || []).find((c) => normalizeText(c.name || '') === normalized || normalizeText(c.code || '') === normalized || normalizeText(c.normalizedName || '') === normalized);
    if (cust) {
      openCustomerDetail(cust);
      appendAssistantLog(`✔ ${cust.name.toUpperCase()} cari kartı açıldı.`);
    } else {
      const confirmCreate = window.confirm(`${nameRaw} cari kaydı bulunamadı. Yeni cari oluşturulsun mu?`);
      if (!confirmCreate) {
        appendAssistantLog('⨯ İşlem iptal edildi.');
        return;
      }
      try {
        await window.mtnApp.createCustomer({ name: nameRaw, type: 'musteri' });
        const data = await window.mtnApp.getData();
        renderCustomers(data.customers || []);
        renderSummary(data);
        refreshAccountingPanels(data);
        const created = (data.customers || []).find((c) => normalizeText(c.name || '') === normalized);
        if (created) {
          openCustomerDetail(created);
          appendAssistantLog(`✔ ${created.name.toUpperCase()} cari oluşturuldu ve açıldı.`);
        }
      } catch (e) {
        appendAssistantLog('⨯ Cari oluşturulamadı.');
      }
    }
    return;
  }
  // 6) Borç gösterme komutları
  match = input.match(/^(.+)\s+borcunu göster$/) || input.match(/^(.+)\s+bor[çc]\s+göster$/);
  if (match) {
    const nameRaw = match[1].trim();
    const normalized = normalizeText(nameRaw);
    const cust = (cachedCustomers || []).find((c) => normalizeText(c.name || '') === normalized || normalizeText(c.code || '') === normalized || normalizeText(c.normalizedName || '') === normalized);
    if (cust) {
      const balance = Number(cust.balance || 0);
      const debt = balance > 0 ? balance : 0;
      const formatted = debt.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      appendAssistantLog(`✔ ${cust.name.toUpperCase()} borcu ${formatted} TL`);
    } else {
      appendAssistantLog('⨯ Cari bulunamadı.');
    }
    return;
  }
  // 7) Bakiye gösterme komutları
  match = input.match(/^(.+)\s+bakiyesini söyle$/) || input.match(/^(.+)\s+bakiye$/);
  if (match) {
    const nameRaw = match[1].trim();
    const normalized = normalizeText(nameRaw);
    const cust = (cachedCustomers || []).find((c) => normalizeText(c.name || '') === normalized || normalizeText(c.code || '') === normalized || normalizeText(c.normalizedName || '') === normalized);
    if (cust) {
      const balance = Number(cust.balance || 0);
      const formatted = balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      appendAssistantLog(`✔ ${cust.name.toUpperCase()} bakiyesi ${formatted} TL`);
    } else {
      appendAssistantLog('⨯ Cari bulunamadı.');
    }
    return;
  }
  // 8) Vadesi yaklaşan carileri göster
  if (input === 'vadesi yaklaşan carileri göster') {
    const now = Date.now();
    const horizon = now + 7 * 24 * 60 * 60 * 1000;
    const dueSoon = (cachedCustomers || []).filter((c) => {
      const balance = Number(c.balance || 0);
      if (balance <= 0) return false;
      const dueDate = getCustomerDueDate(c);
      return dueDate && dueDate.getTime() <= horizon && dueDate.getTime() >= now;
    });
    if (dueSoon.length) {
      const names = dueSoon.map((c) => c.name).join(', ');
      appendAssistantLog(`✔ Vadesi yaklaşan cariler: ${names}`);
    } else {
      appendAssistantLog('✔ Vadesi yaklaşan cari bulunmuyor.');
    }
    return;
  }
  // 9) Tahsilat girme komutları
  match = input.match(/^(.+)\s*(?:dan|den)\s*(\d+)\s*tl\s*tahsilat gir$/) || input.match(/^(.+)\s+tahsilat\s*(\d+)\s*(?:tl)?$/);
  if (match) {
    const nameRaw = match[1].trim();
    const amount = match[2];
    const normalized = normalizeText(nameRaw);
    const cust = (cachedCustomers || []).find((c) => normalizeText(c.name || '') === normalized || normalizeText(c.code || '') === normalized || normalizeText(c.normalizedName || '') === normalized);
    if (!cust) {
      appendAssistantLog('⨯ Cari bulunamadı.');
      return;
    }
    const confirmTx = window.confirm(`${cust.name}’dan ${amount} TL tahsilat girmek üzeresiniz. Devam edilsin mi?`);
    if (!confirmTx) {
      appendAssistantLog('⨯ İşlem iptal edildi.');
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await window.mtnApp.createCustomerTransaction({
        customerId: cust.id,
        type: 'tahsilat',
        amount: amount,
        note: '',
        createdAt: today
      });
      cachedCustomerDebts = result.customerDebts || [];
      cachedCustomers = result.customers || [];
      cachedCashTransactions = result.cashTransactions || [];

      renderCustomers(result.customers || []);
      renderCash(result.cashTransactions || []);
      renderSummary(result);
      renderCustomerDetail(result);
      refreshCustomerDetailIfOpen(result, activeCustomerId);
      refreshAccountingPanels(result);
      const formattedAmount = Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 0 });
      appendAssistantLog(`✔ ${cust.name.toUpperCase()}’dan ${formattedAmount} TL tahsilat kaydedildi.`);
    } catch (err) {
      appendAssistantLog('⨯ Tahsilat kaydedilemedi.');
    }
    return;
  }
  // 10) Bugünkü durumu özetle
  if (input === 'bugünkü durumu özetle') {
    try {
      const data = await window.mtnApp.getData();
      renderSummary(data);
      refreshAccountingPanels(data);
      const totalReceivables = (data.customers || []).reduce((sum, c) => sum + Math.max(Number(c.balance || 0), 0), 0);
      const totalPayables = (data.customers || []).reduce((sum, c) => sum + Math.abs(Math.min(Number(c.balance || 0), 0)), 0);
      let cashBalance = 0;
      (data.cashTransactions || []).forEach((tx) => {
        const amt = Number(tx.amount || 0);
        if (tx.type === 'tahsilat') {
          cashBalance += amt;
        } else if (tx.type === 'odeme') {
          cashBalance -= amt;
        }
      });
      appendAssistantLog(`✔ Bugünkü durum: Alacak ${formatCurrency(totalReceivables)}, Borç ${formatCurrency(totalPayables)}, Kasa ${formatCurrency(cashBalance)}.`);
    } catch (err) {
      appendAssistantLog('⨯ Durum özetlenemedi.');
    }
    return;
  }
  // 11) Kasa durumunu söyle
  if (input === 'kasa durumunu söyle') {
    try {
      const data = await window.mtnApp.getData();
      let cashBalance = 0;
      (data.cashTransactions || []).forEach((tx) => {
        const amt = Number(tx.amount || 0);
        if (tx.type === 'tahsilat') {
          cashBalance += amt;
        } else if (tx.type === 'odeme') {
          cashBalance -= amt;
        }
      });
      appendAssistantLog(`✔ Kasa durumu: ${formatCurrency(cashBalance)}`);
    } catch (err) {
      appendAssistantLog('⨯ Kasa durumu getirilemedi.');
    }
    return;
  }
  // 12) Stok ve cari özetini göster
  if (input === 'stok ve cari özetini göster') {
    try {
      const data = await window.mtnApp.getData();
      renderStocks(data.stocks || []);
      renderCustomers(data.customers || []);
      renderSummary(data);
      refreshAccountingPanels(data);
      appendAssistantLog('✔ Stok ve cari özetleri güncellendi.');
    } catch (err) {
      appendAssistantLog('⨯ Özetler getirilemedi.');
    }
    return;
  }

  // 13) Öneri ve görev bildirimleri
  if (input === 'ne yapmalıyım' || input === 'önerilerin neler' || input === 'öneri ver') {
    try {
      const data = await window.mtnApp.getData();
      const suggestions = [];
      // kritik stoklar
      const lowStocks = (data.stocks || []).filter((s) => Number(s.quantity || 0) <= Number(s.threshold || 0));
      if (lowStocks.length) {
        const names = lowStocks.map((s) => `${s.name} (${s.quantity})`).join(', ');
        suggestions.push(`kritik stoklar: ${names}`);
      }
      // vadesi yaklaşan cariler
      const nowTs = Date.now();
      const horizonTs = nowTs + 7 * 24 * 60 * 60 * 1000;
      const dueSoon = (data.customers || []).filter((c) => {
        const bal = Number(c.balance || 0);
        if (bal <= 0) return false;
        const dueDate = getCustomerDueDate(c);
        return dueDate && dueDate.getTime() <= horizonTs && dueDate.getTime() >= nowTs;
      });
      if (dueSoon.length) {
        const names = dueSoon.map((c) => c.name).join(', ');
        suggestions.push(`vadesi yaklaşan cariler: ${names}`);
      }
      if (!suggestions.length) {
        suggestions.push('Her şey yolunda görünüyor. Şu an yapılacak özel bir işlem bulunmuyor.');
      }
      appendAssistantLog(`✔ Öneriler: ${suggestions.join('; ')}`);
    } catch (err) {
      appendAssistantLog('⨯ Öneriler getirilemedi.');
    }
    return;
  }
  // Fallback
  appendAssistantLog('⨯ Komut anlaşılamadı. Lütfen tekrar deneyin.');
  return;
};

/**
 * Provide a short hint based on partial command input. This helper examines
 * the current input string and suggests how the user can complete a valid
 * command. Hints are intentionally simple and do not perform any actions.
 *
 * @param {string} text The raw user input
 * @returns {string} A hint to display or an empty string
 */
const analyzeAssistantInput = (text) => {
  const trimmed = String(text || '').trim();
  if (!trimmed) {
    return '';
  }
  const lower = trimmed.toLowerCase();
  // Multi-line detection for bulk stock receipt
  if (trimmed.includes('\n')) {
    return 'Çok satırlı malzeme listesi algılandı. Her satır "miktar malzeme" formatında yazılmalıdır.';
  }
  // stok için <malzeme> ekle -> miktar sor
  const stokIcinMatch = lower.match(/^stok\s+için\s+(.+)\s*ekle$/);
  if (stokIcinMatch) {
    const item = stokIcinMatch[1].trim();
    return `${item.toUpperCase()} stoğu eklemek istiyorsunuz. Miktarı belirtir misiniz?`;
  }
  // stok keyword hints
  if (/\b(stok|depo)\b/.test(lower)) {
    return 'Stok eklemek için miktar ve malzeme adı belirtin (örn: 30 kombi).';
  }
  // tahsilat hints
  if (/\b(tahsilat|tahsil)\b/.test(lower)) {
    // Eğer sadece isim yazılmışsa miktar iste
    const parts = trimmed.split(/\s+/);
    if (parts.length === 2) {
      return `${parts[0]} için tahsilat tutarını yazınız.`;
    }
    return 'Tahsilat için cari adı ve tutarı yazınız (örn: Harun Uz tahsilat 5000).';
  }
  // ödeme hints
  if (/\b(odeme|ödeme)\b/.test(lower)) {
    const parts = trimmed.split(/\s+/);
    if (parts.length === 2) {
      return `${parts[0]} için ödeme tutarını yazınız.`;
    }
    return 'Ödeme için cari adı ve tutarı yazınız (örn: Ömer Usta ödeme 2000).';
  }
  // borç hints
  if (/\b(borç|borc)\b/.test(lower)) {
    return 'Cari borcunu görmek için cari adı ve "borcunu göster" yazınız.';
  }
  // vade hints
  if (/\b(vade|vadesi yaklaşan)\b/.test(lower)) {
    return 'Vadesi yaklaşan carileri listelemek için "vadesi yaklaşan carileri göster" yazınız.';
  }
  // kasa/durum
  if (/\b(kasa|durum|özet)\b/.test(lower)) {
    return 'Durum özetleri için "bugünkü durumu özetle" yazabilirsiniz.';
  }
  return '';
};

/**
 * Initializes the assistant by binding the input field to command handling.
 * When the user presses Enter in the input, the command is parsed and the
 * input field is cleared.
 */
const setupAssistant = () => {
  if (!assistantCommandInput) {
    return;
  }
  assistantCommandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = assistantCommandInput.value;
      assistantCommandInput.value = '';
      handleAssistantCommand(value);
    }
  });
  // F2: Sesli sayfa geçişini aç/kapat
  if (!window.mtnVoiceToggleBound) {
    window.mtnVoiceToggleBound = true;
    window.addEventListener("keydown", (e) => {
      if (e.key === "F2") {
        voiceEnabled = !voiceEnabled;
        setStatus(voiceEnabled ? "Sesli geçiş: AÇIK" : "Sesli geçiş: KAPALI");
        try { playUiSound("nav"); } catch (_) {}
      }
      if (e.key === "F5") {
        try {
          e.preventDefault();
          setStatus("Veriler yenileniyor...");
          loadInitialData();
          try { playUiSound("nav"); } catch (_) {}
        } catch (_) {}
      }
    });
  }

  // Provide real‑time hints as the user types
  assistantCommandInput.addEventListener('input', () => {
    const hint = analyzeAssistantInput(assistantCommandInput.value);
    if (assistantLiveHint) {
      assistantLiveHint.textContent = hint;
    }
  });
};

// -----------------------------------------------------------------------------
// Inline customer panel functionality
//
// The inline customer panel allows users to perform actions such as recording
// a payment (tahsilat) for a selected customer without leaving the customer
// list. When a row in the customer table is clicked, the panel opens above
// the list. Only the tahsilat form is currently implemented. Placeholders
// inform the user that offer and invoice forms are not yet supported.

/**
 * Open the inline customer panel for the given customer. This sets the
 * activeCustomerId, updates the title and ensures the panel is visible. Any
 * previous form content is cleared.
 *
 * @param {Object} customer The customer record to open
 */
const openCustomerInlinePanel = (customer) => {
  if (!customerInlinePanel || !customer) {
    return;
  }
  activeCustomerId = customer.id || null;
  if (inlineCustomerTitle) {
    const title = `${customer.code || ''} ${customer.name || ''}`.trim();
    inlineCustomerTitle.textContent = title;
  }
  customerInlinePanel.classList.remove('is-hidden');
  if (inlineFormContainer) {
    inlineFormContainer.innerHTML = '';
  }
};

/**
 * Render the inline tahsilat form. The form collects date, payment method,
 * amount and note and saves the transaction via the main process. Upon
 * successful save the customer list and summary panels are refreshed and a
 * confirmation message is appended to the assistant log.
 */
const showInlineTransactionForm = () => {
  if (!inlineFormContainer) {
    return;
  }
  inlineFormContainer.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'form-grid';
  const today = new Date().toISOString().split('T')[0];
  form.innerHTML = `
    <label>
      Tarih
      <input name="createdAt" type="date" required value="${today}" />
    </label>
    <label>
      Ödeme Türü
      <select name="paymentMethod">
        <option value="nakit">Nakit</option>
        <option value="eft">EFT</option>
        <option value="havale">Havale</option>
        <option value="cek">Çek</option>
        <option value="kart">Kart</option>
        <option value="senet">Senet</option>
      </select>
    </label>
    <label>
      Tutar
      <input name="amount" type="number" min="0" step="0.01" required />
    </label>
    <label class="full-width">
      Açıklama
      <input name="note" placeholder="İşlem açıklaması" />
    </label>
    <button class="primary" type="submit">Kaydet</button>
  `;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createCustomerTransaction) {
      appendAssistantLog('⨯ Tahsilat servisi hazır değil.');
      return;
    }
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    // Overpayment check: warn if amount exceeds current receivable
    const customer = (cachedCustomers || []).find((c) => c.id === activeCustomerId) || {};
    const currentBalance = Math.max(Number(customer.balance || 0), 0);
    if (Number(payload.amount) > currentBalance) {
      const proceed = window.confirm('Girilen tutar alacak bakiyesinin üzerinde. Devam etmek istiyor musunuz?');
      if (!proceed) {
        return;
      }
    }
    try {
      const result = await window.mtnApp.createCustomerTransaction({
        customerId: activeCustomerId,
        type: 'tahsilat',
        amount: payload.amount,
        note: payload.note,
        createdAt: payload.createdAt,
        paymentMethod: payload.paymentMethod
      });
      // Refresh cached data and UI
      cachedCustomerDebts = result.customerDebts || [];
      cachedCustomers = result.customers || [];
      cachedCashTransactions = result.cashTransactions || [];

      renderCustomers(result.customers || []);
      renderCash(result.cashTransactions || []);
      renderSummary(result);
      renderCustomerDetail(result);
      refreshCustomerDetailIfOpen(result, activeCustomerId);
      refreshAccountingPanels(result);
      appendAssistantLog(`✔ ${(customer.name || '').toUpperCase()}’dan ${payload.amount} TL tahsilat kaydedildi.`);
      // Generate a simple tahsilat receipt PDF
      if (window.mtnApp?.generateReport) {
        try {
          const html = `<h1>Tahsilat Makbuzu</h1><p>Cari: ${customer.name || ''}</p><p>Tutar: ${formatCurrency(Number(payload.amount || 0))}</p><p>Tarih: ${payload.createdAt}</p>`;
          const report = await window.mtnApp.generateReport({ title: 'Tahsilat Makbuzu', html });
          handleReportResult(report, reportPathEl, "Tahsilat Makbuzu");
        } catch (_) {
          // ignore pdf generation errors
        }
      }
      form.reset();
    } catch (error) {
      appendAssistantLog('⨯ Tahsilat kaydedilemedi.');
    }
  });
  inlineFormContainer.appendChild(form);
};

/**
 * Render the inline offer (proposal) form. This form collects a simple title,
 * date, amount, VAT rate and note for creating a proposal. Upon submission
 * the proposal is saved via the main process and the offers list is
 * refreshed. A confirmation message is written to the assistant log.
 */
const showInlineOfferForm = () => {
  if (!inlineFormContainer) {
    return;
  }
  inlineFormContainer.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'form-grid';
  const today = new Date().toISOString().split('T')[0];
  form.innerHTML = `
    <label>
      Tarih
      <input name="createdAt" type="date" required value="${today}" />
    </label>
    <label>
      Başlık
      <input name="title" required placeholder="Teklif başlığı" />
    </label>
    <label>
      Tutar
      <input name="total" type="number" min="0" step="0.01" required />
    </label>
    <label>
      KDV Oranı (%)
      <input name="vatRate" type="number" min="0" step="0.01" value="20" />
    </label>
    <label class="full-width">
      Açıklama
      <input name="note" placeholder="Not (isteğe bağlı)" />
    </label>
    <button class="primary" type="submit">Kaydet</button>
  `;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createProposal) {
      appendAssistantLog('⨯ Teklif servisi hazır değil.');
      return;
    }
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const customer = (cachedCustomers || []).find((c) => c.id === activeCustomerId) || {};
      // Attempt to generate a very simple PDF. If generation fails the pdfPath is left blank.
      let pdfPath = '';
      if (window.mtnApp?.generateReport) {
        try {
          const html = `<h1>${payload.title}</h1><p>Tutar: ${formatCurrency(payload.total)}</p>`;
          const report = await window.mtnApp.generateReport({ title: payload.title || 'Teklif', html });
          handleReportResult(report, reportPathEl, "Teklif PDF");
          if (report?.reportFile) {
            pdfPath = report.reportFile;
          }
        } catch (_) {
          // ignore errors generating PDF
        }
      }
      const result = await window.mtnApp.createProposal({
        title: payload.title,
        type: 'internal',
        customerName: customer.name || 'Genel',
        total: Number(payload.total || 0),
        vatRate: Number(payload.vatRate || 0),
        vatManual: 0,
        waybillNo: '',
        createdAt: payload.createdAt ? `${payload.createdAt}T${new Date().toTimeString().slice(0, 8)}` : new Date().toISOString(),
        pdfPath
      });
      // Refresh UI with updated data
      const data = await window.mtnApp.getData();
      renderOffers(data.proposals || []);
      renderSummary(data);
      refreshAccountingPanels(data);
      appendAssistantLog(`✔ ${(customer.name || '').toUpperCase()} için "${payload.title}" teklif kaydedildi.`);
      form.reset();
    } catch (error) {
      appendAssistantLog('⨯ Teklif kaydedilemedi.');
    }
  });
  inlineFormContainer.appendChild(form);
};

/**
 * Render the inline invoice form. The user can record a simple invoice by
 * specifying the date, type (sales or purchase), amount and a note. The
 * invoice is saved via the main process and the invoices list is refreshed.
 */
const showInlineInvoiceForm = () => {
  if (!inlineFormContainer) {
    return;
  }
  inlineFormContainer.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'form-grid';
  const today = new Date().toISOString().split('T')[0];
  form.innerHTML = `
    <label>
      Tarih
      <input name="createdAt" type="date" required value="${today}" />
    </label>
    <label>
      Tür
      <select name="invoiceType">
        <option value="satis">Satış Faturası</option>
        <option value="alis">Alış Faturası</option>
      </select>
    </label>
    <label>
      Tutar
      <input name="amount" type="number" min="0" step="0.01" required />
    </label>
    <label class="full-width">
      Açıklama
      <input name="note" placeholder="Açıklama (isteğe bağlı)" />
    </label>
    <button class="primary" type="submit">Kaydet</button>
  `;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createInvoice) {
      appendAssistantLog('⨯ Fiş/Fatura servisi hazır değil.');
      return;
    }
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const customer = (cachedCustomers || []).find((c) => c.id === activeCustomerId) || {};
      const result = await window.mtnApp.createInvoice({
        invoiceType: payload.invoiceType || 'satis',
        vendor: customer.name || '',
        amount: payload.amount,
        note: payload.note,
        createdAt: payload.createdAt
      });
      renderInvoices(result.invoices || []);
      renderSummary(result);
      renderCustomerDetail(result);
      refreshCustomerDetailIfOpen(result, activeCustomerId);
      refreshAccountingPanels(result);
      appendAssistantLog(`✔ ${(customer.name || '').toUpperCase()} için ${formatCurrency(Number(payload.amount || 0))} TL fatura kaydedildi.`);
      form.reset();
    } catch (error) {
      appendAssistantLog('⨯ Fatura kaydedilemedi.');
    }
  });
  inlineFormContainer.appendChild(form);
};

/**
 * Render the inline payment form. This form records a payment to a supplier
 * or anyone we owe. The balance will increase (negative side) and the
 * transaction is stored via the main process. A receipt PDF is generated
 * after successful save.
 */
const showInlinePaymentForm = () => {
  if (!inlineFormContainer) {
    return;
  }
  inlineFormContainer.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'form-grid';
  const today = new Date().toISOString().split('T')[0];
  form.innerHTML = `
    <label>
      Tarih
      <input name="createdAt" type="date" required value="${today}" />
    </label>
    <label>
      Ödeme Yöntemi
      <select name="paymentMethod">
        <option value="nakit">Nakit</option>
        <option value="eft">EFT</option>
        <option value="havale">Havale</option>
        <option value="cek">Çek</option>
        <option value="kart">Kart</option>
        <option value="senet">Senet</option>
      </select>
    </label>
    <label>
      Tutar
      <input name="amount" type="number" min="0" step="0.01" required />
    </label>
    <label class="full-width">
      Açıklama
      <input name="note" placeholder="İşlem açıklaması" />
    </label>
    <button class="primary" type="submit">Kaydet</button>
  `;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.createCustomerTransaction) {
      appendAssistantLog('⨯ Ödeme servisi hazır değil.');
      return;
    }
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const result = await window.mtnApp.createCustomerTransaction({
        customerId: activeCustomerId,
        type: 'odeme',
        amount: payload.amount,
        note: payload.note,
        createdAt: payload.createdAt,
        paymentMethod: payload.paymentMethod
      });
      cachedCustomerDebts = result.customerDebts || [];
      cachedCustomers = result.customers || [];
      cachedCashTransactions = result.cashTransactions || [];

      renderCustomers(result.customers || []);
      renderCash(result.cashTransactions || []);
      renderSummary(result);
      renderCustomerDetail(result);
      refreshCustomerDetailIfOpen(result, activeCustomerId);
      refreshAccountingPanels(result);
      const customer = (cachedCustomers || []).find((c) => c.id === activeCustomerId) || {};
      appendAssistantLog(`✔ ${(customer.name || '').toUpperCase()}’na ${payload.amount} TL ödeme kaydedildi.`);
      // Generate a simple payment receipt PDF
      if (window.mtnApp?.generateReport) {
        try {
          const html = `<h1>Ödeme Makbuzu</h1><p>Cari: ${customer.name || ''}</p><p>Tutar: ${formatCurrency(Number(payload.amount || 0))}</p><p>Tarih: ${payload.createdAt}</p>`;
          const report = await window.mtnApp.generateReport({ title: 'Ödeme Makbuzu', html });
          handleReportResult(report, reportPathEl, "Ödeme Makbuzu");
        } catch (_) {
          // ignore PDF errors
        }
      }
      form.reset();
    } catch (error) {
      appendAssistantLog('⨯ Ödeme kaydedilemedi.');
    }
  });
  inlineFormContainer.appendChild(form);
};

/**
 * Render the inline job form. This form collects a title, quantity, unit,
 * unit price and note. The total is automatically computed on input.
 * After saving, the customer list, job list and summaries are refreshed.
 */
const showInlineJobForm = () => {
  if (!inlineFormContainer) return;
  inlineFormContainer.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'form-grid';
  const today = new Date().toISOString().split('T')[0];
  form.innerHTML = `
    <label>
      Tarih
      <input name="createdAt" type="date" required value="${today}" />
    </label>
    <label>
      Başlık
      <input name="title" required placeholder="İş tanımı" />
    </label>
    <label>
      Miktar
      <input name="quantity" type="number" min="0" step="0.01" required />
    </label>
    <label>
      Birim
      <input name="unit" placeholder="adet/m" required />
    </label>
    <label>
      Birim Fiyat (TL)
      <input name="unitPrice" type="number" min="0" step="0.01" required />
    </label>
    <label>
      Toplam (TL)
      <input name="total" type="number" min="0" step="0.01" readonly />
    </label>
    <label class="full-width">
      Açıklama
      <input name="note" placeholder="Not (isteğe bağlı)" />
    </label>
    <button class="primary" type="submit">Kaydet</button>
  `;
  // Automatically compute total when quantity or unit price changes
  const updateTotal = () => {
    const qty = parseFloat(form.elements.quantity.value || '0');
    const price = parseFloat(form.elements.unitPrice.value || '0');
    const total = qty * price;
    if (!Number.isNaN(total)) {
      form.elements.total.value = total.toFixed(2);
    }
  };
  form.elements.quantity.addEventListener('input', updateTotal);
  form.elements.unitPrice.addEventListener('input', updateTotal);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.mtnApp?.addCustomerJob) {
      appendAssistantLog('⨯ İş servisi hazır değil.');
      return;
    }
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const result = await window.mtnApp.addCustomerJob({
        customerId: activeCustomerId,
        title: payload.title,
        quantity: payload.quantity,
        unit: payload.unit,
        unitPrice: payload.unitPrice,
        total: payload.total,
        note: payload.note,
        createdAt: payload.createdAt
      });
      cachedCustomerDebts = result.customerDebts || [];
      cachedCustomers = result.customers || [];
      cachedCashTransactions = result.cashTransactions || [];

      renderCustomers(result.customers || []);
      renderSummary(result);
      renderCustomerDetail(result);
      refreshCustomerDetailIfOpen(result, activeCustomerId);
      refreshAccountingPanels(result);
      const customer = (cachedCustomers || []).find((c) => c.id === activeCustomerId) || {};
      appendAssistantLog(`✔ ${(customer.name || '').toUpperCase()} için "${payload.title}" iş kaydedildi.`);
      form.reset();
    } catch (error) {
      appendAssistantLog('⨯ İş kaydedilemedi.');
    }
  });
  inlineFormContainer.appendChild(form);
};

/**
 * Render the inline material form. Allows recording a sale (stock output) for
 * a customer. Users specify item name, quantity, unit price and VAT. A sale
 * record is created and stock quantities updated accordingly.
 */
const showInlineMaterialForm = () => {
  if (!inlineFormContainer) return;

  inlineFormContainer.innerHTML = "";
  const form = document.createElement("form");
  form.className = "form-grid";

  form.innerHTML = `
    <label class="full-width">
      Malzeme
      <input name="itemName" placeholder="Malzeme adı (depodan seçebilirsiniz)" autocomplete="off" />
    </label>
    <label>
      Miktar
      <input name="quantity" type="number" min="0" step="0.01" value="1" />
    </label>
    <label>
      Birim
      <input name="unit" placeholder="ADET" value="ADET" />
    </label>
    <label>
      Birim Fiyat
      <input name="unitPrice" type="number" min="0" step="0.01" value="0" />
    </label>
    <label>
      KDV (%)
      <input name="vatRate" type="number" min="0" step="0.01" value="20" />
    </label>
    <label class="full-width">
      Açıklama
      <input name="note" placeholder="Not (isteğe bağlı)" />
    </label>
    <div class="full-width" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
      <button class="ghost" type="button" id="mtn-pick-stock-btn">Depodan Seç</button>
      <button class="ghost" type="button" id="mtn-bulk-job-btn">Toplu İş Kalemi</button>
      <div style="opacity:.85; font-size:12px;">Depodan seçerseniz ad/fiyat otomatik dolar.</div>
      <div style="flex:1;"></div>
      <button class="primary" type="submit">Kaydet</button>
    </div>
    <div class="full-width" id="mtn-bulk-job-wrap" style="display:none; margin-top:10px;">
      <div style="opacity:.9; font-size:12px; margin-bottom:6px;">
        Her satır ayrı iş kalemi. Örnek: <strong>Kombi montajı 3500</strong> veya <strong>Petek 2 adet 500</strong>
      </div>
      <textarea id="mtn-bulk-job-text" rows="6" style="width:100%; resize:vertical;" placeholder="Toplu iş kalemlerini buraya yaz..."></textarea>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <button class="ghost" type="button" id="mtn-bulk-preview-btn">Ön İzle</button>
        <button class="primary" type="button" id="mtn-bulk-apply-btn">Toplu Kaydet</button>
        <div style="flex:1;"></div>
        <div id="mtn-bulk-summary" style="opacity:.85; font-size:12px;"></div>
      </div>
      <div id="mtn-bulk-preview" style="margin-top:10px;"></div>
    </div>
  `;

  inlineFormContainer.appendChild(form);

  const itemInput = form.querySelector('input[name="itemName"]');
  const unitInput = form.querySelector('input[name="unit"]');
  const unitPriceInput = form.querySelector('input[name="unitPrice"]');
  const vatRateInput = form.querySelector('input[name="vatRate"]');
  const pickBtn = form.querySelector('#mtn-pick-stock-btn');

  const fillFromStock = (stock) => {
    if (!stock) return;
    if (itemInput) itemInput.value = stock.name || stock.normalizedName || "";
    if (unitInput) unitInput.value = (stock.unit || "ADET").toUpperCase();
    if (unitPriceInput) unitPriceInput.value = Number(stock.salePrice || stock.purchasePrice || 0);
    if (vatRateInput) vatRateInput.value = Number(stock.vatRate || 20);
  };

  const openPicker = async () => {
    if (!window.mtnOpenStockPicker) return;
    const stock = await window.mtnOpenStockPicker();
    fillFromStock(stock);
  };

  if (pickBtn) pickBtn.addEventListener("click", openPicker);
  const bulkBtn = form.querySelector("#mtn-bulk-job-btn");
  const bulkWrap = form.querySelector("#mtn-bulk-job-wrap");
  const bulkText = form.querySelector("#mtn-bulk-job-text");
  const bulkPreviewBtn = form.querySelector("#mtn-bulk-preview-btn");
  const bulkApplyBtn = form.querySelector("#mtn-bulk-apply-btn");
  const bulkPreview = form.querySelector("#mtn-bulk-preview");
  const bulkSummary = form.querySelector("#mtn-bulk-summary");

  let lastBulkParsed = [];

  const parseBulkJobs = (text) => {
    const lines = String(text || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const out = [];
    lines.forEach((line) => {
      // sayı yakala (virgül/dot destekli)
      const nums = line.match(/\d+[\.,]?\d*/g) || [];
      let qty = 1;
      let unit = "ADET";
      let unitPrice = 0;
      let title = line;

      // birim yakala
      const unitMatch = line.match(/\b(adet|m|mt|metre|kg|kilo|lt|l|paket|set)\b/i);
      if (unitMatch) unit = unitMatch[1].toUpperCase();

      if (nums.length >= 2) {
        qty = Number(String(nums[0]).replace(",", ".")) || 1;
        unitPrice = Number(String(nums[nums.length - 1]).replace(",", ".")) || 0;
        // başlıktan sayıları kaldır
        title = line.replace(nums[0], "").replace(nums[nums.length - 1], "").trim();
      } else if (nums.length === 1) {
        unitPrice = Number(String(nums[0]).replace(",", ".")) || 0;
        title = line.replace(nums[0], "").trim();
      }

      title = title.replace(/\s+/g, " ").trim();
      if (!title) title = "İş Kalemi";

      const total = Number(qty || 1) * Number(unitPrice || 0);
      out.push({ title, quantity: qty || 1, unit, unitPrice, total });
    });
    return out;
  };

  const renderBulkPreview = (items) => {
    if (!bulkPreview) return;
    if (!items || !items.length) {
      bulkPreview.innerHTML = "";
      if (bulkSummary) bulkSummary.textContent = "";
      return;
    }
    const rows = items.map((it) => `
      <tr>
        <td>${escapeHtml(it.title)}</td>
        <td>${Number(it.quantity || 0)}</td>
        <td>${escapeHtml(String(it.unit || "ADET"))}</td>
        <td>${formatCurrency(Number(it.unitPrice || 0))}</td>
        <td><strong>${formatCurrency(Number(it.total || 0))}</strong></td>
      </tr>
    `).join("");
    const sum = items.reduce((s,x)=>s+Number(x.total||0),0);
    bulkPreview.innerHTML = `
      <div class="card" style="padding:10px;">
        <div style="font-weight:700; margin-bottom:8px;">Ön İzleme</div>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;">İş Kalemi</th>
              <th>Miktar</th>
              <th>Birim</th>
              <th>Birim Fiyat</th>
              <th>Tutar</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:8px; text-align:right;">
          Toplam: <strong>${formatCurrency(sum)}</strong>
        </div>
      </div>
    `;
    if (bulkSummary) bulkSummary.textContent = `${items.length} kalem • Toplam ${formatCurrency(sum)}`;
  };

  if (bulkBtn) {
    bulkBtn.addEventListener("click", () => {
      if (!bulkWrap) return;
      bulkWrap.style.display = bulkWrap.style.display === "none" ? "block" : "none";
      if (bulkWrap.style.display === "block") {
        bulkText?.focus?.();
      }
    });
  }

  if (bulkPreviewBtn) {
    bulkPreviewBtn.addEventListener("click", () => {
      const items = parseBulkJobs(bulkText?.value || "");
      lastBulkParsed = items;
      renderBulkPreview(items);
    });
  }

  if (bulkApplyBtn) {
    bulkApplyBtn.addEventListener("click", async () => {
      const customerId = currentCustomerDetailId || activeCustomerId;
      if (!customerId) {
        setStatus("Cari seçilmedi.");
        return;
      }
      const items = lastBulkParsed?.length ? lastBulkParsed : parseBulkJobs(bulkText?.value || "");
      if (!items.length) {
        setStatus("Toplu iş kalemi boş.");
        return;
      }
      renderBulkPreview(items);
      if (!window.confirm(`${items.length} iş kalemi eklensin mi?`)) return;

      try {
        for (const it of items) {
          const payload = {
            customerId,
            title: it.title,
            quantity: it.quantity,
            unit: it.unit,
            unitPrice: it.unitPrice,
            total: it.total,
            note: "Toplu iş kalemi",
            createdAt: new Date().toISOString()
          };
          await window.mtnApp.addCustomerJob(payload);
        }
        const result = await window.mtnApp.getData();
        cachedCustomerJobs = result.customerJobs || [];
        cachedCustomers = result.customers || [];
        cachedCustomerDebts = result.customerDebts || [];
        cachedCashTransactions = result.cashTransactions || [];
        cachedSales = result.sales || [];
        renderCustomerDetail(result);
        refreshAccountingPanels(result);
        setStatus("Toplu iş kalemi eklendi.");
        bulkText.value = "";
        lastBulkParsed = [];
        renderBulkPreview([]);
        bulkWrap.style.display = "none";
        try { forceKeyboardFocus("customers-panel"); } catch (_) {}
      } catch (_) {
        setStatus("Toplu iş kalemi eklenemedi.");
      }
    });
  }


  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const customerId = currentCustomerDetailId || activeCustomerId;
    if (!customerId) {
      setStatus("Cari seçilmedi.");
      return;
    }

    const fd = new FormData(form);
    const itemName = String(fd.get("itemName") || "").trim();
    const quantity = Number(fd.get("quantity") || 0);
    const unit = String(fd.get("unit") || "ADET").trim().toUpperCase();
    const unitPrice = Number(fd.get("unitPrice") || 0);
    const vatRate = Number(fd.get("vatRate") || 0);
    const noteRaw = String(fd.get("note") || "").trim();

    if (!itemName) {
      setStatus("Malzeme adı zorunlu.");
      return;
    }
    if (!quantity || quantity <= 0) {
      setStatus("Miktar 0 olamaz.");
      return;
    }

    const total = Number(quantity) * Number(unitPrice || 0);
    const note = `${noteRaw ? noteRaw + " | " : ""}KDV:%${Number(vatRate || 0)}`;

    const payload = {
      customerId,
      title: itemName,
      quantity,
      unit,
      unitPrice,
      total,
      note,
      createdAt: new Date().toISOString()
    };

    if (!window.mtnApp?.addCustomerJob) {
      setStatus("İş kalemi servisi hazır değil.");
      return;
    }

    try {
      const result = await window.mtnApp.addCustomerJob(payload);
      cachedCustomerJobs = result.customerJobs || [];
      cachedCustomers = result.customers || [];
      cachedCustomerDebts = result.customerDebts || [];
      cachedCashTransactions = result.cashTransactions || [];
      cachedSales = result.sales || [];
      renderCustomerDetail(result);
      refreshAccountingPanels(result);
      setStatus("İş kalemi eklendi.")
      try { forceKeyboardFocus("customers-panel"); } catch (_) {};
      inlineFormContainer.innerHTML = "";
    } catch (_) {
      setStatus("İş kalemi eklenemedi.");
    }
  });
};

/**
 * Attach event handlers for the inline customer panel buttons and close
 * control. This function should be called after the DOM has loaded.
 */
const setupInlinePanel = () => {
  if (!customerInlinePanel) {
    return;
  }
  if (inlineCustomerClose) {
    inlineCustomerClose.addEventListener('click', () => {
      customerInlinePanel.classList.add('is-hidden');
      if (inlineFormContainer) {
        inlineFormContainer.innerHTML = '';
      }
    });
  }
  if (inlineCustomerTahsilat) {
    inlineCustomerTahsilat.addEventListener('click', () => {
      showInlineTransactionForm();
    });
  }
  if (inlineCustomerOffer) {
    inlineCustomerOffer.addEventListener('click', async () => {
      if (!activeCustomerId) return;
      await openCustomerSavedOffers(activeCustomerId);
    });
  }
  if (inlineCustomerInvoice) {
    inlineCustomerInvoice.addEventListener('click', () => {
      showInlineInvoiceForm();
    });
  }
  if (inlineCustomerPayment) {
    inlineCustomerPayment.addEventListener('click', () => {
      showInlinePaymentForm();
    });
  }
  if (inlineCustomerJob) {
    inlineCustomerJob.addEventListener('click', () => {
      showInlineJobForm();
    });
  }
  if (inlineCustomerMaterial) {
    inlineCustomerMaterial.addEventListener('click', () => {
      showInlineMaterialForm();
    });
  }
};

showPanel("dashboard-panel", "Ana");
initApp().then(loadInitialData);
// Start the live assistant after the application has been initialised
setupAssistant();
// Register inline customer panel handlers
setupInlinePanel();

// -----------------------------------------------------------------------------
// Engineering panel and security reset initialisation
//
// Handles index loading, file upload and listing for the engineering panel.
// Also sets up the data reset functionality with admin password check.
const setupEngineeringPanel = () => {
  // Keep a local list of uploaded attachments for this session
  const attachments = [];
  if (engineeringIndexOpen) {
    engineeringIndexOpen.addEventListener('click', async () => {
      const name = engineeringIndexInput?.value?.trim() || '';
      if (!name) {
        engineeringIndexResult.textContent = 'Index adı giriniz.';
        return;
      }
      try {
        const resp = await window.mtnApp.loadEngineeringIndex(name);
        if (!resp.ok) {
          engineeringIndexResult.textContent = 'Index yüklenemedi: ' + (resp.error || 'Bilinmeyen hata');
          return;
        }
        // Escape HTML for safe embedding
        const html = resp.html || '';
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'width:100%;height:500px;border:none;');
        iframe.srcdoc = html;
        engineeringIndexResult.innerHTML = '';
        engineeringIndexResult.appendChild(iframe);
      } catch (err) {
        engineeringIndexResult.textContent = 'Index yüklenemedi.';
      }
    });
  }
  if (engineeringFileUpload) {
    engineeringFileUpload.addEventListener('change', async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file || !window.mtnApp?.saveAttachment) {
        return;
      }
      try {
        const saved = await window.mtnApp.saveAttachment({ path: file.path, name: file.name, category: 'engineering' });
        if (saved && saved.path) {
          attachments.push(saved);
          // Render list item
          const li = document.createElement('li');
          li.textContent = saved.name || file.name;
          const btn = document.createElement('button');
          btn.textContent = 'Aç';
          btn.addEventListener('click', () => {
            window.mtnApp.openAttachmentFile({ path: saved.path });
          });
          li.appendChild(btn);
          engineeringFileList?.appendChild(li);
        }
        // Reset file input so the same file can be selected again later
        event.target.value = '';
      } catch (err) {
        // ignore
      }
    });
  }
};

// Initialise engineering module
setupEngineeringPanel();



// === MTN: Toplu Stok Girişi (çok satır) – ayrıştır + ön izleme + onay ===
(function(){
  const UNIT_WORDS = ['adet','ad','mt','m','metre','kg','gr','g','lt','l','m2','m³','m3','m²','takım','paket','koli','çift','set'];

  function parseBulk(text){
    const rows = [];
    let usedDefaultUnit = false;
    const lines = String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    for(const line of lines){
      const parts = line.split(/[|;,\t]+/).map(s=>s.trim()).filter(Boolean);
      let name = '';
      let qty = NaN;
      let unit = '';

      if(parts.length >= 2){
        const hasNum = parts.map(p => /[0-9]/.test(p));
        const iQty = hasNum.findIndex(Boolean);
        if(iQty >= 0){
          qty = parseFloat(String(parts[iQty]).replace(',', '.'));
          const iName = hasNum.findIndex(b => !b);
          name = (iName >= 0 ? parts[iName] : parts.find(p => isNaN(parseFloat(p))) || '').trim();
          unit = parts.find(p => UNIT_WORDS.includes(p.toLowerCase())) || '';
        }
      } else {
        const m1 = line.match(/^\s*(\d+(?:[.,]\d+)?)\s+(.+)$/);
        const m2 = line.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s*(\w+)?\s*$/);
        const m3 = line.match(/^(.+?)\s*(?:x|×)\s*(\d+(?:[.,]\d+)?)\s*(\w+)?\s*$/i);
        if(m1){ qty = parseFloat(m1[1].replace(',', '.')); name = m1[2].trim(); }
        else if(m3){ name = m3[1].trim(); qty = parseFloat(m3[2].replace(',', '.')); unit = (m3[3]||'').trim(); }
        else if(m2){ name = m2[1].trim(); qty = parseFloat(m2[2].replace(',', '.')); unit = (m2[3]||'').trim(); }

        if(!unit){
          const hit = UNIT_WORDS.find(u => name.toLowerCase().endsWith(' ' + u));
          if(hit){ unit = hit; name = name.slice(0, -hit.length).trim(); }
        }
      }

      if(!name) name = line;
      if(!isFinite(qty)) qty = NaN;
      if(!unit){ unit = 'adet'; usedDefaultUnit = true; }

      rows.push({ name, quantity: qty, unit });
    }
    return { rows, usedDefaultUnit };
  }

  function showModal(analysis, usedDefaultUnit){
    return new Promise((resolve)=>{
      const modal = document.getElementById('mtn-bulk-modal');
      if(!modal) return resolve(false);
      const tbody = document.getElementById('mtn-bulk-tbody');
      const sumEl = document.getElementById('mtn-bulk-summary');
      const noteEl = document.getElementById('mtn-bulk-note');
      const okBtn = document.getElementById('mtn-bulk-ok');
      const cancelBtn = document.getElementById('mtn-bulk-cancel');

      noteEl.textContent = usedDefaultUnit ? 'Birim belirtilmeyen satırlara ADET atandı.' : '';
      tbody.innerHTML = '';

      const rep = analysis.report || { rows: [] };
      (rep.rows || []).forEach(r => {
        const tr = document.createElement('tr');
        const st = r.status || 'error';
        const pill = document.createElement('span');
        pill.className = 'mtn-pill ' + (st === 'new' ? 'mtn-new' : st === 'update' ? 'mtn-up' : 'mtn-err');
        pill.textContent = r.statusLabel || st;

        const td0 = document.createElement('td'); td0.appendChild(pill);
        const td1 = document.createElement('td'); td1.textContent = r.name || '';
        const td2 = document.createElement('td'); td2.textContent = (r.quantity ?? '');
        const td3 = document.createElement('td'); td3.textContent = r.unit || '';
        const td4 = document.createElement('td'); td4.textContent = r.reason || '';

        tr.appendChild(td0); tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3); tr.appendChild(td4);
        tbody.appendChild(tr);
      });

      const s = analysis.summary || {};
      sumEl.textContent = `Yeni: ${s.newCount || 0} • Güncellenecek: ${s.updateCount || 0} • Hatalı: ${s.errorCount || 0} • Toplam Miktar: ${s.totalQuantity || 0}`;

      const close = (val)=>{
        modal.classList.remove('show');
        okBtn.onclick = null; cancelBtn.onclick = null;
        resolve(val);
      };

      okBtn.onclick = ()=> close(true);
      cancelBtn.onclick = ()=> close(false);
      
    const escHandler = (ev) => {
      if (ev.key === "Escape") close(false);
    };
    window.addEventListener("keydown", escHandler, { once: true });
    modal.addEventListener("click", (ev) => {
      if (ev.target === modal) close(false);
    }, { once: true });
modal.classList.add('show');
    });
  }

  async function bulkFlow(rawText){
    const parsed = parseBulk(rawText);
    if(!parsed.rows.length) return false;

    const analysis = await window.mtnApp.analyzeStockRows({
      rows: parsed.rows.map(r => ({ name: r.name, quantity: r.quantity, unit: r.unit })),
      warehouse: 'Ana Depo'
    });

    const approved = await showModal(analysis, parsed.usedDefaultUnit);
    if(!approved){
      (window.appendAssistantLog || console.log)('⨯ İşlem iptal edildi.');
      return true;
    }

    // MEVCUT STOĞA EKLE (varsayılan)
    await window.mtnApp.applyStockImport({
      rows: analysis.rows,
      warehouse: 'Ana Depo',
      onDuplicate: 'add'
    });

    const s = analysis.summary || {};
    const added = Number(s.newCount || 0) + Number(s.updateCount || 0);
    const totalQty = Number(s.totalQuantity || 0);
    (window.appendAssistantLog || console.log)(`✔ Toplu aktarım tamamlandı: ${added} kalem, toplam ${totalQty} birim.`);

    try {
      const data = await window.mtnApp.getData();
      window.renderStocks && renderStocks(data.stocks || []);
      window.renderStockMovements && renderStockMovements(data.stockMovements || []);
      window.renderSummary && renderSummary(data);
      window.refreshAccountingPanels && refreshAccountingPanels(data);
    } catch(e) {}
    return true;
  }

  window.mtnBulkStockFlow = bulkFlow;
})();




// === MTN: Modal HTML bulunamazsa JS ile otomatik oluştur ===
(function(){
  function ensureBulkModalExists(){
    if (document.getElementById('mtn-bulk-modal')) return;
    // Stil
    if (!document.getElementById('mtn-bulk-style')){
      const st = document.createElement('style');
      st.id = 'mtn-bulk-style';
      st.textContent = `
        /* Kurumsal Light Modal (ERP) */
        .mtn-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(2,6,23,0.35); z-index: 9999; padding: 16px; }
        .mtn-modal.show { display: flex; }
        .mtn-card { background: #FFFFFF; color: #111827; padding: 16px; border-radius: 14px; width: min(900px, 96vw); max-height: 82vh; overflow: hidden; border: 1px solid #E4EAF2; box-shadow: 0 18px 44px rgba(2,6,23,0.14); }
        .mtn-card h3 { margin: 0 0 8px; color: #0B1E3B; }
        .mtn-body { overflow: auto; max-height: 55vh; border: 1px solid #E4EAF2; border-radius: 10px; background: #FFFFFF; }
        .mtn-footer { display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .mtn-footer .spacer { flex: 1; }
        .mtn-note { font-size: 12px; color: #475569; margin-bottom: 8px; }
        .mtn-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .mtn-table thead th { position: sticky; top: 0; background: #F1F5F9; color: #0B1E3B; }
        .mtn-table th, .mtn-table td { padding: 8px; border-bottom: 1px solid #E4EAF2; text-align: left; }
        .mtn-pill { padding: 2px 8px; border-radius: 999px; font-size: 12px; display: inline-block; border: 1px solid rgba(11,30,59,0.18); }
        .mtn-new { background: rgba(16,185,129,0.12); color: #065F46; }
        .mtn-up { background: rgba(59,130,246,0.12); color: #1D4ED8; }
        .mtn-err { background: rgba(239,68,68,0.12); color: #B91C1C; }
        .mtn-footer button { padding: 10px 14px; border-radius: 10px; font-weight: 700; cursor: pointer; }
        #mtn-bulk-cancel { background: #FFFFFF; color: #0B1E3B; border: 1px solid #0B1E3B; }
        #mtn-bulk-ok { background: #0B1E3B; color: #FFFFFF; border: 1px solid #0B1E3B; }
        #mtn-bulk-ok:hover { filter: brightness(0.98); }
      `;
      document.head.appendChild(st);
    }
    // Modal gövdesi
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="mtn-bulk-modal" class="mtn-modal" role="dialog" aria-modal="true" aria-labelledby="mtn-bulk-title">
        <div class="mtn-card">
          <h3 id="mtn-bulk-title">Toplu Stok Girişi — Ön İzleme</h3>
          <div class="mtn-note" id="mtn-bulk-note"></div>
          <div class="mtn-body">
            <table class="mtn-table">
              <thead>
                <tr>
                  <th>Durum</th>
                  <th>Malzeme</th>
                  <th>Miktar</th>
                  <th>Birim</th>
                  <th>Not</th>
                </tr>
              </thead>
              <tbody id="mtn-bulk-tbody"></tbody>
            </table>
          </div>
          <div class="mtn-footer">
            <div id="mtn-bulk-summary"></div>
            <div class="spacer"></div>
            <button id="mtn-bulk-cancel">İPTAL</button>
            <button id="mtn-bulk-ok">ONAYLA</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap.firstElementChild);
  }

  // DOM hazır olunca garanti et
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ensureBulkModalExists);
  } else {
    ensureBulkModalExists();
  }

  window.mtnEnsureBulkModalExists = ensureBulkModalExists;
})();




async function openCustomerSavedOffers(customerId) {
  try {
    const customer = (cachedCustomers || []).find((c) => (c.id || c.name) === customerId) || (cachedCustomers || []).find((c) => c.id === customerId);
    offerCustomerFilterName = customer ? (customer.name || "") : "";
    showPanel("sales-panel", "Teklif");
    activateMenuByPanel("sales-panel");
    if (typeof openOfferWorkspace === "function") {
      openOfferWorkspace("saved");
    } else if (typeof showOfferHome === "function") {
      showOfferHome();
    }
    const data = await window.mtnApp.getData();
    cachedProposals = data.proposals || [];
    renderOffers(cachedProposals);
    if (offerCustomerFilterName) {
      setStatus(`Tekliflerim: ${offerCustomerFilterName}`);
    } else {
      setStatus("Tekliflerim");
    }
  } catch (e) {
    setStatus("Teklif ekranı açılamadı.");
  }
}




(function(){
  function ensureStockPicker(){
    if (document.getElementById('mtn-stock-picker')) return;
    const style = document.createElement('style');
    style.textContent = `
      .mtn-picker{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:9999}
      .mtn-picker.show{display:flex}
      .mtn-picker__card{background:#0b1020;color:#fff;width:920px;max-height:80vh;border:1px solid #2a2f45;border-radius:10px;overflow:hidden}
      .mtn-picker__head{display:flex;gap:8px;align-items:center;padding:12px;border-bottom:1px solid #2a2f45}
      .mtn-picker__head input{flex:1;padding:10px;border-radius:8px;border:1px solid #2a2f45;background:#070b16;color:#fff}
      .mtn-picker__body{max-height:55vh;overflow:auto}
      .mtn-picker table{width:100%;border-collapse:collapse;font-size:13px}
      .mtn-picker th,.mtn-picker td{padding:10px;border-bottom:1px solid #2a2f45;text-align:left}
      .mtn-picker tr:hover{background:rgba(255,255,255,.05);cursor:pointer}
      .mtn-picker__foot{display:flex;justify-content:flex-end;padding:12px;border-top:1px solid #2a2f45}
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.className = 'mtn-picker';
    modal.id = 'mtn-stock-picker';
    modal.innerHTML = `
      <div class="mtn-picker__card">
        <div class="mtn-picker__head">
          <strong>Depodaki Malzemeler</strong>
          <input id="mtn-stock-picker-search" placeholder="Ara: kod / ad" />
          <button class="ghost" id="mtn-stock-picker-close">Kapat</button>
        </div>
        <div class="mtn-picker__body">
          <table>
            <thead><tr><th>Kod</th><th>Malzeme</th><th>Birim</th><th>Stok</th><th>Satış</th></tr></thead>
            <tbody id="mtn-stock-picker-body"></tbody>
          </table>
        </div>
        <div class="mtn-picker__foot">
          <button class="ghost" id="mtn-stock-picker-cancel">İptal</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function fillStockRows(body, all, term){
    const q = normalizeText(term || '');
    const list = q ? all.filter(s => normalizeText(s.name || '').includes(q) || normalizeText(s.code || '').includes(q)) : all;
    body.innerHTML = '';
    list.slice(0, 500).forEach((s) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.code || '-'}</td>
        <td>${s.normalizedName || s.name || '-'}</td>
        <td>${s.unit || '-'}</td>
        <td>${Number(s.quantity || 0)}</td>
        <td>${formatCurrency(Number(s.salePrice || 0))}</td>
      `;
      tr.dataset.stockId = s.id || '';
      body.appendChild(tr);
    });
  }

  async function openStockPicker(){
    ensureStockPicker();
    const modal = document.getElementById('mtn-stock-picker');
    const body = document.getElementById('mtn-stock-picker-body');
    const search = document.getElementById('mtn-stock-picker-search');
    const closeBtn = document.getElementById('mtn-stock-picker-close');
    const cancelBtn = document.getElementById('mtn-stock-picker-cancel');
    if (!modal || !body || !search) return null;

    const all = Array.isArray(cachedStocks) ? cachedStocks : [];
    fillStockRows(body, all, '');

    let resolver;
    const promise = new Promise((resolve)=>{ resolver = resolve; });

    function cleanup(val){
      modal.classList.remove('show');
      search.value = '';
      search.oninput = null;
      closeBtn.onclick = null;
      cancelBtn.onclick = null;
      body.onclick = null;
      resolver(val || null);
    }

    closeBtn.onclick = () => cleanup(null);
    cancelBtn.onclick = () => cleanup(null);

    search.oninput = (e) => fillStockRows(body, all, e.target.value);

    body.onclick = (e) => {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.dataset.stockId;
      const stock = all.find(s => (s.id || '') === id) || all.find(s => (s.code || '') === (tr.children[0]?.textContent || '').trim());
      cleanup(stock || null);
    };

    modal.classList.add('show');
    search.focus();
    return promise;
  }

  window.mtnOpenStockPicker = openStockPicker;
})();



// === MTN: Global Hata Yakalama (program çökmesin diye) ===
(function(){
  function mtnShowError(title, detail){
    try{
      const modal = document.getElementById('mtn-error-modal');
      const body = document.getElementById('mtn-error-body');
      const close = document.getElementById('mtn-error-close');
      const ok = document.getElementById('mtn-error-ok');
      const copy = document.getElementById('mtn-error-copy');
      if(!modal || !body) return;

      const text = `[${new Date().toLocaleString('tr-TR')}] ${title}\n\n${detail || ''}`;
      body.textContent = text;

      const hide = ()=> modal.classList.remove('show');
      close && (close.onclick = hide);
      ok && (ok.onclick = hide);
      copy && (copy.onclick = async ()=> {
        try { await navigator.clipboard.writeText(text); } catch(_) {}
      });

      modal.classList.add('show');
    }catch(_){}
  }

  window.mtnShowError = mtnShowError;

  window.addEventListener('error', (e)=>{
    const msg = e?.message || 'Bilinmeyen hata';
    const stack = e?.error?.stack || '';
    try { window.setStatus && setStatus('Hata oluştu. Detay için hata penceresine bak.'); } catch(_){}
    mtnShowError('Uygulama Hatası', `${msg}\n${stack}`);
  });

  window.addEventListener('unhandledrejection', (e)=>{
    const reason = e?.reason;
    const msg = reason?.message || String(reason || 'Bilinmeyen hata');
    const stack = reason?.stack || '';
    try { window.setStatus && setStatus('Hata oluştu. Detay için hata penceresine bak.'); } catch(_){}
    mtnShowError('İşlem Hatası', `${msg}\n${stack}`);
  });
})();
