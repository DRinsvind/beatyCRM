import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';
import DropDownTreeView from '../commons/dropDowns/DropDownTreeView';

import {
    DEFINE_DOUBLE_NUMBER,
    DEFINE_INT_NUMBER
} from '../../utils/index';

const $ = window.$;

/**
 *
 */
class ServicesEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: this.mapToData(props),
            loaded: false,
            category: props.categoryName,
            service_id: props.service_id,
            services_tags: [],
            tags: this.mapToDataTags(props.service_exp),
            goods: this.mapToDataGoods(props.goods_list),
            errors: {},
        };
    }

    componentWillUpdate(nextProps, nextState) {

        if (this.props !== nextProps) {
            nextState.loaded = true;
            nextState.service_id = nextProps.service_id;
        }

        if (this.props.service_exp !== nextProps.service_exp && nextProps.service_exp !== null) {
            nextState.item = this.mapToData(nextProps);
            nextState.goods_in_service = this.mapToDataPackage(nextProps);
            nextState.tags = this.mapToDataTags(nextProps.service_exp);
            nextState.services_tags = this.dataForTagsSelect(nextProps.services_tags, nextProps.service_exp);

            if ($('#tags_services_edit_select').data('select2')) {
                $('#tags_services_edit_select').empty();
            }

            $('#tags_services_edit_select').select2({
                theme: 'bootstrap',
                placeholder: 'Выберите теги',
                width: '100%',
                multiple: true,
                tags: true,
                data: nextState.services_tags,
            })
                .off('select2:select select2:unselect')
                .on('select2:select', this.tagChanged)
                .on('select2:unselect', this.delTag);
        }

        if (nextProps.errors !== this.props.errors) {
            if (nextProps.errors.status) {
                if (nextProps.errors.status === 'error') {
                    nextState.errors[nextProps.errors.message.field] = {
                        message: nextProps.errors.message.error
                    };
                }
                if (nextProps.errors.status === 'success') {
                    delete nextState.errors[nextProps.errors.message];
                }
            }
            else {
                nextState.errors = {};
            }
        }

        nextState.goods = this.mapToDataGoods(nextProps.goods_list);
        nextState.goods_in_service_ui = this.mapToDataGoodsInService(nextState.goods_in_service);
    }


    render() {
        return (
            <div>
                <div className="row"
                     style={{display: this.state.loaded ? 'block' : 'none'}}>
                    <div className="col-md-6 form-horizontal form-bordered"
                         style={{borderRight: '1px solid #e5e5e5'}}>
                        <h4 className="mb-xlg">
                            Общие атрибуты
                        </h4>
                        <div className={"form-group" + (this.state.errors['good_name'] ? ' has-error' : '')}>
                            <label className="col-md-4 control-label">
                                Название
                            </label>
                            <div className="col-md-8">
                                <input type="text"
                                       className="form-control"
                                       name="name"
                                       placeholder="Название услуги"
                                       value={this.state.item.name}
                                       onChange={this.inputChanged}
                                       onBlur={this.focusLos}
                                />
                                <label className={this.state.errors['good_name'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['good_name'] ? this.state.errors['good_name'].message : ''}
                                </label>
                            </div>
                        </div>

                        <div className="form-group pb-none mb-none">
                            <label className="col-md-4 control-label">
                                Категория услуги
                            </label>
                            <div className="col-md-8">
                                <DropDownTreeView items={this.props.categories}
                                                  category_id={this.state.item.category_id}
                                                  placeholder="Выберите категорию"
                                                  onItemSelect={this.categoryChanged}/>
                            </div>
                        </div>

                        <div className={"form-group mt-none" + (this.state.errors['price'] ? ' has-error' : '')}>
                            <label className="col-md-4 control-label">
                                Цена
                            </label>
                            <div className="col-md-8">
                                <div className="input-group">
                                    <input type="text"
                                           className="form-control"
                                           name="sale_price"
                                           placeholder="0.00"
                                           value={this.state.item.sale_price}
                                           onChange={this.changeSalePrice}
                                           onBlur={this.focusLos}
                                    />
                                    <div className="input-group-addon">
                                        ₴
                                    </div>
                                </div>
                                <label className={this.state.errors['price'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['price'] ? this.state.errors['price'].message : ''}
                                </label>
                            </div>
                        </div>

                        <div className={"form-group" + (this.state.errors['amount'] ? ' has-error' : '')}>
                            <label className="col-md-4 control-label">
                                Количество
                            </label>
                            <div className="col-md-8">
                                <div className="input-group">
                                    <input type="text"
                                           className="form-control"
                                           name="amount"
                                           placeholder="Количество минут"
                                           value={this.state.item.amount}
                                           onChange={this.inputChanged}
                                           onBlur={this.focusLos}
                                    />
                                    <div className="input-group-addon">
                                        мин
                                    </div>
                                </div>
                                <label className={this.state.errors['amount'] ? 'control-label' : 'hidden'}>
                                    {this.state.errors['amount'] ? this.state.errors['amount'].message : ''}
                                </label>
                            </div>
                        </div>

                        <div className="form-group"
                             style={{marginTop: '0px'}}>
                            <label className="col-md-4 control-label">
                                Теги
                            </label>
                            <div className="col-md-8">
                                <div className="input-group">
															<span className="input-group-addon">
																<i className="fa fa-fw fa-tags"/>
															</span>
                                    <select id="tags_services_edit_select"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 form-horizontal form-bordered">
                        <h4 className="mb-xlg">
                            Товары в услуге
                        </h4>
                        <div>
                            {this.state.goods_in_service_ui}
                        </div>
                        <a className="btn btn-primary"
                           style={{marginTop: '25px', width: '20%'}}
                           onClick={this.addGoodClick}>
                            <i className="fa fa-fw fa-plus mr-xs"/>
                            Товар
                        </a>
                    </div>
                </div>
                <div className="modal-footer row">
                    <div className="text-right">
                        <button type="button"
                                className="btn btn-primary mr-sm"
                                onClick={this.editClick}>
                            <i className="fa fa-fw fa-save"/>&nbsp;Сохранить
                        </button>
                        <button type="button"
                                className="btn btn-default"
                                data-dismiss="modal">
                            <i className="fa fa-fw fa-times"/>&nbsp;Отмена
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        (($) => {
            $('#ModalEdit').on('hidden.bs.modal', () => {
                document.querySelector('#formEdit').reset();
                this.setState({
                    tags: [],
                    errors: {}
                });
                this.props.onErrorsClear();
                this.props.onClearEditedService();
            })
        })(window.$);
    }

    mapToData = (props) => {
        return (
            props.service_exp ? {
                service_id: props.service_exp.service_id || '',
                name: props.service_exp.service_name || '',
                amount: +props.service_exp.amount || 0,
                sale_price: parseFloat(props.service_exp.price).toFixed(2) || .0.toFixed(2),
                category_id: props.service_exp.category_id || 0,
                tags: props.service_exp.tags || []
            } : {
                good_id: '',
                name: '',
                amount: 0,
                sale_price: 0.00,
                category_id: 0,
                tags: []
            }
        );
    };

    mapToDataTags = (services) => {
        if (services) {
            return (services.tags.map((tag) => {
                return tag.tag_id;
            }));
        } else return [];
    };

    mapToDataPackage = (props) => {
        return (
            props.service_exp ?
                props.service_exp.package.map((good) => {
                    return ({
                        good_id: good.good_info.good_id,
                        amount: good.amount,
                        selected_unit: good.transfer_form.name,
                        form_id: good.transfer_form.id,
                        available_forms: good.good_info.available_forms,
                        disabled: false
                    })
                }) :
                [
                    {
                        good_id: 0,
                        amount: 0,
                        selected_unit: '',
                        form_id: null,
                        available_forms: [],
                        disabled: false
                    }
                ]
        )
    };

    mapToDataGoods = (props) => {
        if (props) {
            return props.map((good) => {
                return {
                    id: good.good_id,
                    text: good.good_name
                }
            });
        }
    };

    changeUnit = (i, unit) => {
        let obj = this.state.goods_in_service;
        obj[i].selected_unit = unit.name;
        obj[i].form_id = unit.id;
        this.setState({
            goods_in_service: obj,
        });
    };

    dataForTagsSelect = (tags, goods) => {
        let data = [];

        tags.filter((tag) => {
            let found = true;
            goods.tags.forEach((t) => {
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

    mapToDataGoodsInService = (goods_in_service) => {
        if (goods_in_service) {
            return goods_in_service.map((good, pIndex) => {
                return <GoodItemInService key={pIndex}
                                          id={pIndex}
                                          goods={this.state.goods}
                                          goods_list={this.props.goods_list}
                                          selected_good={good.good_id}
                                          unit_name={good.unit_name}
                                          amount={good.amount}
                                          onGoodChanged={this.goodChanged}
                                          onGoodRemoved={this.goodRemoved}
                                          errors={this.state.errors}
                                          onLossFocus={this.focusLos}
                                          units={good.available_forms}
                                          selected_unit={good.selected_unit}
                                          disabled={good.disabled}
                                          onUnitChange={this.changeUnit}
                />
            });
        }
    };

    focusLos = (e) => {
        e.preventDefault();

        let val = e.target.name;

        switch (val) {
            case 'name':
                val = 'good_name';
                break;
            case 'sale_price':
                val = 'price';
                break;
            default:
                val = e.target.name;
                break;
        }

        let data = {
            name: val,
            value: e.target.value,
            index: e.target.id ? e.target.id : '',
            id: this.state.item.service_id
        };

        this.props.onCheckService(data);
    };

    goodChanged = (id, data) => {
        let un_sel = '';
        let un_id = null;
        let forms = [];

        this.props.goods_list.forEach((good) => {
            if (good.good_id === +data.good_id) {
                forms = good.available_forms;
                un_sel = good.available_forms[0].name;
                un_id = good.available_forms[0].id;
            }
        });

        const goods_in_service = this.state.goods_in_service.concat([]);
        goods_in_service.splice(id, 1, {
            good_id: data.good_id,
            amount: data.amount,
            selected_unit: un_sel,
            form_id: un_id,
            disabled: false,
            available_forms: forms
        });

        this.setState({
            goods_in_service: goods_in_service
        });
    };

    goodRemoved = (id) => {
        this.setState({
            goods_in_service: this.state.goods_in_service.filter((item, index) => {
                return index !== id;
            })
        });
    };

    addGoodClick = (e) => {
        e.preventDefault();

        this.setState({
            goods_in_service: this.state.goods_in_service.concat([
                {
                    good_id: 0,
                    amount: 0,
                    selected_unit: '',
                    form_id: null,
                    available_forms: [],
                    disabled: true
                }
            ])
        })

    };


    // EVENTS
    inputChanged = (e) => {
        e.preventDefault();
        let item = this.state.item;

        e.target.name === 'amount' ?
            item[e.target.name] = DEFINE_INT_NUMBER(this.state.item[e.target.name], e.target.value)
            :
            item[e.target.name] = e.target.value;

        this.setState({
            item: item
        });
    };

    changeSalePrice = (e) => {
        e.preventDefault();
        let item = this.state.item;
        item[e.target.name] = DEFINE_DOUBLE_NUMBER(this.state.item[e.target.name], e.target.value);
        this.setState({
            item: item
        });
    };

    categoryChanged = (categoryNewId) => {
        this.setState({
            item: Object.assign({}, this.state.item, {
                category_id: categoryNewId
            })
        });
    };

    tagChanged = (e) => {
        let tags = this.state.tags;

        if (e.params.data.element) {
            tags.push(+e.params.data.id);
        } else {
            tags.push(e.params.data.id);
        }
        this.setState({tags: tags});
    };

    delTag = (e) => {
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

    editClick = () => {
        let err = this.state.errors;

        if (this.state.item.name === '') {
            err['good_name'] = {message: 'Укажите название'};
        }

        if (this.state.category_id === 0) {
            err['service_group'] = {message: ''};
        }

        if (this.state.item.sale_price === '' || +this.state.item.sale_price === 0) {
            err['price'] = {message: 'Укажите цену'};
        }

        if (this.state.item.amount === '' || +this.state.item.amount === 0) {
            err['amount'] = {message: 'Укажите длительность'};
        }

        if (this.state.goods_in_service.length > 0) {
            this.state.goods_in_service.forEach((gItem, gIndex) => {
                if (gItem.good_id === 0) {
                    err['good' + gIndex] = {message: 'Выберите товар'};
                }

                if (gItem.amount === '' || +gItem.amount === 0) {
                    err['amount_good' + gIndex] = {message: 'Укажите количество'};
                }
            });
        }

        this.setState({
            errors: err,
        });

        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!'
            };
            this.props.onNotifyShow(error);
        } else {

            let data = {
                "service_name": this.state.item.name,
                "service_group_id": +this.state.item.category_id,
                "sale_price": parseFloat(this.state.item.sale_price).toFixed(2),
                "amount": this.state.item.amount,
                "package": this.state.goods_in_service ? this.state.goods_in_service : '',
                "tags": this.state.tags,
            };

            this.props.onEditService(data, this.state.item.service_id);
            document.querySelector('#formEdit').reset();
            window.$('#ModalEdit').modal('hide');
            this.setState({
                tags: []
            });
        }
    };
}

ServicesEdit.propTypes = {
    categories: PropTypes.array.isRequired,
    service_exp: PropTypes.object,
    services_tags: PropTypes.array.isRequired,
    goods_list: PropTypes.array.isRequired,
    onEditService: PropTypes.func.isRequired,
    onCheckService: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired,
    onClearEditedService: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
};


/**
 *
 */
class GoodItemInService extends Component {
    render() {
        return (
            <div style={this.props.id > 0 ? {marginTop: '25px'} : {marginTop: '0px'}}>
                <div className={"form-group" + (this.props.errors['good' + this.props.id] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">
                        Товар {this.props.id + 1}
                    </label>
                    <div className="col-md-8">
                        <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-list-alt "/>
                                                    </span>
                            <Select2 className="form-control"
                                     style={{width: '100%'}}
                                     options={{placeholder: 'Выберите товар', theme: 'bootstrap'}}
                                     data={this.props.goods}
                                     value={this.props.selected_good}
                                     onSelect={this.goodsChanged}
                            />
                        </div>
                    </div>
                    <a className="col-md-1 pl-xs mt-xs"
                       onClick={this.goodRemovedClick}>
                        <i className="fa fa-fw fa-lg fa-trash"/>
                    </a>
                </div>

                <div className={"form-group" + (this.props.errors['amount_good' + this.props.id] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">
                        Количество
                    </label>
                    <div className="col-md-4">
                        <div className="input-group">
                            <div className="input-group-addon">
                                <i className="fa fa-fw fa-glass"/>
                            </div>
                            <input type="text"
                                   className="form-control"
                                   name="amount_good"
                                   placeholder="0.00"
                                   disabled={this.props.disabled}
                                   value={this.props.amount}
                                   onChange={this.amountChanged}/>
                            <div className="input-group-btn">
                                <button type="button"
                                        className="btn btn-default dropdown-toggle"
                                        data-toggle="dropdown"
                                        style={{width: '70px', backgroundColor: 'rgb(238,238,238)'}}>
                                    {this.props.selected_unit} <span className="caret"/>
                                </button>
                                <ul className="dropdown-menu">
                                    {this.unitsSelect(this.props.units, this.props.id)}
                                </ul>
                            </div>
                        </div>
                        <label
                            className={this.props.errors['amount_good' + this.props.id] ? 'control-label' : 'hidden'}>
                            {this.props.errors['amount_good' + this.props.id] ? this.props.errors['amount_good' + this.props.id].message : ''}
                        </label>
                    </div>
                </div>
            </div>
        )
    }


    goodsChanged = (e) => {
        this.props.errors['good' + this.props.id] ? delete this.props.errors['good' + this.props.id] : '';

        let unit = '';
        if (this.props.goods_list) {
            this.props.goods_list.map((good) => {
                if (good.good_id === +e.target.value) {
                    unit = good.unit.unit_name;
                }
            })
        }
        let data = {
            good_id: e.target.value,
            amount: this.props.amount,
            unit_name: unit
        };

        this.props.onGoodChanged(this.props.id, data);
    };

    amountChanged = (e) => {
        this.props.errors['amount_good' + this.props.id] ? delete this.props.errors['amount_good' + this.props.id] : '';

        this.setState({
            amount: e.target.value
        });
        let data = {
            good_id: this.props.selected_good,
            amount: e.target.value,
            unit_name: this.props.unit
        };
        this.props.onGoodChanged(this.props.id, data);
    };

    unitsSelect = (units, id) => {
        return units.map((unit, i) => {
            return <li key={i}>
                <a href="#" onClick={(e) => {
                    e.preventDefault();

                    this.props.onUnitChange(id, unit);
                }}>{unit.name}</a>
            </li>
        });
    };

    goodRemovedClick = () => {
        this.props.errors['good' + this.props.id] ? delete this.props.errors['good' + this.props.id] : '';
        this.props.errors['amount_good' + this.props.id] ? delete this.props.errors['amount_good' + this.props.id] : '';
        this.props.onGoodRemoved(this.props.id);
    };
}

GoodItemInService.propTypes = {
    errors: PropTypes.object.isRequired,
    goods: PropTypes.array.isRequired,
    goods_list: PropTypes.array.isRequired,
    units: PropTypes.array.isRequired,
    selected_unit: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    onGoodChanged: PropTypes.func.isRequired,
    onGoodRemoved: PropTypes.func.isRequired,
    onUnitChange: PropTypes.func.isRequired,
    onLossFocus: PropTypes.func.isRequired
};

export default ServicesEdit;
