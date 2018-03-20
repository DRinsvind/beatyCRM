import React, {Component} from 'react';
import CallsNew from './CallsNew';
import CallsHistory from './CallsHistory';
import PropTypes from 'prop-types';

import DatePicker from '../commons/DatePicker';
import {FORMAT_DATE} from '../../utils/index';
import jQuery from 'jquery';
const $ = jQuery;

// const $ = window.$;

class Calls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_group: {
                name: 'Все',
                id: 0,
                denom: ''
            },
            calls: [],
            filter: [],
            loading: props.loading,
            showCalendar: false,
            currentDate: new Date()
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.calls !== this.props.calls) {
            nextState.calls = this.mapCallsToData(nextProps.calls, nextState.selected_group.id);
            nextState.filter = this.mapFilterToData(nextProps.calls);
        }

        if (this.props.loading !== nextProps.loading) {
            nextState.loading = nextProps.loading;
        }
    }

    render() {
        return (
            <section className="content-with-menu">
                <div className="content-with-menu-container">
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="inner-menu-content">
                                <div
                                    id="calls_history_calendar"
                                    className="sidebar-widget"
                                    style={{margin: '20px 35px'}}>
                                    <div className="widget-header text-center">
                                        <h6 className="title" style={{color: 'white'}}>
                                            КАЛЕНДАРЬ
                                            <a href="#"
                                               className="pull-right"
                                               style={{color: '#465162', fontSize: '0.8em'}}
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   $('#smallCalendar').stop().slideToggle(() => {
                                                       this.setState({
                                                           showCalendar: !this.state.showCalendar
                                                       });
                                                   })
                                               }}>
                                                <i className={'fa fa-fw fa-chevron-' + (this.state.showCalendar ? 'up' : 'down')}/>
                                            </a>
                                        </h6>
                                    </div>
                                    <div id="smallCalendar"
                                         className="widget-content"
                                         style={{display: this.state.showCalendar ? 'block' : 'none'}}>
                                        <DatePicker
                                            date={this.state.currentDate}
                                            onDateChanged={this.currentDateChange}
                                        />
                                    </div>
                                    <hr className="separator"/>
