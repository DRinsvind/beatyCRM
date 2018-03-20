import * as types from "../actions/employees";

const empl = {
  first_name: "",
  last_name: "",
  second_name: "",
  contacts: [],
  date_birth: "",
  sex: "F",
  staff_id: "",
  posts: [],
  password: "",
  login: "",
  role_id: null,
  adr_city: "",
  adr_street: "",
  adr_house: "",
  adr_apartment: "",
  adr_zip: "",
  pasp_num: "",
  pasp_ser: "",
  pasp_date: "",
  pasp_whom: "",
  adr_zip: "",
  status_family: null,
  children: "",
  access_allowed: false
};

const initialState = {
  categories: [],
  loading: true,
  employee: {
    ...empl,
    employee_id: null
  },
  salons: [],
  posts: [],
  roles: [],
  payments: [],
  tags_list: [],
  tags_good: [],
  errors: {},
  tags_bad: [],
  modules: [],
  selected_group: {},
  showForm: "",
  photo: null,
  types: [],
  schedule: []
};

const addInitialState = {
  tags_list: [],
  tags_good: [],
  tags_bad: [],
  salons: [],
  posts: [],
  roles: [],
  errors: {},
  employee: {
    ...empl
  },
  photo: null
};

export function employeesListReducer(state = initialState, action) {
  switch (action.type) {
    case types.EMPLOYEES_CATEGORIES_TREE_RECEIVE:
      return {
        ...state,
        categories: action.payload,
        loading: false
      };
    case types.EMPLOYEE_ITEM_RECEIVE:
      return {
        ...state,
        employee: action.payload,
        loading: false,
        showForm: 0
      };
    case types.LOAD_SCHEDULE_TYPES:
      return {
        ...state,
        showForm: 2,
        types: action.payload
      };
    case types.LOAD_EMPLOYEE_SCHEDULE:
      return {
        ...state,
        showForm: 2,
        schedule: action.payload
      };
    case types.EMPLOYEES_TAGS_RECEIVE:
      return {
        ...state,
        tags_list: action.payload.basic,
        tags_good: action.payload.positive,
        tags_bad: action.payload.negative
      };
    case types.SALONS_LIST_RECEIVE:
      return {
        ...state,
        salons: action.payload
      };
    case types.POSTS_LIST_RECEIVE:
      return {
        ...state,
        posts: action.payload
      };
    case types.ROLES_LIST_RECEIVE:
      return {
        ...state,
        roles: action.payload
      };
    case types.RECEIVE_PAYMENT_SCHEME:
      return {
        ...state,
        payments: action.payload
      };
    case types.RECEIVE_EMPLOYEE_ERRORS:
      return {
        ...state,
        errors: action.payload
      };
    case types.RECEIVE_ACCESS_RIGHTS:
      return {
        ...state,
        modules: action.payload
      };
    case types.RECEIVE_EMPLOYEES_GROUP:
      return {
        ...state,
        selected_group: action.payload,
        showForm: 1
      };
    case types.RECEIVE_EMPLOYEE_PHOTO:
      return {
        ...state,
        photo: action.payload
      };
    case types.FAMILY_STATUS_RECEIVE:
      return {
        ...state,
        status_family: action.payload
      };
    case types.CLEAR_EMPLOYEES_INITIAL_STATE:
      return initialState;
    default:
      return state;
  }
}

export function employeesAddReducer(state = addInitialState, action) {
  switch (action.type) {
    case types.EMPLOYEES_TAGS_RECEIVE:
      return {
        ...state,
        tags_list: action.payload.basic,
        tags_good: action.payload.positive,
        tags_bad: action.payload.negative
      };
    case types.SALONS_LIST_RECEIVE:
      return {
        ...state,
        salons: action.payload
      };
    case types.POSTS_LIST_RECEIVE:
      return {
        ...state,
        posts: action.payload
      };
    case types.FAMILY_STATUS_RECEIVE:
      return {
        ...state,
        status_family: action.payload
      };
    case types.ROLES_LIST_RECEIVE:
      return {
        ...state,
        roles: action.payload
      };
    case types.RECEIVE_EMPLOYEE_ERRORS:
      return {
        ...state,
        errors: action.payload
      };
    case types.RECEIVE_EMPLOYEE_PHOTO:
      return {
        ...state,
        photo: action.payload
      };
    case types.RECEIVE_EMPLOYEE_ROLE_ID:
      return {
        ...state,
        employee: {
          ...state.employee,
          role_id: action.payload
        }
      };
    default:
      return state;
  }
}
