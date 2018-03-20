import React, {Component} from 'react';
import Masonry from 'react-masonry-component';
import Select2 from 'react-select2-wrapper';
import PropTypes from 'prop-types';
import photo_client_default from '../../../public/assets/images/dummy/client.jpg';

const $ = window.$;

import {
    FORMAT_PHONE_NUMBER,
    FORMAT_DATE_WITHOUT_TIME,
    FORMAT_DATE_WITH_POINTS
} from '../../utils';


class CallsNew extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_group: {
                name: '',
                id: 0
            },
            calls: this.mapToDataCalls(props.calls)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.calls !== this.props.calls) {
            nextState.calls = this.mapToDataCalls(nextProps.calls);
        }
    }

    render() {
        return (
            <div id="new_calls" className="tab-pane active pl-lg pr-lg">
                <div className="row mt-lg">
                    <Masonry>
                        {this.state.calls}
                    </Masonry>
                </div>
            </div>
        );
    }


    mapToDataCalls = (calls) => {
        return calls.map((call, idx) => {
            return (
                <Call
                    idx={call.call_id}
                    key={idx}
                    call={call}
                    statuses_list={this.props.statuses_list}
                    onAddComment={this.props.onAddComment}
                    onCheckCall={this.props.onCheckCall}
                    onAddStatus={this.props.onAddStatus}
                    onNotifyShow={this.props.onNotifyShow}/>
            )
        })
    };
}


