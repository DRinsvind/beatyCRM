import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PHOTO_EMPLOYEE_DEFAULT from '../../../public/assets/images/dummy/employee.jpg';
import {API_HOST, WORKING_TIME, CLASSES} from '../../constants';
import Popover from '../commons/Popover';
import SchedulesCurrentTimeLine from './SchedulesCurrentTimeLine';

const $ = window.jQuery;

const SECTIONS_ICONS = {
    HAIRDRESSER: 'hairdresser',
    MASSAGIST: 'massage',
    VISAGISTE: 'makeup',
    COSMETICIAN: 'cosmetology',
    MANICUE_PEDICURE: 'manicure',
};

const SECTIONS_DEFAULT = [
    {
        section_id: 1,
        section_denom: 'HAIRDRESSER',
        employees: []
    }, {
        section_id: 2,
        section_denom: 'MASSAGIST',
        employees: []
    }, {
        section_id: 3,
        section_denom: 'VISAGISTE',
        employees: []
    }, {
        section_id: 4,
        section_denom: 'COSMETICIAN',
        employees: []
    }, {
        section_id: 5,
        section_denom: 'MANICUE_PEDICURE',
        employees: []
    },
];

const TIME_MIN = WORKING_TIME.begin;
const TIME_MAX = WORKING_TIME.end;

