import * as net from "../../utils/network";
import * as can from "../../constants";

// CONSTANTS
export const APP_MENU_RECEIVE = 'APP_MENU_RECEIVE';
export const APP_MENU_COMPONENT_CHANGED = 'APP_MENU_COMPONENT_CHANGED';

// ACTIONS
function actionReceiveMenu(menu) {
    return {type: APP_MENU_RECEIVE, payload: menu};
}

// CREATORS
export function changeComponent(item) {
    return {type: APP_MENU_COMPONENT_CHANGED, item};
}

/**
 * Loading menu if not loaded.
 *
 * @param force pass true if need load now, otherwise false.
 * @returns {function(*, *)}.
 */
export function fetchAppMenuIfNeeded(force) {
    return (dispatch, getState) => {
        const {core, menu} = getState();

        if (!menu.loadedMenu || force) {
            return net.aGet(getState(), can.API_COMMONS.getMenu)
                .then(resp => dispatch(actionReceiveMenu({
                    ...resp,
                    pathname: core.lastpath
                })));
        }
    };
}