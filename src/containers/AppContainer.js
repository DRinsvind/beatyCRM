import {connect} from "react-redux";
import {authorizationRequired} from "../state/actions/core";
import {push} from 'react-router-redux';
import App from "../components/App";

import {
  confirmCheck,
  checkoutCheck,
  cancelCheck,
  printCheck,
  clearHTML,
  fetchGetUnpaidBillInfo,
  HIDE_CHECK_WINDOW
} from "../state/actions/appointments";

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

const mapStateToProps = (state) => {
  return {
    ...state.core,
    ...state.menu,
    ...state.appointmentsReducer,
    ...state.notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthorizationRequired: () => {
      dispatch(authorizationRequired());
    },

    onUnpaidBill: (appointment_id) => {
      dispatch(fetchGetUnpaidBillInfo(appointment_id));
    },
    onConfirmCheck: (appointment_id, date) => {
      dispatch(confirmCheck(appointment_id, date));
    },
    onHideCheck: () => {
      dispatch({
        type: HIDE_CHECK_WINDOW
      });
    },
    onSaveCheck: (appointment_id, data, date) => {
      dispatch(checkoutCheck(appointment_id, data, date));
    },
    onCancelCheck: (appointment_id, date) => {
      dispatch(cancelCheck(appointment_id, date));
    },
    onPrintCheck: (appointment_id, data) => {
      dispatch(printCheck(appointment_id, data));
    },
    onClearHTMLForCheck: () => {
      dispatch(clearHTML());
    },


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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);