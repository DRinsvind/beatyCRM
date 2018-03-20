import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDownTreeView from '../commons/dropDowns/DropDownTreeView';
import deepAssign from 'deep-assign';
import GoodSaleItemInSet from './GoodSaleItemInSet';
import * as can from '../../constants';
import {__mapToDataBrands,__mapToDataTags,__mapToDataGoods} from '../../utils/renderUtils';
import { DEFINE_DOUBLE_NUMBER } from '../../utils/index';

const $ = window.$;

const itemInitialState = {
    name: '',
    amount: '',
    sale_price: '',
    article: '',
    barcode: '',
    category_id: 0,
    tags: [],
    amnt_min_limit: '',
    goods_in_set: [
        {
            good_id: 0,
            amount: '',
            selected_unit: '',
            form_id: null,
            possible_forms: [],
            disabled: false,
            category_id: 0
        },
        {
            good_id: 0,
            amount: '',
            selected_unit: '',
            form_id: null,
            possible_forms: [],
            disabled: false,
            category_id: 0
        }
    ],
    brand: '',
    good_exp: ''
};

/**
 *
 */
class GoodsSetAddSale extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: deepAssign({}, itemInitialState),
            loaded: false,
            category_id: props.category_id,
            goods_in_set: [
                {
                    good_id: 0,
                    amount: '',
                    selected_unit: '',
                    form_id: null,
                    possible_forms: [],
                    disabled: false,
                    category_id: 0
                },
                {
                    good_id: 0,
                    amount: '',
                    selected_unit: '',
                    form_id: null,
                    possible_forms: [],
                    disabled: false,
                    category_id: 0
                }
            ],
            goods: __mapToDataGoods(props.goods_list),
            goods_tags: __mapToDataTags(props.goods_tags),
            tags: [],
            errors: {},
            units: [],
            brands: __mapToDataBrands(props.brands),
            good_exp: ''
        };
    }

    componentDidMount() {
        ($ => {
            $('#ModalAddSetSale').on('hidden.bs.modal', () => {
                document.querySelector('#formAddSetSale').reset();
                this.setState({
                    tags: [],
                    goods_in_set: [
                        {
                            good_id: 0,
                            amount: '',
                            selected_unit: '',
                            form_id: null,
                            possible_forms: [],
                            disabled: false,
                            category_id: 0
                        },
                        {
                            good_id: 0,
                            amount: '',
                            selected_unit: '',
                            form_id: null,
                            possible_forms: [],
                            disabled: false,
                            category_id: 0
                        }
                    ],
                    errors: {},
                    item: deepAssign({}, itemInitialState),
                    good_exp: ''
                });
                this.props.onErrorsClear();
            });
        })(window.$);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.good_exp === 'name' && nextProps.errors.code === 200) {
            return false;
        } else {
            return true;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            if (nextProps.errors.data && nextProps.errors.data.errors) {
                let val = nextProps.errors.data.errors[Object.keys(nextProps.errors.data.errors)[0]];
                nextProps.errors.message = val && val[0];
                nextProps.errors.field = Object.keys(nextProps.errors.data.errors)[0];
            }

            nextState.loaded = true;

            if (nextProps.goods_tags !== this.props.goods_tags) {
                nextState.goods_tags = __mapToDataTags(nextProps.goods_tags);
            }
            if (nextProps.brands !== this.props.brands) {
                nextState.brands = __mapToDataBrands(nextProps.brands);
            }

            nextState.goods = __mapToDataGoods(nextProps.goods);
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
        nextState.goods_in_set_ui = this.mapToDataGoodsInSet(nextState.goods_in_set, nextState.goods);
    }

    componentDidUpdate() {
        $('#trend_set_select_sale')
            .select2({
                placeholder: 'Выберите направление',
                theme: 'bootstrap',
                width: '100%',
                className: 'form-control',
                data: this.state.brands,
                tags: true
            })
            .off('change')
            .on('change', e => {
                this.setState({
                    item: {
                        ...this.state.item,
                        brand: e.target.value
                    }
                });
                this.inputChanged(e);
            });

        $('#tags_set_select')
            .select2({
                width: '100%',
                multiple: true,
                tags: true,
                placeholder: 'Выберите теги',
                theme: 'bootstrap',
                data: this.state.goods_tags,
                value: this.state.tags
            })
            .off('select2:select')
            .on('select2:select', this.tagChanged)
            .off('select2:unselect')
            .on('select2:unselect', this.delTag);
    }



    mapToDataGoodsInSet = goods_in_set => {
        return goods_in_set.map((good, pIndex) => {
            return (
                <div key={pIndex}>
                    <GoodSaleItemInSet
                        key={pIndex}
                        id={pIndex}
                        length={goods_in_set.length}
                        goods_list={this.props.goods_list}
                        selected_good={+good.product_id || 0}
                        category_id={+good.category_id || 0}
                        amount={good.quantity || ''}
                        onGoodChanged={this.goodChanged}
                        onGoodRemoved={this.goodRemoved}
                        onLosFocus={this.focusLos}
                        errors={this.state.errors}
                        units={good.possible_forms}
                        selected_unit={good.selected_unit}
                        disabled={good.disabled}
                        onUnitChange={this.changeUnit}
                        onLoadGoodsForPackage={this.props.onLoadGoodsForPackage}
                        saveGoodNameSelected={this.saveGoodNameSelected}
                        countForUpdate={goods_in_set}
                        categories={this.props.categories}
                        onErrorsClear={this.props.onErrorsClear}
                        state={this.props}
                    />
                </div>
            );
        });
    };



    changeUnit = (i, unit) => {
        let obj = this.state.goods_in_set;

        obj[i].selected_unit = unit.name;
        obj[i].form_id = unit.id;
        this.setState({
            goods_in_set: obj
        });
    };

    inputChanged = e => {
        this.checkForErrors(e.target.name);

        e.preventDefault();
        let state = {
            item: this.state.item
        };
        state.item[e.target.name] = e.target.value;
        this.setState(state);
        this.setState({ good_exp: e.target.name });
    };

    changeSalePrice = e => {
        this.checkForErrors(e.target.name);
        let item = this.state.item;
        item[e.target.name] = DEFINE_DOUBLE_NUMBER(this.state.item[e.target.name], e.target.value);
        this.setState({
            item: item
        });
    };

    checkForErrors = name => {
        switch (name) {
            case 'name':
                name = 'product_name';
                break;
            case 'sale_price':
                name = 'price';
                break;
            default:
                break;
        }

        if (name === 'barcode' || name === 'article') {
            this.state.errors['barcode'] ? delete this.state.errors['barcode'] : '';
            this.state.errors['article'] ? delete this.state.errors['article'] : '';
        } else {
            this.state.errors[name] ? delete this.state.errors[name] : '';
        }
    };

    tagChanged = e => {
        let tags = this.state.tags;

        if (e.params.data.element) {
            tags.push(+e.params.data.id);
        } else {
            tags.push(e.params.data.id);
        }

        this.setState({ tags: tags });
    };

    delTag = e => {
        let tags = this.state.tags;
        tags = tags.filter(tag => {
            let found = true;
            if (tag.toString() === e.params.data.id) {
                found = false;
            }
            return found;
        });
        this.setState({ tags: tags });
    };

    focusLos = e => {
        e.preventDefault();

        let val = e.target.name;
        let value = e.target.value;

        switch (val) {
            case 'name':
                val = 'product_name';
                break;
            case 'sale_price':
                val = 'price';
                break;
            default:
                val = e.target.name;
                break;
        }

        if (val === 'barcode' || val === 'article') {
            let data = {};
            data.barcode = this.state.item.barcode;
            data.article = this.state.item.article;
            this.props.onCheckGoodSet(data);
        } else {
            let data = {};
            data[val] = value;
            this.props.onCheckGoodSet(data);
        }
    };

    categoryChanged = categoryNewId => {
        this.state.errors['group_id'] ? delete this.state.errors['group_id'] : '';
        this.setState({
            category_id: categoryNewId
        });
    };

    addGoodClick = e => {
        e.preventDefault();

        this.setState({
            goods_in_set: this.state.goods_in_set.concat([
                {
                    good_id: 0,
                    amount: '',
                    selected_unit: '',
                    form_id: null,
                    possible_forms: [],
                    disabled: false,
                    category_id: 0
                }
            ])
        });
    };

    goodRemoved = id => {
        this.setState({
            goods_in_set: this.state.goods_in_set.filter((item, index) => {
                return index !== id;
            })
        });
    };

    goodChanged = (id, data) => {
        let un_sel = '';
        let un_id = null;
        let forms = [];

        this.props.goods_list.forEach(good => {
            if (good.good_id === +data.good_id) {
                forms = good.available_forms;
                un_sel = good.available_forms[0].name;
                un_id = good.available_forms[0].id;
            }
        });

        const goods_in_set = this.state.goods_in_set.concat([]);
        goods_in_set.splice(id, 1, {
            product_id: data.good_id,
            quantity: +data.amount,
            category_id: +data.category_id
        });

        this.setState({
            goods_in_set: goods_in_set
        });
    };

    addGoodSet = () => {
        let err = this.state.errors;

        if (this.state.item.name === '') {
            err['product_name'] = { message: 'Укажите название' };
        }

        if (this.state.category_id === 0 || this.state.category_id === 1 || this.state.category_id === '') {
            err['group_id'] = { message: '' };
        }

        if (this.state.item.sale_price === '' || this.state.item.sale_price === 0) {
            err['price'] = { message: 'Укажите цену' };
        }

        if (
            this.state.item &&
            ((this.state.item.article === 0 || this.state.item.article === '') && (this.state.item.barcode === 0 || this.state.item.barcode === ''))
        ) {
            err['article'] = {
                message: 'Укажите штрих-код или артикул'
            };
            err['barcode'] = {
                message: 'Укажите штрих-код или артикул'
            };
        }

        if (this.state.item.brand === '' || this.state.item.brand === 0) {
            err['trend'] = { message: 'Выберите направление' };
        }

        this.state.goods_in_set.forEach((gItem, gIndex) => {
            if (gItem.good_id === 0) {
                err['good' + gIndex] = { message: 'Выберите товар' };
            }
            if (gItem.amount === 0 || gItem.amount === '' || gItem.quantity === 0 || gItem.quantity === '') {
                err['amount_good' + gIndex] = { message: 'Укажите количество' };
            }
        });

        this.setState({
            errors: err
        });
        console.log('SET_ADD_SALE');
        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!'
            };
            this.props.onNotifyShow(error);
        } else {
            let data = {
                product_name: this.state.item.name,
                group_id: +this.state.category_id,
                price: +parseFloat(this.state.item.sale_price).toFixed(2),
                tags: this.state.tags,
                items: this.state.goods_in_set,
                trend: +this.state.item.brand
            };
            if (this.state.item.barcode !== 0 && this.state.item.barcode !== '') {
                data.barcode = this.state.item.barcode;
            }
            if (+this.state.item.amnt_min_limit !== 0 && this.state.item.amnt_min_limit !== '') {
                data.amnt_min_limit = +this.state.item.amnt_min_limit;
            }
            if (this.state.item.article && this.state.item.article !== '') {
                data.article = this.state.item.article;
            }
            let warehouse = this.props.warehouse_id === 1 ? 'pro' : 'sale';

            this.props.onAddGood(data, data.group_id, 'product', warehouse, '');
            this.setState({ item: deepAssign({}, itemInitialState) });
            document.querySelector('#formAddSetSale').reset();
            window
                .$('.select2-hidden-accessible')
                .find('option')
                .remove();
            window.$('#ModalAddSetSale').modal('hide');
        }
    };

    clearForm = () => {
        document.querySelector('#formAddSetSale').reset();
        this.setState({ item: deepAssign({}, itemInitialState) });
        window
            .$('.select2-hidden-accessible')
            .find('option')
            .remove();
    };

    render() {
        return (
            <div style={{marginRight: "-15px"}}>
                <div className="row goods-row">
                    <div className="col-md-12" style={{padding: '0px'}}>
                        {/*--------------------------------------Название---------------------------------------------------------*/}
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['product_name'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Название</label>
                                    <div
                                        className="col-md-9"
                                        style={{
                                            textAlign: 'right'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="form-control fs-12"
                                            name="name"
                                            placeholder="Набор 1"
                                            onChange={this.inputChanged}
                                            onBlur={this.focusLos}
                                            value={this.state.item.name}
                                            required
                                        />
                                        <label className={this.state.errors && this.state.errors['product_name'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['product_name'] ? this.state.errors['product_name'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------------------------Штрих-код------------------------------------*/}
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['barcode'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Штрих-код</label>
                                    <div
                                        className="col-md-9"
                                        style={{
                                            textAlign: 'right'
                                        }}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-fw fa-barcode" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control fs-12"
                                                name="barcode"
                                                placeholder="Штрих-код набора"
                                                onChange={this.inputChanged}
                                                onBlur={this.focusLos}
                                                value={this.state.item.barcode}
                                                required
                                            />
                                        </div>
                                        <label className={this.state.errors && this.state.errors['barcode'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['barcode'] ? this.state.errors['barcode'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*--------------------------------------Бренд---------------------------------------------*/}
                <div className="row goods-row">
                    <div className="col-md-12" style={{padding: '0px'}}>
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['group_id'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Бренд</label>
                                    <div className="col-md-9" style={{marginBottom: "-5px"}}>
                                        <DropDownTreeView
                                            items={this.props.categories}
                                            category_id={+this.state.category_id === 2 || +this.state.category_id === 271828182 ? 0 : this.state.category_id}
                                            placeholder="Выберите бренд"
                                            onItemSelect={this.categoryChanged}
                                        />
                                        <label className={this.state.errors && this.state.errors['group_id'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['group_id'] ? this.state.errors['group_id'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*------------------------------------------------Артикул--------------------------------------------------*/}
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['article'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Артикул</label>
                                    <div
                                        className="col-md-9"
                                        style={{
                                            textAlign: 'right'
                                        }}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-fw fa-slack" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control fs-12"
                                                name="article"
                                                placeholder="Артикул набора"
                                                onChange={this.inputChanged}
                                                onBlur={this.focusLos}
                                                value={this.state.item.article}
                                                required
                                            />
                                        </div>
                                        <label className={this.state.errors && this.state.errors['article'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['article'] ? this.state.errors['article'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*---------------------------------------------3я строка-------------------------------------------------------------*/}
                <div className="row goods-row">
                    <div className="col-md-12" style={{padding: '0px'}}>
                        {/*------------------Направление------------------*/}
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['trend'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Направление</label>
                                    <div
                                        className="col-md-9"
                                        style={{
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-fw fa-tag" />
                                            </span>
                                            <select id="trend_set_select_sale" name="trend" />
                                        </div>
                                        <label className={this.state.errors && this.state.errors['trend'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['trend'] ? this.state.errors['trend'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*-----------------Теги---------------------*/}
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['trend'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Теги</label>
                                    <div
                                        className="col-md-9"
                                        style={{
                                            textAlign: 'right'
                                        }}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-fw fa-tags" />
                                            </span>
                                            <select id="tags_set_select" />
                                        </div>
                                        <label className={this.state.errors && this.state.errors['trend'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['trend'] ? this.state.errors['trend'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="goods-set-hr"/>
                {/*-----------------------------------------4я строка------------------------------------------------------------**/}
                <div className="row goods-row">
                    <div className="col-md-12" style={{padding: '0px'}}>
                        {/*------------------Цена продажи------------------*/}
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['price'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Цена продажи</label>
                                    <div
                                        className="col-md-9"
                                        style={{
                                            textAlign: 'right'
                                        }}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-fw fa-upload" />
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control fs-12"
                                                name="sale_price"
                                                placeholder="0.00"
                                                onChange={this.changeSalePrice}
                                                onBlur={this.focusLos}
                                                value={this.state.item.sale_price}
                                                required
                                            />
                                            <span className="input-group-addon">₴</span>
                                        </div>
                                        <label className={this.state.errors && this.state.errors['price'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['price'] ? this.state.errors['price'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*------------------Критическое кол-во------------------*/}
                        <div className="col-md-6">
                            <div>
                                <div className={'fs-12' + (this.state.errors && this.state.errors['amnt_min_limit'] ? ' has-error' : '')}>
                                    <label className="col-md-3 form-label">Критическое кол-во</label>
                                    <div
                                        className="col-md-9"
                                        style={{
                                            textAlign: 'right'
                                        }}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-fw fa-glass" />
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control fs-12"
                                                name="amnt_min_limit"
                                                placeholder="0"
                                                onChange={this.inputChanged}
                                                onBlur={(e) => {
                                                    +e.target.value !== 0 && this.focusLos(e)
                                                }}
                                                value={this.state.item.amnt_min_limit}
                                                required
                                            />
                                        </div>
                                        <label className={this.state.errors && this.state.errors['amnt_min_limit'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors && this.state.errors['amnt_min_limit'] ? this.state.errors['amnt_min_limit'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*---------------------------------------------Товары в наборе------------------------------------------------------------*/}
                <div className="row goods-row">
                    <div className="goods-set-container">Товары в набре</div>
                </div>
                <hr className="goods-set-inner-hr"/>

                <div className="row">
                    <div className="col-md-12">{this.state.goods_in_set_ui}</div>
                </div>

                {/*----------------------------------------------------------------------------------------------------------------------*/}
                <div className="row">
                    <div className="col-md-12 text-right">
                        <button
                            id="save-goods-add-set-sale-form"
                            type="button"
                            className="btn btn-primary mr-sm display-none"
                            onClick={this.addGoodSet}
                        >
                            <i className="fa fa-fw fa-save" />&nbsp;Сохранить
                        </button>
                        <a
                            className="btn btn-primary goods-add-good-set-button"
                            onClick={this.addGoodClick}
                        >
                            <i style={{ marginLeft: '-5px' }} className="fa fa-fw fa-plus-circle mr-xs" />
                            <i className="fa fa-archive" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

GoodsSetAddSale.propTypes = {
    category_id: PropTypes.number.isRequired,
    warehouse_id: PropTypes.number.isRequired,
    goods_list: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    goods_tags: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onAddGood: PropTypes.func.isRequired,
    onCheckGoodSet: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired
};

export default GoodsSetAddSale;
