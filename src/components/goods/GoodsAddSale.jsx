import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownTreeView from '../commons/dropDowns/DropDownTreeView';
import jQuery from 'jquery';
import deepAssign from 'deep-assign';
import {DEFINE_DOUBLE_NUMBER, DEFINE_INT_NUMBER} from '../../utils/index';
import {__mapToDataBrands,__mapToDataTags} from '../../utils/renderUtils';
const $ = window && window.jQuery ? window.jQuery : jQuery;

const itemInitialState = {
    group_id: '',
    product_name: '',
    article: '',
    barcode: '',
    trend: '',
    tags: [],
    price: '',
    price_purchase: '',
    amnt_min_limit: '',
    transfer_form: {
        base_unit: 1,
        per_piece_qnt: '',
        per_package_qnt: '',
        is_package_sale: false,
        is_piece: false,
        is_multi_use: false
    },
    multi_use: '',
    brand: '',
    note: '',
    good_exp: ''
};

/**
 *
 */
class GoodsAddSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: deepAssign({}, itemInitialState),
            loaded: false,
            category_id: props.category_id,
            unit_id: null,
            goods_tags: __mapToDataTags(props.goods_tags),
            tags: [],
            categories: [],
            errors: {},
            brands: [],
            good_exp: ''
        };
    }

    componentDidMount() {
        ($ => {
            $('#ModalAddSale').on('hidden.bs.modal', () => {
                document.querySelector('#formAddSale').reset();
                this.setState({
                    tags: [],
                    errors: {},
                    item: deepAssign(itemInitialState, {
                        transfer_form: {
                            base_unit: 1,
                            per_piece_qnt: '',
                            per_package_qnt: '',
                            is_package_sale: false,
                            is_piece: false
                        }
                    })
                });
                this.props.onErrorsClear();
            });
        })(window.$);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.good_exp === 'product_name' && nextProps.errors.code === 200) {
            return false;
        } else if (nextState.good_exp === 'barcode' && nextProps.errors.code === 200) {
            return false;
        } else if (nextState.good_exp === 'article' && nextProps.errors.code === 200) {
            return false;
        } else {
            return true;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            if (nextProps.errors.data && nextProps.errors.data.errors) {
                let val =
                    nextProps.errors.data.errors[Object.keys(nextProps.errors.data.errors)[0]];
                nextProps.errors.message = val && val[0];
                nextProps.errors.field = Object.keys(nextProps.errors.data.errors)[0];
            }

            nextState.loaded = true;
            nextState.categories = nextProps.categories;

            if (nextProps.brands !== this.props.brands) {
                nextState.brands = __mapToDataBrands(nextProps.brands);
            }
            if (nextProps.goods_tags !== this.props.goods_tags) {
                nextState.goods_tags = __mapToDataTags(nextProps.goods_tags);
            }
            if (nextProps.units !== this.props.units) {
                nextState.units = this.unitsSelect(nextProps.units);
                nextState.unit_id = this.mlUnitId(nextProps.units);
            }

            if (this.props.errors !== nextProps.errors) {
                if (nextProps.errors.message) {
                    if (nextProps.errors.success === false) {
                        nextState.errors[nextProps.errors.field] = {
                            message: nextProps.errors.message
                        };
                    }
                    if (nextProps.errors.success === true) {
                        delete nextState.errors[nextProps.errors.field];
                    }
                } else {
                    nextState.errors = {};
                }
            }

            if (this.props.category_id !== nextProps.category_id) {
                nextState.category_id = nextProps.category_id;
            }
        }
    }

    componentDidUpdate() {
        if ($('#trend_select_sale').select2) {
            $('#trend_select_sale')
                .select2({
                    theme: 'bootstrap',
                    placeholder: 'Выберите направление',
                    width: '100%',
                    data: this.state.brands,
                    tags: true
                })
                .off('change')
                .on('change', e => {
                    let val = parseFloat(e.target.value);
                    this.setState({
                        item: {
                            ...this.state.item,
                            trend: val
                        }
                    });
                });

            $('#tags_select_sale')
                .select2({
                    theme: 'bootstrap',
                    width: '100%',
                    multiple: true,
                    tags: true,
                    placeholder: 'Выберите теги',
                    data: this.state.goods_tags
                })
                .off('select2:select')
                .on('select2:select', this.tagChanged)
                .off('select2:unselect')
                .on('select2:unselect', this.delTag);
        }
    }

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
        tags = tags.filter(tag => {
            let found = true;
            if (tag.toString() === e.params.data.id) {
                found = false;
            }
            return found;
        });
        this.setState({tags: tags});
    };

    checkForErrors = name => {
        if (name === 'barcode' || name === 'article') {
            this.state.errors['barcode'] ? delete this.state.errors['barcode'] : '';
            this.state.errors['article'] ? delete this.state.errors['article'] : '';
        } else {
            this.state.errors[name] ? delete this.state.errors[name] : '';
        }
    };

    focusLos = e => {
        console.log(e.target.value);
        e.preventDefault();
        const val = e.target.name;
        let value;
        let data = {};
        switch (val) {
            case 'trend':
                value = +e.target.value;
                break;
            case 'amnt_min_limit':
                value = +e.target.value;
                break;
            default:
                value = e.target.value;
                break;
        }

        if (val === 'barcode' || val === 'article') {
            data.barcode = this.state.item.barcode;
            data.article = this.state.item.article;
            this.props.onCheckGood(data);
        } else {
            data[val] = value;
            this.props.onCheckGood(data);
        }
    };

    inputChanged = e => {
        e.preventDefault();
        this.checkForErrors(e.target.name);
        let data = this.state.item;

        if (e.target.name === 'amnt_min_limit') {
            data.amnt_min_limit = DEFINE_DOUBLE_NUMBER(data.amnt_min_limit, e.target.value);
            this.setState({good_exp: e.target.name});
        } else {
            data[e.target.name] = e.target.value;
            this.setState({good_exp: e.target.name});
        }

        this.setState({item: data});
    };

    categoryChanged = category_new_id => {
        this.state.errors && this.state.errors['category_id']
            ? delete this.state.errors['category_id']
            : '';

        this.setState({category_id: category_new_id});
    };

    unitsSelect = units => {
        return units.map((unit, i) => {
            return (
                <li key={i}>
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            this.setState({
                                unit_id: unit.unit_id,
                                selected_unit: unit.unit_name
                            });
                        }}
                    >
                        {unit.unit_name}
                    </a>
                </li>
            );
        });
    };

    mlUnitId = units => {
        let un_id = null;
        units.forEach(unit => {
            if (unit.unit_name === 'мл') {
                un_id = unit.unit_id;
            }
        });
        return un_id;
    };

    addGood = () => {
        let data;
        let item = {
            ...this.state.item
        };
        item.group_id = this.state.category_id;
        this.setState({item});

        let err = this.state.errors || {};

        if (this.state.item && this.state.item.product_name === '') {
            err['product_name'] = {
                message: 'Укажите название'
            };
        }

        if (
            (this.state.item && this.state.category_id === 0) ||
            this.state.category_id === '' ||
            this.state.category_id === 1
        ) {
            err['category_id'] = {
                message: 'Укажите бренд'
            };
        }

        if ((this.state.item && this.state.item.price === 0) || this.state.item.price === '') {
            err['price'] = {
                message: 'Укажите цену продажи'
            };
        }

        if (
            (this.state.item && this.state.item.price_purchase === 0) ||
            this.state.item.price_purchase === ''
        ) {
            err['price_purchase'] = {
                message: 'Укажите цену закупки'
            };
        }

        if ((this.state.item && this.state.item.trend === 0) || this.state.item.trend === '') {
            err['trend'] = {
                message: 'Укажите направление'
            };
        }

        if (
            this.state.item &&
            ((this.state.item.article === 0 || this.state.item.article === '') &&
                (this.state.item.barcode === 0 || this.state.item.barcode === ''))
        ) {
            err['article'] = {
                message: 'Укажите штрих-код или артикул'
            };
            err['barcode'] = {
                message: 'Укажите штрих-код или артикул'
            };
        }

        this.setState({errors: err});
        if (Object.keys(err).length > 0 && !err.success) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!'
            };
            this.props.onNotifyShow(error);
        } else {
            data = {
                group_id: this.state.category_id,
                product_name: this.state.item.product_name,
                trend: parseFloat(this.state.item.trend),
                tags: this.state.tags,
                price: this.state.item.price === '' ? '' : parseFloat(this.state.item.price),
                price_purchase:
                    this.state.item.price_purchase === ''
                        ? ''
                        : parseFloat(this.state.item.price_purchase)
            };

            if (this.state.item.amnt_min_limit !== 0 && this.state.item.amnt_min_limit !== '') {
                data.amnt_min_limit = +this.state.item.amnt_min_limit;
            }
            if (this.state.item.barcode && this.state.item.barcode !== '') {
                data.barcode = this.state.item.barcode;
            }
            if (this.state.item.article && this.state.item.article !== '') {
                data.article = this.state.item.article;
            }
            if (this.state.item.note && this.state.item.note !== '') {
                data.note = this.state.item.note;
            }
            console.log('onAddGood', data, this.props.warehouse_id || 2, data.group_id, 'product');
            this.props.onAddGood(data, this.props.warehouse_id || 2, data.group_id, 'product');
            this.setState({item: deepAssign({}, itemInitialState)});
            document.querySelector('#formAddSale').reset();
            window.$('#per_piece_qnt').prop('disabled', false);
            window.$('#ModalAddSale').modal('hide');
        }
    };

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12" style={{padding: '0px'}}>
                        <div className="row goods-row">
                            <div className="col-md-12" style={{paddingRight: '0px'}}>
                                {/*--------------------Название------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div
                                            className={
                                                'form-group fs-12' +
                                                (this.state.errors &&
                                                this.state.errors['product_name']
                                                    ? ' has-error'
                                                    : '')
                                            }
                                        >
                                            <label className="col-md-3 form-label">Название</label>
                                            <div
                                                className="col-md-9"
                                                style={{
                                                    textAlign: 'right'
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    id="product_name"
                                                    className="form-control fs-12"
                                                    name="product_name"
                                                    onChange={this.inputChanged}
                                                    value={this.state.product_name}
                                                    placeholder="Название товара"
                                                    onBlur={this.focusLos}
                                                    required="required"
                                                />
                                                <label
                                                    className={
                                                        this.state.errors &&
                                                        this.state.errors['product_name']
                                                            ? 'control-label'
                                                            : 'hidden'
                                                    }
                                                >
                                                    {this.state.errors &&
                                                    this.state.errors['product_name']
                                                        ? this.state.errors['product_name'].message
                                                        : ''}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*--------------------Штрих-код------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div
                                            className={
                                                'form-group fs-12' +
                                                (this.state.errors && this.state.errors['barcode']
                                                    ? ' has-error'
                                                    : '')
                                            }
                                        >
                                            <label className="col-md-3 form-label">Штрих-код</label>
                                            <div
                                                className="col-md-9"
                                                style={{
                                                    textAlign: 'right'
                                                }}
                                            >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-barcode"/>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="barcode"
                                                        className="form-control fs-12"
                                                        name="barcode"
                                                        placeholder="Штрих-код"
                                                        onBlur={this.focusLos}
                                                        onChange={this.inputChanged}
                                                        value={this.state.barcode}
                                                        required="required"
                                                    />
                                                </div>
                                                <label
                                                    className={
                                                        this.state.errors &&
                                                        this.state.errors['barcode']
                                                            ? 'control-label'
                                                            : 'hidden'
                                                    }
                                                >
                                                    {this.state.errors &&
                                                    this.state.errors['barcode']
                                                        ? this.state.errors['barcode'].message
                                                        : ''}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*---------------------------2------------------------------*/}
                        <div className="row goods-row">
                            <div className="col-md-12" style={{paddingRight: '0px'}}>
                                {/*--------------------Бренд------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div
                                            className={
                                                'form-group fs-12' +
                                                (this.state.errors &&
                                                this.state.errors['category_id']
                                                    ? ' has-error'
                                                    : '')
                                            }
                                            style={{
                                                marginBottom: '0px'
                                            }}
                                        >
                                            <label className="col-md-3 form-label">Бренд</label>
                                            <div className="col-md-9" style={{marginBottom: "-5px"}}>
                                                <DropDownTreeView
                                                    items={this.state.categories}
                                                    category_id={
                                                        +this.state.category_id === 2 ||
                                                        +this.state.category_id === 271828182
                                                            ? 0
                                                            : this.state.category_id
                                                    }
                                                    placeholder="Выберите бренд"
                                                    onItemSelect={this.categoryChanged}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*--------------------Артикул------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div
                                            className={
                                                'form-group fs-12' +
                                                (this.state.errors && this.state.errors['article']
                                                    ? ' has-error'
                                                    : '')
                                            }
                                        >
                                            <label className="col-md-3 form-label">Артикул</label>
                                            <div className="col-md-9 "
                                            >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-slack"/>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="article"
                                                        className="form-control fs-12"
                                                        name="article"
                                                        placeholder="Артикул"
                                                        onBlur={this.focusLos}
                                                        onChange={this.inputChanged}
                                                        value={this.state.article}
                                                        required="required"
                                                    />
                                                </div>
                                                <label
                                                    className={
                                                        this.state.errors &&
                                                        this.state.errors['article']
                                                            ? 'control-label'
                                                            : 'hidden'
                                                    }
                                                >
                                                    {this.state.errors &&
                                                    this.state.errors['article']
                                                        ? this.state.errors['article'].message
                                                        : ''}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*-------------------3--------------------------------*/}
                        <div className="row goods-row">
                            <div className="col-md-12" style={{paddingRight: '0px'}}>
                                {/*--------------------------------------Направление------------------------------------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div
                                            className={
                                                'form-group fs-12' +
                                                (this.state.errors && this.state.errors['trend']
                                                    ? ' has-error'
                                                    : '')
                                            }
                                            style={{
                                                marginTop: '0px'
                                            }}
                                        >
                                            <label className="col-md-3 form-label">
                                                Направление
                                            </label>
                                            <div className="col-md-9">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-tag"/>
                                                    </span>
                                                    <select id="trend_select_sale" name="trend"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*--------------------------------------Теги------------------------------------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div className="form-group fs-12">
                                            <label className="col-md-3 form-label">Теги</label>
                                            <div className="col-md-9">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-tags"/>
                                                    </span>
                                                    <select id="tags_select_sale"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="goods-hr"/>

                        <div className="row">
                            <div className="col-md-12" style={{paddingRight: '0px'}}>
                                <div className="col-md-6">
                                    <div className="row goods-row">
                                        <div className="col-md-12">
                                            <div>
                                                <div
                                                    className={
                                                        'form-group fs-12' +
                                                        (this.state.errors &&
                                                        this.state.errors['price_purchase']
                                                            ? ' has-error'
                                                            : '')
                                                    }
                                                >
                                                    <label className="col-md-3 form-label">
                                                        Цена закупки
                                                    </label>
                                                    <div className="col-md-9 goods-row-padding-right">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-fw fa-upload"/>
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                id="price_purchase"
                                                                className="form-control fs-12"
                                                                name="price_purchase"
                                                                placeholder="0.00"
                                                                onChange={this.inputChanged}
                                                                value={this.state.price_purchase}
                                                                onBlur={this.focusLos}
                                                                required="required"
                                                            />
                                                            <span className="input-group-addon">
                                                                ₴
                                                            </span>
                                                        </div>
                                                        <label
                                                            className={
                                                                this.state.errors &&
                                                                this.state.errors['price_purchase']
                                                                    ? 'control-label'
                                                                    : 'hidden'
                                                            }
                                                        >
                                                            {this.state.errors &&
                                                            this.state.errors['price_purchase']
                                                                ? this.state.errors[
                                                                    'price_purchase'
                                                                    ].message
                                                                : ''}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row goods-row">
                                        <div className="col-md-12">
                                            <div>
                                                <div
                                                    className={
                                                        'form-group fs-12' +
                                                        (this.state.errors &&
                                                        this.state.errors['price']
                                                            ? ' has-error'
                                                            : '')
                                                    }
                                                >
                                                    <label className="col-md-3 form-label goods-two-lines">
                                                        Цена продажи
                                                    </label>
                                                    <div className="col-md-9 goods-row-padding-right">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-fw fa-upload"/>
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                id="price"
                                                                className="form-control fs-12"
                                                                name="price"
                                                                placeholder="0.00"
                                                                onChange={this.inputChanged}
                                                                value={this.state.price}
                                                                onBlur={this.focusLos}
                                                                required="required"
                                                            />
                                                            <span className="input-group-addon">
                                                                ₴
                                                            </span>
                                                        </div>
                                                        <label
                                                            className={
                                                                this.state.errors &&
                                                                this.state.errors['price']
                                                                    ? 'control-label'
                                                                    : 'hidden'
                                                            }
                                                        >
                                                            {this.state.errors &&
                                                            this.state.errors['price']
                                                                ? this.state.errors['price'].message
                                                                : ''}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row goods-row">
                                        <div className="col-md-12">
                                            <div>
                                                <div
                                                    className={
                                                        'form-group fs-12' +
                                                        (this.state.errors &&
                                                        this.state.errors['amnt_min_limit']
                                                            ? ' has-error'
                                                            : '')
                                                    }
                                                >
                                                    <label className="col-md-3 form-label">
                                                        Критическое количество
                                                    </label>
                                                    <div
                                                        className="col-md-9 goods-row-padding-right">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-fw fa-flask"/>
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                id="amnt_min_limit"
                                                                className="form-control fs-12"
                                                                name="amnt_min_limit"
                                                                placeholder="0"
                                                                onBlur={(e) => {
                                                                    +e.target.value !== 0 && this.focusLos(e)
                                                                }}
                                                                onChange={this.inputChanged}
                                                                value={this.state.item.amnt_min_limit}
                                                                required="required"
                                                            />
                                                        </div>
                                                        <label
                                                            className={
                                                                this.state.errors &&
                                                                this.state.errors['amnt_min_limit']
                                                                    ? 'control-label'
                                                                    : 'hidden'
                                                            }
                                                        >
                                                            {this.state.errors &&
                                                            this.state.errors['amnt_min_limit']
                                                                ? this.state.errors[
                                                                    'amnt_min_limit'
                                                                    ].message
                                                                : ''}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row goods-row">
                                        <div className="col-md-12" style={{paddingLeft: "0px"}}>
                                            <div>
                                                <div className="form-group fs-12">
                                                    <label className="col-md-3 form-label">
                                                        Описание
                                                    </label>
                                                    <div className="col-md-9 goods-row-padding-right">
                                                        <div className="input-group">
                                                            <textarea
                                                                type="text"
                                                                id="note"
                                                                className="form-control fs-12 goods-add-textarea"
                                                                name="note"
                                                                rows="6"
                                                                onChange={this.inputChanged}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*-----------------------------------------------------------------------------------------------------------------------------------------*/}

                        <div className="modal-footer row display-none">
                            <div className="text-right">
                                <button
                                    id="save-goods-add-sale-form"
                                    type="button"
                                    onClick={this.addGood}
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GoodsAddSale.propTypes = {
    goods_tags: PropTypes.array.isRequired,
    onAddGood: PropTypes.func.isRequired,
    onCheckGood: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired
};

export default GoodsAddSale;
