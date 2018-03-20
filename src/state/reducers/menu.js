import {REHYDRATE} from 'redux-persist/constants';
import {ACTION_AUTHORIZATION_CLEAR} from '../actions/core';
import {APP_MENU_RECEIVE} from '../actions/menu';
import {LOCATION_CHANGE} from 'react-router-redux';
import {MENU} from '../../constants';

import $ from 'jquery';

const initialState = {
  loadedMenu: false,
  sections: []
};

function menu(state = initialState, action) {
  switch (action.type) {
    case APP_MENU_RECEIVE:
      const sections = action.payload.data;
      const pathname = action.payload.pathname;
      return {
        ...state,
        code: action.payload.code,
        sections: action.payload.data,
        message: action.payload.message,
        pathname: action.payload.pathname,
        success: action.payload.success,
        selected: findSelectedItem(sections, pathname || '/'),
        loadedMenu: true
      };
    case ACTION_AUTHORIZATION_CLEAR:
      return initialState;
    case LOCATION_CHANGE:
      collapseMenuIfNeeded(action.payload.pathname);

      return {
        ...state,
        selected: findSelectedItem(state.sections, action.payload.pathname)
      };
    case REHYDRATE:
      if (action.payload.menu && action.payload.menu.data) {
        let data = action.payload.menu.sections || action.payload.menu.data;
        return {
          ...state,
          sections: action.payload.menu.data,
          selected: action.payload.menu.selected || state.selected,
          loadedMenu: Boolean(data.length)
        };
      }
      return state;
    default:
      return state;
  }
}

// UTILS
/**
 * Search selected item in section by path.
 * ! NEED TO BE FIXED (it's temporary solution) !
 *
 * @param sections searchable sections.
 * @param pathname menu path.
 * @returns {*} item object if found otherwise null.
 */
function findSelectedItem(sections, pathname) {
  let foundKey = Object.keys(MENU).filter(key => {
    return pathname.startsWith(MENU[key]);
  });

  let selected = null;

  if (foundKey.length) {
    sections.forEach(section => {
      section.items.forEach(item => {
        if (!selected && item.component === foundKey[foundKey.length - 1]) {
          selected = item;
        }
      });
    });
  }

  return selected;
}

/**
 * Filter method for collapsing menu.
 *
 * @param pathname menu path.
 */
function collapseMenuIfNeeded(pathname) {
  let collapse = false;
  [
    '/',
    '/clients/',
    '/goods/',
    '/services/',
    '/calendar/',
    '/calendar',
    '/employees/',
    '/employees/add/',
    '/vendors/',
    '/invoices/',
    '/tasks/',
    '/calls/',
    '/calls/history',
    '/reports/',
    '/finances/',
    '/calendar/schedule',
    '/vendors/add/',
    '/setting/'
  ].forEach(item => {
    if (pathname === item || pathname.indexOf(item)===-1) {
      collapse = true;

      $('html').addClass('sidebar-left-collapsed');
    }
  });

  if (!collapse) {
    $('html').removeClass('sidebar-left-collapsed');
  }
}

export default menu;
