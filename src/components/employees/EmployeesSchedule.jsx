import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from '../commons/DatePicker';
import {TimePicker} from 'antd';
import moment from 'moment';

const $ = window.$;
let groupEmoloyees = [];

class EmployeesSchedule extends Component {

    state = {
        marked: [],
        isDown: false,
        search: '',
        date: new Date(),
        period: {
            start: '',
            end: ''
        },
        time: {
            timeStart: ['09', '00'],
            timeEnd: ['18', '00']
        },
        showTime: false,
        types: [],
        usersEvent: [],
        errors: {},
        workingThisDay: false
    };

    //Lifecycle

    componentWillReceiveProps(nextProps) {
        this.setState({types: this.mapDataTypes(nextProps.types)});
        this.setState({usersEvent: this.mapDataSchedule(nextProps.schedule)});
        this.groupEmoloyees = this.props.groupEmoloyees;
    }

    componentWillUpdate(nextProps, nextState) {
        const posArr = nextState.marked.map((item) =>
            item.split('#')[0]);

        const period = {};

        period.start = posArr.length !== 0
            ? `${Math.min(...posArr)} ${this.state.date.toLocaleString('Ru-ru', {month: 'short'})}`
            : '';

        period.end = posArr.length !== 0
            ? `${Math.max(...posArr)} ${this.state.date.toLocaleString('Ru-ru', {month: 'short'})}`
            : '';

        nextState.period = period;

        if (this.props !== nextProps) {
            nextState.usersEvent = this.mapDataSchedule(nextProps.schedule);
        }
    }

    componentDidUpdate() {
        if ($('#period_select_list').select2) {
            $('#period_select_list')
                .select2({theme: 'bootstrap'})
                .off('change')
                .on('change', e => {
                    this.onSelectEvent(e.target.value);
                });
        }

        $('.wpmse_select2').select2({
            width: '100%',
            escapeMarkup: (markup) => markup,
            templateResult: (icon) =>
                `<i class="fa ${$(icon.element).data('icon')}"></i> ${icon.text}`
        });

        this.secondScroll();
    }

    //actions
    secondScroll = () => {
        const scrollHeight = $('#employee-schedule-table-container')
            .height() - 588;

        $('#employee-schedule-scroll')
            .width($('#employee-schedule-table')
                .width());

        $('#employee-schedule-scroll-container')
            .width($('#employee-schedule-scroll-container-main')
                .width());

        $(() => {
            $(window).scroll(() => {
                if ($(window).scrollTop() > scrollHeight) {
                    $('#employee-schedule-scroll-container')
                        .css('display', 'none');
                } else {
                    $('#employee-schedule-scroll-container')
                        .css('display', '');
                }
            });

            $('#employee-schedule-scroll-container-main')
                .scroll(() => {
                    $('#employee-schedule-scroll-container')
                        .scrollLeft($('#employee-schedule-scroll-container-main')
                            .scrollLeft());
                });

            $('#employee-schedule-scroll-container')
                .scroll(() => {
                    $('#employee-schedule-scroll-container-main')
                        .scrollLeft($('#employee-schedule-scroll-container')
                            .scrollLeft());
                });
        });
    };

    mapDataSchedule = (schedule) => (
        schedule.map((item) => {
            const rowItem = {};
            groupEmoloyees.forEach((row, index) => {
                if (row.employee_id === +item.employee_id) {
                    rowItem.name = row.employee_name;
                    rowItem.row = index;
                }
            });
            const res = {
                col: new Date(item.date).getDate(),
                row: rowItem.row,
                name: rowItem.name,
                id: +item.employee_id,
                eventId: item.type_time_usage_id
            };
            if (item.time_begin) {
                res.timeStart = item.time_begin;
            }

            if (item.time_end) {
                res.timeEnd = item.time_end;
            }

            return res;
        })
    );

    mapDataTypes = (types) => (
        types.map((item) => {
            if (item.type_time_usage_id === 1) {
                return {id: 0, text: 'Ничего'};
            }

            return {
                id: item.type_time_usage_id,
                text: item.type_time_usage_name
            };
        })
    );

