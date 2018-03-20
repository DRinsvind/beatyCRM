import React, {Component} from 'react';
import ExpandedDataTableNew from '../commons/tables/ExpandedDataTableNew';
import PropTypes from 'prop-types';
import {FORMAT_DATE_WITH_TIME} from '../../utils';

class ClientsTabCalls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            calls: this.callsToData(props.calls),
            search: ''
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.calls) {
            nextState.calls = nextProps.calls;
            nextState.calls = this.callsToData(nextProps.calls);
        }
    }

    render() {
        return (
            <ExpandedDataTableNew
                headers={[
                    {
                        text: 'Дата/Время',
                        sortable: true,
                        searchable: true,
                        width: '25%'
                    },
                    {
                        text: 'Повод',
                        sortable: true,
                        searchable: true,
                        width: '25%'
                    },
                    {
                        text: 'Администратор',
                        sortable: true,
                        searchable: true,
                        width: '25%'
                    },
                    {
                        text: 'Статус звонка',
                        sortable: true,
                        searchable: true,
                        width: '25%'
                    }
                ]}
                categories={this.state.calls}
                search={this.state.search}
                renderCategories={this.renderCalls}
                renderItemsRowsF={this.renderItemsRows}
                onSearchChange={this.changeSearch}
                columnsNumber="4"
                loading={this.props.loading}
            />
        )
    }

    renderItemsRows = () => null;

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
                case 3:
                    const result = (val === null) ? <span>&mdash;</span> : <span className={"label label_status_" + val.tag_id}>{val.tag_name}</span>;
                    data.push(
                        <td style={{width: '20%'}} key={'data' + vid} className='borderless-left-right'>
                            {result}
                        </td>
                    );
                    break;
                default:
                    data.push(
                        <td style={{width: '25%'}} key={'data' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
            }
        });
        return data;
    };


    callsToData = (calls) => {
        return calls.map((call, cid) => {
            return {
                values: [
                    FORMAT_DATE_WITH_TIME(call.call_date),
                    call.title,
                    call.user_updated,
                    call.status
                ],
                details: call,
                index_cat: cid
            }
        });
    };

    changeSearch = (val) => {
        this.setState({
            search: val,
        });
    };
}

ClientsTabCalls.propTypes = {
    calls: PropTypes.array.isRequired,
};

export default ClientsTabCalls;