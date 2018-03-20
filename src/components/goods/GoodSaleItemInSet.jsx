import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownTreeView from '../commons/dropDowns/DropDownTreeView';

import * as net from '../../utils/network';
import * as can from '../../constants';

const $ = window.$;

class GoodSaleItemInSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods_list: [],
            categories: []
        };
    }

    componentDidMount() {
        if (this.state.categories !== this.props.categories) {
            this.setState({categories: this.props.categories});
        }
    }

    componentWillUpdate(nextProps, nextState) {
        nextState.goods_list = this.mapToDataGoods(nextState.goods_list);
        let id = '#good_set_add_select_sale' + this.props.id;
        if (nextState.goods_list.length === 0) {
            $(id).attr('disabled', true);
        } else {
            $(id).attr('disabled', false);
        }
    }

    componentDidUpdate() {
        let data = this.state.goods_list;
        let id = '#good_set_add_select_sale' + this.props.id;
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

    mapToDataCategories = (categories, category_id) => {
        let i = 0;
        const loadNodes = items => {
            return items.map(item => {
                i++;
                if ((item.subgroup && item.subgroup.length > 0) || item.is_root) {
                    return {
                        item: item,
                        id: item.good_group_id,
                        text: item.good_group_name,
                        children: loadNodes(item.subgroup),
                        state:
                            item.good_group_id === category_id
                                ? {
                                    opened: true,
                                    selected: true,
                                    disabled: this.state.loading
                                }
                                : {
                                    opened: true,
                                    selected: false,
                                    disabled: this.state.loading
                                }
                    };
                }

                return {
                    item: item,
                    id: item.good_group_id,
                    text: item.good_group_name,
                    type: 'file',
                    state:
                        item.good_group_id === category_id
                            ? {
                                selected: true,
                                disabled: this.state.loading
                            }
                            : {
                                selected: false,
                                disabled: this.state.loading
                            }
                };
            });
        };

        return loadNodes(categories);
    };

    mapToDataGoods = goods => {
        if (goods.length !== 0) {
            let temp_goods = goods.map(good => {
                return {text: good.good_name, id: good.good_id};
            });
            temp_goods.unshift({text: '', id: ''});
            return temp_goods;
        } else {
            return goods;
        }
    };

    goodRemovedClick = () => {
        this.props.errors['good' + this.props.id] ? delete this.props.errors['good' + this.props.id] : '';
        this.props.errors['amount_good' + this.props.id] ? delete this.props.errors['amount_good' + this.props.id] : '';
        this.props.onGoodRemoved(this.props.id);
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
                this.props.state,
                can.API_GOODS.getGoodsWithinGroup
                    .replace(/\{groupId}/, category_id)
                    .replace(/\{goodsType}/, 'product')
                    .replace(/\{warehouse}/, 'sale')
            )
            .then(json => {
                this.setState({goods_list: json.data});
            });
    };

    goodsChanged = e => {
        this.props.errors['good' + this.props.id] ? delete this.props.errors['good' + this.props.id] : '';
        let data = {
            category_id: this.props.category_id,
            good_id: e.target.value,
            amount: this.props.amount
        };
        this.props.onGoodChanged(this.props.id, data);
    };

    amountChanged = e => {
        this.props.errors['amount_good' + this.props.id] ? delete this.props.errors['amount_good' + this.props.id] : '';
        this.props.errors[this.props.id] ? delete this.props.errors[this.props.id] : '';
        let data = {
            category_id: this.props.category_id,
            good_id: this.props.selected_good,
            amount: e.target.value
        };

        this.props.onGoodChanged(this.props.id, data);
    };

    render() {
        return (
            <div className="col-md-6" style={{marginTop: '20px'}}>
                {/*------------------------------Бренд--------------------------------------*/}
                <div>
                    <div className="row goods-set-item-row fs-12">
                        <label className="col-md-3 form-label">Бренд</label>
                        <div className="col-md-9" style={{marginBottom: "-5px"}}>
                            <DropDownTreeView
                                items={this.props.categories || this.state.categories}
                                placeholder="Выберите бренд"
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
                    <div
                        className={'row goods-set-item-row fs-12' + (this.props.errors && this.props.errors['good' + this.props.id] ? ' has-error' : '')}>
                        <label className="col-md-3 form-label">Товар {this.props.id + 1}</label>
                        <div
                            className="col-md-9"
                            style={{
                                textAlign: 'left'
                            }}
                        >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-fw fa-list-alt"/>
                                </span>
                                <select id={'good_set_add_select_sale' + this.props.id} onChange={this.goodsChanged}/>
                            </div>
                        </div>
                    </div>
                </div>
                {/*-------------------------------Кол-во-----------------------------------------*/}
                <div>
                    <div
                        className={'fs-12 row goods-set-item-row' + (this.props.errors && this.props.errors['amount_good' + this.props.id] ? ' has-error' : '')}>
                        <label className="col-md-3 form-label">Количество</label>
                        <div
                            className="col-md-9"
                            style={{
                                textAlign: 'left'
                            }}
                        >
                            <div className="input-group">
                                <div className="input-group-addon">
                                    <i className="fa fa-fw fa-glass"/>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    id={this.props.id}
                                    className="form-control fs-12"
                                    name="quantity"
                                    disabled={this.props.disabled}
                                    placeholder="0"
                                    onChange={this.amountChanged}
                                    value={this.props.amount}
                                />
                            </div>
                            <label
                                className={this.props.errors['quantity' + this.props.id] || this.props.errors[this.props.id] ? 'control-label' : 'hidden'}>
                                {this.props.errors['amount_good' + this.props.id]
                                    ? this.props.errors['amount_good' + this.props.id].message
                                    : this.props.errors[this.props.id] ? this.props.errors[this.props.id].message : ''}
                            </label>
                        </div>
                        <div>
                            <a
                                className={this.props.length > 2 ? 'col-md-1 pl-xs mt-xs' : 'hide'}
                                style={{marginLeft: '140px', cursor: 'pointer'}}
                                onClick={this.goodRemovedClick}
                            >
                                <i className="fa fa-fw fa-lg fa-trash"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GoodSaleItemInSet.propTypes = {
    length: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    goods_list: PropTypes.array,
    selected_good: PropTypes.number.isRequired,
    selected_unit: PropTypes.string,
    errors: PropTypes.object.isRequired,
    onGoodChanged: PropTypes.func.isRequired,
    onGoodRemoved: PropTypes.func.isRequired,
    onLosFocus: PropTypes.func.isRequired,
    onUnitChange: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired
};

export default GoodSaleItemInSet;