чк                                </div>

                                <div className="sidebar-widget m-none">
                                    <div className="widget-header mt-lg">
                                        <h6 className="title ml-lg" style={{paddingTop: 5}}>
                                            КАТЕГОРИИ
                                        </h6>
                                    </div>
                                    <div className="widget-content">
                                        <nav id="menu" className="nav-main" role="navigation">
                                            <ul className="nav nav-main">
                                                {this.renderFilterItems(this.state.selected_group)}
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </menu>
                    <div className="inner-body mg-main">
                        <div className="tabs">
                            <ul className="nav nav-tabs tabs-primary">
                                <li id="new_calls_tab" className="active">
                                    <a href="#new_calls" data-toggle="tab" onClick={this.newCalls}>Новые звонки</a>
                                </li>
                                <li id="history_tab">
                                    <a href="#history" data-toggle="tab" onClick={this.callsHistory}>История
                                        прозвонов</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <CallsNew
                                    calls={this.state.calls}
                                    onAddComment={this.props.onAddComment}
                                    onCheckCall={this.props.onCheckCall}
                                    statuses_list={this.props.statuses_list}
                                    onAddStatus={this.props.onAddStatus}
                                    onNotifyShow={this.props.onNotifyShow}/>

                                <div id="history" className="tab-pane">
                                    <CallsHistory
                                        onLoadCallsHistory={this.props.onLoadCallsHistory}
                                        calls_history={this.props.calls_history}
                                        onClientClick={this.clientClick}
                                        loading={this.state.loading}
                                        currentDate={this.state.currentDate}
                                        denom={this.state.selected_group.denom}
                                        statuses_list={this.props.statuses_list}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        )
    };

    componentDidUpdate() {
        let path = this.props.router.location.pathname;

        if (path.match('/history') !== null) {
            $('#history_tab').addClass('active');
            $('#history').addClass('active');
            $('#new_calls_tab').removeClass('active');
            $('#new_calls').removeClass('active');
            $('#calls_history_calendar').removeClass('hidden');
        } else {
            $('#history_tab').removeClass('active');
            $('#history').removeClass('active');
            $('#new_calls_tab').addClass('active');
            $('#new_calls').addClass('active');
            $('#calls_history_calendar').addClass('hidden');
        }
    }


    componentDidMount() {
        let path = this.props.router.location.pathname;

        if (path.match('/history') !== null) {
            $('#history_tab').addClass('active');
            $('#history').addClass('active');
            $('#new_calls_tab').removeClass('active');
            $('#new_calls').removeClass('active');
            this.props.onLoadCallsHistory(FORMAT_DATE(this.state.currentDate) + this.state.selected_group.denom);
        }
        this.props.onLoadCallsList();
    }

    renderFilterItems = (selected_group) => {
        let path = this.props.router.location.pathname;
        return this.state.filter.map((item) => {
            return (
                <li className={+selected_group.id === +item.id ? "nav nav-active" : "nav"} key={item.id}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                            selected_group: {
                                name: item.name,
                                id: item.id,
                                denom: item.denom
                            },
                            calls: this.mapCallsToData(this.props.calls, item.id)
                        });
                        if (path.match('/history') !== null) {
                            this.props.onLoadCallsHistory(FORMAT_DATE(this.state.currentDate) + item.denom);
                        }
                    }}>
                        <i className="fa fa-asterisk"/>
                        {item.name}
                        <span
                            className={"badge pull-right badgeStyle" + (path.match('/history') !== null ? ' hidden' : '')}>
                            {item.count}
                        </span>
                    </a>
                </li>
            )
        });
    };

    mapCallsToData = (calls, id) => {
        let result_calls = [];
        switch (id) {
            case 0:
                result_calls = calls.birthday
                    .concat(calls.lost)
                    .concat(calls.month)
                    .concat(calls.once);
                break;

            case 1:

                result_calls = calls.birthday;
                break;

            case 2:

                result_calls = calls.once;
                break;

            case 3:

                result_calls = calls.lost;
                break;

            case 4:

                result_calls = calls.month;
                break;
        }

        return result_calls;

    };

    mapFilterToData = (calls) => {
        const birthday = calls.birthday.filter((call) => (!call.state)).length;
        const lost = calls.lost.filter((call) => (!call.state)).length;
        const month = calls.month.filter((call) => (!call.state)).length;
        const once = calls.once.filter((call) => (!call.state)).length;

        const all = birthday + lost + month + once;

        return [
            {
                name: 'Все',
                id: 0,
                count: all,
                denom: ''
            },
            {
                name: 'Дни рождения',
                id: 1,
                count: birthday,
                denom: '/birthday'
            },
            {
                name: 'Разовый',
                id: 2,
                count: once,
                denom: '/once'
            },
            {
                name: 'Утерянный',
                id: 3,
                count: lost,
                denom: '/lost'
            },
            {
                name: 'Не был уже месяц',
                id: 4,
                count: month,
                denom: '/month'
            }
        ]
    };

    currentDateChange = (nextDate) => {
        this.setState({
            currentDate: nextDate,
        });

        this.props.onLoadCallsHistory(FORMAT_DATE(this.state.currentDate) + this.state.selected_group.denom);
    };

    newCalls = () => {
        this.props.router.push('/calls/');
    };

    callsHistory = () => {
        this.props.router.push('/calls/history');
        this.props.onLoadCallsHistory(FORMAT_DATE(this.state.currentDate) + this.state.selected_group.denom);
    };

    clientClick = (client_id) => {
        this.props.router.push('/clients/profile/' + client_id);
    }

}


Calls.propTypes = {
    calls: PropTypes.object.isRequired,
    statuses_list: PropTypes.array.isRequired,
    onLoadCallsList: PropTypes.func.isRequired,
    onLoadCallsHistory: PropTypes.func.isRequired,
    onCheckCall: PropTypes.func.isRequired,
    onAddComment: PropTypes.func.isRequired,
    onAddStatus: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired
};

export default Calls;