import React, {Component} from 'react';
import PropTypes from 'prop-types';
// COMMONS
import DatePicker from '../commons/DatePicker';
// COMPONENTS
import AppointmentsClientSearch from './AppointmentsClientSearch';
import AppointmentsClientCard from './AppointmentsClientCard';
import AppointmentsClientServices from './AppointmentsClientServices';


const $ = window.jQuery;


/**
 * Appointments side panel component.
 */
class AppointmentsSidePanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flagServices: false,
            showCalendar: true,
            showSearch: true,
            addingClient: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.selectedClient || nextState.addingClient) {
            nextState.showCalendar = false;
        } else {
            nextState.showCalendar = true;
        }
    }

    render() {
        return (
            <menu id="content-menu" className="inner-menu" role="menu" style={{border: 'none'}}>
                <div className="nano">
                    <div className="nano-content p-none">
                        <div className="inner-menu-content">
                            <div className="sidebar-widget" style={{margin: '20px 35px'}}>
                                <div className="widget-header">
                                    <h6 className="title">
                                        КАЛЕНДАРЬ
                                        <a href="#" className="pull-right"
                                           style={{color: '#465162', fontSize: '0.8em'}}
                                           onClick={(e) => {
                                               e.preventDefault();
                                               $('#smallCalendar').stop().slideToggle(() => {
                                                   this.setState({
                                                       showCalendar: !this.state.showCalendar
                                                   });
                                               })
                                           }}>
                                            <i className={'fa fa-fw fa-chevron-' + (this.state.showCalendar ? 'up' : 'down')} />
                                        </a>
                                    </h6>
                                </div>
                                <div id="smallCalendar"
                                     className="widget-content"
                                     style={{display: this.state.showCalendar ? 'block' : 'none'}}>
                                    <DatePicker
                                        date={this.props.currentDate}
                                        onDateChanged={this.props.onCurrentDateChange}
                                    />
                                    {/*<a href="#" className="btn btn-primary" onClick={(e) => {*/}
                                        {/*e.preventDefault();*/}
                                        {/*this.props.router.push('/calendar/schedule');*/}
                                    {/*}}>График работы</a>*/}
                                </div>
                            </div>

                            <AppointmentsClientSearch
                                style={{display: this.props.selectedClient ? 'none' : 'block'}}
                                onClientSelected={this.clientSelected}
                                onCheck={this.props.onCheckVal}
                                errors_messages={this.props.errors}
                                onClearErrors={this.props.onClearErrors}
                                auth={this.props.auth}
                                onAddingClient={this.onAddingClient}
                                onNotifyShow={this.props.onNotifyShow}
                                references_list={this.props.references_list}
                            />

                            <AppointmentsClientCard
                                data={this.props.selectedClient}
                                onCancel={this.props.onClientDeselect}
                                onDetails={this.props.onClientDetailsShow}
                            />

                            <AppointmentsClientServices
                                appointments={this.props.appointments}
                                data={this.props.selectedClient}
                                addingService={this.props.addingService}
                                currentDate={this.props.currentDate}
                                services={this.props.services}
                                masters={this.props.masters}
                                goods={this.props.goods}
                                onAppointmentAdding={this.props.onAppointmentAdding}
                                onCategorySelected={this.props.onCategorySelected}
                                onMasterSelected={this.props.onMasterSelected}
                                onServiceSelected={this.props.onServiceSelected}
                                onServiceAdding={this.props.onServiceAdding}
                                onGoodsAdding={this.props.onGoodsAdding}
                                onTimeSelected={this.props.onTimeSelected}
                                onServiceCancel={this.props.onServiceCancel}
                                onProductCancel={this.props.onProductCancel}
                                onServiceEdit={this.props.onServiceEdit}
                                onProductEdit={this.props.onProductEdit}
                                onAppointmentSave={this.props.onAppointmentSave}
                                onClientDetailsShow={this.props.onClientDetailsShow}
                                onAppointmentSaveAndPay={this.props.onAppointmentSaveAndPay}
                            />

                            <div className="panel"
                                 style={{display: this.props.selectedClient ? this.props.selectedClient.appointments.length > 0 ? 'block' : 'none' : 'none'}}>
                                <div className="panel-body"
                                     style={{width: '100%', background: '#ECEDF0', borderRadius: '0px'}}>
                                    {/*<div className="row">*/}
                                    {/*<div className="col-md-12 text-right">*/}
                                    {/*<button className="btn btn-sm btn-primary"*/}
                                    {/*onClick={(e) => {*/}
                                    {/*e.preventDefault();*/}
                                    {/*this.props.onAppointmentSave();*/}
                                    {/*}}>*/}
                                    {/*<i className="fa fa-fw fa-save"></i>&nbsp;Сохранить визит*/}
                                    {/*</button>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </menu>
        );
    }

    // EVENTS
    clientSelected = (data) => {
        this.setState({
            showSearch: false,
            showCalendar: false,
        });

        this.props.onClientSelected(data);
    };

    onAddingClient = (flag) => {
        this.setState({
            addingClient: flag,
        });
        this.props.LoadSearchesList();
    }
}

AppointmentsSidePanel.propTypes = {
    currentDate: PropTypes.object.isRequired,
    selectedClient: PropTypes.object,
    services: PropTypes.array,
    masters: PropTypes.array,
    goods: PropTypes.array,
    references_list: PropTypes.array,
    onClientSelected: PropTypes.func.isRequired,
    onClientDeselect: PropTypes.func.isRequired,
    onClientDetailsShow: PropTypes.func.isRequired,
    onCurrentDateChange: PropTypes.func.isRequired,
    onAppointmentAdding: PropTypes.func.isRequired,
    onCategorySelected: PropTypes.func.isRequired,
    onServiceSelected: PropTypes.func.isRequired,
    onAppointmentSave: PropTypes.func.isRequired,
    onServiceAdding: PropTypes.func.isRequired,
    onGoodsAdding: PropTypes.func.isRequired,
    onServiceEdit: PropTypes.func.isRequired,
    onClearErrors: PropTypes.func
};

export default AppointmentsSidePanel;
