import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExpandedDataTableNew from '../commons/tables/ExpandedDataTableNew';

class ServicesAddTable extends Component {

    render() {
        let headers = [
            {
                text: 'Сотрудник',
                sortable: true,
                searchable: true,
                width: '50%'
            },
            {
                text: 'Цена ',
                sortable: true,
                searchable: true,
                width: '50%'
            }
        ];



        return (
            <ExpandedDataTableNew
                headers={headers}
                categories={this.mapRowsToData()}
                search=''//{this.props.search}
                renderCategories={this.renderCalls}
                renderItemsRowsF={(e) => null}
                onSearchChange={this.props.changeSearch}
                columnsNumber="2"
                loading={false}
                //{this.props.loading}
            />
        );
    }

    mapRowsToData = () => {

        const {items} = this.props;

        return items.map((item, iid) => {

            let values = [
                item.employee,
                item.price
            ];

            let idx = iid;
            if (+this.props.category_id !== 271828182) {
                values.push(item.service_id)
            }

            return {
                values: values,
                details: [],
                index_cat: idx
            };
        });
    };

    renderCalls = (service, ci) => {
        return (
            <tr key={'category_' + ci}>
                {this.renderServCells(service, ci)}
            </tr>
        );
    };

    renderServCells = (service, id) => {
        let data = [];

        service.values.forEach((val, vid) => {
            switch (vid) {
                case 0:
                    data.push(
                        <td style={{width: '50%'}} key={'data' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 1:
                    data.push(
                        <td style={{width: '50%'}} key={'data' + vid} className='borderless-left-right'>
                            {val + ' грн'}
                        </td>
                    );
                    break;
                // case 2:
                //     data.push(
                //         <td style={{width: '25%'}} key={'data' + vid} className='borderless-left-right'>
                //             {parseFloat(val).toFixed(2) + 'грн.'}
                //         </td>
                //     );
                //     break;
                // case 3:
                //     data.push(
                //         <td style={{width: '15%'}} key={'data' + vid} className='borderless-left-right'>
                //             <span>
                //                 <a className="p-xs mr-xs"
                //                     href={"#ModalEdit"}
                //                     data-toggle="modal"
                //                     onClick={() => this.onItemEditClick(val)}>
                //                         <i className="fa fa-pencil text-warning"/>
                //                 </a>
                //                 <a className="p-xs mr-xs" href="#"
                //                     onClick={(e) => {
                //                     e.preventDefault();
                //                     this.props.onRemoveService(val, this.props.category_id)}}>
                //                     <i className="fa fa-fw fa-trash text-danger"/>
                //                 </a>
                //             </span>
                //         </td>
                //     );
                //     break;
                default:
                    break;
            }
        });
        return data;
    };

    // onItemEditClick = (service_id) => {
    //     this.setState({service_id});
    //
    //     this.props.onItemEdit(service_id);
    // };
}

ServicesAddTable.propTypes = {
    items: PropTypes.array.isRequired
    // category_id: PropTypes.number.isRequired,
    // onRemoveService: PropTypes.func.isRequired,
    // onItemEdit: PropTypes.func.isRequired
};

export default ServicesAddTable;