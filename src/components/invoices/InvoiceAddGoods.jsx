import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TreeView from '../commons/TreeView';
import DataTable from '../commons/tables/DataTable';

const $ = window.$;

class InvoiceAddGoods extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: this.mapToDataCategories(props.categories, props.category_id),
            category_id: props.category_id,
            goods: [],
            selectedCategoryName: 'Товары',
            goods_state: [],
            loading: true,
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.category_id === this.props.category_id) {
            return false;
        }
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            if (this.props.sel_action !== nextProps.sel_action) {
                nextState.goods_state = [];
                nextState.goods = [];
                nextState.selectedCategoryName = 'Товары';
            }
            if (nextProps.categories !== this.props.categories || nextProps.category_id !== this.props.category_id) {
                nextState.categories = this.mapToDataCategories(nextProps.categories, nextProps.category_id);
            }
            if (nextProps.goods !== this.props.goods) {
                nextState.goods = nextProps.goods;
                nextState.loading = false;
            }
            if (nextProps.removed_id !== this.props.removed_id) {
                this.removeGood(nextProps.removed_id);
            }
            if (nextProps.isAddGoods) {
                setTimeout(function () {
                    $('#addGoodsButton').trigger('click');
                }, 1000);
            }
        }

    }

    mapToDataCategories = (categories, category_id) => {
        let i = 0;
        const loadNodes = (items) => {
            return items.map((item) => {
                i++;
                if (item.subgroup && item.subgroup.length > 0) {
                    return {
                        item: item,
                        id: item.good_group_id,
                        text: item.good_group_name,
                        children: loadNodes(item.subgroup),
                        state: item.good_group_id === category_id ? {
                            opened: true,
                            selected: true
                        } : {
                            opened: true,
                            selected: false,
                        }
                    };
                }

                return {
                    item: item,
                    id: item.good_group_id,
                    text: item.good_group_name,
                    type: 'file',
                    state: item.good_group_id === category_id ? {
                        selected: true
                    } : {
                        selected: false
                    }
                };
            });
        };

        return loadNodes(categories);
    };

    mapToDataRows = (goods, goods_state) => {
        return goods.map((good) => {
            const arr = goods_state.filter((good_st) => (+good_st.good.good_id === +good.good_id));

            let state_checked = false;

            if (arr.length > 0) {
                state_checked = arr[0].values[2];
            }

            return {
                good: good,
                values: [
                    state_checked,
                    good.article,
                    good.good_name

                ]
            }
        })
    };

    cellRender = (data, cell_index, value, details, changeCallback) => {
        switch (cell_index) {
            case 0:
                return (
                    <div className="checkbox-custom checkbox-primary">
                        <input type="checkbox"
                               id={data.good_id + cell_index}
                               onChange={(e) => {
                                   changeCallback(data, cell_index, e.target.checked);
                               }}
                               defaultChecked={value}/>
                        <label/>
                    </div>
                );
            default:
                return value;
        }
    };

    addGoods = (e) => {
        e.preventDefault();
        const data = this.state.goods_state.filter((item) => (item.values[2])).map((item) => {
            return item.good
        });
        this.props.onGoodsSelect(data);
        window.$('#ModalAddGoods').modal('hide');
    };

    removeGood = (id) => {
        this.setState({
            goods_state: this.state.goods_state.filter((item) => (+item.good.good_id !== +id))
        });
    };

    onItemSelect = (category) => {
        this.setState({
            selectedCategoryName: category.text
        });
        this.props.onCategorySelect(category.id, 'product', this.props.werhouse_id === 0 ? 'sale' : 'pro', '');
    };

    selectAllGoods = (e) => {
        e.preventDefault();

        const state = this.state.goods.map((good) => {

            return {
                good: good,
                values: [
                    good.article,
                    good.good_name,
                    true
                ]
            }
        });

        const new_goods = state.filter((element) => (!this.contains(this.state.goods_state, element)));
        this.state.goods_state = this.state.goods_state.map((element) => {
                for (let i = 0; i < state.length; i++) {
                    if (+element.good.good_id === +state[i].good.good_id) {
                        element.values[2] = true;
                    }
                }
                return element;
            }
        );

        let g = this.state.goods_state;
        g.push(...new_goods);
        this.setState({goods_state: g});
    };

    unSelectAllGoods = (e) => {
        e.preventDefault();

        const state = this.state.goods.map((good) => {

            return {
                good: good,
                values: [
                    good.article,
                    good.good_name,
                    false
                ]
            }
        });

        const del_goods = state.filter((element) => (this.contains(this.state.goods_state, element)));
        this.setState({
            goods_state: this.state.goods_state.map((element) => {
                    for (let i = 0; i < del_goods.length; i++) {
                        if (+element.good.good_id === +del_goods[i].good.good_id) {
                            element.values[2] = false;
                        }
                    }
                    return element;
                }
            )
        });
    };

    contains = (a, obj) => {
        for (let i = 0; i < a.length; i++) {
            if (a[i].good.good_id === obj.good.good_id) {
                return true;
            }
        }
        return false;
    }

    render() {
        console.log('PROPS_STATE', this.props, this.state);
        return (
            <div className="content-with-menu-container">
                <div className="row">
                    <div className="col-md-3" style={{overflowY: 'auto', height: 400}}>
                        <TreeView items={this.state.categories}
                                  onItemSelect={this.onItemSelect}/>
                    </div>
                    <div className="col-md-9">
                        <section>
                            <header>
                                <h2 className="panel-title">{this.state.selectedCategoryName}</h2>
                            </header>
                            <div>
                                <div className="row" style={{overflow: 'auto', height: 400}}>
                                    <div className="col-md-12">
                                        <DataTable
                                            headers={[
                                                {
                                                    text: '',
                                                    style: {width: "30px"}
                                                },
                                                {
                                                    text: 'Артикул',
                                                    searchable: true,
                                                    sortable: true,
                                                    style: {width: "60px"}
                                                },
                                                {
                                                    text: 'Название товара',
                                                    sortable: true,
                                                    searchable: true
                                                }
                                            ]}
                                            data={this.mapToDataRows(this.state.goods, this.state.goods_state)}
                                            detailed={false}
                                            cellRender={this.cellRender}
                                            onCellValueChanged={(data, cell_index, value) => {
                                                let flag = false;
                                                let g_states = this.state.goods_state;

                                                g_states.map((good) => {
                                                    if (+good.good.good_id === +data.good_id) {
                                                        flag = true;
                                                        good.values[2] = value;
                                                    }
                                                });

                                                if (!flag) {
                                                    g_states.push({
                                                        good: data,
                                                        values: [
                                                            value,
                                                            data.article,
                                                            data.good_name
                                                        ]
                                                    });
                                                }
                                                this.setState({
                                                    goods_state: g_states,
                                                });
                                                console.log('this.state', this.state);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={this.state.goods.length > 0 ? 'row' : 'hidden'}>
                                    <div className="col-md-12 mt-md text-left">
                                        <a href="#" className="btn btn-primary mr-sm" onClick={this.selectAllGoods}>Выбрать
                                            все</a>
                                        <a href="#" className="btn btn-primary" onClick={this.unSelectAllGoods}>Снять
                                            выбор</a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="modal-footer hide">
                    <div className="text-right">
                        <button
                            type="button"
                            id="addGoodsButton"
                            className="btn btn-primary mr-sm"
                            onClick={this.addGoods}
                        >
                            <i className="fa fa-fw fa-save"/>&nbsp;Сохранить
                        </button>
                        <button
                            type="button"
                            className="btn btn-default"
                            data-dismiss="modal"
                        >
                            <i className="fa fa-fw fa-times"/>&nbsp;Отмена
                        </button>
                    </div>
                </div>
            </div>
        )
    }

}

InvoiceAddGoods.propTypes = {
    onCategorySelect: PropTypes.func.isRequired,
    onGoodsSelect: PropTypes.func.isRequired,
    removed_id: PropTypes.any,
    categories: PropTypes.array.isRequired,
    goods: PropTypes.array.isRequired,
    category_id: PropTypes.number.isRequired,
    werhouse_id: PropTypes.any
};

export default InvoiceAddGoods;