import React, {Component} from 'react';
import Select2 from 'react-select2-wrapper';
import deepAssign from 'deep-assign';
import PropTypes from 'prop-types';
import GeneralInfoBlock from '../commons/inputsForms/GeneralInfoBlock';
import ContactInput from '../commons/inputsForms/ContactInput';
import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;
import {
FORMAT_DATE
} from '../../utils';

export default class ClientsTabEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            client: deepAssign({}, props.client),
            init_client: deepAssign({}, props.client),
            photo: props.photo,
            contacts: props.client.contacts,
            server_response: props.server_response,
            clients_tags: [],
            tags: [],
            errors: {},
            phones: [],
            emails: [],
            loaded: false,
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.server_response = nextProps.server_response;
            nextState.photo = nextProps.photo;
            nextState.loaded = true;

            if (nextProps.client !== this.props.client) {
                nextState.client = deepAssign({}, nextProps.client);
                nextState.init_client = deepAssign({}, nextProps.client);
                nextState.contacts = deepAssign([], nextProps.client.contacts);
                // nextState.clients_tags = this.dataForTagsSelect(nextProps.tags, nextProps.client);
                nextState.tags = this.mapToDataTags(deepAssign({}, nextProps.client));
            }

            if (nextProps.client !== this.props.client && this.state.tags !== nextProps.client.tags) {
                nextState.clients_tags = this.dataForTagsSelect(nextProps.tags, nextProps.client);
            }
        }

        if (this.state.contacts !== nextProps.client.contacts) {
            nextState.phones = this.mapToDataPhones(this.state.contacts);
            nextState.emails = this.mapToDataEmails(this.state.contacts);
        }

        if (this.props.errors_messages !== nextProps.errors_messages) {
            if (nextProps.errors_messages.status === 'error') {
                nextState.errors[nextProps.errors_messages.message.field + nextProps.errors_messages.message.index] = {
                    message: nextProps.errors_messages.message.error
                };
            }
            if (nextProps.errors_messages.status === 'success') {
                delete nextState.errors[nextProps.errors_messages.message + nextProps.errors_messages.index];
            }
        }
    }

    componentDidUpdate() {
        $('.tags_select').select2({
            width: '100%',
            multiple: true,
            tags: true,
            options: {
                placeholder: 'Выберите теги',
                theme: 'bootstrap',
            },
            data: this.state.clients_tags,
        }).off('select2:select').on('select2:select', this.tagChanged)
            .off('select2:unselect').on('select2:unselect', this.delTag);
    };

    render() {
        return (
            <div id="edit" className="tab-pane">
                <form className="form-horizontal">
                    <h4 className="mb-xlg">Персональная информация</h4>
                    <GeneralInfoBlock
                        person={this.state.client}
                        errors={this.state.errors}
                        inputChanged={this.inputChanged}
                        onFocusLos={this.onFocusLos}
                        changeBirthday={this.onBirthdayChange}
                        radioChanged={this.radioChanged}
                        clearBirthDay={this.clearBirthDay}
                    />
                    <hr className="dotted tall"/>
                    <fieldset className="mb-lg">
                        <div className="form-group">
                            <label className="col-md-3 control-label">Комментарий</label>
                            <div className="col-md-7">
                                <textarea
                                    name="note"
                                    className="form-control"
                                    value={this.state.client.note}
                                    onChange={this.inputChanged}
                                    rows="3" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="form-group">
                            <label className="col-md-3 control-label">Заметки</label>
                            <div className="col-md-7">
                                <div className="input-group">
															<span className="input-group-addon">
																<i className="fa fa-fw fa-tags" />
															</span>
                                    <select className="form-control tags_select" />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <hr className="dotted tall"/>
                    <h4 className="mb-xlg">Контакты</h4>
                    <fieldset className="mb-xl">
                        {this.state.phones}
                        {this.contactsButtonAdd(this.onPhoneAddClick, 'Телефон')}
                        {this.state.emails}
                        {this.contactsButtonAdd(this.onEmailAddClick, 'Email')}
                    </fieldset>

                    <div className="panel-footer">
                        <div className="row">
                            <div className="col-md-12 text-right">
                                <button type="button" className="btn btn-primary mr-sm" onClick={this.onSave}>
                                    <i className="fa fa-fw fa-save"></i>
                                    Сохранить
                                </button>
                                <button type="reset" className="btn btn-default" onClick={this.onCancel}>
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    mapToDataPhones = (contacts) => {
        return (
            <ContactInput
                errors={this.state.errors}
                contacts={contacts}
                contact_type="MOBILE_PHONE"
                text="+380 (67) 123-12-34"
                label="Телефон"
                mask="+38 (099) 999-99-99"
                iclass="fa fa-fw fa-phone"
                id='phone_number'
                client={true}
                contactChanged={this.contactChanged}
                onFocusLoss={this.onPhoneFocusLos}
                onContactTrashClick={this.onContactTrashClick}
            />
        );
    };

    mapToDataEmails = (contacts) => {
        return (
            <ContactInput
                errors={this.state.errors}
                contacts={contacts}
                contact_type="EMAIL"
                text="email@com.ua"
                label="Email"
                mask=""
                iclass="fa fa-fw fa-envelope"
                id='email'
                contactChanged={this.contactChanged}
                onFocusLoss={this.onEmailFocusLos}
                onContactTrashClick={this.onContactTrashClick}
            />
        );
    };

    contactsButtonAdd = (func, name) => {
        return (
            <div className="form-group">
                <div className="col-md-3" />
                <div className="col-md-9">
                    <button className="btn btn-primary" style={{width: '30%'}}
                            onClick={func}>
                        <i className="fa fa-fw fa-plus" /> {name}
                    </button>
                </div>
            </div>
        );
    };

    dataForTagsSelect = (tags, client) => {
        let data = [];

        tags.filter((tag) => {
            let found = true;
            client.tags.forEach((t) => {
                if (tag.tag_id === t.tag_id) {
                    found = false;
                    data.push({
                        id: tag.tag_id,
                        text: tag.tag_name,
                        selected: true
                    });
                }
            });

            if (found) {
                data.push({
                    id: tag.tag_id,
                    text: tag.tag_name
                })
            }
        });

        return data;
    };

    mapToDataTags = (client) => {
        let tags = [];
        if (client) {
            client.tags.forEach((tag) => {
                tags.push(tag.tag_id);
            });
        }
        return tags;
    };

    // EVENTS

    tagChanged = (e) => {
        let tags = this.state.tags;

        if (e.params.originalEvent) {
            tags.push(+e.params.data.id);
        } else {
            tags.push(e.params.data.id);
        }

        this.setState({tags: tags});
    };

    delTag = (e) => {
        e.preventDefault();
        let tags = this.state.tags;
        tags = tags.filter((tag) => {
            let found = true;
            if (tag.toString() === e.params.data.id) {
                found = false;
            }
            return found;
        });
        this.setState({tags: tags});
    };

    onFocusLos = (e) => {
        let data = {
            name: e.target.name,
            value: e.target.name === 'date_birth' ? e.target.value.replace(/\//g, '-') : e.target.value,
            index: e.target.id ? e.target.id : ''
        };

        this.props.onCheckInput(data);
    };

    onPhoneFocusLos = (e) => {
        let phone = e.target.value.replace(/[\+\(\)\-" "]/g, '');
        if (phone !== '') {
            let data = {
                name: 'phone_edit',
                value: phone,
                id: this.state.client.client_id,
                index: e.target.id ? e.target.id : ''
            };

            this.props.onCheckInput(data);
        }
    };

    onEmailFocusLos = (e) => {
        if (e.target.value !== '') {
            let data = {
                name: 'email',
                value: e.target.value,
                id: this.state.client.client_id,
                index: e.target.id ? e.target.id : ''
            };

            this.props.onCheckInput(data);
        }
    };

    onBirthdayChange = (e) => {
        let obj = this.state.client;
        obj.date_birth = FORMAT_DATE(e.date);
        this.setState({
            client: obj,
        });
    };

    clearBirthDay = () => {
        let obj = this.state.client;
        obj.date_birth = '';
        this.setState({
            client: obj,
        });
    };

    onSave = (e) => {
        e.preventDefault();

        let err = this.state.errors;

        if (this.state.client.first_name === '') {
            err['first_name'] = {message: 'Укажите имя'};
        }

        if (this.state.client.last_name === '') {
            err['last_name'] = {message: 'Укажите фамилию'};
        }

        let phones = [];
        let emails = [];

        this.state.contacts.forEach((contact) => {
            if (contact.contact_type === 'MOBILE_PHONE') {
                phones.push(contact);
            }

            if (contact.contact_type === 'EMAIL') {
                emails.push(contact);
            }

        });

        phones.forEach((phone, i) => {
            if (phone.contact === '') {
                err['phone_number' + i] = {message: 'Укажите номер телефона'};
            }
        });

        emails.forEach((email, i) => {
            if (email.contact === '') {
                err['email' + i] = {message: 'Укажите адрес электронной почты'};
            }
        });

        this.setState({
            errors: err,
        });

        if (Object.keys(this.state.errors).length > 0) {
            const error = {
                title: 'ОШИБКА',
                text: 'Ошибки при заполнении формы',
                type: 'error'
            };
            this.props.onNotifyShow(error);
        } else {
            let temp = this.state.contacts.map((contact) => {
                if (contact.contact_type === "MOBILE_PHONE") {
                    let phone = contact.contact.replace(/[\+\(\)\-" "]/g, '');
                    return {"contact": phone, "contact_type": contact.contact_type};
                }
                return {"contact": contact.contact, "contact_type": contact.contact_type}
            });

            let data = {
                "first_name": this.state.client.first_name,
                "second_name": this.state.client.second_name,
                "last_name": this.state.client.last_name,
                "date_birth": this.state.client.date_birth,
                "sex": this.state.client.sex,
                "tags": this.state.tags,
                "note": this.state.client.note,
                "contacts": temp,
                "photo": this.state.photo,
            };

            this.props.onEditClient(data, +this.props.client_id);
        }

    };

    checkForErrors = (name) => {
        let err = this.state.errors;
        err[name] ? delete err[name] : '';
        this.setState({errors: err});
    };

    inputChanged = (e) => {
        this.checkForErrors(e.target.name);

        let state = {
            client: this.state.client,
        };

        state.client[e.target.name] = e.target.value;
        this.setState(state);
    };

    radioChanged = (e) => {
        let temp = this.state.client;
        temp[e.target.name] = e.target.value;
        this.setState({client: temp});
    };

    contactChanged = (e) => {
        this.checkForErrors(e.target.name + e.target.id);
        let state = this.state.contacts;
        state[+e.target.name].contact = e.target.value.replace(/[\+\(\)\-" "]/g, '');

        this.setState({contacts: state});
    };

    onContactTrashClick = (e) => {
        e.preventDefault();

        this.checkForErrors(e.target.id);
        let state = this.state.contacts;

        state.splice(+e.target.parentNode.name, 1);
        this.setState({contacts: state});
    };

    onPhoneAddClick = (e) => {
        e.preventDefault();

        let state = this.state.contacts;

        state.push({
            "contact_type": "MOBILE_PHONE",
            "contact": ''
        });

        this.setState({contacts: state});
    };

    onEmailAddClick = (e) => {
        e.preventDefault();

        let state = this.state.contacts;

        state.push({
            "contact_type": "EMAIL",
            "contact": ''
        });

        this.setState(state);
    };

    onCancel = () => {
        this.setState({
            client: this.state.init_client,
            contacts: deepAssign([], this.state.init_client.contacts),
            tags: this.mapToDataTags(deepAssign({}, this.state.init_client))
        });
        this.props.router.goBack();
    };
}

ClientsTabEdit.propTypes = {
    client: PropTypes.object.isRequired,
    server_response: PropTypes.object,
    client_id: PropTypes.string.isRequired,
    photo: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    tags: PropTypes.array.isRequired,
    errors_messages: PropTypes.object.isRequired,
    onEditClient: PropTypes.func.isRequired,
    onCheckInput: PropTypes.func.isRequired
};
