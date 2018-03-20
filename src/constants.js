let SERVER_URL = (process.env.REACT_APP_SERVER || 'http://192.168.1.50:5000');
// let SERVER_URL = 'http://192.168.88.113:5000';
// export const API_HOST = (process.env.NODE_ENV === 'production' ? 'http://test.apidev.xyz:5000' : 'http://192.168.1.50:5000');

if (process.env.NODE_ENV === 'production') {
    // SERVER_URL = 'http://192.168.88.113:5000';
    // SERVER_URL = 'http://test.apidev.xyz:5000';
    SERVER_URL = 'http://apidev.xyz:5000';
}

export const API_HOST = SERVER_URL;

export const API_VERSION = 1;
export const API_URL = API_HOST + '/api/v' + API_VERSION;
export const WORKING_TIME = {
    begin: 9,
    end: 21
};
export const CLASSES = ['app-hightlight-color01',
    'app-hightlight-color02',
    'app-hightlight-color03',
    'app-hightlight-color04',
    'app-hightlight-color05',
    'app-hightlight-color06',
    'app-hightlight-color07',
    'app-hightlight-color08',
    'app-hightlight-color09',
    'app-hightlight-color10',
];
export const API_COMMONS = {
    //getToken: api('/auth/token'),
    getToken: api('/auth/login'),
    verifyToken: api('/auth/'),
    getUser: api('/users/info'),
    getSalons: api('/salons'),
    getPosts: api('/posts/'),
    getRoles: api('/roles/'),
    getNotificationsList: api('/notifications/'),
    getNotifications: api('/notifications/new'),
    getMenu: api('/components/menu'),
    //getBrands: api('/goods/brands'),
    //validations: api('/validations'),
    getBrands: api('/refs/product/trends'),
    getWarehouse: api('/warehouse/'),
    getTags: api('/refs/product/tags'),
    getUnits: api('/refs/product/units'),
    getUnpaidBills: api('/calendar/in_process'),
    getUnpaidBillInfo: api('/calendar/{id}'),
    printUnpaidBill: api('/calendar/{id}/print'),
    uploadImage: api('/images/')
};
export const API_CLIENTS = {
    getClients: api('/clients'),
    getCategoriesTree: api('/clients/filters'),
    getClient: api('/clients/{id}'),
    clientsSearch: api('/clients/search'),
    getTags: api('/clients/tags'),
    getQuestionary: api('/clients/{id}/questionary')
};
export const API_TASKS = {
    getTasks: api('/tasks/{date}'),
    getEmployees: api('/staffs/selector'),
    addTask: api('/tasks/'),
    getTask: api('/tasks/{id}'),
    taskState: api('/tasks/{id}/states'),
    taskComment: api('/tasks/{id}/note')
};
export const API_EMPLOYEES = {
    getEmployees: api('/staffs/{group_id}'),
    getCategoriesTree: api('/employees/'),
    getEmployeesRoles: api('/employees/roles'),
    getEmployeesPosts: api('/employees/posts'),
    getTags: api('/employees/tags'),
    getEmployee: api('/employees/{id}'),
    addEmployee: api('/employees/'),
    getEmployeesGroup: api('/employees/roles/{id}'),
    addEmployeesGroup: api('/employees/roles'),
    validateEmployees: api('/employees/validate'),
    editEmployeesGroup: api('/employees/roles/{id}'),
    getFamilyStatus: api('/employees/family/status'),
    setSalary: api('/employees/{id}/payments'),
    getPaymentShemes: api('/employees/payments/schema'),
    //
    getScheduleTypes: api('/schedules/types'),
    getEmployeeSchedule: api('/schedules/{date}'),
    updateEmployeeSchedule: api('/schedules/{date}')

};
export const API_CALENDAR = {
    getAppointments: api('/calendar/{date}'),
    getClientsAppointments: api('/calendar/{date}/clients/{id}'),
    getServicesCategories: api('/categories/services/calendar'),
    getCalendarGoods: api('/categories/goods/calendar'),
    getMasters: api('/calendar/masters'),
    getServicesSection: api('/calendar/services/{id}/section'),
    addAppointment: api('/calendar/'),
    appointmentConfirm: api('/calendar/{id}/state/confirm'),
    appointmentCheckout: api('/calendar/appointments/{id}/state/checkout'),
    appointmentCancel: api('/calendar/{id}/state/cancel'),
    checkPrint: api('/calendar/appointments/{id}/print'),
    getSearchesList: api('/refs/referals'),
};
export const API_CALLS = {
    birthdaysCalls: api('/calls/birthday'),
    getCallsHistory: api('/calls/history/'),
    callsCheck: api('/calls/{id}'),
    comment: api('/calls/{id}/comment'),
    allCalls: api('/calls/'),
    getCallsStatuses: api('/calls/status')
};
export const API_INVOICES = {
    getInvoicesList: api('/documents/{type_name}/{date_from}/{date_to}'),
    getInvoicesCategories: api('/documents/types'),
    getVendorsList: api('/vendors'),
    addInvoice: api('/documents/{type_name}'),
    getInvoice: api('/documents/{type_name}/{id}'),
    printDocument: api('/documents/inventory/{doc_id}/print'),
    getInvoices: api('/vendors/{vendor_id}/invoice/products/{good_id}'),
    validateInvoices: api('/documents/validation'),
    getInventoryCategoryGoods: api('/groups/{group_id}/inventory'),
    editInventory: api('/documents/inventory/{id}/process'),
    getDocNumber: api('/documents/{type}/uuid')
};
export const API_SETTING = {
    getSettingList:api('/setting')
}
export const API_SERVICES = {
    getEditedService: api('/services/{id}'),
    getServices: api('/categories/services/{id}'),
    getCategories: api('/groups/{goodsType}?warehouse={warehouse}'),
    addService: api('/services'),

    changeCategories: api('/categories/services/{id}'),
    addCategory: api('/categories/services'),
    editCategory: api('/categories/services/{id}/name')
};
export const API_VENDORS = {
    getVendors: api('/vendors'),
    vendorsValidation: api('/vendors/validate'),
    getVendor: api('/vendors/{id}')
};
export const API_REPORTS = {
    getReports: api('/reports/types/{type}')
};
export const API_GOODS = {
//Categories
    getGroupsForType: api('/groups/{goodsType}?warehouse={warehouse}'),
    getGoodsWithinGroup: api('/groups/{groupId}/{goodsType}?warehouse={warehouse}'),
    createNewGroup: api('/groups'),
    updateExistedGroup: api('/groups/{groupId}'),
    removeExistedGroup: api('/groups/{groupId}'),
    validateExistedGroup: api('/groups/validation'),
//Goods
    getProductDetails: api('/products/{productId}'),
    addGood: api('/products/'),
    getEditGood: api('/products/{productId}'),
    removeExistedProduct: api('/products/{productId}'),
    validateNewProduct: api('/products/validate'),

//Package
    getPackageDetails: api('/packages/{package_id}'),
    findProductsForPackage: api('/packages/find'),
    addGoodSet: api('/packages/'),
    validatePackage: api('/packages/validate'),
    getEditSetGood: api('/packages/{package_id}'),
};

