import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {API_CLIENTS} from '../../constants';
import InputElement from 'react-input-mask';
import Select2 from 'react-select2-wrapper';
import notify from '../commons/Notify';

const PHONE_REGEX = /^\d+$/;
const LAST_NAME_REGEX = /^[Є-Їa-zа-яа-яА-ЯёЁїЇєЄіІґҐєґ\‘`´a-zA-Z]+$/;


const $ = window.jQuery;

/**
 * Client search form.
 */
class AppointmentsClientSearch extends Component {
    constructor(props) {
        super(props);

        this.state = this.initialState();
    }

    initialState = () => {
        return {
            addClient: false,
            phone: '',
            last_name: '',
            first_name: '',
            second_name: '',
            sex: 'M',
            showForm: false,
            search_message: 'Совпадений не найдено',
            readOnlyPhone: false,
            readOnlyLsatName: false,
            errors: {},
            sources_list: [],
            references_list: this.mapToDataReferences(this.props.references_list)
        }
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.errors_messages) {

            if (nextProps.errors_messages.status === 'error') {
                nextState.errors[nextProps.errors_messages.message.field] = {
                    message: nextProps.errors_messages.message.error
                };
            }
            if (nextProps.errors_messages.status === 'success') {
                delete nextState.errors[nextProps.errors_messages.message];
            }
        }

        if (nextProps.references_list !== this.props.references_list) {
            nextState.references_list = this.mapToDataReferences(nextProps.references_list);
        }
    };

    render() {
        return (
            <section className="panel mb-none" style={this.props.style}>
                <div className="panel-body pb-md pt-xs"
                     style={{background: '#ECEDF0', borderRadius: '0px'}}>
                    <div className="row mb-xs mt-xs">
                        <div className={this.state.showForm ? 'col-md-12 text-right' : 'hide'}>
                            <a href="#" onClick={this.cancelAction}>
                                <i className="fa fa-fw fa-times"/>
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className={this.state.showForm ? 'hide' : ''}>
                                <select id="clientNumberSelect" className="form-control">
                                    <option value="">Введите телефон/фамилию клиента</option>
                                </select>
                            </div>

                            <section className={'mt-md ' + (this.state.showForm ? '' : 'hide')}>
                                <div className={this.state.errors['phone_number'] ? 'has-error' : ''}>
                                    <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="icon"><i className="fa fa-phone"/></span>
                                    </span>
                                        <InputElement
                                            className="form-control newClientPhone"
                                            mask="+38 (099) 999-99-99"
                                            placeholder="Телефон"
                                            value={this.state.phone}
                                            name="phone"
                                            onChange={this.inputChange('phone')}
                                            ref={(ref) => {
                                                this.input = ref
                                            }}
                                            onBlur={this.onFocusLos}/>
                                    </div>
                                    <label className={this.state.errors['phone_number'] ? 'control-label' : 'hidden'}>
                                        {this.state.errors['phone_number'] ? this.state.errors['phone_number'].message : ''}
                                    </label>
                                </div>
                                <div className={this.state.errors['last_name'] ? 'has-error mt-md' : 'mt-md'}>
                                    <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="icon"><i className="fa fa-user"/></span>
                                    </span>
                                        <input className="form-control newClientLastName"
                                               type="text"
                                               name="last_name"
                                               placeholder="Фамилия"
                                               value={this.state.last_name}
                                               onChange={this.inputChange('last_name')}
                                               onBlur={this.onFocusLos}
                                        />
                                    </div>
                                    <label className={this.state.errors['last_name'] ? 'control-label' : 'hidden'}>
                                        {this.state.errors['last_name'] ? this.state.errors['last_name'].message : ''}
                                    </label>
                                </div>
                                <div className={this.state.errors['first_name'] ? 'has-error mt-md' : 'mt-md'}>
                                    <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="icon"><i className="fa fa-user"/></span>
                                    </span>
                                        <input className="form-control"
                                               type="text"
                                               name="first_name"
                                               placeholder="Имя"
                                               value={this.state.first_name}
                                               onChange={this.inputChange('first_name')}
                                               onBlur={this.onFocusLos}
                                        />
                                    </div>
                                    <label className={this.state.errors['first_name'] ? 'control-label' : 'hidden'}>
                                        {this.state.errors['first_name'] ? this.state.errors['first_name'].message : ''}
                                    </label>
                                </div>
                                <div className={this.state.errors['second_name'] ? 'has-error mt-md' : 'mt-md'}>
                                    <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="icon"><i className="fa fa-user"/></span>
                                    </span>
                                        <input className="form-control"
                                               type="text"
                                               name="second_name"
                                               placeholder="Отчество"
                                               value={this.state.second_name}
                                               onChange={this.inputChange('second_name')}
                                               onBlur={this.onFocusLos}
                                        />
                                    </div>
                                    <label className={this.state.errors['second_name'] ? 'control-label' : 'hidden'}>
                                        {this.state.errors['second_name'] ? this.state.errors['second_name'].message : ''}
                                    </label>
                                </div>

                                <div className="form-group-vertical row mt-md">
                                    <label className="col-md-3 control-label">Пол</label>

                                    <div className="col-md-9">
                                        <div className="radio-custom radio-primary radio-inline mb-none mr-md">
                                            <input type="radio"
                                                   name="sex"
                                                   value="M"
                                                   checked={this.state.sex === 'M'}
                                                   onChange={this.inputChange('sex')}/>
                                            <label>Мужской</label>
                                        </div>

                                        <div className="radio-custom radio-primary radio-inline">
                                            <input type="radio"
                                                   name="sex"
                                                   value="F"
                                                   checked={this.state.sex === 'F'}
                                                   onChange={this.inputChange('sex')}/>
                                            <label>Женский</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="form-group-vertical row mt-md">
                                    <div className="col-md-12">
                                        <div className={this.state.errors['refer_search'] ? 'has-error mt-md' : 'mt-md'}>
                                            <Select2 className="form-control without-search"
                                                     options={{
                                                         placeholder: 'Выберите источник обращения',
                                                         theme: 'bootstrap',
                                                         minimumResultsForSearch: 'Infinity'
                                                     }}
                                                     id="refer"
                                                     name="refer_search"
                                                     data={this.state.references_list}
                                                     value={this.state.selected_source}
                                                     onSelect={(e) => {
                                                         e.preventDefault();
                                                         this.state.errors['refer_search'] ? delete this.state.errors['refer_search'] : '';
                                                         this.setState({
                                                             selected_source: e.target.value
                                                         });

                                                     }}
                                            />
                                            <label className={this.state.errors['refer_search'] ? 'control-label' : 'hidden'}>
                                                {this.state.errors['refer_search'] ? this.state.errors['refer_search'].message : ''}
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                <button className="btn btn-primary mt-md pull-right"
                                        onClick={(e) => {
                                            e.preventDefault();

                                            this.submitNewClient();
                                        }}>
                                    <i className="fa fa-fw fa-plus"/>&nbsp;Добавить
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    componentDidMount() {
        $('#clientNumberSelect').select2({
            ajax: {
                url: API_CLIENTS.clientsSearch,
                dataType: 'json',
                delay: 250,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': this.props.auth
                },
                data: (params) => {
                    this.setState({
                        search: params.term
                    });

                    return {
                        search: params.term,
                        page: params.page
                    };
                },
                processResults: function (result, params) {
                    params.page = params.page || 1;

                    return {
                        results: result.data.map((client) => {
                            return {
                                id: client.client_id,
                                text: client.phone + ' ' + client.last_name + ' ' + client.first_name,
                                client: client
                            }
                        }),
                        pagination: {
                            more: (params.page * 30) < result.total_count
                        }
                    };
                },
                cache: false
            },
            language: {
                "noResults": () => {
                    return $('<div class="text-center"/>')
                        .append($('<div class="mb-sm"/>').html(this.state.search_message))
                        .append(
                            $('<a href="#" class="btn btn-sm btn-primary"/>')
                                .append($('<i class="fa fa-fw fa-plus" />'))
                                .append('Новый клиент')
                                .on('click', this.addingNewClient)
                        );
                }
            },
            escapeMarkup: m => m,
            minimumInputLength: 3,
        }).on('select2:select', (e) => {
            e.preventDefault();

            this.clientSelected();
        });
    }

    // EVENTS
    mapToDataReferences = (references_list) => {
        return references_list.map((refer) => {
            return {
                text: refer.refer_name,
                id: refer.refer_id
            }
        })
    };

    inputChange = (type) => (e) => {
        this.setState({[type]:e.target.value});
    };

    addingNewClient = (e) => {
        e.preventDefault();

        const data = $('#clientNumberSelect').data('select2').results.lastParams.term;

        if (LAST_NAME_REGEX.exec(data)) {
            this.setState({
                last_name: data,
                showForm: true
            });
            $('.newClientPhone').blur();
            $('.newClientLastName').focus();

        } else if (PHONE_REGEX.exec(data)) {
            this.setState({
                phone: data,
                showForm: true
            });
            $('.newClientLastName').blur();
            $('.newClientPhone').focus();
        }
        else {
            // this.setState({
            //     errors: {
            //         ...this.state.errors,
            //         data_input: {message: 'Не верно введены данные'}
            //     }
            // });
            // return;
        }


        $('#clientNumberSelect').select2('close');
        this.props.onAddingClient(true);

    };

    onFocusLos = (e) => {

        if (e.target.value !== '') {
            let data = {
                name: e.target.name === 'phone' ? 'phone_number' : e.target.name,
                value: e.target.name === 'phone' ? e.target.value.replace(/[\+\(\)\-" "]/g, '') : e.target.value,
                index: e.target.id ? e.target.id : ''
            };

            this.props.onCheck(data);
        }
    };

    // EVENTS COMPLETE
    /**
     * Submit a new client.
     */
    submitNewClient = () => {

        if (this.state.first_name === '') {
            this.state.errors['first_name'] = {message: 'Укажите имя'};
        }

        if (this.state.last_name === '') {
            this.state.errors['last_name'] = {message: 'Укажите фамилию'};
        }

        if (this.state.phone === '') {
            this.state.errors['phone_number'] = {message: 'Укажите номер телефона'};
        }

        if (this.state.selected_source === undefined) {
            this.state.errors['refer_search'] = {message: 'Выберите источник обращения'};
        }

        this.forceUpdate();

        if (Object.keys(this.state.errors).length > 0) {
            const error = {
                title: 'ОШИБКА',
                text: 'Проверте правильность заполнения информации о клиенте',
                type: 'error'
            };
            this.props.onNotifyShow(error);
        } else {
            this.props.onClientSelected({
                client_id: 0x0,
                phone: this.input.value.replace(/[\+\(\)\-\_" "]/g, ''),
                last_name: this.state.last_name,
                first_name: this.state.first_name,
                second_name: this.state.second_name,
                sex: this.state.sex,
                refer_id: this.state.selected_source,
                category_id: 1,
                category_name: 'Разовый',
                appointments: [],
                isNew: true
            });

            this.clearState();
        }
    };

    /**
     * Submit a found client.
     */
    clientSelected = () => {
        this.props.onClientSelected(
            $('#clientNumberSelect').select2('data')[0].client
        );

        this.clearState();
    };

    // UTILS
    clearState = () => {
        $("#clientNumberSelect").val('').trigger('change');
        this.setState(this.initialState());

        this.props.onClearErrors();
        this.props.onAddingClient(false);
    };

    cancelAction = (e) => {
        e.preventDefault();

        this.clearState();
    };
}

AppointmentsClientSearch.propTypes = {
    references_list: PropTypes.array,
    onClientSelected: PropTypes.func,
    onClearErrors: PropTypes.func,
    onAddingClient: PropTypes.func
};

export default AppointmentsClientSearch;