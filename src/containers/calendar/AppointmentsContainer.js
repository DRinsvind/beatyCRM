import {connect} from 'react-redux';
import {
    SELECTED_CLIENT_CLEAR,
    fetchDateAppointments,
    fetchClientDateAppointments,
    fetchCalendarServicesTree,
    fetchCalendarGoodsTree,
    fetchSectionId,
    confirmCheck,
    checkoutCheck,
    cancelCheck,
    saveClientAppointment,
    fetchMastersList,
    saveAppointmentForCheck,
    showClientCheck,
    printCheck,
    clearHTML,
    fetchSearchesList,
    ERRORS_CLEAR,
    SELECTED_CLIENT_ADD_NEW,
    SCROLLED_SWITCH,
    HIDE_CHECK_WINDOW
} from "../../state/actions/appointments";
import {pushNotification} from '../../state/actions/alert';
import {checkInputValue} from "../../state/actions/clients";
import Appointments from "../../components/calendar/Appointments";

const mapStateToProps = (state) => {
    return {
        ...state.core,
        ...state.appointmentsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: (date) => {
            dispatch(fetchDateAppointments(date));
            dispatch(fetchCalendarServicesTree());
            dispatch(fetchCalendarGoodsTree());
            dispatch(fetchMastersList())
        },
        onClientAppointmentsLoad: (client_id, date) => {
            dispatch(fetchClientDateAppointments(client_id, date));
        },
        // TODO: REVIEW CODE
        onCategorySelect: (category_id) => {
            dispatch(fetchSectionId(category_id));
        },
        onSelectedClientClear: () => {
            dispatch({
                type: SELECTED_CLIENT_CLEAR
            });
        },
        onConfirmCheck: (appointment_id, date) => {
            dispatch(confirmCheck(appointment_id, date));
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
        onAppointmentSaving: (appointmentServices) => {
            dispatch(saveClientAppointment(appointmentServices, appointmentServices.date));
        },
        onCheck: (data) => {
            dispatch(checkInputValue(data));
        },
        onClearErrors: () => {
            dispatch({
                type: ERRORS_CLEAR
            });
        },
        onAddSelectedClient: (data) => {
            dispatch({
                type: SELECTED_CLIENT_ADD_NEW, data
            });
        },
        onSwitchScrolled: (scrolled_state) => {
            dispatch({
                type: SCROLLED_SWITCH, scrolled_state
            });
        },
        onAppointmentSaveAndPay: (appointmentServices) => {
            dispatch(saveAppointmentForCheck(appointmentServices, appointmentServices.date));
        },
        onHideCheck: () => {
            dispatch({
                type: HIDE_CHECK_WINDOW
            });
        },
        onShowClientDetails: (client_id, appointment_id, date) => {
            dispatch(showClientCheck(client_id, appointment_id, date));
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        onClearHTMLForCheck: () => {
            dispatch(clearHTML());
        },
        onLoadSearchesList: () => {
            dispatch(fetchSearchesList());
        }
    };
};

const AppointmentsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Appointments);

export default AppointmentsContainer;