class Schedules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentAppointment: {
                client: {
                    client_name: '',
                    photo: null
                },
                appointment_items: []
            },
            current_service_id: '',
            current_employee: '',
            sections: props.appointments,
            selected_section_id: props.selected_section_id,
            selected_service_info: props.selected_service_info,
            temp_appointment: props.temp_appointment,
            isOpen: false,
            showPopover: false,
            popover_position: {
                top: '',
                bottom: '',
                left: ''
            },
            activeServiceId: '',
            scrolled: props.scrolled,
        };

        this.bindEvents(this.props);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.bindEvents(nextProps);
        }

        if (nextProps.scrolled !== this.props.scrolled) {
            nextState.scrolled = nextProps.scrolled;
        }
    }

    render() {
        if (!Boolean(this.props.appointments.length)) {
            return null;
        }

        let bounds_inner = {
            height: '',
            width: '',
            top: '',
            left: ''
        };

        if ($('.inner-body')[0]) {
            bounds_inner = $('.inner-body')[0].getBoundingClientRect();
        }

        const bounds_window = $('body')[0].getBoundingClientRect();
        let employees_count = 0;

        this.props.appointments.forEach((section) => {
            employees_count += section.employees.length;
        });
        // const height = $('.scheduler')[0].parent().parent().getBoundingClientRect();

        return (
            <section className="scheduler">
                <div style={{overflowX: 'scroll', whiteSpace: 'nowrap'}}>
                    <div className="content">
                        <div className="columnTimeSpacing"></div>
                        {this.renderHeaders()}
                        <div className="columnTimeSpacing"></div>
                    </div>
                    <div className="content scroller" id="scrollSection">
                        {this.renderTime()}
                        {this.renderTables()}
                        {this.renderTime()}

                        <SchedulesCurrentTimeLine scrolled={this.state.scrolled}
                                                  onSwitchScrolled={this.props.onSwitchScrolled}/>
                    </div>
                    <div className={this.state.showPopover ? '' : 'hide'}
                         style={{
                             height: bounds_window.height,
                             width: bounds_window.width,
                             background: 'transparent',
                             position: 'fixed',
                             top: 0,
                             left: 0,
                             zIndex: '9999'
                         }}
                         onClick={this.onShowPopover}>
                    </div>
                    <div className={'popover popover-' + (this.state.arrow) + (this.state.showPopover ? '' : ' hide')}
                         style={this.state.popover_position}>
                        <Popover appointment={this.state.currentAppointment}
                                 service_id={this.state.current_service_id}
                                 current_employee={this.state.current_employee}
                                 current_section_name={this.state.current_section_name}
                                 onCalendarClick={this.onCalendarClick}
                                 onShowCheckClick={this.onShowCheckClick}
                                 router={this.props.router}/>
                    </div>
                </div>
            </section>
        );
    }

    componentDidUpdate() {
        if (this.props.selectedClient) {
            let founded_id;

            this.props.selectedClient.appointments.forEach((appointment) => {
                const selected_service = appointment.services.filter((service) => (service.selected_service))[0];
                if (selected_service) {
                    founded_id = '#' + appointment.appointment_id + '_' + selected_service.appointment_item_id;
                }
            });
            if (founded_id) {
                $('#scrollSection').stop().animate({
                    scrollTop: parseFloat($(founded_id).position().top) - ($('#scrollSection').height() / 2 - 60)
                }).off('scroll').on('scroll', () => {
                    this.props.onSwitchScrolled(false);
                });
                this.props.onSwitchScrolled(false);
            }

        }

        if (this.state.scrolled) {
            $('#scrollSection').stop().animate({
                scrollTop: parseFloat($('#currentTimeLine').css('top')) - ($('#scrollSection').height() / 2 - 150)
            });
        }
    }

    componentDidMount() {
        this.props.onSwitchScrolled(true);

        let employees_number = this.countTotalEmployees();

        let cont_width_without_mangin = $('section.scheduler').width() - ($('div.timeLine').width() * 2) - 75;

        let width_one_employee = parseInt(cont_width_without_mangin / employees_number);

        $('.scheduleTableCell').width(width_one_employee);
        $('table.serviceMasters td').width(width_one_employee);
        $('.scheduler .appointment').width(width_one_employee);

        // if ($('#currentTimeLine')[0] && !this.state.scrolled) {
        //     $('#scrollSection').stop().animate({
        //         scrollTop: parseFloat($('#currentTimeLine').css('top')) - ($('#scrollSection').height() / 2 - 150)
        //     })
        // }
    }

    // UTILS
    bindEvents = (props) => {
        this.state.events = {
            onAppointmentSelect: this.onAppointmentSelect,
            onSectionCellClick: props.onSectionCellClick
        };
    };

    // RENDERS
    renderTime = () => {
        const cells = this.renderCells([...new Array((TIME_MAX + 1) - TIME_MIN).keys()]
            .map(i => TIME_MIN + i));

        return (<div className="timeLine">{cells}</div>);
    };

    renderCells = (values, props) => {
        return values.map((hour) => {
            const time = (hour < 10 ? '0' + hour : hour);
            return (
                <div key={hour}>
                    <div {...props} className="timestamp">
                        <div className="hours">{time}</div>
                        <div className="minute">00</div>
                    </div>
                    <div {...props} className="timestamp timestamp_half">
                        <div className="hours">{time}</div>
                        <div className="minute">30</div>
                    </div>
                </div>
            );
        })
    };

    renderHeaders = () => {
        return this.props.appointments.map((section, idx) => {
            return (
                <SchedulesHeader
                    key={idx}
                    section={section}
                    addingService={this.props.addingService}
                    highlight={this.props.highlightSection === section.service_category_id}
                    router={this.props.router}
                    {...this.state.events}
                />
            );
        });
    };

    createSectionElements = () => {
        let colorIdx = 0;
        let data = [];
        this.props.appointments.map((section, idx) => {
            data.push({
                section: section.section_name,
                items: []
            });
            section.employees.map((empl) => {
                empl.appointments.map((app) => {
                    app.appointment_items.map((item) => {
                        let element = {
                            date: new Date(item.service_time),
                            client_id: app.client.client_id,
                            app_item: item
                        };

                        let found = false;

                        let color = null;

                        data.map((d, index) => {
                            d.items.map((it, itid) => {
                                if (element.client_id === it.client_id && element.date.getHours() === it.date.getHours()) {
                                    color = CLASSES[colorIdx++];

                                    data[index].items[itid] = {
                                        ...it,
                                        color: color
                                    };

                                    found = true;

                                    if (colorIdx >= CLASSES.length) {
                                        colorIdx = 0;
                                    }
                                }
                            })
                        });

                        if (!found) {
                            data[idx].items.push(element);
                        } else {
                            let newEl = {
                                ...element,
                                color: color
                            };

                            data[idx].items.push(newEl);
                        }

                    })
                })
            });
        });

        return data;
    };

    renderTables = () => {
        // this.createSectionElements();
        return this.props.appointments.map((section, idx) => {
            return (
                <SchedulesTable
                    key={idx}
                    scrolled={this.state.scrolled}
                    section={section}
                    sections={this.createSectionElements()}
                    selectedClient={this.props.selectedClient}
                    addingService={this.props.addingService}
                    highlight={this.props.highlightSection !== undefined ? this.props.highlightSection === section.service_category_id : true}
                    onTimeSelected={this.props.onServiceTimeSelected}
                    onSwitchScrolled={this.props.onSwitchScrolled}
                    onChangeAppointmentService={this.props.onChangeAppointmentService}
                    identifyTrainerId={this.identifyTrainerId}
                    {...this.state.events}
                />
            );
        });
    };

    countTotalEmployees = () => {
        let employees_number = 0;
        this.props.appointments.map((section, idx) => {
            employees_number = employees_number + section.employees.length;
        });
        return employees_number;
    };

    // EVENTS
    onAppointmentSelect = (rect, em, a, service_id, section_name, e) => {
        this.props.onSwitchScrolled(false);

        this.setState({
            activeServiceId: e.target.id
        });
        $(e.target).addClass('active_serv');

        if (a !== this.state.appointment) {

            const scrol_coord_bot = $('.scroller')[0].getBoundingClientRect().bottom;

            const diff_wind_scrol = $(window).height() - scrol_coord_bot;
            const diff_wind_apt = $(window).height() - rect.bottom;

            let top;
            let left;
            let arrow;

            if (scrol_coord_bot <= rect.bottom) {
                if (diff_wind_scrol <= 160) {
                    top = scrol_coord_bot - 190;
                    arrow = 'top';
                } else {
                    top = scrol_coord_bot - 16;
                    arrow = 'bottom';
                }
            } else if (diff_wind_apt <= 160) {
                top = rect.bottom - 180;
                arrow = 'top';
            } else {
                top = rect.bottom + 6;
                arrow = 'bottom';
            }

            if (rect.left > 1140) {
                left = rect.left - 450;
            } else {
                left = rect.left - 282;
            }


            this.setState({
                currentAppointment: a,
                current_service_id: service_id,
                current_employee: em.master_name,
                current_section_name: section_name,
                showPopover: !this.state.showPopover,
                popover_position: {
                    top: top,
                    left: left
                },
                arrow: arrow
            });
        }
    };

    onShowPopover = () => {
        $('#' + this.state.activeServiceId).removeClass('active_serv');
        this.setState({
            showPopover: !this.state.showPopover,
            activeServiceId: ''
        });
    };

    onCalendarClick = (appointment) => {
        this.setState({
            showPopover: false
        });

        // this.props.onSwitchScrolled(false);

        this.props.onClientSelected(appointment.client, false);
    };

    onShowCheckClick = (appointment) => {
        $('#' + this.state.activeServiceId).removeClass('active_serv');
        this.setState({
            showPopover: false,
            activeServiceId: ''
        });

        this.props.onClientDetailsShow(appointment.client.client_id, appointment.appointment_id);
    };

    identifyTrainerId = (x, section_id) => {
        return (this.props.appointments.filter((section) => (+section.service_category_id === +section_id))[0].employees[x].trainer_id)
    }
}

