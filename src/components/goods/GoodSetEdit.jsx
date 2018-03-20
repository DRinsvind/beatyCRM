import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDownTreeView from '../commons/dropDowns/DropDownTreeView';
import * as net from '../../utils/network';
import * as can from '../../constants';

import { DEFINE_DOUBLE_NUMBER, DEFINE_INT_NUMBER } from '../../utils/index';

const $ = window.$;

/**
 *
 */
class GoodSetEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: this.mapToData(props),
            loaded: false,
            categories: props.categories,
            goods_tags: [],
            goods: [],
            tags: [],
            errors: {},
            good_exp: ''
        };
    }

    componentDidMount() {
        ($ => {
            $('#ModalEditSet').on('hidden.bs.modal', () => {
                document.querySelector('#formEditSet').reset();
                this.setState({
                    tags: [],
                    errors: {}
                });
                this.props.onErrorsClear();
                this.props.onClearEditedGood();
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
            nextState.loaded = true;
            nextState.categories = nextProps.categories;
        }

        if (this.props.package !== nextProps.package && nextProps.package !== null) {
            nextState.item = this.mapToData(nextProps);
            nextState.goods_in_set = this.mapToDataPackage(nextProps);
            nextState.goods_tags = this.dataForTagsSelect(nextProps.goods_tags, nextProps.package);
            nextState.brands = this.dataForBrandsSelect(nextProps.brands, nextProps.package.trend);

            if ($('#brand_set_edit_select').data('select2')) {
                $('#brand_set_edit_select').empty();
            }

            $('#trend_select_edit_set')
                .select2({
                    theme: 'bootstrap',
                    placeholder: 'Выберите направление',
                    width: '100%',
                    data: this.dataForBrandsSelect(nextProps.brands, nextProps.package.trend),
                    tags: true
                })
                .on('change', e => {
                    nextState.item.brand = e.target.value;
                });

            if ($('#tags_set_edit_select').data('select2')) {
                $('#tags_set_edit_select').empty();
            }

            $('#tags_set_edit_select')
                .select2({
                    width: '100%',
                    multiple: true,
                    tags: true,
                    className: 'form-control',
                    placeholder: 'Выберите теги',
                    theme: 'bootstrap',
                    data: nextState.goods_tags
                })
                .off('select2:select select2:unselect')
                .on('select2:select', this.tagChanged)
                .on('select2:unselect', this.delTag);
        }

        if (this.props.errors !== nextProps.errors) {
            if (!nextProps.errors.success && Object.keys(nextProps.errors).length !== 0) {
                nextState.errors[nextProps.errors.field] = {
                    message: nextProps.errors.message
                };
            }
            if (nextProps.errors.success) {
                delete nextState.errors[nextProps.errors.field];
            }
        }

        nextState.goods = this.mapToDataGoods(nextProps.goods_list);
        nextState.goods_in_set_ui = this.mapToDataGoodsInSet(nextState.goods_in_set);
    }

    inputChanged = e => {
        e.preventDefault();

        this.checkForErrors(e.target.name);

        let state = {
            item: this.state.item
        };
        state.item[e.target.name] = e.target.value;
        this.setState(state);
        this.setState({ good_exp: e.target.name });
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

        this.state.errors[name] ? delete this.state.errors[name] : '';
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

    dataForTagsSelect = (tags, goods) => {
        let data = [];

        tags.filter(tag => {
            let found = true;
            goods.tags.forEach(t => {
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
                });
            }
        });
        return data;
    };

    dataForBrandsSelect = (brands, selected_brand) => {
        let result = brands.map(brand => {
            if (brand.trend_id === selected_brand.trend_id && selected_brand.trend_id !== '') {
                return {
                    text: brand.trend_name,
                    id: brand.trend_id,
                    selected: true
                };
            }
            return {
                text: brand.trend_name,
                id: brand.trend_id
            };
        });

        if (selected_brand === ' ') {
            result.unshift({ text: '', id: '' });
        }

        return result;
    };

    focusLos = e => {
        e.preventDefault();

        let val = e.target.name;

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
            data[val] = e.target.value;
            this.props.onCheckGoodSet(data);
        }
    };

    goodRemoved = id => {
        this.setState({
            goods_in_set: this.state.goods_in_set.filter((item, index) => {
                return index !== id;
            })
        });
    };

    addGoodClick = e => {
        e.preventDefault();

        this.setState({
            goods_in_set: this.state.goods_in_set.concat([
                {
                    good_id: 0,
                    amount: 0,
                    selected_unit: '',
                    form_id: null,
                    possible_forms: []
                }
            ])
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

    mapToData = props => {
        return props.package
            ? {
                  good_id: props.package.good_id || 0,
                  name: props.package.good_name || '',
                  amount: +props.package.quantity || 0,
                  sale_price: parseFloat(props.package.sale_price).toFixed(2) || (0.0).toFixed(2),
                  article: props.package.article || '',
                  barcode: props.package.barcode || '',
                  category_id: props.package.category_id || 0,
                  tags: props.package.tags || [],
                  goods_in_set: props.package.package || [],
                  brand: props.package.brand || '',
                  amnt_min_limit: +props.package.amnt_min_limit
              }
            : {
                  good_id: 0,
                  name: '',
                  amount: 0,
                  sale_price: 0.0,
                  article: '',
                  barcode: '',
                  category_id: 0,
                  tags: [],
                  goods_in_set: [],
                  brand: '',
                  amnt_min_limit: 0
              };
    };

    mapToDataPackage = props => {
        return props.package
            ? props.package.items.map(good => {
                  return {
                      good_id: good.good_id,
                      amount: good.quantity,
                      good_name: good.good_name
                  };
              })
            : [
                  {
                      good_id: 0,
                      amount: 0,
                      good_name: ''
                  }
              ];
    };

    mapToDataGoods = props => {
        if (props) {
            let res = props.map(good => {
                return {
                    id: good.good_id,
                    text: good.good_name
                };
            });
            return res;
        }
    };

    mapToDataGoodsInSet = goods_in_set => {
        if (goods_in_set) {
            return goods_in_set.map((good, pIndex) => {
                return (
                    <GoodItemInSet
                        key={'good_set_edit_' + pIndex}
                        length={goods_in_set.length}
                        id={pIndex}
                        good_id={good.good_id}
                        good_name={good.good_name}
                        amount={good.amount || ''}
                        errors={this.state.errors}
                        onGoodChanged={this.goodChanged}
                        onGoodRemoved={this.goodRemoved}
                        onLosFocus={this.focusLos}
                        onUnitChange={this.changeUnit}
                        categories={this.props.categories}
                        core={this.props.core}
                        category_id={+good.category_id}
                        warehouse={this.props.warehouse_id === 1 ? 'pro' : 'sale'}
                    />
                );
            });
        }
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
            good_id: data.good_id,
            amount: data.amount,
            category_id: +data.category_id
        });

        this.setState({
            goods_in_set: goods_in_set
        });
    };

    mapToDataCategories = (categories, category_id) => {
        var name = '';
        const loadNodes = items => {
            items.forEach(item => {
                if (item.good_group_id === category_id) {
                    return (name = item.good_group_name);
                }
                if ((item.subgroup && item.subgroup.length !== 0) || item.services) {
                    loadNodes(item.subgroup || item.services);
                }
            });
        };

        loadNodes(categories);
        return name;
    };

    editGoodSet = () => {
        let err = this.state.errors;

        if (this.state.item.name.trim() === '') {
            err['good_name'] = { message: 'Укажите название' };
        }

        if (this.state.item.sale_price.trim() === '') {
            err['price'] = { message: 'Укажите цену' };
        }

        this.state.goods_in_set.forEach((gItem, gIndex) => {
            if (gItem.good_id === 0) {
                err['good' + gIndex] = { message: 'Выберите товар' };
            }

            if (+gItem.amount === 0 || gItem.amount === '') {
                err['amount_good' + gIndex] = { message: 'Укажите количество' };
            }
        });

        this.setState({
            errors: err
        });
        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!'
            };
            this.props.onNotifyShow(error);
        } else {
            let items = this.state.goods_in_set.map(item => {
                return {
                    product_id: +item.good_id,
                    quantity: item.amount
                };
            });

            let data = {
                product_name: this.state.item.name,
                price: +(+this.state.item.sale_price).toFixed(2),
                tags: this.state.tags,
                items: items
            };

            if (this.state.item.barcode && this.state.item.barcode !== '') {
                data.barcode = this.state.item.barcode;
            }

            if (this.state.item.article && this.state.item.article !== '') {
                data.article = this.state.item.article;
            }

            if (this.state.item.amnt_min_limit !== 0 && this.state.item.amnt_min_limit !== '') {
                data.amnt_min_limit = +this.state.item.amnt_min_limit;
            }

            let warehouse = this.props.warehouse_id === 1 ? 'pro' : 'sale';
            this.props.onEditGoodSet(data, +this.state.item.good_id, +this.props.category_id, warehouse);
            document.querySelector('#formEditSet').reset();
            window.$('#ModalEditSet').modal('hide');
            this.setState({
                tags: []
            });
        }
    };

    render() {
        return (
                <div style={{marginRight: "-15px"}}>
                    <div className="row goods-row">
                        <div className="col-md-12"  style={{padding: '0px'}}>
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
                                        <label className="col-md-3 form-label">{this.props.warehouse_id === 2 ? 'Категория' : 'Бренд'}</label>
                                        <div className="col-md-9" style={{marginBottom: "-5px"}}>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-fw fa-tag" />
                                                </span>
                                                <input
                                                    className="form-control fs-12"
                                                    type="text"
                                                    name="group_id"
                                                    value={this.mapToDataCategories(this.props.categories, this.props.category_id)}
                                                    disabled
                                                />
                                            </div>
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
                                        <div className="col-md-9">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-fw fa-tag" />
                                                </span>
                                                <select id="trend_select_edit_set" name="trend" />
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
                                                <select id="tags_set_edit_select" />
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
                                id="save-goods-edit-set-form"
                                type="button"
                                className="btn btn-primary mr-sm display-none"
                                onClick={this.editGoodSet}
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

GoodSetEdit.propTypes = {
    good_id: PropTypes.number.isRequired,
    warehouse_id: PropTypes.number.isRequired,
    goods_list: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    goods_tags: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    package: PropTypes.object,
    onEditGoodSet: PropTypes.func.isRequired,
    onCheckGoodSet: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired
};

/**
 *
 */
class GoodItemInSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods_list: [],
            categories: []
        };
    }

    componentDidMount() {
        if (this.state.categories !== this.props.categories) {
            this.setState({ categories: this.props.categories });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('UPDATE');
        nextState.goods_list = this.mapToDataGoods(nextState.goods_list);
        let id = '#good_set_edit_select' + this.props.id;
        if (nextState.goods_list.length === 0 || nextState.goods_list.length === 1) {
            $(id).attr('disabled', false); //true
        } else {
            $(id).attr('disabled', false);
        }
    }

    componentDidUpdate(prevState, prevProps) {
        console.log('componentDidUpdate_PROPS_STATE', this.props, this.state);
        let data = this.state.goods_list;
        let id = '#good_set_edit_select' + this.props.id;
        $(id).val(null);
        if (data.length === 0) {
            data = [{ id: this.props.good_id, text: this.props.good_name }];
            let newOption = new Option(data.text, data.id, false, false);
            $(id).append(newOption);
        }
        $(id).val(data.id);
        $(id)
            .select2({
                placeholder: 'Выберите товар',
                theme: 'bootstrap',
                width: '100%',
                className: 'form-control',
                data: data,
                tags: true
            })
            .off('change')
            .on('change', e => {
                this.setState({
                    item: {
                        ...this.state.item,
                        good: e.target.value
                    }
                });
                this.goodsChanged(e);
            });
    }

    mapToDataGoods = goods => {
        if (goods.length !== 0) {
            let temp_goods = goods.map(good => {
                return { text: good.good_name, id: good.good_id };
            });
            temp_goods.unshift({ text: '', id: '' });
            return temp_goods;
        } else {
            return goods;
        }
    };

    categoryChanged = category_id => {
        let data = {
            category_id: category_id,
            good_id: this.props.selected_good,
            amount: this.props.amount
        };
        this.props.onGoodChanged(this.props.id, data);

        net
            .aGet(
                { core: this.props.core },
                can.API_GOODS.getGoodsWithinGroup
                    .replace(/\{groupId}/, category_id)
                    .replace(/\{goodsType}/, 'product')
                    .replace(/\{warehouse}/, this.props.warehouse)
            )
            .then(json => {
                this.setState({ goods_list: json.data });
            });
    };

    goodsChanged = e => {
        this.props.errors['good' + this.props.id] ? delete this.props.errors['good' + this.props.id] : '';

        let unit = '';
        if (this.props.goods_list) {
            this.props.goods_list.map(good => {
                if (good.good_id === +e.target.value) {
                    unit = good.unit.unit_name;
                }
            });
        }

        let data = {
            good_id: e.target.value,
            amount: this.props.amount,
            unit_name: unit,
            category_id: this.props.category_id
        };

        this.props.onGoodChanged(this.props.id, data);
    };

    amountChanged = e => {
        this.props.errors['amount_good' + this.props.id] ? delete this.props.errors['amount_good' + this.props.id] : '';
        this.props.errors[this.props.id] ? delete this.props.errors[this.props.id] : '';
        let data = {
            good_id: this.props.good_id,
            amount: +e.target.value,
            category_id: this.props.category_id
        };
        this.props.onGoodChanged(this.props.id, data);
    };

    goodRemovedClick = () => {
        this.props.errors['good' + this.props.id] ? delete this.props.errors['good' + this.props.id] : '';
        this.props.errors['amount_good' + this.props.id] ? delete this.props.errors['amount_good' + this.props.id] : '';
        this.props.onGoodRemoved(this.props.id);
    };

    render() {
        return (
            <div>
                <div className="col-md-6" style={{ marginTop: '20px' }}>
                    {/*------------------------------Бренд--------------------------------------*/}
                    <div>
                        <div className="row goods-set-item-row fs-12">
                            <label className="col-md-3 form-label">{this.props.warehouse === 'sale' ? 'Бренд' : 'Категория'}</label>
                            <div className="col-md-9" style={{marginBottom: "-5px"}}>
                                <DropDownTreeView
                                    items={this.props.categories || this.state.categories}
                                    placeholder={this.props.warehouse === 'sale' ? 'Выберите бренд' : 'Выберите категорию'}
                                    category_id={this.props.category_id}
                                    onItemSelect={this.categoryChanged}
                                />
                            </div>
                        </div>
                    </div>
                    {/*-------------------------------Товар-----------------------------------------*/}
                    <div
                        className="form-horizontal form-bordered"
                        style={{
                            display: 'block'
                        }}
                    >
                        <div className={'row goods-set-item-row fs-12' + (this.props.errors && this.props.errors['good' + this.props.id] ? ' has-error' : '')}>
                            <label className="col-md-3 form-label">Товар {this.props.id + 1}</label>
                            <div
                                className="col-md-9"
                                style={{
                                    textAlign: 'left'
                                }}
                            >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-fw fa-list-alt" />
                                    </span>
                                    <select id={'good_set_edit_select' + this.props.id} onChange={this.goodsChanged} value={this.props.good_name} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*-------------------------------Кол-во-----------------------------------------*/}
                    <div>
                        <div className={'fs-12 row goods-set-item-row' + (this.props.errors && this.props.errors['amount_good' + this.props.id] ? ' has-error' : '')}>
                            <label className="col-md-3 form-label">Количество</label>
                            <div
                                className="col-md-9"
                                style={{
                                    textAlign: 'left'
                                }}
                            >
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-fw fa-glass" />
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        id={this.props.id}
                                        className="form-control fs-12"
                                        name="amount"
                                        placeholder="0"
                                        onChange={this.amountChanged}
                                        value={this.props.amount}
                                        onBlur={this.props.onLosFocus}
                                    />
                                </div>
                                <label
                                    className={this.props.errors['quantity' + this.props.id] || this.props.errors[this.props.id] ? 'control-label' : 'hidden'}
                                >
                                    {this.props.errors['amount_good' + this.props.id]
                                        ? this.props.errors['amount_good' + this.props.id].message
                                        : this.props.errors[this.props.id] ? this.props.errors[this.props.id].message : ''}
                                </label>
                            </div>
                            <div>
                                <a
                                    className={this.props.length > 2 ? 'col-md-1 pl-xs mt-xs' : 'hide'}
                                    style={{ marginLeft: '140px', cursor: 'pointer' }}
                                    onClick={this.goodRemovedClick}
                                >
                                    <i className="fa fa-fw fa-lg fa-trash" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GoodItemInSet.propTypes = {
    length: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    errors: PropTypes.object.isRequired,
    onGoodChanged: PropTypes.func.isRequired,
    onGoodRemoved: PropTypes.func.isRequired,
    onLosFocus: PropTypes.func.isRequired,
    onUnitChange: PropTypes.func.isRequired
};

export default GoodSetEdit;
