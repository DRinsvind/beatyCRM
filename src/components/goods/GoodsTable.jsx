import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FORMAT_DATE_WITH_POINTS } from '../../utils';
import DataTable from '../commons/tables/DataTable';

/**
 *
 */

class GoodsTable extends Component {
    mapRowsToData = () => {
        const { items } = this.props;
        return items.map(item => {
            let values;
            if (+this.props.warehouse_id === 1) {
                //PROF
                values = [
                    item.is_package,
                    item.article,
                    item.good_name,
                    item.trend.trend_name,
                    item.available_qnt,
                    item.purchase_price,
                    item.sale_price,
                    FORMAT_DATE_WITH_POINTS(item.date_created)
                ];
            } else {
                //SALE
                values = [
                    item.is_package,
                    item.article,
                    item.good_name,
                    item.trend.trend_name,
                    item.purchase_price,
                    item.sale_price,
                    item.available_qnt,
                    item.available_cost ? item.available_cost : 0
                ];
            }

            if (+this.props.category_id !== 271828182) {
                values.push({
                    good_id: item.good_id,
                    is_package: item.is_package
                });
            }
            /*item.is_rentable = !item.is_critical;
            item.is_unused = !item.is_demand;
            item.is_processed = true;
            delete item.is_profit;
            delete item.is_demand*/

            //return {values, details: item, is_unused: item.is_unused, is_rentable: item.is_rentable};
            return {
                values,
                details: item,
                is_demand: item.is_demand,
                is_critical: item.is_critical
            };
        });
    };

    onItemEditClick = (good_id, is_package, type, warehouse, groupId) => {
        this.props.onItemEdit(good_id, is_package, type, warehouse, groupId);
    };

    cellRender = (row_index, cell_index, cell, details) => {
        if (+this.props.warehouse_id === 1) {
            switch (cell_index) {
                case 0:
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <i className={'fa fa-' + (Boolean(cell) ? 'cubes' : 'archive')} />
                        </div>
                    );
                case 3:
                    if (cell === ' ') {
                        return <span>&mdash;</span>;
                    } else return cell;
                case 4:
                    return cell + ' ' + details.unit;
                case 5:
                    return parseFloat(cell).toFixed(2) + ' грн.';
                case 6:
                    return parseFloat(cell).toFixed(2) + ' грн.';

                case 8:
                    return (
                        <span>
                            <a
                                className="p-xs mr-xs"
                                href={cell.is_package ? '#ModalEditSet' : '#ModalEditGoodPro'}
                                data-toggle="modal"
                                onClick={() => {
                                    this.props.onLoadUnits();
                                    this.onItemEditClick(cell.good_id, cell.is_package, 'product', 'pro', this.props.category_id);
                                }}
                            >
                                <i className="fa fa-pencil text-warning" />
                            </a>
                            <a
                                className="p-xs mr-xs"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    this.props.onRemoveGood(cell.good_id, this.props.category_id);
                                }}
                            >
                                <i className="fa fa-fw fa-trash text-danger" />
                            </a>
                        </span>
                    );
                default:
                    return cell;
                    break;
            }
        } else {
            switch (cell_index) {
                case 0:
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <i className={'fa fa-' + (Boolean(cell) ? 'cubes' : 'archive')} />
                        </div>
                    );
                case 3:
                    if (cell === ' ') {
                        return <span>&mdash;</span>;
                    } else return cell;
                case 4:
                case 5:
                case 7:
                    return parseFloat(cell).toFixed(2) + ' грн.';
                case 6:
                    return cell + ' ' + 'шт.';
                case 8:
                    return (
                        <span>
                            <a
                                className="p-xs mr-xs"
                                href={cell.is_package ? '#ModalEditSet' : '#ModalEditGoodSale'}
                                data-toggle="modal"
                                onClick={() => this.onItemEditClick(cell.good_id, cell.is_package, 'product', 'sale')}
                            >
                                <i className="fa fa-pencil text-warning" />
                            </a>
                            <a
                                className="p-xs mr-xs"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    this.props.onRemoveGood(cell.good_id, this.props.category_id);
                                }}
                            >
                                <i className="fa fa-fw fa-trash text-danger" />
                            </a>
                        </span>
                    );
                default:
                    return cell;
                    break;
            }
        }
    };

    render() {
        let headers = [];
        if (+this.props.warehouse_id === 1) {
            headers = [
                {
                    text: 'Тип',
                    sortable: true
                },
                {
                    text: 'Артикул',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'article' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'article'
                },
                {
                    text: 'Наименование',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'name' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'name'
                },
                {
                    text: 'Направление',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'brand' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'brand'
                },
                {
                    text: 'Кол-во',
                    sortable: true,
                    searchable: true
                },
                {
                    text: 'Цена закупки',
                    sortable: true,
                    searchable: true,
                    name: 'purchase_price'
                },
                {
                    text: 'Цена продажи',
                    sortable: true,
                    searchable: true,
                    name: 'sale_price'
                },
                {
                    text: 'Дата создания',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'date' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'date'
                }
            ];
        } else {
            headers = [
                {
                    text: 'Тип',
                    sortable: true
                },
                {
                    text: 'Артикул',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'article' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'article'
                },
                {
                    text: 'Наименование',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'good_name' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'good_name'
                },
                {
                    text: 'Направление',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'trend_name' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'trend_name'
                },
                {
                    text: 'Цена закупки',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'purchase_price' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'purchase_price'
                },
                {
                    text: 'Цена продажи',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'sale_price' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'sale_price'
                },
                {
                    text: 'Кол-во',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'available_qnt' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'available_qnt'
                },
                {
                    text: 'Сумма, грн.',
                    sortable: true,
                    sorted: this.props.table_sort.order === 'available_cost' ? this.props.table_sort.asc : '',
                    searchable: true,
                    name: 'available_cost'
                }
            ];
        }

        if (+this.props.category_id !== 271828182) {
            headers.push({ text: 'Функции' });
        }

        return (
            <DataTable
                headers={headers}
                data={this.mapRowsToData()}
                cellRender={this.cellRender}
                loading={this.props.loading}
                onServerSort={this.props.onTableSort}
                goods={true}
                search={this.props.search}
            />
        );
    }
}

GoodsTable.propTypes = {
    onItemEdit: PropTypes.func.isRequired,
    onRemoveGood: PropTypes.func.isRequired,
    onTableSort: PropTypes.func.isRequired,
    onLoadUnits: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    warehouse_id: PropTypes.number.isRequired,
    table_sort: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default GoodsTable;