    onSelectEvent = (value) => {
        const markedEvent = this.state.marked.map((item) =>
            ({
                col: +item.split('#')[0],
                row: +item.split('#')[1],
                name: item.split('#')[2],
                id: +item.split('#')[3],
                eventId: +value
            })
        );
        const usersEvent = this.state.usersEvent;
        let usersEventRes = [...this.state.usersEvent];
        if (this.state.usersEvent.length === 0) {
            this.setState({usersEvent: markedEvent});
            this.setState({marked: []});
            this.updateShedule(markedEvent);
        } else {
            markedEvent.forEach(markedItem => {
                if (usersEvent.every(userItem => userItem.col !== markedItem.col || userItem.id !== markedItem.id)) {
                    usersEventRes.push(markedItem);
                }

                if (usersEvent.some(userItem => userItem.col === markedItem.col && userItem.id === markedItem.id)) {
                    if (markedItem.eventId === 0) {
                        usersEventRes = usersEventRes.filter((item) =>
                            item.col !== markedItem.col || item.id !== markedItem.id
                        );

                    } else {
                        usersEventRes = usersEventRes.filter(item =>
                            item.col !== markedItem.col || item.id !== markedItem.id
                        );

                        usersEventRes.push(markedItem);
                    }
                }
            });

            this.setState({usersEvent: usersEventRes});
            this.setState({marked: []});
            this.updateShedule(usersEventRes);
        }

        $('#period_select_list').val('');
    };

    onBlurTime = () => {
        const markedEvent = this.state.marked.map((item) => (
            {
                col: +item.split('#')[0],
                row: +item.split('#')[1],
                name: item.split('#')[2],
                id: +item.split('#')[3],
                eventId: 1,
                timeStart: `${this.state.time.timeStart[0]}:${this.state.time.timeStart[1]}`,
                timeEnd: `${this.state.time.timeEnd[0]}:${this.state.time.timeEnd[1]}`
            })
        );
        let usersEventRes = [...this.state.usersEvent];
        const usersEvent = this.state.usersEvent;
        const timeDefault = {
            timeStart: ['09', '00'],
            timeEnd: ['18', '00']
        };

        if (this.state.usersEvent.length === 0) {
            this.setState({time: timeDefault});
            this.setState({usersEvent: markedEvent});
            this.setState({marked: []});
            this.updateShedule(markedEvent);
            this.setState({workingThisDay: false});
        } else {
            markedEvent.forEach((markedItem) => {
                if (usersEvent.every((userItem) => userItem.col !== markedItem.col
                        || userItem.id !== markedItem.id)) {
                    usersEventRes.push(markedItem);
                }

                if (usersEvent.some((userItem) => userItem.col === markedItem.col && userItem.id === markedItem.id)) {
                    if (markedItem.eventId === 0) {
                        usersEventRes = usersEventRes.filter((item) =>
                            item.col !== markedItem.col || item.id !== markedItem.id
                        );
                    } else {
                        usersEventRes = usersEventRes.filter((item) =>
                            item.col !== markedItem.col || item.id !== markedItem.id
                        );
                        usersEventRes.push(markedItem);
                    }

                }
            });
            this.setState({time: timeDefault});
            this.setState({usersEvent: usersEventRes});
            this.setState({marked: []});
            this.updateShedule(usersEventRes);
            this.setState({workingThisDay: false});
        }
    };

    updateShedule = (usersEvent) => {
        const {date} = this.state;
        const firstDay = `${date.getFullYear()}-${date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1}-01`;

        let params = usersEvent.map((item) => {
            const res = {
                employee_id: item.id,
                type_time_usage_id: item.eventId,
                date: `${date.getFullYear()}-${date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1}-${item.col < 10
                    ? '0' + item.col
                    : item.col}`
            };

            if (item.timeStart) {
                res.time_begin = item.timeStart;
            }

            if (item.timeEnd) {
                res.time_end = item.timeEnd;
            }

            return res;
        });

        params = params.filter((item) => item.type_time_usage_id !== 0);
        this.props.onUpdateEmployeeShedule(firstDay, params);
    };