export const API_FINANCES = {
    getFinancesOperationsList: api('/finances/{date}'),
    getVendorsList: api('/refs/vendors'),
    getAccountsList: api('/refs/accounts'),
    getClientsList: api('/refs/clients'),
    getServicesList: api('/finances/clients/{client_id}'),
    getExpensesList: api('/refs/expenses'),
    createExpense: api('/finances/expenses'),
    addExpense: api('/finances/expenses/payment'),
    addPayVendor: api('/finances/expenses/vendor'),
    addTransfer: api('/finances/expenses/transfer'),
    addCashBack: api('/finances/expenses/refund'),
    editExpense: api('/finances/expenses/{id}'),
};
export const API_SCHEDULE = {
    getWorkSchedule: api('/staffs/schedule/{date}'),
    // getWorkSchedulePost: api('/staffs/schedule/{post_id}/{date}'),
    addWorkingDay: api('/staffs/schedule'),
    getEmployeesGroups: api('/staffs/schedule/posts'),
    changeWorkingHours: api('/staffs/schedule/customize'),
};
export const MENU = {
    DASHBOARD: '/',
    CALENDAR: '/calendar/',
    CLIENTS: '/clients/',
    CLIENTS_CATEGORIES: '/clients/categories',
    GOODS: '/goods/',
    SERVICES: '/services/',
    EMPLOYEES: '/employees/',
    // WAREHOUSE: '/warehouse/',
    USER_SETTINGS: '/user/settings',
    TASKS: '/tasks/',
    NOTIFICATIONS: '/notifications/',
    WAREHOUSE: '/invoices/',
    VENDORS: '/vendors/',
    REPORTS: '/reports/',
    CALLS: '/calls/',
    FINANCE: '/finances/',
    SETTING: '/setting/'
};

/**
 * Join API url with path.
 *
 * @param actionPath path on API server.
 */
function api(actionPath) {
    return API_URL + actionPath;
}
