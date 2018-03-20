import React from 'react';
/**
 * Prepend zero to number if lower then 10.
 *
 * @param n any number.
 * @returns string of number with zero leading.
 */
export const NZF = n => (n < 10 ? '0' : '') + n;

/**
 * Standard phone regular expression.
 *
 * @type {RegExp}
 */
export const PHONE_REGEX = /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/;
export const DATE_BIRTH_REGEX = /(\d{4})([\-\/])(\d{2})([\-\/])(\d{2})/;
export const DOUBLE_REGEX = /^\d+(\.\d*)?$/;
export const INT_REGEX = /^\d+$/;

/**
 * Format date to date string.
 *
 * @param date for formatting.
 * @returns {string} formatted string.
 */
export const FORMAT_DATE = (date) => {
    return date.getFullYear() + '-' + NZF(date.getMonth() + 1) + '-' + NZF(date.getDate());
};

/**
 * Format date to time string.
 *
 * @param date for formatting.
 * @returns {string} formatted string.
 */
export const FORMAT_TIME = (date) => {
    return NZF(date.getHours()) + ':' + NZF(date.getMinutes()) + ':00';
};

export const FORMAT_TIME_WITHOUT_SECONDS = (date) => {
    return NZF(date.getHours()) + ':' + NZF(date.getMinutes());
};

export const FORMAT_PHONE_NUMBER = (phone) => {
    let res_phone;
    if (phone !== '') {
        let segs = PHONE_REGEX.exec(phone);
        if (segs !== null) {
            res_phone = '+' + segs[1] + ' (' + segs[2] + ') ' + segs[3] + '-' + segs[4] + '-' + segs[5];
        } else {
            res_phone = phone;
        }
    }
    return res_phone;
};

export const FORMAT_DATE_WITH_POINTS = (date) => {
    let res_date = (<span>&mdash;</span>);
    if (date) {
        const temp_date = new Date(date);
        let dd = temp_date.getDate();
        if (dd < 10) dd = '0' + dd;
        let mm = temp_date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        res_date = dd + '.' + mm + '.' + temp_date.getFullYear();
    }
    return res_date;
};

export const FORMAT_DATE_WITH_TIME = (date) => {
    let res_date = (<span>&mdash;</span>);

    if (date) {
        const temp_date = new Date(date);

        let dd = NZF(temp_date.getDate());
        let mm = NZF(temp_date.getMonth() + 1);
        let hrs = NZF(temp_date.getHours());
        let min = NZF(temp_date.getMinutes());

        res_date = temp_date.getFullYear() + '/' + mm + '/' + dd + ' (' + hrs + ':' + min + ')';
    }

    return res_date;
};

export const FORMAT_DATE_WITH_NO_TIME = (date) => {
    let res_date = (<span>&mdash;</span>);

    if (date) {
        const temp_date = new Date(date);

        let dd = NZF(temp_date.getDate());
        let mm = NZF(temp_date.getMonth() + 1);

        res_date = temp_date.getFullYear() + '/' + mm + '/' + dd;
    }

    return res_date;
};

export const FORMAT_DATE_WITH_SLASH = (date) => {
    return NZF(date.getDate()) + '/' + NZF(date.getMonth()+1) + '/' + date.getFullYear();
};

export const FORMAT_DATE_WITH_DASH = (date) => {
    return NZF(date.getFullYear() + '-' + NZF(date.getMonth()+1) + '-' + date.getDate());
};

export const FORMAT_TIME_WITH_OUT_SEC = (date) => {
    let res_date = (<span>&mdash;</span>);

    if (date) {
        const temp_date = new Date(date);
        let hrs = NZF(temp_date.getHours());
        let min = NZF(temp_date.getMinutes());

        res_date = '(' + hrs + ':' + min + ')';
    }

    return res_date;
};

export const FORMAT_DATE_WITHOUT_TIME = (date) => {
    let res_date = (<span>&mdash;</span>);
    if (date) {
        let segms = DATE_BIRTH_REGEX.exec(date);
        res_date = segms[5] + '.' + segms[3] + '.' + segms[1];
    }
    return res_date;
};

export const MAP_TO_DATA_CATEGORIES = (categories, category_id) => {
    const loadNodes = (items) => {
        return items.map((item, idx) => {
            if (item.items) {
                return {
                    item: item,
                    id: idx,
                    text: item.name,
                    children: loadNodes(item.items),
                    state: idx === category_id ? {
                        opened: true,
                        selected: true
                    } : {
                        opened: true,
                        selected: false
                    }

                };
            }
            return {
                item: item,
                id: idx,
                text: item.name,
                type: 'file',
                state: idx === category_id ? {
                    selected: true
                } : {
                    selected: false
                }
            };
        });
    };

    return loadNodes(categories);
};


export const DEFINE_INT_NUMBER = (prev_value, next_value) => {
    const matches = INT_REGEX.exec(next_value);

    if ((matches && matches[0]) || (next_value === '')) {
        return next_value;
    }

    return prev_value;
};


export const DEFINE_DOUBLE_NUMBER = (prev_value, next_value) => {
    const matches = DOUBLE_REGEX.exec(next_value);

    if ((matches && matches[0]) || (next_value === '')) {
        return next_value;
    }

    return prev_value;
};

export const FORMAT_FIRST_DAY_OF_MONTH = (date) => {
    return '01/' + NZF((date.getMonth())+1) + '/' + date.getFullYear();
};

export const FORMAT_LAST_DAY_OF_MONTH = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth()+1;

    return new Date(year , month, 0).getDate() + '/' + NZF(month) + '/' + year;

};


// BACKUP FUNC
Array.prototype.flatMap = function (lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

export default {
    PHONE_REGEX,
    DATE_BIRTH_REGEX,
    DOUBLE_REGEX,
    INT_REGEX,
    FORMAT_DATE,
    FORMAT_TIME,
    FORMAT_TIME_WITHOUT_SECONDS,
    FORMAT_PHONE_NUMBER,
    FORMAT_DATE_WITH_POINTS,
    FORMAT_DATE_WITH_TIME,
    FORMAT_DATE_WITH_SLASH,
    FORMAT_TIME_WITH_OUT_SEC,
    FORMAT_DATE_WITHOUT_TIME,
    MAP_TO_DATA_CATEGORIES,
    DEFINE_INT_NUMBER,
    DEFINE_DOUBLE_NUMBER
};

