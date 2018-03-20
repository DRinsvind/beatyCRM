import React from "react";
import PropTypes from "prop-types";
import {Provider} from "react-redux"
import {browserHistory, IndexRoute, Route, Router} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";

import * as can from './constants';
// CONTAINERS
import LoginContainer from "./containers/LoginContainer";
import AppContainer from "./containers/AppContainer";
import GoodsContainer from "./containers/goods/GoodsContainer";
import GoodEditProContainer from "./containers/goods/GoodEditProContainer";
import GoodEditSaleContainer from "./containers/goods/GoodEditSaleContainer";
import GoodAddProContainer from "./containers/goods/GoodAddProContainer";
import GoodAddSaleContainer from "./containers/goods/GoodAddSaleContainer";
import GoodSetAddContainer from "./containers/goods/GoodSetAddSaleContainer";
import GoodSetEditContainer from "./containers/goods/GoodSetEditContainer";
import ServicesContainer from "./containers/services/ServicesContainer";
import ServicesEditContainer from "./containers/services/ServicesEditContainer";
import ServicesAddContainer from "./containers/services/ServicesAddContainer";
import ClientsListContainer from "./containers/clients/ClientsListContainer";
import ClientsEditContainer from "./containers/clients/ClientsEditContainer";
import EmployeesListContainer from "./containers/employees/EmployeesListContainer";
import AppointmentsContainer from "./containers/calendar/AppointmentsContainer";
import EmployeesAddContainer from "./containers/employees/EmployeesAddContainer";
import NotificationsContainer from "./containers/notifications/NotificationsContainer";
import InvoicesContainer from "./containers/invoices/InvoicesContainer";
import InvoiceViewContainer from "./containers/invoices/InvoiceViewContainer";
import VendorsListContainer from "./containers/vendors/VendorsListContainer";
import VendorsEditContainer from "./containers/vendors/VendorsEditContainer";
import VendorsAddContainer from "./containers/vendors/VendorsAddContainer";
import TasksListContainer from "./containers/tasks/TasksListContainer";
import EditTasksContainer from "./containers/tasks/EditTasksContainer";
import CallsContainer from "./containers/calls/CallsContainer";
import ReportsContainer from "./containers/reports/ReportsContainer";
import FinancesListContainer from "./containers/finances/FinancesListContainer";
import WorkScheduleContainer from "./containers/schedule/WorkScheduleContainer";
import SettingContainer from './containers/setting/SettingContainer';
import SettingGeneralContainer from './containers/setting/SettingGeneralContainer';

// COMPONENTS
import Dashboard from "./components/Dashboard";

import SettingCommon from './components/setting/general/SettingCommon'
import SettingCommonLocation from './components/setting/general/SettingCommonLocation'
import SettingCommonBackup from './components/setting/general/SettingCommonBackup'
import SettingCommonDirection from './components/setting/general/SettingCommonDirection'
import SettingCommonEmail from './components/setting/general/SettingCommonEmail'
import SettingCommonSms from './components/setting/general/SettingCommonSms'
import SettingCommonSecurity from './components/setting/general/SettingCommonSecurity'
import SettingCommonWorkingTime from './components/setting/general/SettingCommonWorkingTime'
import SettingClients from './components/setting/general/SettingClients'
import SettingClientsAction from './components/setting/general/SettingClientsAction'
import SettingClientsHappy from './components/setting/general/SettingClientsHappy'
import SettingClientsReminder from './components/setting/general/SettingClientsReminder'
import SettingClientsRecord from './components/setting/general/SettingClientsRecord'
import SettingPolls from './components/setting/general/SettingPolls'
import SettingPollsQuestionnaire from './components/setting/general/SettingPollsQuestionnaire'

