import React, {Component} from 'react';
import {FORMAT_DATE_WITH_POINTS} from '../../utils/index';
import ExpandedDataTableNew from '../commons/tables/ExpandedDataTableNew';
import PropTypes from 'prop-types';

class ClientsTabServices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            client: this.props.client,
            appointment_history: [],
            search: ''
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.client !== this.props.client) {
            nextState.client = nextProps.client;
            nextState.appointment_history = this.mapToData(nextProps.client);
        }
    }

    render() {
        return (
            <ExpandedDataTableNew
                headers={[
                    {
                        text: '',
                        width: '5%'
                    },
                    {
                        text: 'Дата',
                        sortable: true,
                        searchable: true,
                        date_search: true,
                        width: '30%'
                    },
                    {
                        text: 'Салон',
                        sortable: true,
                        searchable: true,
                        width: '35%'
                    },
                    {
                        text: 'Цена',
                        sortable: true,
                        searchable: true,
                        width: '30%'
                    }
                ]}
                categories={this.state.appointment_history}
                search={this.state.search}
                renderCategories={this.renderCategories}
                renderItemsRowsF={this.renderItemsRows}
                onSearchChange={this.changeSearch}
                columnsNumber="3"
                loading={this.props.loading}
            />
        )
    }

    mapToData = (client) => {
        let data = [];
        if (client.appointment_history.length > 0) {
            client.appointment_history.map((visit, ind) => {
                data.push({
                    values: [
                        '',
                        FORMAT_DATE_WITH_POINTS(visit.appointment_date),
                        visit.appointment_salon,
                        visit.appointment_total_cost
                    ],
                    details: visit,
                    expanded: false,
                    index_cat: ind
                });
            });
        }
        return data;
    };

    renderCategories = (category, ci) => {
        return (
            <tr key={'category_' + ci}>
                {this.renderServicesCells(category, ci)}
            </tr>
        );
    };

    renderServicesCells = (service, id) => {
        let data = [];
        service.values.forEach((val, vid) => {
            switch (vid) {
                case 0:
                    data.push(
                        <td style={{width: '5%'}} key={'data' + vid} className='borderless-left-right'>
                            <a href="#" onClick={(e) => {
                                e.preventDefault();

                                this.expandCategoryItems(id, service.expanded);
                            }}>
                                <i className={service.expanded ?
                                    "fa fa-minus-square-o h5 m-none details-control" :
                                    "fa fa-plus-square-o h5 m-none details-control"}
                                   style={{color: "#0088cc"}}
                                />
                            </a>
                        </td>
                    );
                    break;
                case 1:
                    data.push(
                        <td style={{width: '30%'}} key={'data' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 2:
                    data.push(
                        <td style={{width: '35%'}} key={'data' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 3:
                    data.push(
                        <td style={{width: '30%'}} key={'data' + vid} className='borderless-left-right'>
                            {parseFloat(val).toFixed(2) + 'грн'}
                        </td>
                    );
                    break;
                default:
                    break;
            }
        });
        return data;
    };

    renderItemsRows = (id, details) => {
        return (
            this.renderServices(details)
        );
    };

    expandCategoryItems = (idx, cat_expanded) => {
        let categories = this.state.appointment_history;
        categories = categories.map((cat) => {
            if (cat.index_cat === idx) {
                return {
                    ...cat,
                    expanded: !cat_expanded
                }
            }
            return cat;
        });

        this.setState({
            appointment_history: categories,
        });
    };

    changeSearch = (val) => {
        this.setState({
            search: val,
        });
    };

    renderServices = (details) => {
        let data = [];

        data.push(<tr key={'services_details'}>
            <td colSpan="4" style={{fontWeight: '700'}} className={details.services.length > 0 ? 'borderless-left-right' : 'hide'}>
                Услуги
            </td>
        </tr>);

        details.services.map((service, ind) => {
            data.push(<tr key={ind}>
                <td className="borderless-left-right" colSpan="2" style={{width: '35%'}}>{service.service_name}</td>
                <td className="borderless-left-right" style={{width: '35%'}}><i className="fa fa-fw fa-user-circle-o"></i><a
                    href={"/employees/profile/" + service.master_id}
                    style={{color: "#0088cc"}}>{service.trainer_name}</a></td>
                <td className="borderless-left-right"  style={{width: '30%'}}>{parseFloat(service.position_total_cost).toFixed(2) + " грн."}</td>
            </tr>)
        });

        data.push(<tr key={'goods_details'}>
            <td colSpan="4" style={{fontWeight: '700'}} className={details.products.length > 0 ? 'borderless-left-right' : 'hide'}>
                Товары
            </td>
        </tr>);

        details.products.map((product, ind) => {
            data.push(<tr key={ind}>
                <td className="borderless-left-right" colSpan="2" style={{width: '35%'}}>{product.product_name}</td>
                <td className="borderless-left-right" style={{width: '35%'}}><i className="fa fa-fw fa-user-circle-o"></i><a
                    href={"/employees/profile/" + product.master_id}
                    style={{color: "#0088cc"}}>{product.trainer_name}</a></td>
                <td className="borderless-left-right" style={{width: '30%'}}>{parseFloat(product.position_total_cost*product.product_cnt).toFixed(2) + " грн."}</td>
            </tr>)
        });

        return data;

    };

}

ClientsTabServices.propTypes = {
    client: PropTypes.object.isRequired,
};

export default ClientsTabServices;