    onReselectSchedule = (id) => {
        let lastElement = [];
        let currElement = [];

        if (this.state.marked.length !== 0) {
            lastElement = this.state.marked[0].split('#');
            currElement = id.split('#');
        }
        if (this.state.marked.some((item) => item === id)) {
            const markedIndex = this.state.marked.indexOf(id);
            let {marked} = this.state;
            marked.splice(markedIndex, 1);
            this.setState({
                marked: marked,
                workingThisDay: false
            });

        } else if (lastElement[1] !== currElement[1] && id !== '') {
            this.setState({marked: []});

        } else if (id !== '') {
            this.setState({
                marked: [id, ...this.state.marked],
                workingThisDay: false
            });
        }
    };

    onMouseOver = (id) => {
        if (id && this.state.isDown) {
            const {marked} = this.state;
            if (marked[marked.length - 1].split('#')[3] === id.split('#')[3]) {
                this.setState({
                    marked: [id, ...marked],
                    workingThisDay: false
                });
            }
        }
    };

    onMouseDown = (id) => {
        if (this.state.marked.length === 0 && id !== '') {
            this.setState({
                isDown: true,
                marked: [id]
            });

        } else {
            this.setState({isDown: true});
        }

        this.onReselectSchedule(id);

    };

    renderRow = (dates, rowId, empl) => {
        const row = [];
        const showTimeWidthClassName = this.state.showTime
            ? 'employee-shedule-showtime-wide'
            : 'employee-shedule-showtime-narrow';

        for (let i = 1; i <= dates; i++) {
            let icon = '';
            let eventId = 0;
            let time = '';

            const id = `${i}#${rowId}#${empl.employee_name}#${empl.employee_id}`;
            this.state.usersEvent &&
            this.state.usersEvent.forEach((item) => {
                if (item.col === i && item.id === empl.employee_id) {
                    time = item.timeStart && `${item.timeStart} ${item.timeEnd}`;

                    if (item.eventId === 0) {
                        eventId = 0;
                    }

                    if (item.eventId === 1) {
                        eventId = 1;
                    }

                    if (item.eventId === 3) {
                        icon = (
                            <i
                                className="fa fa-plane employee-schedule-icon-plane"
                                aria-hidden="true"
                            />
                        );
                    }

                    if (item.eventId === 2) {
                        icon = (
                            <i
                                className="fa fa-user-secret employee-schedule-icon-user-secret"
                                aria-hidden="true"
                            />
                        );
                    }

                    if (item.eventId === 4) {
                        icon = (
                            <i
                                className="fa fa-ambulance employee-schedule-icon-ambulance"
                                aria-hidden="true"
                            />
                        );
                    }
                }
            });

            row.push(
                <td
                    key={i}
                    className={showTimeWidthClassName}
                    style={{
                        padding: '0px'
                    }}
                >
                    <div
                        className={
                            this.state.marked.some((item) =>
                                item === `${i}#${rowId}#${empl.employee_name}#${empl.employee_id}`
                            )
                                ? 'clickedTd'
                                : eventId === 1
                                ? 'employee-shedule-workTd'
                                : 'defaultTd'
                        }
                        key={i}
                        id={id}
                        onMouseOver={() => this.onMouseOver(id)}
                        onMouseDown={() => this.onMouseDown(id)}
                        onMouseUp={() => this.setState({isDown: false})}
                    >
                        {icon}
                        <div
                            className={this.state.showTime
                                ? 'employees-shedule-time-container'
                                : 'display-none'}>
                            {time}
                        </div>
                    </div>
                </td>
            );
        }
        return row;
    };

    renderLoadingRowDays = (datesInMonth) => (
        groupEmoloyees.map((empl, eid) => (
            <tr
                key={eid}
                className="schedule-body-category-tr"
            >
                {this.renderRow(datesInMonth, eid, empl)}
            </tr>
        ))
    );

