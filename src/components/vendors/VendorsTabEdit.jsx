import React, {Component} from 'react';
import peson from '../../../public/assets/images/dummy/client.jpg';
import InputElement from 'react-input-mask';

import API_URL from '../../constants';

export default class VendorsTabEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vendor: this.mapToData(props.vendor),
            photo: {
                name: '',
                file: '',
                data: '',
                personImagePreviewUrl: peson
            },
            image: props.photo,
            loaded: false,
            errors: props.errors,
            vendor_id: null,
            person_id: null
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.loaded = true;
            nextState.image = nextProps.photo;
            nextState.photo.personImagePreviewUrl = this.mapToDataImage(nextProps);
        }

        if (this.props.vendor !== nextProps.vendor) {
            nextState.vendor = this.mapToData(nextProps);
        }

        if (this.props.errors !== nextProps.errors) {
            nextState.errors = nextProps.errors;
        }

        if (this.props.image !== nextProps.image) {
            if (nextProps.type === 'vendor') {
                nextState.vendor_id = nextProps.image;
            } else {
                nextState.person_id = nextProps.image;
            }
        }
    }

    render() {
        let {personImagePreviewUrl} = this.state.photo;
        let $personImagePreviewUrl = null;

        if (personImagePreviewUrl) {
            $personImagePreviewUrl = (
                <img className="img-responsive" src={personImagePreviewUrl} alt="Фото контактного лица"/>);
        }

        return (
            <div id="edit" className="tab-pane">
                <form className="form-horizontal">
                    <div className="mb-xlg text-weight-bold">Поставщик</div>
                    <fieldset>
                        <div className={"form-group fs-12" + (this.state.errors['short_name'] ? ' has-error' : '')}>
                            <label className="col-md-2 control-label">Название</label>
                            <div className="col-md-9" style={{textAlign: 'right'}}>
                                <input type="text"
                                       className="form-control fs-12"
                                       name="short_name"
                                       value={this.state.vendor.short_name}
                                       onChange={this.onInputChanged}
                                       onBlur={this.onFocusLos}
                                />
                                <label
                                    className={this.state.errors['short_name'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['short_name'] ? this.state.errors['short_name'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <div className={"form-group fs-12" + (this.state.errors['note'] ? ' has-error' : '')}>
                            <label className="col-md-2 control-label">Заметки</label>
                            <div className="col-md-9" style={{textAlign: 'right'}}>
                                                <textarea
                                                    className="form-control fs-12"
                                                    name="note"
                                                    rows="3"
                                                    value={this.state.vendor.note}
                                                    onChange={this.onInputChanged}
                                                    onBlur={this.onFocusLos}
                                                />
                                <label
                                    className={this.state.errors['note'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['note'] ? this.state.errors['note'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <hr/>
                        <div className="mb-xlg text-weight-bold">Контакты</div>
                        <div className={"form-group fs-12" + (this.state.errors['address'] ? ' has-error' : '')}>
                            <label className="col-md-3 control-label">Адрес</label>
                            <div className="col-md-7" style={{textAlign: 'right'}}>
                                <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-fw fa-map-marker" />
                                </span>
                                    <InputElement
                                        className="form-control fs-12"
                                        placeholder="Адрес"
                                        name="address"
                                        value={this.state.vendor.address}
                                        onChange={this.onInputChanged}
                                        onBlur={this.onFocusLos}
                                    />
                                </div>
                                <label
                                    className={this.state.errors['address'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['address'] ? this.state.errors['address'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <div className={"form-group fs-12" + (this.state.errors['contacts'] ? ' has-error' : '')}>
                            <label className="col-md-3 control-label">Телефон</label>
                            <div className="col-md-7" style={{textAlign: 'right'}}>
                                <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-fw fa-phone" />
                                </span>
                                    <InputElement
                                        className="form-control fs-12"
                                        mask="+38 (099) 999-99-99"
                                        placeholder="+380 (67) 123-12-34"
                                        name="contacts"
                                        value={this.state.vendor.contacts}
                                        onChange={this.onInputChanged}
                                        onBlur={this.onFocusLos}
                                    />
                                </div>
                                <label
                                    className={this.state.errors['contacts'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['contacts'] ? this.state.errors['contacts'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <div className={"form-group fs-12" + (this.state.errors['website'] ? ' has-error' : '')}>
                            <label className="col-md-3 control-label">Веб-сайт</label>
                            <div className="col-md-7" style={{textAlign: 'right'}}>
                                <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-fw fa-globe" />
                                </span>
                                    <InputElement
                                        className="form-control fs-12"
                                        placeholder="Веб-сайт"
                                        name="website"
                                        value={this.state.vendor.website}
                                        onChange={this.onInputChanged}
                                        onBlur={this.onFocusLos}
                                    />
                                </div>
                                <label
                                    className={this.state.errors['website'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['website'] ? this.state.errors['website'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <hr/>
                        <div className="mb-xlg text-weight-bold">Реквизиты</div>
                        <div className={"form-group fs-12" + (this.state.errors['code'] ? ' has-error' : '')}>
                            <label className="col-md-2 control-label">код ЕДРПОУ</label>
                            <div className="col-md-9" style={{textAlign: 'right'}}>
                                <input type="text"
                                       className="form-control fs-12"
                                       name="code"
                                       value={this.state.vendor.code}
                                       onChange={this.onInputChanged}
                                       onBlur={this.onFocusLos}
                                />
                                <label
                                    className={this.state.errors['code'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['code'] ? this.state.errors['code'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <div className={"form-group fs-12" + (this.state.errors['full_name'] ? ' has-error' : '')}>
                            <label className="col-md-2 control-label">Оф. название</label>
                            <div className="col-md-9" style={{textAlign: 'right'}}>
                                                <textarea
                                                    className="form-control fs-12"
                                                    name="full_name"
                                                    rows="3"
                                                    value={this.state.vendor.full_name}
                                                    onChange={this.onInputChanged}
                                                    onBlur={this.onFocusLos}
                                                />
                                <label
                                    className={this.state.errors['full_name'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['full_name'] ? this.state.errors['full_name'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <div className={"form-group fs-12" + (this.state.errors['requisites'] ? ' has-error' : '')}>
                            <label className="col-md-2 control-label">Реквизиты</label>
                            <div className="col-md-9" style={{textAlign: 'right'}}>
                                                <textarea
                                                    className="form-control fs-12"
                                                    name="requisites"
                                                    rows="3"
                                                    value={this.state.vendor.requisites}
                                                    onChange={this.onInputChanged}
                                                    onBlur={this.onFocusLos}
                                                />
                                <label
                                    className={this.state.errors['requisites'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['requisites'] ? this.state.errors['requisites'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <hr/>
                        <div className="mb-xlg">Контактное лицо</div>
                        <div className="row mt-lg">
                            <div className="col-md-3 col-lg-3">
                                <div className="img-rounded employee-image" style={{width: '100%'}}>
                                    {$personImagePreviewUrl}
                                </div>
                                <label id="button-photo" className="btn btn-primary mr-xs mb-sm mt-lg"
                                       style={{width: '60%'}}>
                                    <i className="fa fa-fw fa-plus" /> Фото
                                    <input
                                      type="file"
                                      onChange={this.onPersonImageChange}
                                      style={{display: 'none'}}
                                    />
                                </label>
                            </div>
                            <div className="col-md-8 col-lg-8">
                                <div
                                    className={"form-group fs-12" + (this.state.errors['last_name'] ? ' has-error' : '')}>
                                    <label className="col-md-3 control-label">Фамилия</label>
                                    <div className="col-md-9" style={{textAlign: 'right'}}>
                                        <input type="text"
                                               className="form-control fs-12"
                                               name="last_name"
                                               placeholder="Иванов"
                                               value={this.state.vendor.person.last_name ? this.state.vendor.person.last_name : ''}
                                               onChange={this.onPersonInputChanged}
                                               onBlur={this.onFocusLos}
                                        />
                                        <label
                                            className={this.state.errors['last_name'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors['last_name'] ? this.state.errors['last_name'][0] : ''}
                                        </label>
                                    </div>
                                </div>
                                <div
                                    className={"form-group fs-12" + (this.state.errors['first_name'] ? ' has-error' : '')}>
                                    <label className="col-md-3 control-label">Имя</label>
                                    <div className="col-md-9" style={{textAlign: 'right'}}>
                                        <input type="text"
                                               className="form-control fs-12"
                                               name="first_name"
                                               placeholder="Иван"
                                               value={this.state.vendor.person.first_name ? this.state.vendor.person.first_name : ''}
                                               onChange={this.onPersonInputChanged}
                                               onBlur={this.onFocusLos}
                                        />
                                        <label
                                            className={this.state.errors['first_name'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors['first_name'] ? this.state.errors['first_name'][0] : ''}
                                        </label>
                                    </div>
                                </div>
                                <div
                                    className={"form-group fs-12" + (this.state.errors['second_name'] ? ' has-error' : '')}>
                                    <label className="col-md-3 control-label">Отчество</label>
                                    <div className="col-md-9" style={{textAlign: 'right'}}>
                                        <input type="text"
                                               className="form-control fs-12"
                                               name="second_name"
                                               placeholder="Иванович"
                                               value={this.state.vendor.person.second_name ? this.state.vendor.person.second_name : ''}
                                               onChange={this.onPersonInputChanged}
                                               onBlur={this.onFocusLos}
                                        />
                                        <label
                                            className={this.state.errors['second_name'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors['second_name'] ? this.state.errors['second_name'][0] : ''}
                                        </label>
                                    </div>
                                </div>
                                <div className={"form-group fs-12" + (this.state.errors['phone'] ? ' has-error' : '')}>
                                    <label className="col-md-3 control-label">Телефон</label>
                                    <div className="col-md-9" style={{textAlign: 'right'}}>
                                        <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-fw fa-phone" />
                                </span>
                                            <InputElement
                                                className="form-control fs-12"
                                                mask="+38 (099) 999-99-99"
                                                placeholder="+380 (67) 123-12-34"
                                                name="phone"
                                                value={this.state.vendor.person.contacts ? this.state.vendor.person.contacts.phone : ''}
                                                onChange={this.onPhoneChanged}
                                                onBlur={this.onFocusLosPersonPhone}
                                            />
                                        </div>
                                        <label
                                            className={this.state.errors['phone'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors['phone'] ? this.state.errors['phone'][0] : ''}
                                        </label>
                                    </div>
                                </div>
                                <div className={"form-group fs-12" + (this.state.errors['email'] ? ' has-error' : '')}>
                                    <label className="col-md-3 control-label">Эл. почта</label>
                                    <div className="col-md-9" style={{textAlign: 'right'}}>
                                        <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-fw fa-globe" />
                                </span>
                                            <InputElement
                                                className="form-control fs-12"
                                                placeholder="Эл. почта"
                                                name="email"
                                                value={this.state.vendor.person.contacts ? this.state.vendor.person.contacts.email : ''}
                                                onChange={this.onEmailChanged}
                                                onBlur={this.onFocusLos}
                                            />
                                        </div>
                                        <label
                                            className={this.state.errors['email'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors['email'] ? this.state.errors['email'][0] : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="panel-footer">
                        <div className="row">
                            <div className="col-md-12 text-right">
                                <button type="button" className="btn btn-primary mr-sm"
                                        onClick={this.onSave}>
                                    <i className="fa fa-fw fa-save" />
                                    Сохранить
                                </button>
                                <button type="reset" className="btn btn-default"
                                        onClick={this.onCancelClick}>
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    mapToData = (props) => {
        let phone = '';
        let email = '';

        if (props.vendor) {
            props.vendor.person.contacts.map((c) => {
                if (c.contact_type === 'EMAIL') {
                    email = c.contact;
                } else {
                    phone = c.contact;
                }
            })
        }
        return (
            props.vendor ? {
                full_name: props.vendor.full_name || '',
                short_name: props.vendor.short_name || '',
                photo_id: props.vendor.photo_id || null,
                code: props.vendor.code || '',
                requisites: props.vendor.requisites || '',
                contacts: props.vendor.contacts || '',
                address: props.vendor.address || '',
                website: props.vendor.website || '',
                note: props.vendor.note || '',
                person: {
                    ...props.vendor.person,
                    first_name: props.vendor.person.first_name || '',
                    last_name: props.vendor.person.last_name || '',
                    second_name: props.vendor.person.second_name || '',
                    contacts: {
                        phone: phone,
                        email: email
                    }
                } || {},
            } : {
                full_name: '',
                short_name: '',
                photo_id: null,
                code: '',
                requisites: '',
                contacts: '',
                address: '',
                website: '',
                note: '',
                person: {
                    first_name: '',
                    last_name: '',
                    second_name: '',

                }
            }
        );
    };

    mapToDataImage = (props) => {
        return (props.vendor ?
            (props.vendor.person.photo_id && props.vendor.person.photo_id !== null ?
                props.vendor.person.image
                : peson)
            : peson)
    };

    onFocusLos = (e) => {
        let data = {};
        if (e.target.name === 'contacts') {
            let phone = e.target.value.replace(/[\+\(\)\-" "]/g, '');
            data = {
                legal_enity_id: this.props.vendor.vendor_id,
                [e.target.name]: phone
            }
        } else {
            data = {
                legal_enity_id: this.props.vendor.vendor_id,
                [e.target.name]: e.target.value
            };
        }

        this.props.onCheckInput(data);
    };

    onFocusLosPersonPhone = (e) => {
        let data = {
            person_id: this.state.vendor.person.person_id,
            'phone': e.target.value.replace(/[\+\(\)\-" "]/g, '')
        };

        this.props.onCheckInput(data);
    };

    onPersonImageChange = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({
                photo: {
                    name: file.name,
                    data: reader.result.replace('data:;base64,', ''),
                    personImagePreviewUrl: reader.result
                }
            });
        };
        reader.readAsDataURL(new Blob([file]));

        const formData = new FormData();
        formData.append('image', file);

        this.props.onUploadImage(formData, 'person');
    };

    checkForErrors = (name) => {
        this.state.errors[name] ? delete this.state.errors[name] : '';
        this.state.errors['legal_enity_id'] ? delete this.state.errors['legal_enity_id'] : '';
    };

    onInputChanged = (e) => {

        this.checkForErrors(e.target.name);

        let state = {
            vendor: this.state.vendor,
        };

        state.vendor[e.target.name] = e.target.value;

        this.setState(state);
    };

    onPersonInputChanged = (e) => {
        this.checkForErrors(e.target.name);

        let state = {
            contact_person: this.state.vendor.person,
        };

        state.contact_person[e.target.name] = e.target.value;

        this.setState(state);
    };

    onPhoneChanged = (e) => {
        this.checkForErrors(e.target.name);

        let state = {
            contacts: this.state.vendor.person.contacts,
        };

        state.contacts.phone = e.target.value;
        this.setState(state);
    };

    onEmailChanged = (e) => {
        this.checkForErrors(e.target.name);

        let state = {
            contacts: this.state.vendor.person.contacts,
        };

        state.contacts.email = e.target.value;
        this.setState(state);
    };


    // EVENTS

    /**
     * Handle adding new post.
     * @param e event object.
     */

    onCancelClick = () => {
        this.props.loadVendorData(this.props.vendor.vendor_id);
        this.props.router.goBack();
    };

    checkForEmptiness = () => {
        let err = this.state.errors;

        if (this.state.vendor.short_name === '') {
            err['short_name'] = {message: 'Укажите название'};
        }

        if (this.state.vendor.full_name === '') {
            err['full_name'] = {message: 'Укажите название'};
        }

        if (this.state.vendor.code === '') {
            err['code'] = {message: 'Укажите код за ЕДРПОУ'};
        }

        if (this.state.vendor.contacts === '') {
            err['contacts'] = {message: 'Укажите телефон поставщика'};
        }

        if (this.state.vendor.requisites === '') {
            err['requisites'] = {message: 'Укажите реквизиты'};
        }

        if (this.state.vendor.person.first_name === '') {
            err['first_name'] = {message: 'Укажите имя'};
        }

        if (this.state.vendor.person.contacts.phone === '') {
            err['phone'] = {message: 'Укажите номер телефона'};
        }

        this.setState({
            errors: err,
        });
    };

    onSave = (e) => {
        e.preventDefault();

        this.checkForEmptiness();

        if (Object.keys(this.state.errors).length > 0) {
            const error = {
                text: 'Ошибки при заполнении формы',
                type: 'error'
            };
            this.props.onNotifyShow(error);
        } else {
            let cont = this.state.vendor.person.contacts;

            let data = {
                'full_name': this.state.vendor.full_name,
                'code': this.state.vendor.code,
                'short_name': this.state.vendor.short_name,
                'note': this.state.vendor.note,
                'requisites': this.state.vendor.requisites,
                'address': this.state.vendor.address,
                'website': this.state.vendor.website,
                'contacts': this.state.vendor.contacts.replace(/[\+\(\)\-" "]/g, ''),
                "photo_id": this.state.vendor_id !== null ? this.state.vendor_id : this.state.vendor.photo_id,
                'person': {
                    'first_name': this.state.vendor.person.first_name,
                    'last_name': this.state.vendor.person.last_name,
                    'second_name': this.state.vendor.person.second_name,
                    'photo_id': this.state.person_id !== null ? this.state.person_id : this.state.vendor.person.photo_id,
                    'contacts': [{"contact": cont.phone.replace(/[\+\(\)\-" "]/g, ''), "contact_type": 'PHONE'}, {"contact": cont.email, "contact_type": 'EMAIL'}],
                    'person_id': this.state.vendor.person.person_id
                }
            };

            this.props.onEditVendor(data, +this.props.vendor_id, this.props.router);
        }

    };

    onCancel = () => {
        this.props.router.goBack();
    };
}
