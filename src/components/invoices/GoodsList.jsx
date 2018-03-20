import React, {Component} from 'react';
import ExpandedDataTable from '../commons/tables/ExpandedDataTable';
import PropTypes from 'prop-types';
import {DEFINE_DOUBLE_NUMBER} from '../../utils/index';

class InventoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            search: ''
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            if (nextProps.categories) {
                nextState.categories = nextProps.categories;
            }
        }
    }

    render() {
        return (
            <ExpandedDataTable
                headers={this.dataForInventoryTable()}
                categories={this.state.categories}
                itemValues={this.mapToDataRows}
                onTableSortClick={this.onSort}
                search={this.state.search}
                onSearchChange={this.searchChange}
                renderCategories={this.renderCategories}
                columnsNumber={14}
                someData={() => {}}
                renderCell={this.rendCells}
                border={true}
            />
        )
    }

    dataForInventoryTable = () => {
        return [
            {
                text: 'Артикул',
                sortable: true,
                searchable: true
            },
            {
                text: 'Наименование',
                sortable: true,
                searchable: true
            },
            {
                text: 'Кол-во на начало периода',
                sortable: true,
                searchable: true
            },
            {
                text: 'Приход',
                sortable: true,
                searchable: true
            },
            {
                text: 'Перемещение',
                sortable: true,
                searchable: true
            },
            {
                text: 'Списание',
                sortable: true,
                searchable: true
            },
            {
                text: 'Возврат',
                sortable: true,
                searchable: true
            },
            {
                text: 'Расход',
                sortable: true,
                searchable: true
            },
            {
                text: 'Кол-во на конец периода',
                sortable: true,
                searchable: true
            },
            {
                text: 'Кол-во на конец периода (факт)',
                sortable: true,
                searchable: true
            },
            {
                text: 'Сумма остатков (грн.)',
                sortable: true,
                searchable: true
            },
            {
                text: 'Расхождение (шт.)',
                sortable: true,
                searchable: true
            },
            {
                text: 'Цена за единицу',
                sortable: true,
                searchable: true
            },
            {
                text: 'Расхождение (грн.)',
                sortable: true,
                searchable: true
            },
            {
                text: ''
            }
        ]
    };

    onSort = () => {
        let categories = this.state.categories;
        categories.forEach((category) => {
            category.expanded = true;
        });
        this.setState({categories: categories});
    };

    mapToDataRows = (category) => {
        let data = [];

        category.goods.forEach((good) => {
            data.push({
                values: [
                    good.article,
                    good.good_name,
                    good.initial_quantity + ' ' + good.unit,
                    good.invoice,
                    good.transition,
                    good.production,
                    good.returning,
                    good.consumption,
                    good.remained_quantity + ' ' + good.unit,
                    good.actual_quantity ? good.actual_quantity : '',
                    good.remained_sum,
                    good.variance_quantity + ' ' + good.unit,
                    good.receipt_price,
                    good.variance_sum,
                    ''
                ],
                details: good
            })
        });

        return data;
    };

    renderCategories = (category, ci) => {
        return (
            <tr key={'category_' + ci}
                style={{backgroundColor: 'rgb(252, 254, 180)'}}>
                <td className='' colSpan={14}>
                    {category.values[0]}
                </td>
                <td className='borderless-left-right'>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();

                        this.expandCategoryItems(ci, category.expanded);
                    }}>
                        <i className={"fa fw fa-caret-" + (category.expanded || this.state.search !== '' ? 'up' : 'down')}></i>
                    </a>
                </td>
            </tr>
        );
    };

    searchChange = (data) => {
        let categories = this.state.categories;

        if (data !== '') {
            categories.forEach((category) => {
                category.expanded = true;
            });
        } else {
            categories.forEach((category) => {
                category.expanded = false;
            });
        }

        this.setState({
            categories: categories,
            search: data
        });
    };

    rendCells = (values, idx, cid, details) => {
        return values.map((value, i) => {
            if (i === 9) {
                return (
                    <td key={i}>
                        <div className="center-block">
                            <input
                                style={{width: '100%'}}
                                className="form-control text-right"
                                name='quantity'
                                type="text"
                                value={value}
                                onChange={(e) => {
                                    this.props.changeInputInventory(cid, details.good_id, e.target.value);
                                }}
                            />
                        </div>
                    </td>
                );
            } else {
                return (
                    <td key={i} className={i === 14 ? 'borderless-left-right' : ''}>{value}</td>
                );
            }
        });
    };

    expandCategoryItems = (idx, cat_expanded) => {
        let categories = this.state.categories;
        categories[idx].expanded = !cat_expanded;

        this.setState({
            categories: categories,
        });
    };
}

InventoryList.propTypes = {
    categories: PropTypes.array,
};

export default InventoryList;
