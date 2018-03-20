import React, {Component} from "react";
import PropTypes from "prop-types";
import AppMenuContainer from "../containers/AppMenuContainer";
import AlertContainer from "../containers/AlertContainer";

import AppContent from "./AppContent";


import {FORMAT_DATE} from '../utils';
import Modal from '../components/commons/modals/Modal';
import AppointmentsDetailsCard from '../components/calendar/AppointmentsDetailsCard';
import jQuery from 'jquery';

const date = new Date();
const $ = window ? window.jQuery : jQuery;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.unpaid_bill_info !== this.props.unpaid_bill_info) {
      nextState.selectedClientDetails = nextProps.unpaid_bill_info.selectedClientDetails;
      nextState.selectedAppointmentId = nextProps.unpaid_bill_info.selectedAppointmentId;
    }
  }

  render() {
    if (!this.props.token || !this.props.token.value || !this.props.token.valid) {
      return null;
    }

    return (
      <section className='body'>
        <div className="inner-wrapper">
          <Modal
            id="clientAppointmentModalBill"
            customClass="modal-dialog modal-lg"
            idForm="formClientAppointment"
            title="Карточка визита">
            <AppointmentsDetailsCard
              data={this.state.selectedClientDetails}
              appointmentId={this.state.selectedAppointmentId}
              onConfirmCheck={this.onConfirmCheck}
              onSaveCheck={this.onSaveCheck}
              onCancelCheck={this.onCancelCheck}
              onCloseCheck={this.onCloseCheck}
              onPrintCheck={this.props.onPrintCheck}
              html_for_check={this.props.html_for_check}
              onClearHTMLForCheck={this.props.onClearHTMLForCheck}
            />
          </Modal>
          <AppMenuContainer />
          <AppContent
            page={this.props.selected}
            unpaid_bills={this.props.unpaid_bills}
            notificationsNew={this.props.notificationsNew}
            html_unpaid_for_check={this.props.html_unpaid_for_check}
            onPrintUnpaidBill={this.props.onPrintUnpaidBill}
            onClearHTMLForUnpaidCheck={this.props.onClearHTMLForUnpaidCheck}
            onNotificationChangeState={this.props.onNotificationChangeState}
            onSignOut={this.props.onSignOut}
            onViewAll={this.props.onViewAll}
            user={this.props.user}
            onShowBill={this.onShowBill}
          >
            {this.props.children}
          </AppContent>
        </div>
        <AlertContainer />
      </section>
    );
  }


  onShowBill = (appointment_id) => {
    this.props.onUnpaidBill(appointment_id);
    $('#clientAppointmentModalBill').modal('show');
  };

  onConfirmCheck = (appointment_id) => {
    $('#clientAppointmentModalBill').modal('hide');
    this.props.onConfirmCheck(appointment_id, FORMAT_DATE(date));
    this.props.onHideCheck();
  };

  onSaveCheck = (appointment_id, data) => {
    $('#clientAppointmentModalBill').modal('hide');
    this.props.onSaveCheck(appointment_id, data, FORMAT_DATE(date));
    this.props.onHideCheck();
  };

  onCancelCheck = (appointment_id) => {
    $('#clientAppointmentModalBill').modal('hide');
    this.props.onCancelCheck(appointment_id, FORMAT_DATE(date));
    this.props.onHideCheck();
  };

  onCloseCheck = () => {
    $('#clientAppointmentModalBill').modal('hide');
    this.props.onHideCheck();
  };


  componentDidUpdate() {
    if (this.props.loaded && (!this.props.token.value || !this.props.token.valid)) {
      this.props.onAuthorizationRequired();
    }
  }

  componentDidMount() {
    if (this.props.loaded && (!this.props.token.value || !this.props.token.valid)) {
      this.props.onAuthorizationRequired();
    }
  }
}

App.propTypes = {
  token: PropTypes.object.isRequired,
  onAuthorizationRequired: PropTypes.func.isRequired,
  onUnpaidBill: PropTypes.func.isRequired,
  onConfirmCheck: PropTypes.func.isRequired,
  onHideCheck: PropTypes.func.isRequired,
  onSaveCheck: PropTypes.func.isRequired,
  onCancelCheck: PropTypes.func.isRequired,
  onPrintCheck: PropTypes.func.isRequired,
  onClearHTMLForCheck: PropTypes.func.isRequired,
  onPrintUnpaidBill: PropTypes.func.isRequired,
  onViewAll: PropTypes.func.isRequired
};

export default App;