Schedules.propTypes = {
    date: PropTypes.instanceOf(Date),
    appointments: PropTypes.arrayOf(
        PropTypes.shape({
            section_id: PropTypes.number.isRequired,
            section_denom: PropTypes.oneOf(Object.keys(SECTIONS_ICONS)),
            employees: PropTypes.array.isRequired
        })
    ),
    client_id: PropTypes.number,
    highlightSection: PropTypes.number,
    // EVENTS
    onClientSelected: PropTypes.func.isRequired,
    onClientDetailsShow: PropTypes.func.isRequired,
    onServiceTimeSelected: PropTypes.func.isRequired
};

Schedules.defaultProps = {
    sections: SECTIONS_DEFAULT
};

/**
 *
 */
class SchedulesHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div
                className={"serviceColumn top" + (this.props.addingService && !this.props.highlight ? ' disabled' : '')}>
                <div className="serviceHeader">
                    <div className="serviceTitle">
                        <i className={"fa-2x fa-fw bs-" + SECTIONS_ICONS[this.props.section.section_denom]}/>
                    </div>
                </div>
                <table className="serviceMasters">
                    <tbody>
                    <tr>{this.renderEmployees()}</tr>
                    </tbody>
                </table>
            </div>
        );
    }

    // RENDERS
    renderEmployees = () => {
        return this.props.section.employees.map((emp, idx) => {
            const img = emp.photo ? (API_HOST + emp.photo) : PHOTO_EMPLOYEE_DEFAULT;
            return (
                <td key={"header_" + emp.master_id + "_" + idx}>
                    <a href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           this.props.router.push('/employees/profile/' + emp.master_id);
                       }}>
                        <div className="img-rounded schedules_employee_photo"
                             style={{backgroundImage: 'url(' + img + ')'}}
                             title={'Master: #' + emp.master_id + ' ' + emp.master_name}
                        />
                    </a>
                </td>
            );
        });
    };
}

