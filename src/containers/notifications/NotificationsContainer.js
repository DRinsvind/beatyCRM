import {connect} from 'react-redux';
import {fetchNotifications} from "../../state/actions/notification";
import NotificationsList from "../../components/notifications/NotificationsList";

const mapStateToProps = (state) => {
    return state.notification;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchNotifications());
        },
    };
};

const NotificationsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationsList);

export default NotificationsContainer;