    renderEmployeeName = () => {
        const searchTerm = (this.state.search && this.state.search.toString().toLowerCase()) || '';
        let dataFound = this.props.groupEmoloyees;
        if (searchTerm) {
            dataFound = dataFound.filter((row) => {
                let found = false;
                if (row.employee_name
                        .toString()
                        .toLowerCase()
                        .indexOf(searchTerm) >= 0
                ) {
                    found = true;
                }
                return found;
            });
        }

        groupEmoloyees = dataFound;

        return (
            dataFound &&
            dataFound.map((empl, eid) => (
                    <tr key={eid} className="schedule-body-category-tr">
                        <td
                            key={eid}
                            style={{
                                fontWeight: 'bold',
                                marginLeft: '20px'
                            }}
                        >
                            {empl.employee_name}
                        </td>
                    </tr>
                )
            )
        );
    };

    renderDaysHeader = (datesInMonth) => {
        let headers = [];

        for (let i = 1; i <= datesInMonth; i++) {
            let date = new Date(this.state.date);
            date.setDate(i);
            let dateNum = i;
            if (i < 10) {
                dateNum = i;
            }

            headers.push(
                <th
                    key={'dates_' + i}
                    className="employee-schedule-date-header-container"
                >
                    <div className="employee-schedule-date-header-number">
                        {dateNum}
                    </div>
                    <div className="employee-schedule-date-header-day">
                        {date.toLocaleString('Ru-ru', {weekday: 'short'})}
                    </div>
                </th>
            );
        }
        return headers;
    };

    daysInMonth = () => {
        let date = new Date(this.state.date);
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    onDateChanged = (date) => {
        if (date.getMonth() !== this.state.date.getMonth() || date.getYear() !== this.state.date.getYear()) {
            this.props.onLoadScheduleData(date);
        }
        this.setState({date: date});
    };

    onClearErrors = () => {
        this.setState({errors: {}});
    };

    onCheckTime = e => {
        if (!e) {
            const {errors} = this.state;
            if (+this.state.time.timeStart[0] > +this.state.time.timeEnd[0]) {
                errors.timeEnd = true;
                errors.timeStart = true;
            }
            this.setState({errors: errors});

            if (!errors.timeStart && !errors.timeEnd) {
                this.onBlurTime(e);
            }
        } else {
            this.setState({errors: {}});
        }
    };

    onChangeStartTime = (time, timeString) => {
        const timeState = this.state.time;
        const timeArr = timeString.split(':');
        timeState.timeStart = timeArr;
        this.setState({time: timeState});
    };

    onChangeEndTime = (time, timeString) => {
        const timeState = this.state.time;
        const timeArr = timeString.split(':');
        timeState.timeEnd = timeArr;
        this.setState({time: timeState});
    };

    onCheckedWorkingThisDay = () => {
        this.state.workingThisDay
            ? this.setState({workingThisDay: false})
            : this.setState({workingThisDay: true})
    };


    renderHeader = () => {
        const display = this.state.workingThisDay
            ? ' display-none '
            : '';

        const notDisplay = this.state.workingThisDay
            ? 'emploee-schedule-time-container'
            : ' display-none ';

        return (<header style={{height: '41px'}}>
            <div className="employee-shedule-header-title">
                График работы
            </div>
            <div className="employee-shedule-header-events">
                <div className="employee-schedule-period-label2">
                    Сотрудник:<br/>
                    Пользователь
                </div>
                <div className="employee-schedule-period-select">
                    <div
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay}
                            checked={this.state.workingThisDay}
                        />
                        <label className="employee-schedule-work-this-day-label">
                            Работает в этот день
                        </label>
                    </div>
                    <div className={notDisplay}>
                        <div className={this.state.errors.timeStart
                            ? 'has-error display-inline-block'
                            : 'display-inline-block'
                        }>
                            <TimePicker
                                className="employee-schedule-time"
                                format="HH:mm"
                                minuteStep={30}
                                onChange={this.onChangeStartTime}
                                defaultValue={moment('09:00', 'HH:mm')}
                                onOpenChange={this.onClearErrors}
                            />
                        </div>
                        <div className={this.state.errors.timeEnd
                            ? 'has-error display-inline-block'
                            : 'display-inline-block'
                        }>
                            &nbsp;-&nbsp;
                            <TimePicker
                                className="employee-schedule-time"
                                format="HH:mm"
                                minuteStep={30}
                                onChange={this.onChangeEndTime}
                                defaultValue={moment('18:00', 'HH:mm')}
                                onOpenChange={this.onCheckTime}
                            />
                        </div>
                    </div>
                    {/*___________________hide all block ot css______________________________________*/}
                    {!this.state.workingThisDay &&
                    <div id="period_select_list-container" className={display}>
                        <select
                            name="period_options"
                            id="period_select_list"
                            className="input-block-level wpmse_select2"
                            data-placeholder="Выберите событие"
                        >
                            <option value=""/>
                            <option value={this.state.types[0] && this.state.types[0].id}
                                    data-icon="fa-square-o">
                                {this.state.types[0] && this.state.types[0].text}
                            </option>
                            <option value={this.state.types[2] && this.state.types[2].id}
                                    data-icon="fa-plane">
                                {this.state.types[2] && this.state.types[2].text}
                            </option>
                            <option value={this.state.types[1] && this.state.types[1].id}
                                    data-icon="fa-user-secret">
                                {this.state.types[1] && this.state.types[1].text}
                            </option>
                            <option value={this.state.types[3] && this.state.types[3].id}
                                    data-icon="fa-ambulance">
                                {this.state.types[3] && this.state.types[3].text}
                            </option>
                        </select>
                    </div>
                    }

                </div>
                <div className="show-time-checkbox checkbox-custom-employee checkbox-primary-employee">
                    <input
                        type="checkbox"
                        name="showTime"
                        value="showTime"
                        onChange={() => {
                            if (this.state.showTime) {
                                this.setState({
                                    showTime: false
                                });
                            } else {
                                this.setState({
                                    showTime: true
                                });
                            }
                        }}
                    />
                    <label style={{color: '#424242'}}>Показывать время работы</label>
                </div>
            </div>
        </header>)
    };


