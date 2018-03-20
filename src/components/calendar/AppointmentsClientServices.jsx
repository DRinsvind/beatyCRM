import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';
import deepAssign from 'deep-assign';
// CONSTANTS
import {NZF} from '../../utils';
// COMMONS
import DropDownTreeViewCalendar from '../commons/dropDowns/DropDownTreeViewCalendar';

import AppointmentsEdit from './AppointmentsEdit'

const $ = window.jQuery;

/**
 * Client appointment details
 */
const TIME_MIN = 9;
const TIME_MAX = 21;
const COUNT_MIN = 1;
const COUNT_MAX = 10;

const initialStateService = {
    category_id: '',
    service: '',
    master: '',
    time: {
        hours: null,
        minutes: null
    },
    is_present: false
};

const initialStateGood = {
    category_id: '',
    count: 0,
    good: '',
    master: ''
};

class AppointmentsClientServices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedService: {},
            showPaidServices: false,
            showNotPaidServices: true,
            showEditingService: true,
            showEditingGood: true,
            editService: false,
            editGood: false,
            editedService: deepAssign({}, initialStateService),
            editedGood: deepAssign({}, initialStateGood),
            addingService: deepAssign({}, initialStateService),
            addingGood: deepAssign({}, initialStateGood),
            filledServicesForm: true,
            filledGoodsForm: true
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.data === undefined) {
            nextState.editedService = deepAssign({time: {hours: null, minutes: null}}, initialStateService);
            nextState.editedGood = deepAssign({}, initialStateGood);
            nextState.addingService = deepAssign({time: {hours: null, minutes: null}}, initialStateService);
            nextState.addingGood = deepAssign({}, initialStateGood);
            nextState.filledServicesForm = true;
            nextState.filledGoodsForm = true;
        }
    }

    render() {

        if (this.props.data === undefined) {

            return null;
        }

        const not_paid_arr = this.props.data.appointments
            .filter((appointment) => (appointment.appointment_state.state_denom !== 'PAID'))[0];
        const paid_arr = this.props.data.appointments
            .filter((appointment) => (appointment.appointment_state.state_denom === 'PAID'));


        return (
            <section className="panel mb-none">
                <div className="panel-body p-none"
                     style={{width: '100%', background: '#ECEDF0', borderRadius: '0px'}}>
                    <div className={paid_arr && paid_arr.length > 0 ? 'p-xs' : 'hide'}
                         style={{backgroundColor: 'transparent', color: '#21262D', fontWeight: '600'}}>
                        <span className="p-sm">ОПЛАЧЕННЫЕ УСЛУГИ/ТОВАРЫ
                        <a href="#" className="pull-right pr-sm"
                           onClick={this.paidServicesToggleClick}
                           style={{
                               backgroundColor: 'transparent',
                               fontSize: '0.7em',
                               color: '#21262D'
                           }}>
                            <i className={"fa fa-fw fa-chevron-" + (this.state.showPaidServices ? 'up' : 'down')}></i>
                        </a>
                    </span>
                    </div>
                    <div id="paid_services" style={{display: 'none'}}>
                        {this.paidAppointmentsRender()}
                    </div>
                    <div
                        className={(not_paid_arr && not_paid_arr.services.length > 0) || (not_paid_arr && not_paid_arr.products.length > 0) ? 'p-xs mb-sm mt-sm' : 'hide'}
                        style={{backgroundColor: 'transparent', color: '#21262D', fontWeight: '600'}}>
                      <span className="p-sm">
                            НЕ ОПЛАЧЕННЫЕ УСЛУГИ/ТОВАРЫ
                          <a href="#" className="pull-right pr-sm"
                             style={{fontSize: '0.7em', color: '#21262D'}}
                             onClick={this.notPaidServicesToggleClick}>
                                <i className={"fa fa-fw fa-chevron-" + (this.state.showNotPaidServices ? 'up' : 'down')}></i>
                            </a>
                       </span>
                    </div>
                    <div id="not_paid_services">
                        {this.notPaidAppointmentsRender()}
                    </div>
                </div>

                <div className="row pt-md" style={{background: '#ECEDF0'}}>
                    <div className="col-md-12">
                        <div className="tabs mb-none tabs-primary" style={{borderRadius: '0px'}}>
                            <ul className="nav nav-tabs nav-justified">
                                <li id="profile_tab" className="active">
                                    <a href="#services" data-toggle="tab">
                                        <i className="fa fa-fw fa-plus"></i>
                                        Услуга
                                    </a>
                                </li>
                                <li id="edit_tab">
                                    <a href="#goods" data-toggle="tab">
                                        <i className="fa fa-fw fa-plus"></i>
                                        Товар
                                    </a>
                                </li>
                            </ul>
                            <div className="tab-content p-none">
                                <div id="services" className="tab-pane active">
                                    <div className="panel-body pb-none"
                                         style={{width: '100%', borderRadius: '0px'}}>
                                        <div className="row">
                                            <div className="col-md-12 selection pt-sm">
                                                <div className="mb-xs calendar-select2">
                                                    <Select2 className="form-control"
                                                             options={{
                                                                 placeholder: 'Выберите категорию',
                                                                 theme: 'bootstrap'
                                                             }}
                                                             data={this.categoriesList(this.props.services)}
                                                             value={this.state.addingService.category_id}
                                                             onSelect={(e) => {
                                                                 this.onSelect(e, this.state.addingService, 'category_id')
                                                             }}
                                                    />
                                                </div>
                                                <div className="mb-xs">
                                                    <DropDownTreeViewCalendar
                                                        placeholder="Выберите услугу"
                                                        items={this.makeServicesTree(this.props.services, this.state.addingService.category_id)}
                                                        onItemSelected={(id, service) => this.addedDDSelected(id, service, 'service', this.state.addingService)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3 p-none pl-md">
                                                <Select2
                                                    id="hours"
                                                    className="form-control"
                                                    options={{
                                                        placeholder: 'ЧЧ',
                                                        theme: 'bootstrap'
                                                    }}
                                                    data={this.timeHours()}
                                                    value={this.state.addingService.time.hours}
                                                    onSelect={(e) => this.serviceTimeSelected(e, this.state.addingService)}
                                                />
                                            </div>
                                            <div className="col-md-3 p-none pl-xs pr-xs">
                                                <Select2
                                                    id="minutes"
                                                    className="form-control"
                                                    options={{
                                                        placeholder: 'ММ',
                                                        theme: 'bootstrap'
                                                    }}
                                                    data={this.timeMinutes()}
                                                    value={this.state.addingService.time.minutes}
                                                    onSelect={(e) => this.serviceTimeSelected(e, this.state.addingService)}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-sm calendar-select2 p-none pr-md">
                                                <Select2 className="form-control"
                                                         options={{
                                                             placeholder: 'Мастер',
                                                             theme: 'bootstrap'
                                                         }}
                                                         data={this.filterMasters(this.state.addingService.category_id)}
                                                         value={this.state.addingService.master}
                                                         onSelect={(e) => this.onSelect(e, this.state.addingService, 'master')}
                                                />
                                            </div>
                                        </div>
                                        {/*<div className="row">*/}
                                            {/*<div className="col-md-12 mb-md checkbox-custom checkbox-primary ml-md">*/}
                                                {/*<input type="checkbox"*/}
                                                       {/*checked={this.state.addingService.is_present}*/}
                                                       {/*name="is_present"*/}
                                                       {/*onChange={this.onCheckboxCheck}/>*/}

                                                {/*<label htmlFor="is_present" style={{fontSize: '1em'}}><i className="fa fa-fw fa-gift fa-lg"/> Услуга в подарок</label>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                        <label className={this.state.filledServicesForm ? 'hidden' : 'text-danger'}>Заполните
                                            все
                                            поля!</label>
                                        <div className="row pb-md">
                                            <div className="col-md-12">
                                                <a href="#"
                                                   className="btn btn-primary btn-sm pull-right"
                                                   onClick={(e) => {
                                                       e.preventDefault();

                                                       this.onAddService();
                                                   }}>
                                                    Добавить услугу
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="goods" className="tab-pane">
                                    <div className="panel-body pb-none"
                                         style={{width: '100%', borderRadius: '0px'}}>
                                        <div className="row">
                                            <div className="col-md-12 selection pt-sm">
                                                <div className="mb-xs calendar-select2">
                                                    <Select2 className="form-control"
                                                             options={{
                                                                 placeholder: 'Выберите категорию',
                                                                 theme: 'bootstrap'
                                                             }}
                                                             data={this.categoriesList(this.props.goods)}
                                                             value={this.state.addingGood.category_id}
                                                             onSelect={(e) => {
                                                                 this.onSelect(e, this.state.addingGood, 'category_id')
                                                             }}
                                                    />
                                                </div>
                                                <div className="mb-xs">
                                                    <DropDownTreeViewCalendar
                                                        placeholder="Выберите товар"
                                                        items={this.makeServicesTree(this.props.goods, this.state.addingGood.category_id)}
                                                        onItemSelected={(id, good) => this.addedDDSelected(id, good, 'good', this.state.addingGood)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 p-none pl-md pr-xs">
                                                <Select2
                                                    id="hours"
                                                    className="form-control"
                                                    options={{
                                                        placeholder: 'шт',
                                                        theme: 'bootstrap'
                                                    }}
                                                    data={this.goodsCount()}
                                                    value={this.state.addingGood.count}
                                                    onSelect={(e) => this.onSelect(e, this.state.addingGood, 'count')}
                                                />
                                            </div>
                                            <div className="col-md-8 mb-md calendar-select2 p-none pr-md">
                                                <Select2 className="form-control"
                                                         options={{
                                                             placeholder: 'Мастер',
                                                             theme: 'bootstrap'
                                                         }}
                                                         data={this.mastersList()}
                                                         value={this.state.addingGood.master}
                                                         onSelect={(e) => this.onSelect(e, this.state.addingGood, 'master')}
                                                />
                                            </div>
                                        </div>
                                        <label className={this.state.filledGoodsForm ? 'hidden' : 'text-danger'}>Заполните
                                            все
                                            поля!</label>
                                        <div className="row pb-md">
                                            <div className="col-md-12">
                                                <a href="#"
                                                   className="btn btn-primary btn-sm pull-right"
                                                   onClick={(e) => {
                                                       e.preventDefault();

                                                       this.onAddGood();
                                                   }}>
                                                    Добавить товар
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    makeServicesTree = (props, category_id) => {
        const loadNodes = (item) => {
            const children = [];
            let flag = true;
            if (item.services) {
                flag = false;
                item.services.map((service) => {
                    children.push({
                        item: service,
                        id: service.id,
                        text: service.name,
                        type: 'file',
                        state: {
                            disabled: false
                        }
                    })
                });
            }

            if (item.subcategory && item.subcategory.length > 0) {
                item.subcategory.map((item_subcategory) => {
                    const sub_children = [];
                    if (item_subcategory.services) {
                        item_subcategory.services.map((service) => {
                            sub_children.push({
                                item: service,
                                id: service.id,
                                text: service.name,
                                type: 'file',
                                state: {
                                    disabled: false
                                }
                            })
                        });
                    }
                    if (item.subcategory.subcategory && item.subcategory.subcategory.length > 0) {
                        item.subcategory.subcategory.map((item_subcategory) => {
                            sub_children.push(loadNodes(item_subcategory));
                        })
                    }

                    flag = true;
                    children.push({
                        item: item_subcategory,
                        id: item_subcategory.id,
                        text: item_subcategory.name,
                        children: sub_children,
                        state: {
                            opened: true,
                            disabled: true
                        }
                    })
                })
            }

            return {
                item: item,
                id: item.id,
                text: item.name,
                children: children,
                state: {
                    opened: true,
                    disabled: true
                }
            };
        };

        if (category_id) {
            return props
                .filter((service) => (service.id === +category_id))
                .map(loadNodes);
        }
        return null;
    };

    onAddService = () => {

        if (!this.state.addingService.category_id || !this.state.addingService.service.id || !this.state.addingService.time.hours || !this.state.addingService.time.minutes || !this.state.addingService.master) {
            this.setState({
                filledServicesForm: false
            });
            return;
        }


        let date = new Date(this.props.currentDate.toISOString());
        date.setHours(this.state.addingService.time.hours);
        date.setMinutes(this.state.addingService.time.minutes);


        let service = {
            appointment_item_id: +this.state.addingService.service.id,
            category_id: +this.state.addingService.category_id,
            trainer_id: +this.state.addingService.master,
            service_duration: +this.state.addingService.service.duration,
            service_id: +this.state.addingService.service.id,
            service_name: this.state.addingService.service.name,
            position_total_cost: this.state.addingService.service.price,
            service_time: date,
            selected_service: true,
            is_present: this.state.addingService.is_present
        };


        this.props.onServiceAdding(service);
        this.setState({
            addingService: deepAssign({time: {hours: null, minutes: null}}, initialStateGood),
            filledServicesForm: true
        });
    };

    onAddGood = () => {

        if (!this.state.addingGood.good.id || !this.state.addingGood.master || !this.state.addingGood.good.id || !this.state.addingGood.count) {
            this.setState({
                filledGoodsForm: false
            });
            return;
        }

        let good = {
            appointment_item_id: +this.state.addingGood.good.id,
            trainer_id: +this.state.addingGood.master,
            product_id: +this.state.addingGood.good.id,
            product_name: this.state.addingGood.good.name,
            position_total_cost: this.state.addingGood.good.price,
            product_cnt: +this.state.addingGood.count,
            product_price: this.state.addingGood.good.price
        };
        this.props.onGoodsAdding(good);
        this.setState({
            addingGood: deepAssign({}, initialStateGood),
            filledGoodsForm: true
        });

    };

    categoriesList = (data) => {
        return data.map((item) => {
            return {
                id: item.id,
                text: item.name
            };
        });
    };

    mastersList = () => {
        return this.props.masters.map((master) => {
            return {
                id: master.trainer_id,
                text: master.trainer_name
            };
        });
    };

    timeHours = () => {
        let hours = [];
        for (let i = TIME_MIN; i <= TIME_MAX; i++) {
            hours.push({
                id: i,
                text: i < 10 ? '0' + i : i
            });
        }
        return hours;
    };

    timeMinutes = () => {
        let minutes = [];
        for (let i = 0; i < 60; i = i + 10) {
            minutes.push({
                id: i,
                text: i < 10 ? '0' + i : i
            });
        }

        return minutes;
    };

    goodsCount = () => {
        let goods_count = [];
        for (let i = COUNT_MIN; i <= COUNT_MAX; i++) {
            goods_count.push({
                id: i,
                text: i
            });
        }
        return goods_count;
    };

    paidAppointmentsRender = () => {
        if (this.props.data.appointments.length === 0) {
            return null;
        }

        let cost = 0;

        const paid_arr = this.props.data.appointments
            .filter((appointment) => (appointment.appointment_state.state_denom === 'PAID'));

        const hasServices = paid_arr
            .filter((app) => (app.services.length > 0));

        const hasGoods = paid_arr
            .filter((app) => (app.products.length > 0));

        let paidAppointmentsServices = paid_arr
            .map((appointment) => {
                return appointment.services.sort((a, b) => {
                    return new Date(a.time_service) - new Date(b.time_service);
                })

                    .map((service, index) => {
                        const serviceTime = new Date(service.service_time);
                        cost += service.position_total_cost;

                        return (
                            <tr key={'service_' + appointment.appointment_id + '_' + service.service_id + '_' + index}>
                                <td style={{paddingLeft: 15, width: '60%'}}>{service.service_name}</td>

                                <td>
                                    {NZF(serviceTime.getHours()) + ':' + NZF(serviceTime.getMinutes())}
                                </td>
                                <td style={{whiteSpace: 'nowrap', textAlign: 'right', paddingRight: 15}}>
                                    {parseFloat(service.position_total_cost).toFixed(2)}
                                </td>
                            </tr>
                        )
                    })
            });

        let paidAppointmentsGoods = paid_arr
            .map((appointment) =>
                appointment.products.map((product, index) => {
                    const sum_product_cost = product.product_price * product.product_cnt;
                    cost += sum_product_cost;

                    return (
                        <tr key={'goods_' + appointment.appointment_id + '_' + product.product_id + '_' + index}>
                            <td style={{paddingLeft: 15, width: '60%'}}>
                                {/*<a href="#"*/}
                                   {/*onClick={(e) => {*/}
                                       {/*this.onEditGoodClick(product, e)*/}
                                   {/*}}>*/}
                                    {product.product_name}
                                {/*</a>*/}
                            </td>
                            <td style={{whiteSpace: 'nowrap'}}>
                                {product.product_cnt + ' шт'}
                            </td>
                            <td style={{whiteSpace: 'nowrap', textAlign: 'right', paddingRight: 15}}>
                                {parseFloat(sum_product_cost).toFixed(2)}
                            </td>
                        </tr>
                    )
                })
            );

        return (
            <div>
                <div className={hasServices.length > 0 ? 'row' : 'hidden'}
                     style={{width: '100%'}}>
                    <div className="col-md-12 ml-md p-xs pr-md"
                         style={{backgroundColor: '#c0c0c0', width: '100%', color: 'white'}}>
                        <span className="pl-md">Услуги:</span>
                    </div>
                </div>
                <table className="table table-striped mb-none" style={{background: 'white'}}>
                    <tbody>
                    {paidAppointmentsServices}
                    </tbody>
                </table>

                <div className={hasGoods.length > 0 ? 'row' : 'hidden'}
                     style={{width: '100%'}}>
                    <div className="col-md-12 ml-md p-xs pr-md"
                         style={{backgroundColor: '#c0c0c0', width: '100%', color: 'white'}}>
                        <span className="pl-md">Товары:</span>
                    </div>
                </div>
                <table className="table table-striped mb-none" style={{background: 'white'}}>
                    <tbody>
                    {paidAppointmentsGoods}
                    </tbody>
                </table>
            </div>
        );
    };

    notPaidAppointmentsRender = () => {
        if (this.props.data.appointments.length === 0) {
            return null;
        }

        let cost = 0;

        const not_paid_arr = this.props.data.appointments
            .filter((appointment) => (appointment.appointment_state.state_denom !== 'PAID'));

        const hasServices = not_paid_arr
            .filter((app) => (app.services.length > 0));

        const hasGoods = not_paid_arr
            .filter((app) => (app.products.length > 0));


        let notPaidAppointmentsServices = not_paid_arr
            .map((appointment) => {
                return appointment.services.sort((a, b) => {
                    return new Date(a.service_time) - new Date(b.service_time);
                })

                    .map((service, index) => {
                        const serviceTime = new Date(service.service_time);
                        cost += service.position_total_cost;

                        return (
                            <tr key={'service_' + appointment.appointment_id + '_' + service.service_id + '_' + index}>
                                <td style={{paddingLeft: 15, width: '60%'}}>
                                    <a href="#"
                                       onClick={(e) => {
                                           this.onEditServiceClick(service, e)
                                       }}>
                                        {service.service_name}
                                    </a>
                                </td>
                                <td>
                                    {NZF(serviceTime.getHours()) + ':' + NZF(serviceTime.getMinutes())}
                                </td>
                                <td style={{whiteSpace: 'nowrap', textAlign: 'right', paddingRight: 15}}>
                                    {service.is_present ? '0.00' : parseFloat(service.position_total_cost).toFixed(2)}
                                </td>
                            </tr>
                        )
                    })
            });

        let notPaidAppointmentsGoods = not_paid_arr
            .map((appointment) =>
                appointment.products.map((product, index) => {
                    const sum_product_cost = product.product_price * product.product_cnt;
                    cost += sum_product_cost;

                    return (
                        <tr key={'goods_' + appointment.appointment_id + '_' + product.product_id + '_' + index}>
                            <td style={{paddingLeft: 15, width: '60%'}}>
                                <a href="#"
                                   onClick={(e) => {
                                       this.onEditGoodClick(product, e)
                                   }}>
                                    {product.product_name}
                                </a>
                            </td>
                            <td style={{whiteSpace: 'nowrap'}}>
                                {product.product_cnt + ' шт'}
                            </td>
                            <td style={{whiteSpace: 'nowrap', textAlign: 'right', paddingRight: 15}}>
                                {parseFloat(sum_product_cost).toFixed(2)}
                            </td>
                        </tr>
                    )
                })
            );


        return (
            <div>
                <div className={hasServices.length > 0 ? 'row' : 'hidden'}
                     style={{width: '100%'}}>
                    <div className="col-md-12 ml-md p-xs pr-md"
                         style={{backgroundColor: '#c0c0c0', width: '100%', color: 'white'}}>
                        <span className="pl-md">Услуги:</span>
                    </div>
                </div>
                <table className="table table-striped mb-none" style={{background: 'white'}}>
                    <tbody>
                    {notPaidAppointmentsServices}
                    </tbody>
                </table>

                <div className={hasGoods.length > 0 ? 'row' : 'hidden'}
                     style={{width: '100%'}}>
                    <div className="col-md-12 ml-md p-xs pr-md"
                         style={{backgroundColor: '#c0c0c0', width: '100%', color: 'white'}}>
                        <span className="pl-md">Товары:</span>
                    </div>
                </div>
                <table className="table table-striped mb-none" style={{background: 'white'}}>
                    <tbody>
                    {notPaidAppointmentsGoods}
                    </tbody>
                </table>

                <div
                    // className={hasGoods.length > 0 || hasServices.length > 0 ? 'row m-none pb-xs pt-xs mb-md' : 'hidden'}
                    className="row m-none pb-xs pt-xs mb-xs"
                    style={{width: '100%', backgroundColor: 'white', color: '#c0c0c0'}}>
                    <div className="col-md-12 p-xs">
                        {/*<div className={hasGoods.length > 0 || hasServices.length > 0 ? '' : 'hidden'}>*/}
                        <span className="pl-md pull-right" style={{fontSize: '1em'}}>ИТОГО, грн  <span style={{
                            color: 'black',
                            fontWeight: '500',
                            fontSize: '1.5em'
                        }}>&nbsp; {parseFloat(cost).toFixed(2)}</span></span>
                        {/*</div>*/}
                    </div>
                    {/*<div className="col-md-3 pr-xs">*/}
                        {/**/}
                    {/*</div>*/}
                </div>
                <div className="row m-none pb-xs pt-xs mb-xs">
                    <a href="#" className="btn btn-primary btn-sm pull-right mr-xs" onClick={(e) => {
                        e.preventDefault();
                        this.props.onAppointmentSave()
                    }
                    }>
                        Подтвердить
                    </a>
                    <a href="#" className={((hasGoods.length > 0) || (hasServices.length > 0)) ? 'btn btn-primary btn-sm pull-right mr-xs' : 'hidden'} onClick={(e) => {
                        e.preventDefault();
                        this.props.onAppointmentSaveAndPay();
                    }
                    }>
                        Перейти к оплате
                    </a>
                </div>
                <AppointmentsEdit
                    timeHours={this.timeHours}
                    timeMinutes={this.timeMinutes}
                    goodsCount={this.goodsCount}
                    mastersList={this.mastersList}
                    showEditingService={this.state.showEditingService}
                    showEditingGood={this.state.showEditingGood}
                    editGood={this.state.editGood}
                    editService={this.state.editService}
                    editedService={this.state.editedService}
                    editedGood={this.state.editedGood}
                    filterMasters={this.filterMasters}
                    onServiceCancel={this.onServiceCancel}
                    onGoodCancel={this.onGoodCancel}
                    onServiceEdit={this.onEditService}
                    onGoodsEdit={this.onEditGood}
                    currentDate={this.props.currentDate}
                    onSelect={this.onSelect}
                    serviceTimeSelected={this.serviceTimeSelected}
                />
            </div>
        );
    };

    onEditServiceClick = (service, e) => {
        e.preventDefault();
        this.state.editService ? $('td>a').removeClass('active') : $(e.target).addClass('active');
        this.setState({
            editService: !this.state.editService
        });

        if (!this.state.editService) {
            this.setState({
                selectedService: service,
                editedService: {
                    category_id: +service.category_id,
                    service: service,
                    time: {
                        hours: new Date(service.service_time).getHours(),
                        minutes: new Date(service.service_time).getMinutes()
                    },
                    master: +service.trainer_id
                }
            })
        }
        else {
            this.setState({
                editedService: deepAssign({}, initialStateService),
                selectedService: {},
                showEditingService: true,
                showEditingGood: true
            });
        }
    };

    onEditGoodClick = (product, e) => {
        e.preventDefault();
        this.state.editGood ? $('td>a').removeClass('active') : $(e.target).addClass('active');
        this.setState({
            editGood: !this.state.editGood
        });

        if (!this.state.editGood) {
            this.setState({
                selectedGood: product,
                editedGood: {
                    category_id: +product.category_id,
                    count: +product.product_cnt,
                    master: +product.trainer_id,
                    good: product,
                }
            })
        }
        else {
            this.setState({
                editedGood: deepAssign({}, initialStateGood),
                selectedGood: {},
                showEditingService: true,
                showEditingGood: true
            });
        }
    };

    onEditService = (service) => {
        this.props.onServiceEdit(this.state.selectedService, service);
        this.setState({
            editService: !this.state.editService,
            editedService: deepAssign({}, initialStateService)
        });
    };

    onEditGood = (good) => {
        this.props.onProductEdit(this.state.selectedGood, good);
        this.setState({
            editGood: !this.state.editGood,
            editedGood: deepAssign({}, initialStateGood)
        });
    };

    onServiceCancel = (editService) => {
        this.setState({
            editService: editService
        });
        this.props.onServiceCancel(this.state.selectedService);
    };

    onGoodCancel = (editGood) => {
        this.setState({
            editGood: editGood
        });
        this.props.onProductCancel(this.state.selectedGood);
    };

    filterMasters = (category_id) => {
        if (category_id) {
            const section = this.props.appointments
                .filter((appointment) => appointment.service_category_id === +category_id)[0];


            return section.employees
                .map((employee) => {
                    return {
                        id: employee.trainer_id,
                        text: employee.master_name
                    };
                });
        }

        return [];
    };

    paidServicesToggleClick = (e) => {
        e.preventDefault();

        $('#paid_services').stop().slideToggle();

        this.setState({
            showPaidServices: !this.state.showPaidServices
        });
    };

    notPaidServicesToggleClick = (e) => {
        e.preventDefault();
        $('#not_paid_services').stop().slideToggle();
        this.setState({
            showNotPaidServices: !this.state.showNotPaidServices
        });
    };

    onSelect = (e, selectedItem, name) => {
        let data = selectedItem;
        data[name] = e.target.value;
        this.forceUpdate();
    };

    onCheckboxCheck = (e) => {
        this.setState({
            addingService: {
                ...this.state.addingService,
                is_present: e.target.checked
            }
        });
    };

    addedDDSelected = (id, selectedItem, name, state) => {
        let data = state;
        data[name] = selectedItem;
        this.forceUpdate();
    };

    serviceTimeSelected = (e, state) => {
        let data = state;
        data.time[e.target.id] = e.target.value;
        this.forceUpdate();
    };
}

AppointmentsClientServices.propTypes = {
    data: PropTypes.object,
    services: PropTypes.array,
    goods: PropTypes.array,
    masters: PropTypes.array,
    onAppointmentAdding: PropTypes.func.isRequired,
    onCategorySelected: PropTypes.func.isRequired,
    onServiceSelected: PropTypes.func.isRequired,
    onMasterSelected: PropTypes.func.isRequired,
    onTimeSelected: PropTypes.func.isRequired,
    onAppointmentSave: PropTypes.func.isRequired,
    onServiceAdding: PropTypes.func.isRequired,
    onServiceCancel: PropTypes.func.isRequired,
    onProductCancel: PropTypes.func.isRequired,
    onServiceEdit: PropTypes.func.isRequired,
    onProductEdit: PropTypes.func.isRequired,
    onGoodsAdding: PropTypes.func.isRequired
};

export default AppointmentsClientServices;