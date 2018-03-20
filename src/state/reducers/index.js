import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
// REDUCERS
import core from "./core";
import menu from "./menu";
import notification from "./notification";
import alert from "./alert";
// COMMONS
import {clientsEditReducer, clientsListReducer} from "./clients";
import {goodsReducer, treeReducer} from "./goods";
import servicesReducer from "./services";
import {employeesAddReducer, employeesListReducer} from "./employees";
import appointmentsReducer from "./appointments";
import {invoiceEditReducer, invoiceReducer, invoicesListReducer} from "./invoices";
import {vendorAddReducer, vendorEditReducer, vendorsListReducer} from "./vendors";
import {tasksEditReducer, tasksListReducer} from "./tasks";
import callsReducer from './calls';
import {reportsReducer} from "./reports";
import {financesOperationsReducer} from "./finances";
import {workScheduleReducer} from "./work_schedule";

const appReducer = combineReducers({
    clientsListReducer,
    clientsEditReducer,

    goodsReducer,
    servicesReducer,

    employeesListReducer,
    employeesAddReducer,

    appointmentsReducer,

    invoiceEditReducer,
    invoicesListReducer,
    invoiceReducer,

    vendorsListReducer,
    vendorAddReducer,
    vendorEditReducer,

    tasksListReducer,
    tasksEditReducer,

    callsReducer,

    reportsReducer,

    financesOperationsReducer,

    workScheduleReducer,
    treeReducer,


    // MUST BE AT THE END
    core,
    menu,
    notification,
    alert,

    // MUST BE LAST
    routing: routerReducer
});

export default appReducer;