class Call extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addComment: false,
            comment: props.call.comment,
            status: (props.call.status === null) ? {tag_id: '', tag_name: ''} : props.call.status,
            statuses_list: this.mapToDataStatuses(props.statuses_list, props.call.status),
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.call) {
            nextState.statuses_list = this.mapToDataStatuses(nextProps.statuses_list);
            nextState.status = (nextProps.call.status === null) ? {tag_id: '', tag_name: ''} : nextProps.call.status;
        }
    }

    render() {
        let last_call_status = '';
        if (this.props.call.client.last_call_status !== null) {
            last_call_status = this.props.call.client.last_call_status;
        }
        return (
            <div className="col-lg-6 col-md-12 mb-lg mt-lg" key={this.props.idx}>
                <section className={'panel panel' + (this.props.call.state ? "-custom" : "-primary")}
                         style={{width: '100%'}}>
                    <header className="panel-heading">
                        <div className="row">
                            <div className="col-md-10 col-xs-10">
                                <h2 className="panel-title">{this.props.call.client.name}</h2>
                            </div>
                            <div className="col-md-2 col-xs-2">
                                <div className="panel-actions" style={{right: '0px', top: '0px'}}>
                                    <div className="checkbox-custom checkbox-primary">
                                        <input type="checkbox"
                                               checked={this.props.call.state}
                                               name="is_called"
                                               onChange={() => {
                                                   if (this.state.status.tag_id !== '') {
                                                       let res = this.state.status.tag_id;
                                                       this.props.onCheckCall(this.props.call.call_id, {status: res});
                                                   } else {
                                                       const error = {
                                                           title: 'Предупреждение',
                                                           text: 'Сначала выберите статус звонка',
                                                           type: 'warning'
                                                       };

                                                       this.props.onNotifyShow(error);
                                                   }

                                               }}/>
                                        <label htmlFor="#"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="panel-body" style={{backgroundColor: '#F4F5F8', border: '2px solid #ECEDF0'}}>
                        <div className="row">
                            <div className="col-md-3 col-xs-3 text-center">
                                <div className="img-rounded employee-image" style={{width: '120px', height: 'auto'}}>
                                    <img className="img-responsive"
                                         src={this.props.call.client.photo ? this.props.call.client.photo : photo_client_default}
                                         alt="Фото клиента"/>
                                </div>
                                <div>
                                    {this.props.call.client.category ? this.renderCategory(this.props.call.client.category) : ''}
                                </div>
                                <div className="mt-sm">
                                    <a href={"/clients/profile/" + this.props.call.client.client_id}
                                       className="no-text-decor">
                                                        <span style={{
                                                            fontWeight: '300',
                                                            color: '#21262d',
                                                            fontSize: '1em',
                                                            width: '100%'
                                                        }} className="label label-client-1">
                                                            Профайл
                                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-9 col-xs-9">
                                <div className="row">
                                    <div className="col-md-1 col-sm-1">
                                        <i className="fa fa-fw fa-phone fa-lg" style={{color: '#ccc'}}/>
                                    </div>
                                    <div className="col-md-9 col-sm-9">
                                            <span
                                                style={{
                                                    fontWeight: 900,
                                                    fontSize: '1.5em'
                                                }}>{FORMAT_PHONE_NUMBER(this.props.call.client.phone)}</span>
                                    </div>
                                    <div className="col-md-2 col-sm-2">
                                        {/*<a href="#">*/}
                                        {/*<i className="fa fa-fw fa-calendar fa-lg"*/}
                                        {/*style={{color: '#ccc'}}/>*/}
                                        {/*</a>*/}
                                    </div>
                                </div>

                                <div className="row mt-sm">
                                    <div className="col-md-1 col-sm-1">
                                        <i className="fa fa-fw fa-birthday-cake fa-lg"
                                           style={{color: '#ccc'}}/>
                                    </div>
                                    <div className="col-md-9 col-sm-9">
                                            <span
                                                style={{fontSize: '1.2em'}}>{FORMAT_DATE_WITHOUT_TIME(this.props.call.client.date_birth)}</span>
                                    </div>
                                </div>

                                <div className="row mt-sm">
                                    <div className="col-md-1 col-sm-12">
                                        <i className="fa fa-fw fa-volume-control-phone fa-lg"
                                           style={{color: '#ccc'}}/>
                                    </div>
                                    <div className="col-md-10 col-sm-12" style={{fontSize: '1.1em'}}>
                                        <div>Последний
                                            прозвон {FORMAT_DATE_WITH_POINTS(this.props.call.client.last_call)}</div>
                                    </div>
                                </div>


                                <div className="row mt-sm">
                                    <div className="col-md-1 col-sm-12">
                                        <i className="fa fa-fw fa-area-chart fa-lg"
                                           style={{color: '#ccc'}}/>
                                    </div>
                                    <div className="col-md-10 col-sm-12" style={{fontSize: '1.1em'}}>
                                        <div>Последнее
                                            посещение {FORMAT_DATE_WITH_POINTS(this.props.call.client.last_appointment.appointment_date)}</div>
                                        {this.mapToDataLastAppointmentServices(this.props.call.client.last_appointment.services)}
                                        {this.mapToDataLastAppointmentProducts(this.props.call.client.last_appointment.products)}
                                    </div>
                                </div>
                                <div className={last_call_status !== '' ? "row mt-sm" : "hide"}>
                                    <div className="col-md-12 col-md-offset-1">
                                        <span
                                            className={last_call_status !== '' ? "label label_status_" + last_call_status.tag_id : ''}>
                                        {last_call_status !== '' ? last_call_status.tag_name : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-md">
                            <div className="col-md-12 col-sm-12">
                                <div className='input-group'>
															<span className="input-group-addon">
																<i className="fa fa-fw fa-tag"/>
															</span>


                                    <Select2 className="form-control straight-left-corners"
                                             id="call_status_select"
                                             options={{
                                                 placeholder: 'Выберите статус',
                                                 theme: 'bootstrap'
                                             }}
                                             data={this.state.statuses_list}
                                             value={this.state.status.tag_id}
                                             onSelect={(e) => {
                                                 e.preventDefault();
                                                 this.props.onAddStatus({tag_id: e.params.data.id, tag_name: e.params.data.text}, this.props.call.call_id);
                                                 }}
                                             disabled={this.props.call.state}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>)
    }

    renderCategory = (category) => {
        return (
            <span style={{
                fontWeight: '300',
                color: '#21262d',
                fontSize: '1em',
                width: '100%'
            }}
                  className={"label label-client-" + category.category_id}>
                                                            {category.category_name}
                                                        </span>
        )
    };

    mapToDataLastAppointmentServices = (services) => {
        return services.map((service, idx) => {
            return (
                <div key={idx}>{service.service_name} - <i
                    className="fa fa-fw fa-user-circle-o"/>
                    <a
                        href={"/employees/profile/" + service.master_id}
                        style={{color: "#0088cc"}}>{service.trainer_name}</a>
                </div>
            )
        })
    };

    mapToDataLastAppointmentProducts = (products) => {
        return products.map((product, idx) => {
            return (
                <div key={idx}>{product.product_name} - <i
                    className="fa fa-fw fa-user-circle-o"/>
                    <a
                        href={"/employees/profile/" + product.master_id}
                        style={{color: "#0088cc"}}>{product.trainer_name}
                    </a>
                </div>
            )
        })
    };

    mapToDataStatuses = (statuses) => {
        let result = statuses.map((stat) => {
            return {
                text: stat.tag_name,
                id: stat.tag_id,
            }
        });

        return result;
    };
}

export default CallsNew;