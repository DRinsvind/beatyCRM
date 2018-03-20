import React, {Component} from 'react';
import PropTypes from 'prop-types';
import picture from '../../../public/assets/images/dummy/client.jpg';
import {API_HOST} from '../../constants';
import ClientsTabEdit from './ClientsTabEdit'
import ClientsTabCalls from './ClientsTabCalls'
import ClientsTabServices from './ClientsTabServices'
import ClientsTabQuestionary from './ClientsTabQuestionary'
import {FORMAT_DATE_WITH_POINTS, FORMAT_PHONE_NUMBER} from '../../utils';
import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;

class ClientsEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            client: this.mapToData(props),
            loaded: false,
            image: {
                name: '',
                file: '',
                data: '',
                imagePreviewUrl: picture
            },
            last_appointment: '',
            server_response: props.server_response,
            questions_groups: props.questions_groups,
            errors: props.errors,
            loading: props.loading
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.client !== nextProps.client) {
            nextState.client = this.mapToData(nextProps);
            nextState.tags = this.mapToDataTags(nextProps.client);
            nextState.statuses = this.mapToDataStatus(nextState.client.last_call_status)
        }

        if (this.props !== nextProps) {
            nextState.errors = nextProps.errors;
            nextState.image.imagePreviewUrl = this.mapToDataImage(nextProps);
            nextState.last_appointment = this.mapToDataLastAppointment(nextProps);
            nextState.loaded = true;
        }

        if (nextProps.loading !== this.props.loading) {
            nextState.loading = nextProps.loading;
        }
    }

    componentDidUpdate() {
        (($) => {
            $('[data-plugin-masked-input]').each((i, input) => {
                const inp = $(input);
                inp.mask(inp.attr('data-input-mask'));
            });
        })(window.$);

        let path = this.props.router.location.pathname;

        if (path.match(/profile/i) !== null) {
            window.$('#profile_tab').addClass('active');
            window.$('#profile').addClass('active');
            window.$('#edit_tab').removeClass('active');
            window.$('#edit').removeClass('active');
            window.$('#clientsServicesInf').removeClass('hide');
            window.$('#button-photo').removeClass('show');
            window.$('#button-photo').addClass('hide');
            window.$('#questionary').removeClass('active');
            window.$('#questionary_tab').removeClass('active');
        } else if (path.match(/edit/i) !== null) {
            window.$('#profile_tab').removeClass('active');
            window.$('#profile').removeClass('active');
            window.$('#edit_tab').addClass('active');
            window.$('#edit').addClass('active');
            window.$('#clientsServicesInf').addClass('hide');
            window.$('#button-photo').addClass('show');
            window.$('#button-photo').removeClass('hide');
            window.$('#questionary').removeClass('active');
            window.$('#questionary_tab').removeClass('active');
        } else if (path.match(/questionary/i) !== null) {
            window.$('#edit_tab').removeClass('active');
            window.$('#edit').removeClass('active');
            window.$('#button-photo').removeClass('show');
            window.$('#button-photo').addClass('hide');
            window.$('#questionary').addClass('active');
            window.$('#questionary_tab').addClass('active');
        }
    }

    render() {
        let {imagePreviewUrl} = this.state.image;
        let $imagePreview = null;

        if (imagePreviewUrl) {
            $imagePreview = (<img className="img-responsive" src={imagePreviewUrl} alt="Фото клиента"/>);
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-3 col-lg-3">
                        <section className="panel">
                            <div className="panel-body">
                                <div className="img-rounded employee-image" style={{width: '100%'}}>
                                    {$imagePreview}
                                </div>
                                <label id="button-photo" className="btn btn-primary mr-xs mb-sm mt-lg hide"
                                       style={{width: '60%'}}>
                                    <i className="fa fa-plus"></i> Фото
                                    <input
                                        type="file"
                                        onChange={this.handleImageChange}
                                        style={{display: 'none'}}
                                    />
                                </label>
                                <h4 style={{
                                    color: '#21262d',
                                    lineHeight: '25px',
                                    fontWeight: '600'
                                }}>{this.state.client.last_name} {this.state.client.first_name} {this.state.client.second_name}</h4>
                                <span style={{fontSize: '1em', fontWeight: '300', color: '#21262d'}}
                                      className={"label mr-xs label-client-" + this.state.client.category_id}>
                                {this.state.client.category_name}
                            </span>
                                <hr className="dotted short"/>
                                <div>
                                    {this.state.tags}
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="col-md-9 col-lg-9">
                        <div className="tabs">
                            <ul className="nav nav-tabs tabs-primary">
                                <li id="profile_tab">
                                    <a href="#profile" data-toggle="tab" onClick={this.onClickProfile}>Профайл</a>
                                </li>
                                <li id="edit_tab">
                                    <a href="#edit" data-toggle="tab" onClick={this.onClickEdit}>Редактировать</a>
                                </li>
                                <li id="questionary_tab">
                                    <a href="#questionary" data-toggle="tab" onClick={this.onClickQuestionary}>Анкета
                                        клиента</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div id="profile" className="tab-pane">
                                    <div className="row">
                                        <div className="col-md-6">
                                            {this.renderProfileElements(this.state.client.sex === '' ? 'hide' : 'row mb-md',
                                                this.state.client.sex === 'M' ? "fa fa-male" : "fa fa-female",
                                                this.state.client.sex === 'M' ? "Мужской" : "Женский")}

                                            {this.renderProfileElements(this.state.client.date_birth ? 'row mb-md' : 'hide', "fa fa-birthday-cake",
                                                this.state.client.date_birth ? FORMAT_DATE_WITH_POINTS(this.state.client.date_birth) : '')}

                                            {this.renderProfileElements(this.mapToDataPhonesProfile(this.state.client.contacts).length > 0 ? 'row mb-sm' : 'hide',
                                                "fa fa-phone", this.mapToDataPhonesProfile(this.state.client.contacts))}

                                            {this.renderProfileElements(this.mapToDataEmailsProfile(this.state.client.contacts).length > 0 ? 'row mb-md' : 'hide',
                                                "fa fa-envelope", this.mapToDataEmailsProfile(this.state.client.contacts))}

                                            <h5 className={this.state.client.last_call ? "row" : "hide"}>
                                                <div className="col-md-1 pr-sm">
                                                    <i className="fa fa-fw fa-volume-control-phone"/>
                                                </div>
                                                <div className="col-md-10 pl-sm">
                                                    <span>{FORMAT_DATE_WITH_POINTS(this.state.client.last_call)}</span>
                                                    <span
                                                        className={"ml-sm label label_status_" + this.state.client.last_call_status.tag_id}>{this.state.client.last_call_status.tag_name}
                                                    </span>
                                                </div>
                                            </h5>


                                            {this.renderProfileElements("row mt-md", "fa fa-fw fa-money",
                                                this.state.client.total_income ? 'Сумма оплат: ' + parseFloat(this.state.client.total_income).toFixed(2) : 0)}

                                            {this.renderProfileElements("row mt-md", "fa fa-fw fa-globe",
                                                'Источник обращения: ' + (this.state.client.refer ? (this.state.client.refer.refer_name) : 'не указан'))}
                                        </div>
                                        <div className="col-md-6">
                                            <h5>
                                                <div className="col-md-1">
                                                    <i className="fa fa-area-chart"/>
                                                </div>
                                                <div className="col-md-10">
                                                    <span>Последнее посещение:</span>
                                                    {this.state.last_appointment}
                                                    {/*<a href="#" className="btn btn-primary mt-lg" onClick={(e) => {*/}
                                                    {/*e.preventDefault();*/}
                                                    {/*this.props.router.push('/calendar/');*/}
                                                    {/*}}*/}
                                                    {/*style={{width: '70%'}}>*/}
                                                    {/*<i className="fa fa-fw fa-calendar mr-xs"></i>*/}
                                                    {/*Календарь*/}
                                                    {/*</a>*/}
                                                </div>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <ClientsTabEdit client={this.state.client}
                                                server_response={this.state.server_response}
                                                client_id={this.props.params.client_id}
                                                photo={this.state.image}
                                                router={this.props.router}
                                                tags={this.props.tags_list}
                                                errors_messages={this.props.errors}
                                                onEditClient={this.onEditClient}
                                                onNotifyShow={this.props.onNotifyShow}
                                                onCheckInput={this.onCheck}/>

                                <ClientsTabQuestionary client={this.state.client}
                                                       server_response={this.state.server_response}
                                                       client_id={this.props.params.client_id}
                                                       photo={this.state.image}
                                                       router={this.props.router}
                                                       questions_groups={this.props.questions_groups}
                                                       onEditQuestionary={this.onEditQuestionary}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" id="clientsServicesInf">
                    <div className="col-md-12 col-lg-12">
                        <div className="tabs">
                            <ul className="nav nav-tabs tabs-primary">
                                <li id="services_tab" className="active">
                                    <a href="#services" data-toggle="tab">Посещения клиента</a>
                                </li>
                                <li id="statistics_tab">
                                    <a href="#statistics" data-toggle="tab">История звонков</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div id="services" className="tab-pane active">
                                    <ClientsTabServices
                                        client={this.state.client}
                                        loading={this.state.loading}
                                    />
                                    <div className="row">
                                        <label className="pull-right mt-md mr-md" style={{fontWeight: 'bold', fontSize: '16px'}}>
                                            {'Сумма оплат: ' + parseFloat(this.state.client.total_income).toFixed(2) + ' грн'}
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="pull-right mt-md mr-md" style={{fontWeight: 'bold', fontSize: '16px'}}>
                                            {'Сумма задолженности: ' + parseFloat(this.state.client.client_debt).toFixed(2) + ' грн'}
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="pull-right mt-md mr-md" style={{fontWeight: 'bold', fontSize: '16px'}}>
                                            {'Общая сумма: ' + parseFloat(this.state.client.total_cost).toFixed(2) + ' грн'}
                                        </label>
                                    </div>
                                </div>
                                <div id="statistics" className="tab-pane">
                                    <ClientsTabCalls
                                        calls={this.state.client.call_history}
                                        loading={this.state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentWillMount() {
        this.props.onLoad(this.props.params.client_id);
    }

    componentDidMount() {
        $(window).scrollTop(0);
    }

    renderProfileElements = (hclass, iclass, spancont) => {
        return (
            <h5 className={hclass}>
                <div className="col-md-1 pr-sm">
                    <i className={iclass}/>
                </div>
                <div className="col-md-10 pl-sm">
                    <span>{spancont}</span>
                </div>
            </h5>
        );
    };

    mapToDataTags = (client) => {
        return client.tags.map((tag, idx) => {
            return <label key={idx} className="label label-primary tag-label mr-xs">{tag.tag_name}</label>
        })
    };

    mapToDataStatus = (status) => {
        return <label className={"label mr-sm ml-sm label_status_" + status.tag_id}
                      style={{display: 'block', width: '100%'}}>{status.tag_name}</label>
    };

    mapToData = (props) => {
        return (
            props.client ? {
                    client_id: props.client_id || null,
                    first_name: props.client.first_name || '',
                    last_name: props.client.last_name || '',
                    second_name: props.client.second_name || '',
                    deposit_sum: parseFloat(props.client.deposit_sum || .0).toFixed(2),
                    note: props.client.note || '',
                    photo: props.client.photo ?
                        API_HOST + props.client.photo : '',
                    send_sms: !!props.client.do_not_send_sms || false,
                    send_email: !!props.client.do_not_send_email || false,
                    date_birth: props.client.date_birth || "",
                    sex: props.client.sex || '',
                    contacts: props.client.contacts || [],
                    category_id: props.client.category ? props.client.category.category_id : 0 || 0,
                    category_name: props.client.category ? props.client.category.category_name : '' || '',
                    last_appointment: props.client.last_appointment || {},
                    appointment_history: props.client.appointment_history || [],
                    tags: props.client.tags || [],
                    last_call: props.client.last_call || '',
                    call_history: props.client.call_history || [],
                    total_income: props.client.total_income || 0,
                    total_cost: props.client.total_cost || 0,
                    client_debt: props.client.client_debt || 0,
                    refer: props.client.refer || undefined,
                    last_call_status: props.client.last_call_status ? props.client.last_call_status : [],
                } : {
                    client_id: null,
                    first_name: '',
                    last_name: '',
                    second_name: '',
                    deposit_sum: 0.00,
                    note: '',
                    send_sms: false,
                    send_email: false,
                    date_birth: "",
                    sex: '',
                    photo: null,
                    contacts: [],
                    category_id: 0,
                    category_name: '',
                    last_appointment: {},
                    appointment_history: [],
                    tags: [],
                    last_call: '',
                    call_history: [],
                    total_income: 0,
                    total_cost: 0,
                    client_debt: 0,
                    refer: undefined,
                    last_call_status: [],
                }
        );
    };

    mapToDataLastAppointment = (props) => {
        if (props.client.last_appointment.appointment_date) {
            return (
                <div className="mt-md">
                    <h5 style={{color: '#21262d'}}>{FORMAT_DATE_WITH_POINTS(props.client.last_appointment.appointment_date)}</h5>
                    <h5 style={{fontWeight: '200'}}>{props.client.last_appointment.appointment_salon}</h5>
                    {props.client.last_appointment.services.map((service, idx) => {
                        return <div key={idx}>
                            <hr className="dotted short"/>
                            <h5>{service.service_name}</h5>
                            <div><i className="fa fa-fw fa-user-circle-o"/>
                                <a
                                    href={"/employees/profile/" + service.master_id}
                                    style={{color: "#0088cc"}}>{service.trainer_name}</a></div>
                        </div>
                    })}

                    {props.client.last_appointment.products.map((product, idx) => {
                        return <div key={idx}>
                            <hr className="dotted short"/>
                            <h5>{product.product_name}</h5>
                            <div><i className="fa fa-fw fa-user-circle-o"/>
                                <a
                                    href={"/employees/profile/" + product.master_id}
                                    style={{color: "#0088cc"}}>{product.trainer_name}</a></div>
                        </div>
                    })}
                </div>
            )
        } else {
            return (
                <div className="mt-md"/>
            )
        }
    };

    mapToDataImage = (props) => {
        return (props.client ?
            (props.client.photo !== null ?
                API_HOST + props.client.photo
                : picture)
            : picture)
    };

    mapToDataPhonesProfile = (contacts) => {
        return contacts.filter((contact) => contact.contact_type === 'MOBILE_PHONE')
            .map((contact, idx) => {
                return (
                    <div className="mb-xs" key={idx}>
                        <span style={{color: "#0088cc"}}>{FORMAT_PHONE_NUMBER(contact.contact)}</span>
                    </div>
                );
            });
    };

    mapToDataEmailsProfile = (contacts) => {
        return contacts.filter((contact) => contact.contact_type === 'EMAIL')
            .map((contact, idx) => {
                return (
                    <div className="mb-xs" key={idx}>
                        <span style={{color: "#0088cc"}}>{contact.contact}</span>
                    </div>
                )
            });
    };

    onEditQuestionary = (data, client_id) => {
        this.props.onQuestionaryEdit(data, client_id, this.props.router);
    };

    onEditClient = (data, client_id) => {
        this.props.onEdit(data, client_id, this.props.router);
    };

    onCheck = (data) => {
        this.props.onCheckInputValue(data);
    };

    onClickProfile = () => {
        this.props.router.push('/clients/profile/' + this.props.params.client_id);
    };

    onClickEdit = () => {
        this.props.router.push('/clients/edit/' + this.props.params.client_id);
    };

    onClickQuestionary = () => {
        this.props.router.push('/clients/questionary/' + this.props.params.client_id);
    };

    handleImageChange = (e) => {
        e.preventDefault();

        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({
                image: {
                    name: file.name,
                    data: reader.result.replace('data:;base64,', ''),
                    imagePreviewUrl: reader.result
                }
            });
        };
        reader.readAsDataURL(new Blob([file]));
    };

}

ClientsEdit.propTypes = {
    client: PropTypes.object.isRequired,
    server_response: PropTypes.object,
    questions_groups: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onQuestionaryEdit: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCheckInputValue: PropTypes.func.isRequired
};

export default ClientsEdit;