    /*____________________________________________________________________________________________________________________*/
    render() {
        return (
            <div className="row" id="qwerty">
                <div className="col-md-12">
                    <section className="panel">
                        {this.renderHeader()}
                        <div id="employee-schedule-table-container" className="panel-body pr-xlg"
                             style={{fontSize: '12px'}}>
                            <div className="row">
                                <div className="employee-schedule-secondname pr-none">
                                    <table
                                        className="table table-hover mb-none table-bordered"
                                        style={{
                                            borderRight: '0px'
                                        }}
                                    >
                                        <thead>
                                        <tr
                                            style={{
                                                height: '32px'
                                            }}
                                        >
                                            <th
                                                key={'full_name'}
                                                style={{
                                                    padding: '0px'
                                                }}
                                            >
                                                <DatePicker
                                                    onDateChanged={this.onDateChanged}
                                                    onMonthChanged={this.onDateChanged}/>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>{this.renderEmployeeName()}</tbody>
                                    </table>
                                </div>
                                <div
                                    id="employee-schedule-scroll-container-main"
                                    className="p-none"
                                >
                                    <div id="employee-schedule-scroll-container">
                                        <div id="employee-schedule-scroll"/>
                                    </div>
                                    <table
                                        id="employee-schedule-table"
                                        className="table table-hover mb-none table-bordered"
                                        style={{
                                            borderLeft: '0px'
                                        }}
                                    >
                                        <thead>
                                        <tr>{this.renderDaysHeader(this.daysInMonth())}</tr>
                                        </thead>
                                        <tbody>{this.renderLoadingRowDays(this.daysInMonth())}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

EmployeesSchedule.propTypes = {
    groupEmployeees: PropTypes.array,
    onLoadScheduleData: PropTypes.func.isRequired,
    onUpdateEmployeeShedule: PropTypes.func.isRequired,
    schedule: PropTypes.array,
    types: PropTypes.array.isRequired
};

export default EmployeesSchedule;
