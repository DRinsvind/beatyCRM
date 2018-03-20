import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownTreeView from '../commons/dropDowns/DropDownTreeView';
import {__mapToGoodsDataTags} from '../../utils/renderUtils'
import {DEFINE_DOUBLE_NUMBER, DEFINE_INT_NUMBER} from '../../utils/index';

const $ = window.$;


class GoodsEditPro extends Component {
    constructor(props) {
        super(props);
        this.editGoodPro = this.editGoodPro.bind(this);
        this.categoryChanged = this.categoryChanged.bind(this);
        this.state = {
            item: this.mapToData(props),
            loaded: false,
            goods_tags: [],
            tags: __mapToGoodsDataTags(props.good_exp),
            errors: {},
            units: [],
            isChanged: false,
            brands: [],
            category_id: props.category_id,
            good_exp: ''
        };
    }

    componentDidMount() {
        ($ => {
            $('#ModalEditGoodPro').on('hidden.bs.modal', () => {
                document.querySelector('#formEditGoodPro').reset();
                this.setState({
                    tags: [],
                    errors: {},
                    item: this.itemDefaultState()
                });
                this.props.onErrorsClear();
                this.props.onClearEditedGood();
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
            nextState.loaded = true;
        }
        if (this.props.good_exp !== nextProps.good_exp && nextProps.good_exp !== null) {
            nextState.item = this.mapToData(nextProps);
            nextState.tags = __mapToGoodsDataTags(nextProps.good_exp);
            nextState.goods_tags = this.dataForTagsSelect(nextProps.goods_tags, nextProps.good_exp);
            nextState.brands = this.dataForBrandsSelect(nextProps.brands, nextProps.good_exp.trend);
            //nextState.is_multi_use_edit_pro = nextProps.good_exp.divisible_qnt && this.props.good_exp.divisible_qnt !== '' ? true : false
            if ($('#trend_select_edit_pro').data('select2')) {
                $('#trend_select_edit_pro').empty();
            }

            $('#trend_select_edit_pro')
                .select2({
                    theme: 'bootstrap',
                    placeholder: 'Выберите бренд',
                    width: '100%',
                    data: this.dataForBrandsSelect(nextProps.brands, nextProps.good_exp.trend),
                    tags: true
                })
                .on('change', e => {
                    nextState.item.brand = e.target.value;
                });

            if ($('#tags_goods_select_edit_pro').data('select2')) {
                $('#tags_goods_select_edit_pro').empty();
            }
            $('#tags_goods_select_edit_pro')
                .select2({
                    theme: 'bootstrap',
                    placeholder: 'Выберите теги',
                    width: '100%',
                    multiple: true,
                    data: nextState.goods_tags,
                    tags: true
                })
                .off('select2:select select2:unselect')
                .on('select2:select', this.tagChanged)
                .on('select2:unselect', this.delTag);
        }

        if (this.props.units !== nextProps.units) {
            nextState.units = this.unitsSelect(nextProps.units);
        }

        if (this.props.categories !== nextProps.categories) {
            nextState.categories = nextProps.categories;
        }

        if (this.props.category_id !== nextProps.category_id) {
            nextState.category_id = nextProps.category_id;
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
    }

    itemDefaultState = () => {
        return {
            good_id: '',
            good_name: '',
            category_id: null,
            article: '',
            barcode: '',
            sale_price: 0,
            price_purchase: 0,
            tags: [],
            amnt_min_limit: 0,
            multi_use: 0,
            transfer_form: {
                unit_name: '',
                unit_id: null,
                is_piece: false,
                is_package_sale: false,
                per_piece_qnt: 0,
                per_package_qnt: 0
            },
            brand: '',
            good_exp: ''
        };
    };

    mapToData = props => {
        return props.good_exp
            ? {
                good_id: props.good_exp.good_id || '',
                good_name: props.good_exp.good_name || '',
                category_id: props.category_id || null,
                article: props.good_exp.article || '',
                barcode: props.good_exp.barcode || '',
                sale_price: props.good_exp.sale_price || 0,
                price_purchase: props.good_exp.purchase_price || 0,
                tags: props.good_exp.tags || [],
                amnt_min_limit: props.good_exp.amnt_min_limit || 0,
                divisible_qnt: props.good_exp.divisible_qnt || 0,
                quantity: props.good_exp.quantity || 0,
                brand: props.good_exp.trend || '',
                selected_unit: props.good_exp.unit || ''
            }
            : {
                good_id: '',
                good_name: '',
                category_id: null,
                article: '',
                barcode: '',
                sale_price: 0,
                price_purchase: 0,
                tags: [],
                amnt_min_limit: 0,
                transfer_form: {
                    unit_name: '',
                    unit_id: null,
                    is_piece: false,
                    is_multi_use: false,
                    is_package_sale: false,
                    per_piece_qnt: 0,
                    per_package_qnt: 0
                },
                multi_use: 0,
                brand: '',
                good_exp: ''
            };
    };

    focusLos = e => {
        e.preventDefault();
        let val = e.target.name;

        switch (val) {
            case 'product_name_edit_pro':
                val = 'product_name';
                break;
            case 'price_edit_pro':
                val = 'price';
                break;
            case 'amnt_min_limit_edit_pro':
                val = 'amnt_min_limit';
                break;
            case 'quantity_edit_pro':
                val = 'quantity';
                break;
            case 'divisible_qnt_edit_pro':
                val = 'divisible_qnt';
                break;
            case 'barcode_edit_pro':
                val = 'barcode';
                break;
            case 'article_edit_pro':
                val = 'article';
                break;
            default:
                val = e.target.name;
                break;
        }
        if (val === 'product_name' || val === 'good_name') {
            let data = {};
            data.product_name = e.target.value;
            data.good_id = this.state.item.good_id;
            this.props.onCheckGood(data);
        } else if (val === 'barcode' || val === 'article') {
            let data = {};
            data.barcode = this.state.item.barcode;
            data.article = this.state.item.article;
            this.props.onCheckGood(data);
        } else {
            let data = {};
            data[val] = e.target.value;
            this.props.onCheckGood(data);
        }
    };

    tagChanged = e => {
        let tags = this.state.tags;
        if (e.params.data.element) {
            tags.push(+e.params.data.id);
        } else {
            tags.push(e.params.data.id);
        }
        this.setState({tags: tags});
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
        this.setState({tags: tags});
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
                data.push({id: tag.tag_id, text: tag.tag_name});
            }
        });
        return data;
    };

    dataForBrandsSelect = (brands, selected_brand) => {
        let result = brands.map(brand => {
            if (brand.trend_id === selected_brand.trend_id && selected_brand.trend_id !== ' ') {
                return {
                    text: brand.trend_name,
                    id: brand.trend_id,
                    selected: true
                };
            }
            return {text: brand.trend_name, id: brand.trend_id};
        });

        if (selected_brand === ' ') {
            result.unshift({text: '', id: ''});
        }

        return result;
    };

    checkForErrors = name => {
        this.state.errors[name] ? delete this.state.errors[name] : '';
    };

    inputChanged = e => {
        let val = e.target.name;
        e.preventDefault();

        switch (val) {
            case 'product_name_edit_pro':
                val = 'product_name';
                break;
            case 'price_edit_pro':
                val = 'price';
                break;
            case 'price_purchase_edit_pro':
                val = 'price_purchase';
                break;
            case 'amnt_min_limit_edit_pro':
                val = 'amnt_min_limit';
                break;
            case 'quantity_edit_pro':
                val = 'quantity';
                break;
            case 'divisible_qnt_edit_pro':
                val = 'divisible_qnt';
                break;
            case 'barcode_edit_pro':
                val = 'barcode';
                break;
            case 'article_edit_pro':
                val = 'article';
                break;
            default:
                val = e.target.name;
                break;
        }
        this.setState({good_exp: val});

        this.checkForErrors(val);

        switch (val) {
            case 'product_name':
                val = 'good_name';
                break;
            case 'price':
                val = 'sale_price';
                break;
        }

        let state = {
            item: this.state.item
        };
        state.item[val] = e.target.value;
        this.setState(state);
    };

    categoryChanged = categoryNewId => {
        this.setState({category_id: categoryNewId});
    };

    unitsSelect = units => {
        return units.map((unit, i) => {
            return (
                <li key={i}>
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            let item = this.state.item;
                            item.selected_unit = unit.unit_name;
                            this.setState({item});
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

    editGoodPro = () => {
        let err = this.state.errors;

        if (this.state.item.good_name === '') {
            err['product_name'] = {
                message: 'Укажите название'
            };
        }

        if (this.state.item.sale_price == 0 || this.state.item.sale_price == '') {
            err['price'] = {
                message: 'Укажите цену продажи'
            };
        }

        if (this.state.item.price_purchase == 0 || this.state.item.price_purchase == '') {
            err['price_purchase'] = {
                message: 'Укажите цену закупки'
            };
        }

        if (+this.state.item.amnt_min_limit === 0) {
            err['amnt_min_limit'] = {
                message: 'Укажите критическое количество'
            };
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

        this.setState({errors: err});

        console.log('GOODS_Edit_PRO');
        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!'
            };
            this.props.onNotifyShow(error);
        } else {
            let data = {
                //"group_id": this.state.category_id,
                product_name: this.state.item.good_name,
                price: +this.state.item.sale_price,
                price_purchase: +this.state.item.price_purchase,
                tags: this.state.tags,
                amnt_min_limit: +this.state.item.amnt_min_limit,
                trend: this.state.item.brand.trend_id || this.state.item.brand
            };
            if (this.state.item.barcode && this.state.item.barcode !== '') {
                data.barcode = this.state.item.barcode;
            }
            if (this.state.item.article && this.state.item.article !== '') {
                data.article = this.state.item.article;
            }
            if (this.state.item.note && this.state.item.note !== '') {
                data.note = this.state.item.note;
            }
            let warehouseName = this.props.warehouse_id === 1 ? 'pro' : 'sale';
            this.props.onEditGood(this.state.item.good_id, data, this.state.category_id, warehouseName);

            window.$('#ModalEditGoodPro').modal('hide');
            this.setState({
                tags: [],
                goods_tags: [],
                brands: [],
                item: this.itemDefaultState()
            });
        }
    };

    render() {
        return (
            <div>
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row goods-row-prof">
                                <div className="col-md-12" style={{paddingRight: '0px'}}>
                                    {/*--------------------Название------------------------*/}
                                    <div className="col-md-6 goods-prof">
                                        <div
                                            className="form-horizontal form-bordered"
                                            style={{
                                                display: this.state.loaded ? 'block' : 'none'
                                            }}
                                        >
                                            <div
                                                className={'form-group fs-12' + (this.state.errors && this.state.errors['product_name'] ? ' has-error' : '')}>
                                                <label className="col-md-3 form-label">Название</label>
                                                <div
                                                    className="col-md-9"
                                                    style={{
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        id="product_name_edit_pro"
                                                        className="form-control fs-12"
                                                        name="product_name_edit_pro"
                                                        placeholder="Название товара"
                                                        value={this.state.item.good_name}
                                                        onChange={this.inputChanged}
                                                        onBlur={this.focusLos}
                                                    />
                                                    <label
                                                        className={this.state.errors && this.state.errors['product_name'] ? 'control-label' : 'hidden'}>
                                                        {this.state.errors && this.state.errors['product_name'] ? this.state.errors['product_name'].message : ''}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*--------------------Штрих-код------------------------*/}
                                    <div className="col-md-6 goods-prof">
                                        <div
                                            className="form-horizontal form-bordered"
                                            style={{
                                                display: this.state.loaded ? 'block' : 'none'
                                            }}
                                        >
                                            <div
                                                className={'form-group fs-12' + (this.state.errors && this.state.errors['barcode'] ? ' has-error' : '')}>
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
                                                            id="barcode_edit_pro"
                                                            className="form-control fs-12"
                                                            name="barcode_edit_pro"
                                                            placeholder="Штрих-код"
                                                            value={this.state.item.barcode}
                                                            onChange={this.inputChanged}
                                                            onBlur={this.focusLos}
                                                        />
                                                    </div>
                                                    <label
                                                        className={this.state.errors && this.state.errors['barcode'] ? 'control-label' : 'hidden'}>
                                                        {this.state.errors && this.state.errors['barcode'] ? this.state.errors['barcode'].message : ''}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*---------------------------2------------------------------*/}
                            <div className="row goods-row-prof">
                                <div className="col-md-12" style={{paddingRight: '0px'}}>
                                    {/*--------------------Категория товара------------------------*/}
                                    <div className="col-md-6 goods-prof" style={{marginBottom: "-5px"}}>
                                        <div
                                            className="form-horizontal form-bordered"
                                            style={{
                                                display: this.state.loaded ? 'block' : 'none'
                                            }}
                                        >
                                            <div
                                                className={'form-group fs-12' + (this.state.errors && this.state.errors['category_id'] ? ' has-error' : '')}
                                                style={{
                                                    marginBottom: '0px'
                                                }}
                                            >
                                                <label className="col-md-3 form-label">Категория товара</label>
                                                <div className="col-md-9">
                                                    <DropDownTreeView
                                                        items={this.state.categories}
                                                        category_id={+this.state.category_id === 2 || +this.state.category_id === 271828182 ? 0 : this.state.category_id}
                                                        placeholder="Выберите категорию"
                                                        onItemSelect={this.categoryChanged}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*--------------------Артикул------------------------*/}
                                    <div className="col-md-6 goods-prof">
                                        <div
                                            className="form-horizontal form-bordered"
                                            style={{
                                                display: this.state.loaded ? 'block' : 'none'
                                            }}
                                        >
                                            <div
                                                className={'form-group fs-12' + (this.state.errors && this.state.errors['article'] ? ' has-error' : '')}>
                                                <label className="col-md-3 form-label">Артикул</label>
                                                <div
                                                    className="col-md-9 "
                                                    style={{
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-slack"/>
                                                    </span>
                                                        <input
                                                            type="text"
                                                            id="article_edit_pro"
                                                            className="form-control fs-12"
                                                            name="article_edit_pro"
                                                            placeholder="Артикул"
                                                            value={this.state.item.article}
                                                            onChange={this.inputChanged}
                                                            onBlur={this.focusLos}
                                                            required="required"
                                                        />
                                                    </div>
                                                    <label
                                                        className={this.state.errors && this.state.errors['article'] ? 'control-label' : 'hidden'}>
                                                        {this.state.errors && this.state.errors['article'] ? this.state.errors['article'].message : ''}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*-------------------3--------------------------------*/}
                            <div className="row goods-row-prof">
                                <div className="col-md-12" style={{paddingRight: '0px'}}>
                                    {/*--------------------------------------Направление------------------------------------------------------*/}
                                    <div className="col-md-6 goods-prof">
                                        <div
                                            className="form-horizontal form-bordered"
                                            style={{
                                                display: this.state.loaded ? 'block' : 'none'
                                            }}
                                        >
                                            <div
                                                className={'form-group fs-12' + (this.state.errors && this.state.errors['trend'] ? ' has-error' : '')}
                                                style={{
                                                    marginTop: '0px'
                                                }}
                                            >
                                                <label className="col-md-3 form-label">Направление</label>
                                                <div className="col-md-9">
                                                    <div className="input-group" style={{width: '210px'}}>
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-tag"/>
                                                    </span>
                                                        <select id="trend_select_edit_pro" name="trend"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*--------------------------------------Теги------------------------------------------------------*/}
                                    <div className="col-md-6 goods-prof" style={{marginTop: "-8px"}}>
                                        <div
                                            className="form-horizontal form-bordered"
                                            style={{
                                                display: this.state.loaded ? 'block' : 'none'
                                            }}
                                        >
                                            <div className="form-group fs-12">
                                                <label className="col-md-3 form-label">Теги</label>
                                                <div className="col-md-9">
                                                    <div className="input-group" style={{width: '210px'}}>
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-tags"/>
                                                    </span>
                                                        <select id="tags_goods_select_edit_pro"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr style={{margin: "25px 0px 20px 0px"}}/>
                            {/*------------------------------4----------------------------------------------*/}


                            {/*---------------------------------------------------------------------------------------------*/}

                            <div className="row goods-row-prof">
                                <div className="col-md-12" style={{paddingRight: '0px'}}>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div
                                                    className="form-horizontal form-bordered"
                                                    style={{
                                                        display: this.state.loaded ? 'block' : 'none'
                                                    }}
                                                >
                                                    <div
                                                        style={{margin: "0 5px"}}
                                                        className={
                                                            'form-group fs-12' + (this.state.errors && this.state.errors['price_purchase'] ? ' has-error' : '')
                                                        }
                                                    >
                                                        <label className="col-md-3 form-label">Цена закупки</label>
                                                        <div
                                                            className="col-md-9"
                                                            style={{
                                                                textAlign: 'right'
                                                            }}
                                                        >
                                                            <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-fw fa-upload"/>
                                                            </span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    id="purchase_price_edit_pro"
                                                                    className="form-control fs-12"
                                                                    name="price_purchase_edit_pro"
                                                                    placeholder="0.00"
                                                                    onChange={this.inputChanged}
                                                                    value={this.state.item.price_purchase}
                                                                    onBlur={this.focusLos}
                                                                    required="required"
                                                                />
                                                                <span className="input-group-addon">₴</span>
                                                            </div>
                                                            <label
                                                                className={this.state.errors && this.state.errors['price_purchase'] ? 'control-label' : 'hidden'}
                                                            >
                                                                {this.state.errors && this.state.errors['price_purchase']
                                                                    ? this.state.errors['price_purchase'].message
                                                                    : ''}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row goods-row-prof">
                                            <div className="col-md-12">
                                                <div
                                                    className="form-horizontal form-bordered"
                                                    style={{
                                                        display: this.state.loaded ? 'block' : 'none'
                                                    }}
                                                >
                                                    <div
                                                        style={{margin: "0 5px"}}
                                                        className={'form-group fs-12' + (this.state.errors && this.state.errors['price'] ? ' has-error' : '')}>
                                                        <label className="col-md-3 form-label">Цена продажи</label>
                                                        <div
                                                            className="col-md-9"
                                                            style={{
                                                                textAlign: 'right'
                                                            }}
                                                        >
                                                            <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-fw fa-upload"/>
                                                            </span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    id="price_edit_pro"
                                                                    className="form-control fs-12"
                                                                    name="price_edit_pro"
                                                                    placeholder="0.00"
                                                                    onChange={this.inputChanged}
                                                                    value={this.state.item.sale_price}
                                                                    onBlur={this.focusLos}
                                                                    required="required"
                                                                />
                                                                <span className="input-group-addon"
                                                                      style={{height: "34px"}}>₴</span>
                                                            </div>
                                                            <label
                                                                className={this.state.errors && this.state.errors['price'] ? 'control-label' : 'hidden'}>
                                                                {this.state.errors && this.state.errors['price'] ? this.state.errors['price'].message : ''}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/*-------------------------------------------------------------------------------*/}
                                        <div className="row goods-row-prof">
                                            <div className="col-md-12" style={{margin: "-7px 0"}}>
                                                <div
                                                    className="form-horizontal form-bordered"
                                                    style={{
                                                        display: this.state.loaded ? 'block' : 'none'
                                                    }}
                                                >
                                                    <div
                                                        style={{margin: "0 5px"}}
                                                        className={
                                                            'form-group fs-12' + (this.state.errors && this.state.errors['amnt_min_limit'] ? ' has-error' : '')
                                                        }
                                                    >
                                                        <label className="col-md-3 form-label">Критическое
                                                            количество</label>
                                                        <div
                                                            className="col-md-9"
                                                            style={{
                                                                textAlign: 'right'
                                                            }}
                                                        >
                                                            <div className="input-group">
                                                            <span className="input-group-addon"
                                                                  style={{height: "34.5px"}}>
                                                                <i className="fa fa-fw fa-flask"/>
                                                            </span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    id="amnt_min_limit_edit_pro"
                                                                    className="form-control fs-12"
                                                                    name="amnt_min_limit_edit_pro"
                                                                    onChange={this.inputChanged}
                                                                    value={this.state.item.amnt_min_limit}
                                                                    onBlur={this.focusLos}
                                                                    required="required"
                                                                />
                                                            </div>
                                                            <label
                                                                className={this.state.errors && this.state.errors['amnt_min_limit'] ? 'control-label' : 'hidden'}
                                                            >
                                                                {this.state.errors && this.state.errors['amnt_min_limit']
                                                                    ? this.state.errors['amnt_min_limit'].message
                                                                    : ''}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{margin: "-5px 0px"}}>
                                        <div className="row goods-row-prof">
                                            <div className="col-md-12" style={{margin: "-7px 0"}}>
                                                <div
                                                    className="form-horizontal form-bordered"
                                                    style={{
                                                        display: this.state.loaded ? 'block' : 'none'
                                                    }}
                                                >
                                                    <div className="form-group fs-12">
                                                        <label className="col-md-3 form-label">Описание</label>
                                                        <div
                                                            className="col-md-9"
                                                            style={{
                                                                textAlign: 'right'
                                                            }}
                                                        >
                                                            <div className="input-group">
                                                            <textarea
                                                                type="text"
                                                                style={{
                                                                    overflow: 'hidden',
                                                                    width: '210px',
                                                                    borderRadius: '4px'
                                                                }}
                                                                id="note_pro"
                                                                className="form-control fs-12"
                                                                name="note"
                                                                rows="7"
                                                                onChange={this.inputChanged}
                                                                value={this.state.item.note}
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

                            <div className="modal-footer row" style={{display: 'none'}}>
                                <div className="text-right">
                                    <button id="save-goods-edit-pro-form" type="button" onClick={this.editGoodPro}>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

GoodsEditPro.propTypes = {
    good_id: PropTypes.number,
    warehouse_id: PropTypes.number.isRequired,
    brands: PropTypes.array.isRequired,
    goods_tags: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onEditGood: PropTypes.func.isRequired,
    onCheckGood: PropTypes.func.isRequired,
    onClearEditedGood: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired
};

export default GoodsEditPro;
