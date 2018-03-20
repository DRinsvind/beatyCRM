import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownTreeView from '../commons/dropDowns/DropDownTreeView';
import {DEFINE_DOUBLE_NUMBER, DEFINE_INT_NUMBER} from '../../utils/index';
import {__mapToGoodsDataTags} from '../../utils/renderUtils'
const $ = window.$;

/**
 *
 */
class GoodsEditSale extends Component {
    constructor(props) {
        super(props);
        this.editGoodSale = this.editGoodSale.bind(this);
        this.state = {
            item: this.mapToData(props),
            loaded: false,
            goods_tags: [],
            tags: __mapToGoodsDataTags(props.good_exp),
            errors: {},
            units: [],
            isChanged: false,
            brands: [],
            good_exp: ''
        };
    }

    componentDidMount() {
        ($ => {
            $('#ModalEditGoodSale').on('hidden.bs.modal', () => {
                document.querySelector('#formEditGoodSale').reset();
                this.setState({tags: [], errors: {}, item: this.itemDefaultState()});
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

        if (nextState.errors['undefined']) {
            nextState.errors = {};
        }

        if (this.props.good_exp !== nextProps.good_exp && nextProps.good_exp !== null) {
            nextState.item = this.mapToData(nextProps);
            nextState.tags = __mapToGoodsDataTags(nextProps.good_exp);
            nextState.goods_tags = this.dataForTagsSelect(nextProps.goods_tags, nextProps.good_exp);
            nextState.brands = this.dataForBrandsSelect(nextProps.brands, nextProps.good_exp.trend);

            if ($('#brand_select_edit_sale').data('select2')) {
                $('#brand_select_edit_sale').empty();
            }

            $('#brand_select_edit_sale')
                .select2({
                    theme: 'bootstrap',
                    placeholder: 'Выберите бренд',
                    width: '100%',
                    data: this.dataForBrandsSelect(nextProps.brands, nextProps.good_exp.trend),
                    tags: true
                })
                .on('change', e => {
                    nextState.item.trend = parseFloat(e.target.value);
                });

            if ($('#tags_goods_select_sale').data('select2')) {
                $('#tags_goods_select_sale').empty();
            }

            $('#tags_goods_select_sale')
                .select2({
                    theme: 'bootstrap',
                    placeholder: 'Выберите теги',
                    width: '100%',
                    multiple: true,
                    tags: true,
                    data: nextState.goods_tags
                })
                .off('select2:select select2:unselect')
                .on('select2:select', this.tagChanged)
                .on('select2:unselect', this.delTag);
        }

        if (this.props.units !== nextProps.units) {
            nextState.units = this.unitsSelect(nextProps.units);
        }

        if (this.props.errors !== nextProps.errors) {
            if (!nextProps.errors.success) {
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
            price: 0,
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
                price: props.good_exp.sale_price || 0,
                price_purchase: props.good_exp.purchase_price || 0,
                tags: props.good_exp.tags || [],
                unit: props.good_exp.unit || '',
                amnt_min_limit: props.good_exp.amnt_min_limit || 0,
                brand: props.good_exp.trend || '',
                note: props.good_exp.note || ''
            }
            : {
                good_id: '',
                good_name: '',
                category_id: null,
                article: '',
                barcode: '',
                price: 0,
                price_purchase: 0,
                tags: [],
                amnt_min_limit: 0,
                multi_use: 0,
                brand: '',
                good_exp: '',
                note: ''
            };
    };
    focusLos = e => {
        e.preventDefault();
        let val = e.target.name;
        let value = e.target.value;
        let data = {};

        switch (val) {
            case 'name_sale':
                val = 'product_name';
                break;
            case 'price_sale':
                val = 'price';
                break;
            case 'barcode_sale':
                val = 'barcode';
                break;
            case 'article_sale':
                val = 'article';
                break;
            case 'amnt_min_limit_sale':
                val = 'amnt_min_limit';
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
                    data.push({id: tag.tag_id, text: tag.tag_name, selected: true});
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
                return {text: brand.trend_name, id: brand.trend_id, selected: true};
            }
            return {text: brand.trend_name, id: brand.trend_id};
        });

        if (selected_brand === ' ') {
            result.unshift({text: '', id: ''});
        }
        return result;
    };

    checkForErrors = name => {
        switch (name) {
            case 'per_piece_qnt':
                name = 'amount';
                break;
            case 'per_package_qnt':
                name = 'package';
                break;
            default:
                break;
        }

        this.state.errors[name] ? delete this.state.errors[name] : '';
    };

    inputChangedSale = e => {
        let val = e.target.name;
        let value = e.target.value;
        switch (val) {
            case 'product_name':
                val = 'good_name';
                break;
            case 'price_sale':
                val = 'price';
                break;
            case 'sale_price':
                val = 'price';
                break;
            case 'barcode_sale':
                val = 'barcode';
                break;
            case 'article_sale':
                val = 'article';
                break;
            case 'amnt_min_limit_sale':
                val = 'amnt_min_limit';
                break;
            default:
                val = e.target.name;
                break;
        }
        this.setState({good_exp: val});

        e.preventDefault();
        this.checkForErrors(val);
        let state = {
            item: this.state.item
        };
        state.item[val] = value;
        this.setState(state);
    };

    categoryChanged = categoryNewId => {
        this.setState({item: Object.assign({}, this.state.item, {category_id: categoryNewId})});
    };

    unitsSelect = units => {
        return units.map((unit, i) => {
            return (
                <li key={i}>
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();

                            let obj = this.state.item;

                            obj.transfer_form.unit_id = unit.unit_id;
                            obj.transfer_form.unit_name = unit.unit_name;
                            this.setState({item: obj});
                        }}
                    >
                        {unit.unit_name}
                    </a>
                </li>
            );
        });
    };

    editGoodSale = () => {
        let err = this.state.errors;
        let data;

        if (this.state.item.good_name === '') {
            err['product_name'] = {
                message: 'Укажите название'
            };
        }

        if (this.state.item.price === '0') {
            err['price'] = {
                message: 'Укажите цену продажи'
            };
        }

        if (this.state.item.price_purchase === '0') {
            err['price_purchase'] = {
                message: 'Укажите цену закупки'
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
        if (!err.success && Object.keys(err).length !== 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!'
            };
            this.props.onNotifyShow(error);
        } else {
            data = {
                product_name: this.state.item.good_name,
                price: +this.state.item.price,
                price_purchase: +this.state.item.price_purchase,
                tags: this.state.tags,
                trend: this.state.item.trend || this.state.item.brand.trend_id
            };

            if (this.state.item.amnt_min_limit !== 0 && this.state.item.amnt_min_limit !== '') {
                data.amnt_min_limit = this.state.item.amnt_min_limit;
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

            if (this.state.item.amnt_min_limit !== 0 && this.state.item.note !== '') {
                data.amnt_min_limit = +this.state.item.amnt_min_limit;
            }

            let warehouseName = this.props.warehouse_id === 1 ? 'pro' : 'sale';
            this.props.onEditGoodSale(this.state.item.good_id, data, this.state.item.category_id, warehouseName);
            window.$('#ModalEditGoodSale').modal('hide');
            this.setState({tags: [], goods_tags: [], brands: [], item: this.itemDefaultState()});
        }
    };

    render() {
        return (
            <div className="modal-goods-add-set-sale">
                <div className="row">
                    <div className="col-md-12" style={{padding: '0px'}}>
                        <div className="row goods-row">
                            <div className="col-md-12" style={{paddingRight: '0px'}}>
                                {/*--------------------Название------------------------*/}
                                <div className="col-md-6">
                                    <div>
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
                                                    id="product_name"
                                                    className="form-control fs-12"
                                                    name="product_name"
                                                    onChange={this.inputChangedSale}
                                                    value={this.state.item.good_name}
                                                    placeholder="Название товара"
                                                    onBlur={this.focusLos}
                                                    required="required"
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
                                <div className="col-md-6">
                                    <div>
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
                                                        id="barcode_sale"
                                                        className="form-control fs-12"
                                                        name="barcode_sale"
                                                        placeholder="Штрих-код"
                                                        onBlur={this.focusLos}
                                                        onChange={this.inputChanged}
                                                        value={this.state.item.barcode}
                                                        required="required"
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
                        <div className="row goods-row">
                            <div className="col-md-12" style={{paddingRight: '0px'}}>
                                {/*--------------------Бренд------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div
                                            className={'form-group fs-12' + (this.state.errors && this.state.errors['category_id'] ? ' has-error' : '')}
                                            style={{
                                                marginBottom: '0px'
                                            }}
                                        >
                                            <label className="col-md-3 form-label">Бренд</label>
                                            <div className="col-md-9" style={{marginBottom: "-5px"}}>
                                                <DropDownTreeView
                                                    items={this.props.categories}
                                                    category_id={this.state.item.category_id}
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
                                            className={'form-group fs-12' + (this.state.errors && this.state.errors['article'] ? ' has-error' : '')}>
                                            <label className="col-md-3 form-label">Артикул</label>
                                            <div className="col-md-9">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-slack"/>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="article_sale"
                                                        className="form-control fs-12"
                                                        name="article_sale"
                                                        placeholder="Артикул"
                                                        onBlur={this.focusLos}
                                                        onChange={this.inputChanged}
                                                        value={this.state.item.article}
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
                        <div className="row goods-row">
                            <div className="col-md-12" style={{paddingRight: '0px'}}>
                                {/*--------------------------------------Направление------------------------------------------------------*/}
                                <div className="col-md-6">
                                    <div>
                                        <div
                                            className={'form-group fs-12' + (this.state.errors && this.state.errors['trend'] ? ' has-error' : '')}
                                            style={{
                                                marginTop: '0px'
                                            }}
                                        >
                                            <label className="col-md-3 form-label">Направление</label>
                                            <div className="col-md-9">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-tag"/>
                                                    </span>
                                                    <select id="brand_select_edit_sale"/>
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
                                                    <select id="tags_goods_select_sale"/>
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
                                                        'form-group fs-12' + (this.state.errors && this.state.errors['price_purchase'] ? ' has-error' : '')
                                                    }
                                                >
                                                    <label className="col-md-3 form-label">Цена закупки</label>
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
                                                                onChange={this.inputChangedSale}
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
                                    <div className="row goods-row">
                                        <div className="col-md-12">
                                            <div>
                                                <div
                                                    className={'form-group fs-12' + (this.state.errors && this.state.errors['price'] ? ' has-error' : '')}>
                                                    <label className="col-md-3 form-label goods-two-lines">Цена продажи</label>
                                                    <div className="col-md-9 goods-row-padding-right">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-fw fa-upload"/>
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                id="price_sale"
                                                                className="form-control fs-12"
                                                                name="price_sale"
                                                                placeholder="0.00"
                                                                onChange={this.inputChangedSale}
                                                                value={this.state.item.price}
                                                                onBlur={this.focusLos}
                                                                required="required"
                                                            />
                                                            <span className="input-group-addon">₴</span>
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
                                    <div className="row goods-row">
                                        <div className="col-md-12">
                                            <div>
                                                <div
                                                    className={
                                                        'form-group fs-12' + (this.state.errors && this.state.errors['amnt_min_limit'] ? ' has-error' : '')
                                                    }
                                                >
                                                    <label className="col-md-3 form-label">Критическое
                                                        количество</label>
                                                    <div
                                                        className="col-md-9 goods-row-padding-right"
                                                    >
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-fw fa-flask"/>
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                id="amnt_min_limit_sale"
                                                                className="form-control fs-12"
                                                                name="amnt_min_limit_sale"
                                                                onBlur={(e) => {
                                                                    +e.target.value !== 0 && this.focusLos(e)
                                                                }}
                                                                onChange={this.inputChangedSale}
                                                                value={this.state.item.amnt_min_limit}
                                                                required="required"
                                                            />
                                                            <span
                                                                className="input-group-addon">{this.state.item.unit}</span>
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
                                <div className="col-md-6">
                                    <div className="row goods-row">
                                        <div className="col-md-12" style={{paddingLeft: "0px"}}>
                                            <div>
                                                <div className="form-group fs-12">
                                                    <label className="col-md-3 form-label">Описание</label>
                                                    <div className="col-md-9 goods-row-padding-right">
                                                        <div className="input-group">
                                                            <textarea
                                                                type="text"
                                                                id="note"
                                                                className="form-control fs-12 goods-add-textarea"
                                                                name="note"
                                                                rows="6"
                                                                onChange={this.inputChangedSale}
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

                        <div className="modal-footer row display-none">
                            <div className="text-right">
                                <button id="save-goods-edit-sale-form" type="button" onClick={this.editGoodSale}>
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*-------------------------------------------------------------------------------------------*/}
            </div>
        );
    }
}

GoodsEditSale.propTypes = {
    good_id: PropTypes.number,
    warehouse_id: PropTypes.number.isRequired,
    brands: PropTypes.array.isRequired,
    goods_tags: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onEditGoodSale: PropTypes.func.isRequired,
    onCheckGood: PropTypes.func.isRequired,
    onClearEditedGood: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired
};

export default GoodsEditSale;
