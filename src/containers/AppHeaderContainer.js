import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {authorizationFlush} from '../state/actions/core';
import {
    changeNotificationState,
    fetchNotificationsNew
} from '../state/actions/notification';
import {
    fetchUnpaidBillsList,
    printUnpaidBill,
    clearUnpaidHTML
} from "../state/actions/appointments";
import AppHeader from "../components/AppHeader";

const mapStateToProps = (state) => {
    return {
        ...state.core,
        ...state.notification,
        ...state.appointmentsReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadNotifications: () => {
            dispatch(fetchNotificationsNew());
            dispatch(fetchUnpaidBillsList());
        },
        onNotificationChangeState: (data) => {
            dispatch(changeNotificationState(data));
        },
        onPrintUnpaidBill: (appointment_id) => {
           dispatch(printUnpaidBill(appointment_id));
        },
        onViewAll: () => {
            dispatch(push('/notifications/'));
        },
        onSignOut: () => {
            dispatch(authorizationFlush());
        },
        onClearHTMLForUnpaidCheck: () => {
            dispatch(clearUnpaidHTML());
        },
        onImageBackstageClick: () => {
            dispatch(push('/calendar/'));
        },
    };
};

const AppHeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHeader);

export default AppHeaderContainer;