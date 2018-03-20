import React, {Component} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
// CONSTANTS
import {
    FORMAT_DATE,
    FORMAT_TIME
} from '../../utils';
// COMMONS
import Modal from '../commons/modals/Modal';
// COMPONENTS
import Schedules from './Schedules';
import AppointmentsDetailsCard from './AppointmentsDetailsCard';
import AppointmentsSidePanel from './AppointmentsSidePanel';

const $ = window.jQuery;

/**
 * Appointments component.
 */
class Appointments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            today: new Date(),
            currentDate: new Date(),
            appointments: props.appointments,
            temporaryAppointments: {},
            loading: true
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (!this.props.loading) {
            nextState.loading = nextProps.loading;
        }

        nextState.appointments = nextProps.appointments;

        const tempAppoint = nextState.temporaryAppointments[FORMAT_DATE(nextState.currentDate)];

        if (tempAppoint) {
            nextState.appointments = nextState.appointments.concat(tempAppoint);
        }

        if (nextProps.client_id_for_check && (nextProps.client_id_for_check !== this.props.client_id_for_check)) {
            this.clientDetailsShow(nextProps.client_id_for_check, 0);
        }

        if (nextProps.selectedClient !== this.props.selectedClient) {

            nextState.selectedClient = nextProps.selectedClient;

            if (nextState.currentDate.toLocaleDateString() !== nextState.today.toLocaleDateString()) {
                nextState.selectedTime = {
                    hour: 9,
                    minutes: 0
                }
            } else {
                const minutes = nextState.today.getMinutes();
                let hour = nextState.today.getHours();

                if (minutes % 10 > 0) {
                    let min = minutes / 10;
                    min = min - (min % 1);

                    if (min !== 5) {
                        min = (min + 1) * 10;
                    } else {
                        min = 0;
                        hour = hour + 1;
                    }

                    nextState.selectedTime = {
                        hour: hour,
                        minutes: min
                    }
                } else {
                    nextState.selectedTime = {
                        hour: nextState.today.getHours(),
                        minutes: nextState.today.getMinutes()
                    }
                }
            }
        }

        if (nextProps.selectedClientData) {
            nextState.selectedClientDetails = nextProps.selectedClientData.selectedClientDetails;
            nextState.selectedAppointmentId = nextProps.selectedClientData.selectedAppointmentId;
        }
    }

    render() {
        return (
            <section className="content-with-menu">
                <div className="content-with-menu-container">
                    <div className="inner-menu-toggle">
                        <a href="#" className="inner-menu-expand" data-open="inner-menu">
                            Меню <i className="fa fa-chevron-right"/>
                        </a>
                    </div>

                    <AppointmentsSidePanel
                        appointments={this.state.appointments}
                        currentDate={this.state.currentDate}
                        selectedClient={this.state.selectedClient}
                        services={this.props.services}
                        masters={this.props.masters}
                        goods={this.props.goods}
                        addingService={this.state.addingService}
                        references_list={this.props.references_list}
                        onClientSelected={this.clientSelected}
                        onClientDeselect={this.clientDeselect}
                        onClientDetailsShow={this.clientDetailsShow}
                        onCurrentDateChange={this.currentDateChange}
                        onAppointmentAdding={this.appointmentAdding}
                        onCategorySelected={this.serviceCategorySelected}
                        onMasterSelected={this.serviceMasterSelected}
                        onTimeSelected={this.serviceTimeSelected}
                        onServiceSelected={this.appointmentServiceSelected}
                        onServiceCancel={this.appointmentServiceCanceled}
                        onProductCancel={this.appointmentProductCanceled}
                        onServiceEdit={this.appointmentServiceEdit}
                        onProductEdit={this.appointmentProductEdit}
                        onAppointmentSave={this.appointmentSaving}
                        onServiceAdding={this.serviceAdding}
                        onGoodsAdding={this.goodsAdding}
                        onCheckVal={this.checkInputValue}
                        errors={this.props.errors}
                        onClearErrors={this.props.onClearErrors}
                        onAppointmentSaveAndPay={this.appointmentSaveAndPay}
                        auth={this.props.token.value}
                        onNotifyShow={this.props.onNotifyShow}
                        LoadSearchesList={this.props.onLoadSearchesList}
                        router={this.props.router}
                    />

                    <div className="inner-body mg-main p-xs">
                        <div className="row">
                            <div className="col-md-6">
                                <h3 className="ml-xl">{this.renderHeaderDate()}</h3>
                            </div>
                            <div className="col-md-6">
                                <a href="#" className="btn btn-primary pull-right mt-md mr-lg" onClick={(e) => {
                                    e.preventDefault();
                                    this.props.router.push('/calendar/schedule');
                                }}>График работы</a>
                            </div>
                        </div>
                        <div className="row">
                            {this.renderCalendarSchedule(this.state.loading)}

                        </div>
                    </div>

                    <Modal
                        id="clientAppointmentModal"
                        customClass="modal-dialog modal-lg"
                        idForm="formAppointment"
                        title="Карточка визита">
                        <AppointmentsDetailsCard
                            data={this.state.selectedClientDetails}
                            appointmentId={this.state.selectedAppointmentId}
                            onConfirmCheck={this.onConfirmCheck}
                            onSaveCheck={this.onSaveCheck}
                            onCancelCheck={this.onCancelCheck}
                            onCloseCheck={this.onCloseCheck}
                            onPrintCheck={this.props.onPrintCheck}
                            html_for_check={this.props.html_for_check}
                            onClearHTMLForCheck={this.props.onClearHTMLForCheck}
                        />
                    </Modal>
                </div>
            </section>
        )
    }


    renderCalendarSchedule = (load) => {
       if (load) {
           return (
               <div className="loader"></div>
           );
       } else {
           return (
               <div className="col-md-12" style={{overflowX: 'auto'}}>
                   <Schedules
                       date={this.state.currentDate}
                       router={this.props.router}
                       scrolled={this.props.scrolled}
                       appointments={this.state.appointments}
                       selectedClient={this.state.selectedClient}
                       highlightSection={this.state.selectedCategory}
                       addingService={this.state.addingService}
                       onClientSelected={this.clientSelected}
                       onClientDetailsShow={this.clientDetailsShow}
                       onServiceTimeSelected={this.clientServiceTimeSelected}
                       onSwitchScrolled={this.props.onSwitchScrolled}
                       onChangeAppointmentService={this.selectedClientChange}
                   />
               </div>
           )
       }
    };

    componentDidMount() {
        const date = new Date();

        this.props.onLoad(FORMAT_DATE(date));
    };

    renderHeaderDate = () => {
        return this.state.currentDate.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // EVENTS
    currentDateChange = (nextDate) => {
        this.setState({
            currentDate: nextDate
        });

        const formattedDate = FORMAT_DATE(this.state.currentDate);

        if (this.state.selectedClient && +this.state.selectedClient.client_id !== 0) {
            this.props.onClientAppointmentsLoad(this.state.selectedClient.client_id, formattedDate);
        }

        this.props.onLoad(FORMAT_DATE(this.state.currentDate));
    };

    clientSelected = (data) => {

        if (data.isNew) {
            this.setState({
                selectedClient: data
            });
            this.props.onAddSelectedClient(data);
        } else {
            this.props.onClientAppointmentsLoad(data.client_id, FORMAT_DATE(this.state.currentDate));
        }
    };

    clientDeselect = () => {
        this.setState({
            addingService: undefined,
            selectedCategory: undefined,
            selectedMaster: undefined,
            selectedTime: undefined
        });

        this.props.onSelectedClientClear();
    };

    checkInputValue = (data) => {
        this.props.onCheck(data);
    };

    clientDetailsShow = (client_id, appointment_id) => {
        this.props.onShowClientDetails(client_id, appointment_id, FORMAT_DATE(this.state.currentDate));
        $('#clientAppointmentModal').modal('show');
    };

    selectedClientChange = (changedService) => {
        let result = this.state.selectedClient.appointments
            .filter((appointment) => (appointment.appointment_id === changedService.appointment_id))[0].services
            .filter((service) => (service.appointment_item_id === changedService.appointment_item_id));

        let date = new Date(result[0].service_time);
        date.setHours(changedService.time.hours);
        date.setMinutes(changedService.time.minutes);


        result[0].trainer_id = +changedService.trainer_id;
        result[0].service_time = date.toString();

        this.setState({
            selectedClient: this.state.selectedClient
        });
    };

    appointmentAdding = () => {
        // this.state.selectedClient.appointments.push({
        //     appointment_id: uuid.v4().replace(/[\-]+/g, ''),
        //     cost: 0,
        //     date_appointment: this.state.currentDate.toISOString(),
        //     services: [],
        //     state: {
        //         state_id: 1,
        //         state_denom: 'NEW'
        //     }
        // });
        //
        // this.setState({
        //     selectedClient: this.state.selectedClient
        // });

        let date = new Date(this.state.currentDate.toISOString());
    };

    serviceCategorySelected = (category_id) => {
        let service = this.state.addingService || {};
        service.category_id = category_id;

        service.trainer_id = this.props.appointments
            .filter((appointment) => appointment.service_category_id === category_id)[0]
            .employees[0]
            .trainer_id;

        this.setState({
            addingService: service
        });
    };

    appointmentServiceSelected = (data) => {
        let service = this.state.addingService;
        service.service = data;

        if (!service.time_service) {
            const time = new Date();
            time.setYear(this.state.currentDate.getYear());
            time.setMonth(this.state.currentDate.getMonth());
            time.setDate(this.state.currentDate.getDate());

            service.time_service = time;
        }

        this.setState({
            addingService: service
        });
    };

    serviceMasterSelected = (trainer_id) => {
        const service = this.state.addingService;
        service.trainer_id = trainer_id;

        this.setState({
            addingService: service
        });
    };

    serviceTimeSelected = (time) => {
        const service = this.state.addingService;
        service.time_service = time;

        this.setState({
            addingService: service
        });
    };

    serviceAdding = (service) => {
        let tmpApp = this.state.selectedClient.appointments.filter((app) => app.temporary);

        if (!tmpApp.length) {
            tmpApp = [{
                appointment_id: uuid.v4().replace(/[\-]+/g, ''),
                appointment_total_cost: 0,
                appointment_date: new Date(this.state.currentDate.toISOString()),
                services: [],
                products: [],
                appointment_state: {
                    state_id: 1,
                    state_denom: 'NEW'
                },
                temporary: true
            }];

            this.state.selectedClient.appointments.push(...tmpApp);
        }

        tmpApp[0].services.map((service) => {
            service.selected_service = false;
        });

        tmpApp[0].services.push(service);


        this.forceUpdate();
    };

    goodsAdding = (good) => {
        let tmpApp = this.state.selectedClient.appointments.filter((app) => app.temporary);

        if (!tmpApp.length) {
            tmpApp = [{
                appointment_id: uuid.v4().replace(/[\-]+/g, ''),
                appointment_total_cost: 0,
                appointment_date: new Date(this.state.currentDate.toISOString()),
                services: [],
                products: [],
                appointment_state: {
                    state_id: 1,
                    state_denom: 'NEW'
                },
                temporary: true
            }];

            this.state.selectedClient.appointments.push(...tmpApp);
        }

        tmpApp[0].products.push(good);

        this.forceUpdate();
    };

    clientServiceTimeSelected = (e) => {
        const selectedTime = new Date(this.state.currentDate.toISOString());
        selectedTime.setHours(e.time.hours);
        selectedTime.setMinutes(e.time.minutes);
        selectedTime.setSeconds(0);

        let tempAppointment = null;

        this.state.selectedClient.appointments.forEach((appointment) => {
            if (appointment.state.temporary) {
                tempAppointment = appointment;
            }
        });

        if (tempAppointment === null) {
            this.state.selectedClient.appointments.push(
                tempAppointment = {
                    appointment_id: uuid.v4().replace(/[\-]+/g, ''),
                    cost: 0,
                    date_appointment: this.state.currentDate.toISOString(),
                    services: [],
                    state: {
                        state_id: 1,
                        state_denom: 'NEW'
                    },
                    temporary: true
                });
        }

        tempAppointment.services.push({
            appointment_item_id: this.state.addingService.service.id,
            time_service: selectedTime,
            service: {
                service_id: this.state.addingService.service.id,
                service_name: this.state.addingService.service.name,
                duration: this.state.addingService.service.duration
            },
            category_id: e.category_id,
            trainer_id: e.trainer_id,
            ...e.master
        });


        this.setState({
            selectedClient: this.state.selectedClient,
            addingService: undefined,
            selectedCategory: undefined,
            selectedMaster: undefined,
            selectedTime: undefined
        });
    };

    appointmentServiceCanceled = (service) => {
        this.state.selectedClient.appointments = this.state.selectedClient.appointments.map((appointment) => {
            appointment.services = appointment.services.filter((serv) => (serv != service));
            return appointment;
        });

        this.setState({
            selectedClient: this.state.selectedClient
        });
    };

    appointmentServiceEdit = (service_old, service_new) => {
        this.state.selectedClient.appointments = this.state.selectedClient.appointments.map((appointment) => {
            appointment.services = appointment.services.map((serv) => {
                    serv.selected_service = false;
                    if (serv === service_old) {
                        service_new.selected_service = true;
                        return service_new;
                    }
                    return serv;
                }
            );
            return appointment;
        });

        this.setState({
            selectedClient: this.state.selectedClient
        });
    };

    appointmentProductEdit = (product_old, product_new) => {
        this.state.selectedClient.appointments = this.state.selectedClient.appointments.map((appointment) => {
            appointment.products = appointment.products.map((prod) => {
                    if (prod === product_old) {
                        return product_new;
                    }
                    return prod;
                }
            );
            return appointment;
        });

        this.setState({
            selectedClient: this.state.selectedClient
        });
    };

    appointmentProductCanceled = (product) => {
        this.state.selectedClient.appointments = this.state.selectedClient.appointments.map((appointment) => {
            appointment.products = appointment.products.filter((serv) => (serv !== product));
            return appointment;
        });

        this.setState({
            selectedClient: this.state.selectedClient
        });
    };

    appointmentSaving = () => {
        let arr = [];
        const items = this.state.selectedClient.appointments
            .filter((appointment) => appointment.appointment_state.state_denom !== 'PAID')
            .forEach((appointment) => {
                    appointment.services.map((service) => {
                        arr.push({
                            good_id: service.service_id,
                            trainer_id: service.trainer_id,
                            time_service: FORMAT_DATE(new Date(service.service_time)) + ' ' + FORMAT_TIME(new Date(service.service_time)),
                        });
                    });
                    appointment.products.map((product) => {
                        arr.push({
                            good_id: product.product_id,
                            trainer_id: product.trainer_id,
                            quantity: product.product_cnt,
                        });
                    })
                }
            );


        this.props.onAppointmentSaving({
            date: FORMAT_DATE(this.state.currentDate),
            client_id: this.state.selectedClient.client_id,
            first_name: this.state.selectedClient.first_name,
            second_name: this.state.selectedClient.second_name,
            last_name: this.state.selectedClient.last_name,
            phone: this.state.selectedClient.phone,
            sex: this.state.selectedClient.sex,
            refer_id: this.state.selectedClient.refer_id ? this.state.selectedClient.refer_id : '',
            appointment_items: [].concat(...arr)
        });
    };

    appointmentSaveAndPay = (client_id) => {
        let arr = [];
        const items = this.state.selectedClient.appointments
            .filter((appointment) => appointment.appointment_state.state_denom !== 'PAID')
            .forEach((appointment) => {
                    appointment.services.map((service) => {
                        arr.push({
                            good_id: service.service_id,
                            trainer_id: service.trainer_id,
                            time_service: FORMAT_DATE(new Date(service.service_time)) + ' ' + FORMAT_TIME(new Date(service.service_time)),
                        });
                    });
                    appointment.products.map((product) => {
                        arr.push({
                            good_id: product.product_id,
                            trainer_id: product.trainer_id,
                            quantity: product.product_cnt,
                        });
                    })
                }
            );

        this.props.onAppointmentSaveAndPay({
            date: FORMAT_DATE(this.state.currentDate),
            client_id: this.state.selectedClient.client_id,
            first_name: this.state.selectedClient.first_name,
            second_name: this.state.selectedClient.second_name,
            last_name: this.state.selectedClient.last_name,
            phone: this.state.selectedClient.phone,
            sex: this.state.selectedClient.sex,
            refer_id: this.state.selectedClient.refer_id ? this.state.selectedClient.refer_id : '',
            appointment_items: [].concat(...arr)
        }, client_id);
    };

    onConfirmCheck = (appointment_id) => {
        $('#clientAppointmentModal').modal('hide');
        this.props.onConfirmCheck(appointment_id, FORMAT_DATE(this.state.currentDate));
        this.props.onHideCheck();
    };

    onSaveCheck = (appointment_id, data) => {
        $('#clientAppointmentModal').modal('hide');
        this.props.onSaveCheck(appointment_id, data, FORMAT_DATE(this.state.currentDate));
        this.props.onHideCheck();
    };

    onCancelCheck = (appointment_id) => {
        $('#clientAppointmentModal').modal('hide');
        this.props.onCancelCheck(appointment_id, FORMAT_DATE(this.state.currentDate));
        this.props.onHideCheck();
    };

    onCloseCheck = () => {
        $('#clientAppointmentModal').modal('hide');
        this.props.onHideCheck();
    }
}

Appointments.propTypes = {
    services: PropTypes.array,
    masters: PropTypes.array,
    goods: PropTypes.array,
    references_list: PropTypes.array,
    selectedClient: PropTypes.object,
    onLoad: PropTypes.func.isRequired,
    onClientAppointmentsLoad: PropTypes.func.isRequired,
    onSelectedClientClear: PropTypes.func.isRequired,
    onAppointmentSaving: PropTypes.func.isRequired,
    onCheck: PropTypes.func.isRequired,
    onClearErrors: PropTypes.func,
    onSwitchScrolled: PropTypes.func.isRequired,
    onLoadSearchesList: PropTypes.func.isRequired,
};

export default Appointments;