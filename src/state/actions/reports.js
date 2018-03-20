import * as can from "../../constants";
import * as net from "../../utils/network";

export const RECEIVE_REPORT = 'RECEIVE_REPORT';

function receiveReport(operation) {
    return {type: RECEIVE_REPORT, payload: operation};
}

export function fetchGetReports(type, data) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_REPORTS.getReports.replace('{type}', type), data)
            .then(resp => {
                dispatch(receiveReport(resp.data))
            });
    }
}