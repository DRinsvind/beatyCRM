import {connect} from 'react-redux';
import AppointmentCard from "../components/calendar/AppointmentCard";

const mapStateToProps = (state) => {
    return state.appointmentDetailsReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

const AppointmentCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppointmentCard);

export default AppointmentCardContainer;