SchedulesHeader.propTypes = {
    section: PropTypes.object.isRequired,
    addingService: PropTypes.object,
    highlight: PropTypes.bool
};

/**
 *
 */
class SchedulesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={"serviceColumn bottom" + (!this.props.highlight ? ' disabled' : '')}>
                <table className={'timeTable' + (this.props.highlight ? ' serviceTarget' : '')}>
                    <tbody id={this.props.section.service_category_id}>
                    {this.renderTimeRows()}
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {

        let rootView = $('#scrollSection');

        rootView.off('mousedown mousemove mouseup scroll')
            .on('mousedown', '.appointment.active.not_paid', (e) => {

                let target = $(e.target).parent().clone();

                rootView.data({
                    captured: true,
                    element: target,
                    element_origin: $(e.target).parent(),
                    moved: false
                });

                target.css('pointer-events', 'none');
            })

            .on('mousemove', (e) => {
                if (rootView.data('captured') && rootView.data('element')) {
                    let element = rootView.data('element');
                    let section, x, y = undefined;

                    $(rootView.data('element_origin')).css('display', 'none');
                    section = $(document.elementFromPoint(e.pageX, e.pageY)).parent().parent()[0];

                    if ($(document.elementFromPoint(e.pageX, e.pageY))[0].tagName === "TD" && section && ((+(section.id)) === +element[0].dataset.sectionId)) {
                        $(document.elementFromPoint(e.pageX, e.pageY)).append(element);

                        x = $(e.target).index();
                        y = $(e.target).parent().index();
                        rootView.data({
                            ...rootView.data(),
                            x: x,
                            y: y,
                            section: section
                        });
                    }

                    rootView.data({
                        ...rootView.data(),
                        moved: true
                    });
                }

            })
            .on('mouseup', (e) => {
                if (rootView.data('captured') && rootView.data('element')) {

                    let element = rootView.data('element');
                    element.css('pointer-events', 'auto');

                    if (rootView.data('moved')) {
                        const x = rootView.data('x');
                        const y = rootView.data('y');

                        const data = element.data();
                        const section = rootView.data('section');

                        element.remove();
                        $(rootView.data('element_origin')).css('display', 'block');

                        const changedService = {
                            trainer_id: this.props.identifyTrainerId(x, section.id),
                            time: {
                                hours: TIME_MIN + Math.floor(y / 6),
                                minutes: (y % 6) * 10
                            },
                            appointment_id: data.appId,
                            appointment_item_id: data.itemAppId
                        };
                        this.props.onChangeAppointmentService(changedService);
                    }

                    rootView.data({
                        captured: false,
                        element: undefined,
                        element_origin: undefined,
                        moved: false,
                        section: undefined,
                        x: undefined,
                        y: undefined
                    });

                }
            });
    }

    // RENDERS
    renderTimeRows = () => {
        const visibleHours = TIME_MAX - TIME_MIN;

        return [...new Array((visibleHours + 1) * 6)].map((i, rowIdx) => {
            let row = (rowIdx % 6);

            const cellHour = TIME_MIN + parseInt(rowIdx / 6, 10);
            const cellMinute = ((rowIdx % 6) / 6 * 60);

            return (
                <tr key={'row_' + rowIdx}>
                    {
                        this.props.section.employees.map((employee, colIdx) => {
                            let event = null;
                            let style = {
                                //backgroundColor: (this.props.highlight ? '#EEFFEE' : '#FFFFFF')
                            };

                            employee.appointments.forEach((appointment) => {
                                appointment.appointment_items.forEach((item) => {
                                    const serviceTime = new Date(item.service_time);

                                    const minute = parseInt(serviceTime.getMinutes() / 60 * 6, 10);

                                    if (serviceTime.getHours() === cellHour && row === minute) {
                                        const dur = item.service.duration / 60 * 6 * 12;

                                        let className = 'appointment';

                                        if (appointment.state.state_denom === 'PAID') {
                                            className += ' paid';
                                        }

                                        if (this.props.selectedClient && this.props.selectedClient.client_id === appointment.client.client_id) {
                                            event = null;
                                        } else {

                                            let style = '';

                                            this.props.sections.map((section) => {
                                                section.items.map((it) => {
                                                    if (it.app_item.item_id === item.item_id) {
                                                        style = it.color ? it.color : '';
                                                    }
                                                });
                                            });

                                            event = (
                                                <div style={{
                                                    position: 'relative',
                                                    pointerEvents: 'auto'
                                                }}>
                                                    <div
                                                        className={className + ' ' + style}
                                                        style={{
                                                            height: dur - 1,
                                                        }}
                                                        data-toggle="popover"
                                                        id={'appointment_' + appointment.appointment_id + 'service_' + item.service.service_id + 'time_' + new Date(item.service_time).getTime()}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const rect = e.target.getBoundingClientRect();
                                                            this.props.onAppointmentSelect(rect, employee, appointment,
                                                                item.service.service_id, this.props.section.section_name, e);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }
                                    }
                                })
                            });

                            if (this.props.selectedClient) {
                                this.props.selectedClient.appointments.forEach((appointment) => {
                                    appointment.services.forEach((service) => {
                                        const serviceTime = new Date(service.service_time);
                                        const minute = parseInt(serviceTime.getMinutes() / 60 * 6, 10);

                                        if (this.props.section.service_category_id === service.category_id
                                            && employee.trainer_id === service.trainer_id
                                            && serviceTime.getHours() === cellHour
                                            && row === minute) {
                                            const dur = service.service_duration / 60 * 6 * 12;
                                            event = (
                                                <div
                                                    id={appointment.appointment_id + '_' + service.appointment_item_id}
                                                    data-section-id={this.props.section.service_category_id}
                                                    data-app-id={appointment.appointment_id}
                                                    data-item-app-id={service.appointment_item_id}
                                                    style={{
                                                        position: 'relative',
                                                        pointerEvents: 'auto'
                                                    }}>
                                                    <div
                                                        className={'appointment active' + ((appointment.appointment_state.state_denom === 'PAID') ? ' paid' : ' not_paid')}
                                                        id={'appointment_' + appointment.appointment_id + 'service_' + service.service_id + 'time_' + new Date(service.service_time).getTime()}
                                                        style={{height: dur - 1}}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const rect = e.target.getBoundingClientRect();
                                                            appointment = {
                                                                ...appointment,
                                                                client: this.props.selectedClient
                                                            };

                                                            this.props.onAppointmentSelect(rect, employee, appointment, service.service_id, this.props.section.section_name, e);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }
                                    })
                                })
                            }

                            const sectionId = this.props.section.section_id;
                            return (
                                <td key={'section_cell_' + sectionId + '_' + rowIdx + 'x' + colIdx}
                                    className={'scheduleTableCell'}
                                    style={style}
                                >{event}</td>
                            )
                        })
                    }
                </tr>
            )
        })
    };
}

SchedulesTable.propTypes = {
    section: PropTypes.object.isRequired,
    addingService: PropTypes.object,
    highlight: PropTypes.bool,
    onAppointmentSelect: PropTypes.func.isRequired,
    onTimeSelected: PropTypes.func,
    onSwitchScrolled: PropTypes.func.isRequired,
    onChangeAppointmentService: PropTypes.func.isRequired
};

export default Schedules;