import React, {Component} from 'react';
import PropTypes from 'prop-types';
import picture from '../../../public/assets/images/dummy/client.jpg';
import DataTable from '../commons/tables/DataTable';
import {API_HOST} from '../../constants';

import {
    DEFINE_DOUBLE_NUMBER
} from '../../utils/index';

let NEW_WIN;

const APPOINTMENT_STATE_NEW = 'NEW';
const APPOINTMENT_STATE_CONFIRMED = 'CONFIRMED';
const PHONE_REGEX = /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/;

const $ = window.jQuery;

class AppointmentsDetailsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.data !== this.props.data) {
            nextState.appointments = nextProps.data.appointments;
            nextState.paid_appointment = nextProps.data.appointments.filter((appointment) => (appointment.appointment_state.state_denom === 'PAID'));
            nextState.not_paid_appointment = nextProps.data.appointments.filter((appointment) => (appointment.appointment_state.state_denom !== 'PAID'))
        }


        if (nextProps.html_for_check) {
            setTimeout(()=>{
                NEW_WIN.document.write(nextProps.html_for_check);
                NEW_WIN.print();
            }, 100);
            this.props.onClearHTMLForCheck();
        }
    }

    render() {
        if (this.props.data === undefined || this.props.data.appointments.length === 0) {
            return null;
        }

        let phone;

        let segs = PHONE_REGEX.exec(this.props.data.phone);
        if (segs !== null) {
            phone = ('+' + segs[1] + ' (' + segs[2] + ') ' + segs[3] + '-' + segs[4] + '-' + segs[5]);
        } else {
            phone = this.props.data.phone;
        }


        let tablePaidServices;
        let tablePaidGoods;
        let tableNotPaidServices;
        let tableNotPaidGoods;
        let not_paid_appointment_cost = 0;

        let cost = 0;
        const paid = true;
        let to_pay = 0;


        if (this.state.paid_appointment.length > 0) {
            tablePaidServices = this.mapToDataServices(this.state.paid_appointment, paid);
            tablePaidGoods = this.mapToDataGoods(this.state.paid_appointment, paid);
            this.state.paid_appointment.forEach((appointment) => {
                cost = cost + appointment.appointment_total_cost;
            });
        }

        if (this.state.not_paid_appointment.length > 0) {
            tableNotPaidServices = this.mapToDataServices(this.state.not_paid_appointment, !paid);
            tableNotPaidGoods = this.mapToDataGoods(this.state.not_paid_appointment, !paid);
            this.state.not_paid_appointment[0].services.map((service) => {
                if (service.checked !== false) {
                    not_paid_appointment_cost += +service.position_total_cost;
                }
            });
            this.state.not_paid_appointment[0].products.map((product) => {
                if (product.checked !== false) {
                    not_paid_appointment_cost += product.position_total_cost * product.product_cnt;
                }
            });

            to_pay =
                this.state.not_paid_appointment[0].services.filter((service) => (service.checked !== false)).length
                +
                this.state.not_paid_appointment[0].products.filter((product) => (product.checked !== false)).length;
        }

        return (
            <section>
                <div className="row">
                    <div className="col-md-3">
                        <div className="img-rounded employee-image" style={{width: '100%'}}>
                            <img className="img-responsive"
                                 src={this.props.data.photo ? API_HOST + this.props.data.photo : picture}
                                 alt="Фото клиента"/>
                        </div>
                        <h4 style={{
                            color: '#21262d',
                            lineHeight: '25px',
                            fontWeight: '600'
                        }}>
                            {this.props.data.last_name} {this.props.data.first_name} {this.props.data.second_name}
                        </h4>

                        <span style={{fontSize: '1em', fontWeight: '300', color: '#21262d'}}
                              className={"label mr-xs label-client-" + this.props.data.category_id }>
                            {this.props.data.category_name}
                        </span>
                        <hr className="dotted short"/>

                        <div className="row mb-sm">
                            <div className="col-md-1 pr-sm">
                                <i className="fa fa-fw fa-phone"/>
                            </div>
                            <div className="col-md-10 pl-sm">
                                <span style={{color: "#0088cc"}}>{phone}</span>
                            </div>
                        </div>

                        <hr className="dotted short"/>
                        <p>{this.props.data.note}</p>
                    </div>
                    <div className="col-md-9">
                        <h3 className="mt-none" style={{display: 'block', color: '#777', fontWeight: '400'}}>
                            Визит {this.getHeaderDate()}</h3>

                        {this.mapToDataPaidServicesTable(tablePaidServices)}
                        {this.mapToDataPaidGoodsTable(tablePaidGoods)}
                        {this.mapToDataCost(cost, 'Итого')}
                        <hr className={(not_paid_appointment_cost > 0) && (cost > 0) ? '' : 'hide'}/>
                        {this.mapToDataNotPaidServicesTable(tableNotPaidServices)}
                        {this.mapToDataNotPaidGoodsTable(tableNotPaidGoods)}
                        {this.mapToDataCost(not_paid_appointment_cost, 'Итого к оплате')}


                        {/*<a type="button"*/}
                        {/*className={'btn btn-default pull-right mt-md' + ((appointment.appointment_state.state_denom === APPOINTMENT_STATE_NEW) ? '' : ' hide')}*/}
                        {/*onClick={this.onCancel}>*/}
                        {/*<i className="fa fa-fw fa-times"></i>*/}
                        {/*Отменить визит*/}
                        {/*</a>*/}

                        {/*<a type="button"*/}
                        {/*className={'btn btn-primary pull-right mt-md mr-sm' + ((appointment.appointment_state.state_denom === APPOINTMENT_STATE_NEW) ? '' : ' hide')}*/}
                        {/*onClick={this.onConfirm}>*/}
                        {/*<i className="fa fa-fw fa-check"></i>*/}
                        {/*Подтвердить визит*/}
                        {/*</a>*/}

                    </div>
                </div>
                <div className="modal-footer row pb-none">
                    <div className="text-right">
                        <a type="button"
                           className="btn btn-default pull-right"
                           href="#"
                           data-dismiss="modal"
                           onClick={this.onClose}>
                            <i className="fa fa-fw fa-times"/>&nbsp;Отмена
                        </a>
                        <a type="button"
                           className={to_pay > 0 ? "btn btn-default pull-right mr-sm" : "hidden"}
                           href="#"
                           onClick={this.onPrint}>
                            <i className="fa fa-fw fa-print"/>&nbsp;Печать
                        </a>
                        <a type="button"
                           href="#"
                           className={to_pay > 0 ? "btn btn-primary pull-right mr-sm" : "hidden"}
                           onClick={(e) => {
                               e.preventDefault();
                               this.onSave(1);
                           }}>
                            <i className="fa fa-fw fa-money"/>
                            {' Оплата наличными'}
                        </a>
                        <a type="button"
                           href="#"
                           className={to_pay > 0 ? "btn btn-primary pull-right mr-sm" : "hidden"}
                           onClick={(e) => {
                               e.preventDefault();
                               this.onSave(2);
                           }}>
                            <i className="fa fa-fw fa-download"/>
                            {' Оплата через терминал'}
                        </a>
                    </div>
                </div>
            </section>
        )
    }

    componentDidMount() {
        $(".input-search").hide();
    }

    getHeaderDate = () => {
        return new Date(this.props.data.appointments[0].appointment_date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    mapToDataServices = (appointments, paid) => {
        let headers = [
            {text: 'Услуга'},
            {text: 'Время'},
            {text: 'Цена, грн.'},
            {text: 'Сумма, грн.'}
        ];
        let cellRender = undefined;

        let data = appointments.map((appointment) => {
            return appointment.services.map((service) => {
                return {
                    values: [
                        service.service_name,
                        service.service_duration + ' минут',
                        service.position_total_cost,
                        service.position_total_cost
                    ]
                };
            })
        });

        if (!paid) {
            data = appointments.map((appointment) => {
                return appointment.services.map((service) => {
                    return {
                        values: [
                            (service.checked === undefined ? true : service.checked),
                            service.service_name,
                            service.service_duration + ' минут',
                            service.position_total_cost,
                            +service.position_total_cost
                        ]
                    };
                })
            });

            headers = [].concat([''], ...headers);
            cellRender = this.cellRender;
        }

        return {
            headers: [].concat([], ...headers),
            data: [].concat([], ...data),
            cellRender: cellRender
        }
    };

    mapToDataGoods = (appointments, paid) => {
        let data = appointments.map((appointment) => {
            return appointment.products.map((product) => {
                return {
                    values: [
                        product.product_name,
                        product.product_cnt + ' шт.',
                        product.position_total_cost,
                        product.position_total_cost * product.product_cnt
                    ]
                };
            })
        });
        let headers = [
            {text: 'Товар', style: {textAlign: 'text-center'}},
            {text: 'Количество'},
            {text: 'Цена, грн.'},
            {text: 'Сумма, грн.'}
        ];
        let cellRender = undefined;

        if (!paid) {
            data = appointments.map((appointment) => {
                return appointment.products.map((product) => {
                    return {
                        values: [
                            (product.checked === undefined ? true : product.checked),
                            product.product_name,
                            product.product_cnt + ' шт.',
                            product.position_total_cost,
                            product.position_total_cost * product.product_cnt
                        ]
                    };
                })
            });
            headers = [].concat([''], ...headers);
            cellRender = this.cellRender;
        }
        return {
            headers: [].concat([], ...headers),
            data: [].concat([], ...data),
            cellRender: cellRender
        };
    };

    cellRender = (row_index, cell_index, value, details, changeCallback) => {
        switch (cell_index) {
            case 0:
                return (
                    <div className="checkbox-custom checkbox-primary center-block">
                        <input
                            id={row_index + cell_index}
                            type="checkbox"
                            checked={value}

                            onChange={(e) => {
                                changeCallback(row_index, cell_index, e.target.checked);
                            }}
                        />
                        <label/>
                    </div>
                );
            case 3:
                return (
                    <div className="center-block">
                        <input
                            id={row_index + cell_index}
                            className="form-control text-right"
                            type="text"
                            value={value}
                            style={{width: '80%'}}
                            onChange={(e) => {
                                changeCallback(row_index, cell_index, e.target.value);
                            }}
                        />
                        <label/>
                    </div>
                );
            default:
                return (
                    <div className="text-center">
                        {value}
                    </div>
                );
        }
    };

    mapToDataPaidServicesTable = (tablePaidServices) => {
        if (tablePaidServices && tablePaidServices.data && tablePaidServices.data.length > 0) {
            return (
                <div className={tablePaidServices.data && tablePaidServices.data.length > 0 ? 'mb-md' : 'hide'}>
                    <h4 className="mt-md mb-none" style={{color: '#33353F'}}>Оплаченные услуги</h4>
                    <DataTable {...tablePaidServices} />
                </div>
            )
        } else {
            return <div></div>
        }
    };

    mapToDataPaidGoodsTable = (tablePaidGoods) => {
        if (tablePaidGoods && tablePaidGoods.data && tablePaidGoods.data.length > 0) {
            return (
                <div className={tablePaidGoods.data && tablePaidGoods.data.length > 0 ? 'mb-md' : 'hide'}>
                    <h4 className="mt-md mb-none" style={{color: '#33353F'}}>Оплаченные товары</h4>
                    <DataTable {...tablePaidGoods} />
                </div>
            )
        } else {
            return <div></div>
        }

    };

    mapToDataNotPaidServicesTable = (tableNotPaidServices) => {
        if (tableNotPaidServices && tableNotPaidServices.data && tableNotPaidServices.data.length > 0) {
            return (
                <div>
                    <h4 className="mt-md mb-none" style={{color: '#33353F'}}>Неоплаченные услуги</h4>
                    <DataTable
                        {...tableNotPaidServices}
                        onCellValueChanged={(row_index, cell_index, value) => {
                            let item = this.state;

                            switch (cell_index) {
                                case 0:
                                    item.not_paid_appointment[0].services[row_index].checked = value;
                                    break;
                                case 3:
                                    item.not_paid_appointment[0].services[row_index].position_total_cost = DEFINE_DOUBLE_NUMBER(item.not_paid_appointment[0].services[row_index].position_total_cost, value);
                                    break;
                                default:
                                    break;
                            }
                            this.setState({
                                item: item
                            });
                        }}
                    />
                </div>
            )
        } else {
            return <div></div>
        }
    };

    mapToDataNotPaidGoodsTable = (tableNotPaidGoods) => {
        if (tableNotPaidGoods && tableNotPaidGoods.data && tableNotPaidGoods.data.length > 0) {
            return (
                <div>
                    <h4 className="mt-md mb-none" style={{color: '#33353F'}}>Неоплаченные товары</h4>
                    <DataTable {...tableNotPaidGoods}
                               onCellValueChanged={(row_index, cell_index, value) => {
                                   let item = this.state;

                                   switch (cell_index) {
                                       case 0:
                                           item.not_paid_appointment[0].products[row_index].checked = value;
                                           break;
                                       case 3:
                                           item.not_paid_appointment[0].products[row_index].position_total_cost = DEFINE_DOUBLE_NUMBER(item.not_paid_appointment[0].products[row_index].position_total_cost, value);
                                           break;
                                       default:
                                           break;
                                   }
                                   this.setState({
                                       item: item
                                   });
                               }}/>
                </div>
            )
        } else {
            return <div></div>
        }
    };

    mapToDataCost = (cost, text) => {
        return (
            <div className={cost > 0 ? 'mt-md' : 'hidden'}
                 style={{fontSize: '1.5em', marginRight: '50px'}}>
                {text} <span style={{color: '#21262d', fontWeight: '700'}}>{cost} грн.</span>
            </div>
        )
    };


    onConfirm = () => {
        this.props.onConfirmCheck(this.props.appointmentId);
    };

    onSave = (paid_form) => {
        const not_paid = this.state.not_paid_appointment[0];
        const services = not_paid.services.filter((service) => (service.checked !== false)).map((service) => {
            return {id: service.appointment_item_id, cost: +service.position_total_cost}
        });
        const goods = not_paid.products.filter((product) => (product.checked !== false)).map((product) => {
            return {id: product.appointment_item_id, cost: (product.position_total_cost * product.product_cnt)}
        });

        const data = {
            checkout_goods: [].concat([], goods),
            checkout_services: [].concat([], services),
            paid_form: +paid_form
        };
        this.props.onSaveCheck(this.state.not_paid_appointment[0].appointment_id, data);
    };

    onCancel = () => {
        this.props.onCancelCheck(this.props.appointmentId);
    };

    onClose = (e) => {
        e.preventDefault();
        this.props.onCloseCheck();
    };

    onPrint = (e) => {
        e.preventDefault();
        const not_paid = this.state.not_paid_appointment[0];
        const services = not_paid.services.filter((service) => (service.checked !== false)).map((service) => {
            return {id: service.appointment_item_id, cost: +service.position_total_cost}
        });
        const goods = not_paid.products.filter((product) => (product.checked !== false)).map((product) => {
            return {id: product.appointment_item_id, cost: (product.position_total_cost * product.product_cnt)}
        });

        const data = {
            checkout_goods: [].concat([], goods),
            checkout_services: [].concat([], services)
        };
        this.props.onPrintCheck(this.state.not_paid_appointment[0].appointment_id, data);
        NEW_WIN = window.open("about:blank");
    }
}

AppointmentsDetailsCard.propTypes = {
    data: PropTypes.object,
    appointmentId: PropTypes.number,
    onPrintCheck: PropTypes.func.isRequired,
    onClearHTMLForCheck: PropTypes.func.isRequired
};


export default AppointmentsDetailsCard;