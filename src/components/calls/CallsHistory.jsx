import React, {Component} from 'react';
import ExpandedDataTableNew from '../commons/tables/ExpandedDataTableNew';
import PropTypes from 'prop-types';

import {
    FORMAT_PHONE_NUMBER,
    FORMAT_DATE_WITH_POINTS,
    FORMAT_DATE
} from '../../utils/index';


class CallsHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: this.mapToDataHistory(props.calls_history),
            search: ''
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.calls_history !== this.props.calls_history) {
            nextState.rows = this.mapToDataHistory(nextProps.calls_history);
        }
    }

    render() {
        let headers = [
            {
                text: 'ФИО клиента',
                sortable: true,
                searchable: true,
                width: '20%'
            },
            {
                text: 'Телефон',
                searchable: true,
                width: '15%'
            }
            ,
            {
                text: 'Повод',
                sortable: true,
                width: '15%'
            }
            ,
            {
                text: 'Дата',
                sortable: true,
                searchable: true,
                width: '15%'
            },
            {
                text: 'Звонил',
                sortable: true,
                searchable: true,
                width: '15%'
            },
            {
                text: 'Статус звонка',
                width: '20%'
            }
        ];

        return (
            <div id="new_calls" className="tab-pane active pl-lg pr-lg">
                <div className="row">
                    <ExpandedDataTableNew
                        headers={headers}
                        categories={this.state.rows}
                        search={this.state.search}
                        renderCategories={this.renderCalls}
                        renderItemsRowsF={this.renderItemsRows}
                        onSearchChange={this.changeSearch}
                        columnsNumber="6"
                        loading={this.props.loading}
                    />
                </div>
            </div>
        );
    }

    renderCalls = (call, ci) => {
        return (
            <tr key={'category_' + ci}>
                {this.renderCallsCells(call, ci)}
            </tr>
        );
    };

    renderCallsCells = (call, id) => {
        let data = [];
        call.values.forEach((val, vid) => {
            switch (vid) {
                case 0:
                    data.push(
                        <td style={{width: '20%'}} key={'data' + vid} className='borderless-left-right'>
                            <a href="#" style={{color: '#33353F', fontWeight: '700'}}
                               onClick={(e) => {
                                   e.preventDefault();
                                   this.props.onClientClick(call.details.client.client_id)
                               }}>
                                {val}
                            </a>
                        </td>
                    );
                    break;
                case 5:
                    data.push(
                        <td style={{width: '20%'}} key={'data' + vid} className='borderless-left-right'>
                            <span className={"label label_status_" + val.tag_id}>{val.tag_name}</span>
                        </td>
                    );
                    break;
                default:
                    data.push(
                        <td style={{width: '15%'}} key={'data' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
            }
        });
        return data;
    };

    renderItemsRows = () => null;

    mapToDataHistory = (calls_history) => {
        return calls_history.map((call, cid) => {
            return {
                values: [
                    call.client.name,
                    FORMAT_PHONE_NUMBER(call.client.phone),
                    call.title,
                    FORMAT_DATE_WITH_POINTS(call.call_date),
                    call.user_updated,
                    call.status
                ],
                details: call,
                index_cat: cid
            };
        });
    };

    changeSearch = (val) => {
        this.setState({
            search: val,
        });
    };

    componentDidMount() {
        this.props.onLoadCallsHistory(FORMAT_DATE(this.props.currentDate) + this.props.denom);
    }

}

CallsHistory.propTypes = {
    onLoadCallsHistory: PropTypes.func.isRequired,
    onClientClick: PropTypes.func.isRequired,
    calls_history: PropTypes.array.isRequired,
    loading: PropTypes.any.isRequired
};

export default CallsHistory;