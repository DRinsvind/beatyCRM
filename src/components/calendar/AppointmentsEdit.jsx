import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';
import deepAssign from 'deep-assign';

const $ = window.jQuery;

const initialStateService = {
    category_id: '',
    service: '',
    master: '',
    time: {
        hours: null,
        minutes: null
    }
};

const initialStateGood = {
    category_id: '',
    count: 0,
    good: '',
    master: ''
};

class AppointmentsEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedService: {},
            showEditingService: true,
            showEditingGood: true,
            editService: false,
            editGood: false,
            editedService: deepAssign({}, initialStateService),
            editedGood: deepAssign({}, initialStateGood)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            nextState.showEditingService = nextProps.showEditingService;
            nextState.showEditingGood = nextProps.showEditingGood;
            nextState.editGood = nextProps.editGood;
            nextState.editService = nextProps.editService;
            nextState.editedService = nextProps.editedService;
            nextState.editedGood = nextProps.editedGood;
        }
    }

    render() {
        return (
            <div>
                <div className={this.state.editService ? 'p-xs mb-md' : 'hide'}>
                    <div style={{backgroundColor: 'transparent', color: '#e58c8c'}}>
                      <span className="p-sm pt-lg" style={{color: '#e58c8c'}}>
                            РЕДАКТИРОВАНИЕ УСЛУГИ
                          <a href="#" className="pull-right pr-sm"
                             style={{fontSize: '0.7em', color: '#e58c8c'}}
                             onClick={this.onEditingServiceToggleClick}>
                                <i className={"fa fa-fw fa-chevron-" + (this.state.showEditingService ? 'up' : 'down')}></i>
                          </a>
                       </span>
                    </div>
                    <div id="editing_service">
                        <div className="panel-body pb-none"
                             style={{width: '100%', background: '#ECEDF0', borderRadius: '0px', boxShadow: 'none'}}>
                            <div className="row">
                                <div className="col-md-12 selection">
                                    <div className="row">
                                        <div className="col-md-3 p-none pl-md">
                                            <Select2 className="form-control"
                                                     options={{
                                                         placeholder: 'ЧЧ',
                                                         theme: 'bootstrap'
                                                     }}
                                                     id="hours"
                                                     data={this.props.timeHours()}
                                                     value={this.state.editedService.time.hours}
                                                     onSelect={(e) => this.props.serviceTimeSelected(e, this.state.editedService)}
                                            />
                                        </div>
                                        <div className="col-md-3 p-none pl-xs pr-xs">
                                            <Select2 className="form-control"
                                                     options={{
                                                         placeholder: 'ММ',
                                                         theme: 'bootstrap'
                                                     }}
                                                     id="minutes"
                                                     data={this.props.timeMinutes()}
                                                     value={this.state.editedService.time.minutes}
                                                     onSelect={(e) => this.props.serviceTimeSelected(e, this.state.editedService)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-md calendar-select2 p-none pr-md">
                                            <Select2 className="form-control"
                                                     options={{
                                                         placeholder: 'Мастер',
                                                         theme: 'bootstrap'
                                                     }}
                                                     data={this.props.filterMasters(this.state.editedService.category_id)}
                                                     value={this.state.editedService.master}
                                                     onSelect={(e) => this.props.onSelect(e, this.state.editedService, 'master')}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <a href="#" className="btn btn-custom btn-sm"
                                               onClick={this.onServiceCancel}>
                                                Удалить
                                            </a>
                                        </div>
                                        <div className="col-md-6">
                                            <a href="#"
                                               className="btn btn-primary btn-sm pull-right"
                                               onClick={(e) => {
                                                   e.preventDefault();

                                                   this.onEditService();
                                               }}>
                                                Изменить</a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={this.state.editGood ? 'p-xs mb-md' : 'hide'}>
                    <div style={{backgroundColor: 'transparent', color: '#e58c8c'}} className="">
                      <span className="p-sm" style={{color: '#e58c8c'}}>
                            РЕДАКТИРОВАНИЕ ТОВАРА
                          <a href="#" className="pull-right pr-sm"
                             style={{fontSize: '0.7em', color: '#e58c8c'}}
                             onClick={this.onEditingGoodsToggleClick}>
                                <i className={"fa fa-fw fa-chevron-" + (this.state.showEditingGood ? 'up' : 'down')}></i>
                            </a>
                       </span>
                    </div>
                    <div id="editing_good">
                        <div className="panel-body pb-none"
                             style={{width: '100%', background: '#ECEDF0', borderRadius: '0px', boxShadow: 'none'}}>
                            <div className="row">
                                <div className="col-md-12 selection">
                                    <div className="row">
                                        <div className="col-md-4 p-none pl-md pr-xs">
                                            <Select2
                                                id="hours"
                                                className="form-control"
                                                options={{
                                                    placeholder: 'шт',
                                                    theme: 'bootstrap'
                                                }}
                                                data={this.props.goodsCount()}
                                                value={this.state.editedGood.count}
                                                onSelect={(e) => this.onSelect(e, this.state.editedGood, 'count')}
                                            />
                                        </div>
                                        <div className="col-md-8 mb-md calendar-select2 p-none pr-md">
                                            <Select2 className="form-control"
                                                     options={{
                                                         placeholder: 'Мастер',
                                                         theme: 'bootstrap'
                                                     }}
                                                     data={this.props.mastersList()}
                                                     value={this.state.editedGood.master}
                                                     onSelect={(e) => this.onSelect(e, this.state.editedGood, 'master')}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <a href="#" className="btn btn-custom btn-sm"
                                               onClick={this.onGoodCancel}>
                                                Удалить
                                            </a>
                                        </div>
                                        <div className="col-md-6">
                                            <a href="#"
                                               className="btn btn-primary btn-sm pull-right"
                                               onClick={(e) => {
                                                   e.preventDefault();

                                                   this.onEditGood();
                                               }}>Изменить</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onEditService = () => {
        let date = new Date(this.props.currentDate.toISOString());
        date.setHours(+this.state.editedService.time.hours);
        date.setMinutes(+this.state.editedService.time.minutes);

        const service = {
            appointment_item_id: +this.state.editedService.service.service_id,
            category_id: +this.state.editedService.category_id,
            trainer_id: +this.state.editedService.master,
            service_duration: +this.state.editedService.service.service_duration,
            service_id: +this.state.editedService.service.service_id,
            service_name: this.state.editedService.service.service_name,
            position_total_cost: this.state.editedService.service.position_total_cost,
            service_time: date
        };

        this.props.onServiceEdit(service);
    };

    onEditGood = () => {
        const good = {
            appointment_item_id: +this.state.editedGood.good.product_id,
            category_id: +this.state.editedGood.category_id,
            trainer_id: +this.state.editedGood.master,
            product_cnt: +this.state.editedGood.count,
            product_id: +this.state.editedGood.good.product_id,
            product_name: this.state.editedGood.good.product_name,
            product_price: +this.state.editedGood.good.product_price,
            position_total_cost: this.state.editedGood.good.position_total_cost
        };

        this.props.onGoodsEdit(good);
    };

    onEditingServiceToggleClick = (e) => {
        e.preventDefault();

        $('#editing_service').stop().slideToggle(() => {
            this.setState({
                showEditingService: !this.state.showEditingService
            });
        });
    };

    onEditingGoodsToggleClick = (e) => {
        e.preventDefault();

        $('#editing_good').stop().slideToggle(() => {
            this.setState({
                showEditingGood: !this.state.showEditingGood
            });
        });
    };

    onServiceCancel = (e) => {
        e.preventDefault();
        this.props.onServiceCancel(!this.state.editService);
    };

    onGoodCancel = (e) => {
        e.preventDefault();
        this.props.onGoodCancel(!this.state.editGood);
    };

    onSelect = (e, selectedItem, name) => {
        let data = selectedItem;
        data[name] = e.target.value;
        this.forceUpdate();
    };
}

AppointmentsEdit.propTypes = {
    showEditingService: PropTypes.bool,
    showEditingGood: PropTypes.bool,
    editGood: PropTypes.bool,
    editService: PropTypes.bool,
    editedService: PropTypes.object,
    editedGood: PropTypes.object,
    currentDate: PropTypes.object,

    timeHours: PropTypes.func.isRequired,
    timeMinutes: PropTypes.func.isRequired,
    goodsCount: PropTypes.func.isRequired,
    mastersList: PropTypes.func.isRequired,
    filterMasters: PropTypes.func.isRequired,
    onServiceCancel: PropTypes.func.isRequired,
    onGoodCancel: PropTypes.func.isRequired,
    onServiceEdit: PropTypes.func.isRequired,
    onGoodsEdit: PropTypes.func.isRequired,
    serviceTimeSelected: PropTypes.func.isRequired
};

export default AppointmentsEdit;