import {connect} from 'react-redux';
import {fetchGetReports} from '../../state/actions/reports'
import Reports from '../../components/reports/Reports';

const mapStateToProps = (state) => {
    return state.reportsReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadReport: (type, data) => {
            dispatch(fetchGetReports(type, data));
        },
    };
};

const ReportsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Reports);

export default ReportsContainer;
