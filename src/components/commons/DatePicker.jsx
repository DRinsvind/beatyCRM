import React, {Component} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
const $ = window.$;

/**
 * Date picker component.
 */
class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 'datePicker_' + uuid.v4().replace(/[\-]+/g, '')
        };
    };

    componentWillUpdate(nextProps, nextState) {
    }

    render() {
        return (
            <div id={this.state.id}></div>
        );
    }

    componentDidMount() {
        $('#' + this.state.id).datepicker({
            todayHighlight: true,
            weekStart: 1,
            language: 'ru-RU',
            todayBtn: 'linked'
        }).on('changeDate', this.onChangeDate)
        .on('changeMonth', this.onChangeMonth);
    }

    onChangeDate = (e) => {
        if (this.props.onDateChanged) {
            this.props.onDateChanged(e.date);
        }
    };
    onChangeMonth = (e) => {
        if (this.props.onMonthChanged) {
            this.props.onMonthChanged(e.date);
        }
    };
}

DatePicker.propTypes = {
    onDateChanged: PropTypes.func
};

export default DatePicker;
