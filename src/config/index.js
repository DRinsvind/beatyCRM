import menu from "./menu";

/**
 * Application config.
 */
const config = {
    stack_topright: {"dir1": "down", "dir2": "left", "push": "top"},
    working_time: {
        begin: 9,
        end: 21
    },
    rest: {
        host: 'http://apidev.xyz:5000',
        // host: 'http://192.168.1.50:5000',
        api: '/api/v1',
        validations: '/validations',
        auth: {
            api_key_name: 'key',
            path: '/api/v1/auth/login'
        },
        user: {
            info: '/api/v1/users/info'
        },
        menu: '/api/v1/components/menu',
        units: '/api/v1/dictionaries/types/units',
        // services: {
        //     categories: '/api/v1/categories/services',
        //     categories_edit: '/api/v1/categories/services/{id}/name',
        //     service_add: '/api/v1/services',
        //     items: '/api/v1/categories/services/{id}',
        //     item_expanded: '/api/v1/services/{id}'
        // },
        // goods: {
        //     goods_list: '/api/v1/categories/goods/unfiltered',
        //     categories: '/api/v1/categories/goods',
        //     categories_edit: '/api/v1/categories/goods/{id}/name',
        //     good_add: '/api/v1/goods',
        //     good_set_add: '/api/v1/goods/package',
        //     items: '/api/v1/categories/goods/{id}',
        //     item_expanded: '/api/v1/goods/{id}',
        //     item_set_expanded: '/api/v1/goods/package/{id}'
        // },
        vendors: {
            vendors_list: '/api/v1/vendors',
            get: '/api/v1/vendors/{id}'
        },
        // calendar: {
        //     appointments: '/api/v1/calendar/{date}',
        //     client_appointments: '/api/v1/calendar/{date}/clients/{id}',
        //     services_tree: '/api/v1/categories/services/calendar',
        //     goods_tree: '/api/v1/categories/goods/calendar',
        //     client_info: '/api/v1/clients/{id}/info',
        //     section: '/api/v1/calendar/services/{id}/section',
        //     add_appointment: '/api/v1/calendar/',
        //     appointment_create: '/api/v1/calendar/',
        //     appointment_confirm: '/api/v1/calendar/{id}/state/confirm',
        //     appointment_checkout: '/api/v1/calendar/appointments/{id}/state/checkout',
        //     appointment_cancel: '/api/v1/calendar/{id}/state/cancel',
        //     masters: '/api/v1/calendar/services/{id}/masters',
        //     masters_list: '/api/v1/calendar/masters'
        // },
        salons: {
            list: '/api/v1/salons/'
        },
        posts: {
            list: '/api/v1/posts/'
        },
        roles: {
            list: '/api/v1/roles/'
        },
        tags: '/api/v1/tags',
        storage: '/api/v1/storage/',
        warehouse: {
            list: '/api/v1/warehouse/'
        },
        invoices: {
            list: '/api/v1/warehouse/docs/all',
            add_invoice: '/api/v1/warehouse/invoices',
            write_off: '/api/v1/warehouse/writeoff',
            categories: '/api/v1/warehouse/docs/filters',
            vendors_list: '/api/v1/vendors/list',
            invoice: '/api/v1/warehouse/docs/{id}',
        },
        reports: {
            operations_history: '/api/v1/operations_history',
        },

    },
    menu: menu
};

export default config;