const Routes = ({store}) => {
    const history = syncHistoryWithStore(browserHistory, store);

    return (
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={AppContainer}>
                    <IndexRoute component={Dashboard}/>
                    <Route path={can.MENU.DASHBOARD} component={Dashboard}/>
                    <Route path={can.MENU.GOODS} component={GoodsContainer}/>
                    <Route path={can.MENU.GOODS + 'edit/goodPro/:good_id'} component={GoodEditProContainer}/>
                    <Route path={can.MENU.GOODS + 'edit/goodSale/:good_id'} component={GoodEditSaleContainer}/>
                    <Route path={can.MENU.GOODS + 'edit/set/:good_id'} component={GoodSetEditContainer}/>
                    <Route path={can.MENU.GOODS + 'add/goodPro'} component={GoodAddProContainer}/>
                    <Route path={can.MENU.GOODS + 'add/goodSale'} component={GoodAddSaleContainer}/>
                    <Route path={can.MENU.GOODS + 'add/set'} component={GoodSetAddContainer}/>
                    <Route path={can.MENU.SERVICES} component={ServicesContainer}/>
                    <Route path={can.MENU.SERVICES + 'edit/:service_id'} component={ServicesEditContainer}/>
                    <Route path={can.MENU.SERVICES + 'add/'} component={ServicesAddContainer}/>
                    <Route path={can.MENU.CLIENTS} component={ClientsListContainer}/>
                    <Route path={can.MENU.CLIENTS + 'edit/:client_id'} component={ClientsEditContainer}/>
                    <Route path={can.MENU.CLIENTS + 'profile/:client_id'} component={ClientsEditContainer}/>
                    <Route path={can.MENU.CLIENTS + 'questionary/:client_id'}
                           component={ClientsEditContainer}/>
                    <Route path={can.MENU.EMPLOYEES} component={EmployeesListContainer}/>
                    <Route path={can.MENU.EMPLOYEES + 'add/'} component={EmployeesAddContainer}/>
                    <Route path={can.MENU.CALENDAR} component={AppointmentsContainer}/>
                    <Route path={can.MENU.CALENDAR + 'schedule'} component={WorkScheduleContainer}/>
                    <Route path={can.MENU.NOTIFICATIONS} component={NotificationsContainer}/>
                    <Route path={can.MENU.WAREHOUSE} component={InvoicesContainer}/>
                    <Route path={can.MENU.WAREHOUSE + ':type/:invoice_id'} component={InvoiceViewContainer}/>
                    <Route path={can.MENU.VENDORS} component={VendorsListContainer}/>
                    <Route path={can.MENU.VENDORS + 'edit/:vendor_id'} component={VendorsEditContainer}/>
                    <Route path={can.MENU.VENDORS + 'profile/:vendor_id'} component={VendorsEditContainer}/>
                    <Route path={can.MENU.VENDORS + 'add/'} component={VendorsAddContainer}/>
                    <Route path={can.MENU.TASKS} component={TasksListContainer}/>
                    <Route path={can.MENU.TASKS + 'edit/:task_id'} component={EditTasksContainer}/>
                    <Route path={can.MENU.CALLS} component={CallsContainer}/>
                    <Route path={can.MENU.CALLS + 'history'} component={CallsContainer}/>
                    <Route path={can.MENU.REPORTS} component={ReportsContainer}/>
                    <Route path={can.MENU.FINANCE} component={FinancesListContainer}/>
                    <Route path={can.MENU.SETTING} component={SettingContainer}/>
                    <Route path={can.MENU.SETTING+'general/'} component={SettingGeneralContainer}>
                        <Route path="common" component={SettingCommon}/>
                        <Route path="common/location" component={SettingCommonLocation}/>
                        <Route path="common/sms" component={SettingCommonSms}/>
                        <Route path="common/security" component={SettingCommonSecurity}/>
                        <Route path="common/working-time" component={SettingCommonWorkingTime}/>
                        <Route path="common/backup" component={SettingCommonBackup}/>
                        <Route path="common/direction" component={SettingCommonDirection}/>
                        <Route path="common/email" component={SettingCommonEmail}/>

                        <Route path="clients" component={SettingClients}/>
                        <Route path="clients/happy-birthday" component={SettingClientsHappy}/>
                        <Route path="clients/action" component={SettingClientsAction}/>
                        <Route path="clients/reminder" component={SettingClientsReminder}/>
                        <Route path="clients/record" component={SettingClientsRecord}/>

                        <Route path="polls" component={SettingPolls}/>
                        <Route path="polls/questionnaire" component={SettingPollsQuestionnaire}/>

                    </Route>

                </Route>
                <Route path="/login" component={LoginContainer}/>
            </Router>
        </Provider>
    );
};

Routes.propTypes = {
    store: PropTypes.object.isRequired
};

export default Routes;
