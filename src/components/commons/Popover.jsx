import React, {Component} from 'react';
import photo_client_default from '../../../public/assets/images/dummy/client.jpg';
import {API_HOST} from '../../constants';

const PHONE_REGEX = /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/;

/**
 * Modal component.
 */
class Popover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointment: props.appointment,
            current_employee: props.current_employee,
            service_id: props.service_id,
            time_beg: '',
            time_end: '',
            service: '',
            // current_appointment: this.mapToDataApp(props.appointment, props.service_id)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.appointment !== nextProps.appointment) {
            nextState.appointment = nextProps.appointment;
            nextState.service_id = nextProps.service_id;
            nextState.time_beg = this.mapToDataTimeBeg(nextProps.appointment, nextProps.service_id);
            nextState.time_end = this.mapToDataTimeEnd(nextProps.appointment, nextProps.service_id);
            nextState.service = this.mapToDataApp(nextProps.appointment, nextProps.service_id);
            nextState.current_employee = nextProps.current_employee;
            // nextState.current_appointment = this.mapToDataApp(nextProps.appointment, nextProps.service_id);
        }
    }

    render() {
        let phone;

        let segs = PHONE_REGEX.exec(this.state.appointment.client.phone);
        if (segs !== null) {
            phone = ('+' + segs[1] + ' (' + segs[2] + ') ' + segs[3] + '-' + segs[4] + '-' + segs[5]);
        } else {
            phone = this.state.appointment.client.phone;
        }

        return (
            <div className="row">
                <div className="col-md-2 p-none pl-md text-center">
                    <div className="img-rounded employee-image" style={{width: '100px', height: 'auto'}}>
                        <img className="img-responsive"
                             src={this.props.appointment.client.photo ? API_HOST + this.props.appointment.client.photo : photo_client_default}
                             alt="Фото клиента"/>
                    </div>
                    <div>
                        <span style={{fontWeight: '300', color: '#21262d', fontSize: '0.9em'}}
                              className={"label label-client-" + this.state.appointment.client.category_id}>
                            {this.state.appointment.client.category_name}
                        </span>
                    </div>
                    <div className="mt-xs">
                        <a href="#"
                           className="no-text-decor"
                           onClick={(e) => {
                               e.preventDefault();
                               this.props.router.push('/clients/profile/' + this.state.appointment.client.client_id);
                           }}>
                            <span style={{fontWeight: '300', fontSize: '0.9em'}}
                                  className="label label-client-1">
                            Профайл
                        </span>
                        </a>
                    </div>

                </div>
                <div className="col-md-4 pl-sm pr-sm" style={{fontWeight: '700', color: '#555'}}>
                    <p style={{fontSize: '1.2em'}}>
                        {this.state.appointment.client.last_name} {this.state.appointment.client.first_name} {this.state.appointment.client.second_name}
                    </p>
                    <p style={{fontWeight: '300', fontSize: '1em'}}>
                        <i className="fa fa-fw fa-phone"></i>
                        <span style={{color: '#0088cc'}}>
                            {phone}
                        </span>
                    </p>
                </div>
                <div className="col-md-6 p-none">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-daterange input-group"
                                 style={{marginBottom: '5px', width: 'auto', color: '#555'}}>
                                {/*<input type="text" className="form-control p-none" name="start" style={{width: '60px', background: 'white', fontSize: '1.3em', fontWeight: '300'}} disabled="disabled"*/}
                                {/*value={this.state.time_beg}/>*/}
                                {/*<span className="input-group-addon" style={{width: '5px'}}>-</span>*/}
                                {/*<input type="text" className="form-control p-xs" name="end" style={{width: '60px', background: 'white', fontSize: '1.3em', fontWeight: '300'}} disabled="disabled"*/}
                                {/*value={this.state.time_end}/>*/}

                                <span className="p-xs" style={{
                                    width: '60px',
                                    background: 'white',
                                    fontSize: '1.8em',
                                    fontWeight: '300'
                                }}>
                                    {this.state.time_beg}
                                    </span>
                                <span className="" style={{width: '5px', fontSize: '1.8em'}}>-</span>
                                <span className="p-xs" style={{
                                    width: '60px',
                                    background: 'white',
                                    fontSize: '1.8em',
                                    fontWeight: '300'
                                }}>
                                    {this.state.time_end}
                                </span>

                            </div>
                        </div>

                        <div className="col-md-6">
                            <a className="btn btn-primary" style={{display: 'inline-block'}} href="#"
                               onClick={this.onCalendarClick} title="Информация о визите">
                                <i className="fa fa-fw fa-calendar" title="Информация о визите"></i>
                            </a>
                            <a className="btn btn-primary" href="#" onClick={this.onShowCheckClick}
                               title="Перейти к оплате">
                                <i className="fa fa-fw fa-window-maximize" title="Перейти к оплате"></i>
                            </a>
                        </div>

                    </div>
                    <div className="row ml-sm mt-sm">
                        <div className="p-xs mb-sm"
                             style={{backgroundColor: '#c0c0c0', color: 'white', width: '250px', fontSize: '0.9em'}}>
                            <span style={{paddingLeft: 10}}>
                                {this.props.current_section_name}
                            </span>
                            <span className="pull-right" style={{paddingRight: 5}}>
                                {this.props.current_employee}
                            </span>
                        </div>
                        <div>
                            &bull; {this.state.service}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    mapToDataTimeBeg = (appoint, service_id) => {
        let time_beg_result = '';
        if (appoint.appointment_items) {
            appoint.appointment_items.map((item) => {
                if (item.service.service_id === service_id) {
                    const time_beg = new Date(item.service_time);
                    let hour = time_beg.getHours();
                    if (hour < 10) hour = '0' + hour;
                    let min = time_beg.getMinutes();
                    if (min < 10) min = '0' + min;

                    time_beg_result = hour + ':' + min;
                }

            });
        } else {
            appoint.services.map((service) => {
                if (service.service_id === service_id) {
                    const time_beg = new Date(service.service_time);
                    let hour = time_beg.getHours();
                    if (hour < 10) hour = '0' + hour;
                    let min = time_beg.getMinutes();
                    if (min < 10) min = '0' + min;

                    time_beg_result = hour + ':' + min;
                }

            });
        }

        return time_beg_result;
    };

    mapToDataTimeEnd = (appoint, service_id) => {
        let time_end_result = '';
        if (appoint.appointment_items) {
            appoint.appointment_items.map((item) => {
                if (item.service.service_id === service_id) {
                    const time_beg = new Date(item.service_time);
                    let hour = time_beg.getHours();
                    let min = time_beg.getMinutes();


                    const dur_hour = item.service.duration / 60 - ((item.service.duration / 60) % 1);
                    const dur_min = item.service.duration - dur_hour * 60;
                    //
                    let time_end_hour = hour + dur_hour;
                    let time_end_min = min + dur_min;
                    //
                    if (time_end_min >= 60) {
                        const t_t = time_end_min / 60 - ((time_end_min / 60) % 1);
                        time_end_hour = time_end_hour + t_t;
                        time_end_min = time_end_min - t_t * 60;
                    }
                    if (time_end_hour < 10) time_end_hour = '0' + time_end_hour;
                    if (time_end_min < 10) time_end_min = '0' + time_end_min;
                    time_end_result = time_end_hour + ':' + time_end_min;
                }
            });
        } else {
            appoint.services.map((service) => {
                if (service.service_id === service_id) {
                    const time_beg = new Date(service.service_time);
                    let hour = time_beg.getHours();
                    let min = time_beg.getMinutes();


                    const dur_hour = service.service_duration / 60 - ((service.service_duration / 60) % 1);
                    const dur_min = service.service_duration - dur_hour * 60;
                    //
                    let time_end_hour = hour + dur_hour;
                    let time_end_min = min + dur_min;
                    //
                    if (time_end_min >= 60) {
                        const t_t = time_end_min / 60 - ((time_end_min / 60) % 1);
                        time_end_hour = time_end_hour + t_t;
                        time_end_min = time_end_min - t_t * 60;
                    }
                    if (time_end_hour < 10) time_end_hour = '0' + time_end_hour;
                    if (time_end_min < 10) time_end_min = '0' + time_end_min;
                    time_end_result = time_end_hour + ':' + time_end_min;
                }
            });
        }

        return time_end_result;
    };

    mapToDataApp = (appoint, service_id) => {
        let service = '';
        if (appoint.appointment_items) {
            appoint.appointment_items.map((item) => {
                if (item.service.service_id === service_id) {
                    service = item.service.service_name;
                }
            });
        } else {
            appoint.services.map((item) => {
                if (item.service_id === service_id) {
                    service = item.service_name;
                }
            });
        }

        return service;


        // let arr = appoint.appointment_items.filter((item) => {
        //     if (item.service.service_id === service_id) {
        //         return item;
        //     }
        // });
        //
    };

    onCalendarClick = (e) => {
        e.preventDefault();
        this.props.onCalendarClick(this.state.appointment);
    };

    onShowCheckClick = (e) => {
        e.preventDefault();
        this.props.onShowCheckClick(this.state.appointment);
    }

}

export default Popover;
