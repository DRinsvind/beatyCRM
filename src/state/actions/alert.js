// CONSTANTS
export const ACTION_ALERT_PUSH = 'ACTION_ALERT_PUSH';
export const ACTION_ALERT_POP = 'ACTION_ALERT_POP';

// ACTIONS
function actionPushNotification(data) {
    const {title, text, type} = data;
    return {
        type: ACTION_ALERT_PUSH,
        payload: {
            type: (type || 'success'),
            title: title || 'Система',
            text: text || ""
        }
    };
}

function actionPopNotification() {
    return {type: ACTION_ALERT_POP};
}

// CREATORS
/**
 *
 * @param data is a Object with structure = {
 *      type: "success"
 *      title: "Система"
 *      message: "",
 * }
 * @returns {function(*, *)}
 */
export function pushNotification(data) {
    return (dispatch, getState) => {
        dispatch(actionPushNotification(data));
    };
}

export function popNotification() {
    return (dispatch, getState) => {
        dispatch(actionPopNotification());
    };
}