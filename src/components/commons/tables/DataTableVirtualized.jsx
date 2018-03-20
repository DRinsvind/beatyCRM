import React, {Component} from 'react';
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css';


class DataTableVirtualized extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: '',
            loading: !Boolean(this.props.data.length),
            width: 0,
            headers: this.renderHeader()
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            // this.renderHeader();
            nextState.width = nextProps.width;
            if (nextProps.headers !== this.props.headers) {
                nextState.headers = this.renderHeader();
            }
        }
    }


    render() {
        const list = [
            {
                type: <i className="fa fa-bell"></i>,
                article: 'Артикул123',
                name: 'Название123',
                price: '<i className="fa fa-bell"></i>',
                count: 'Наличие123',
                func: this.props.cellRender ? this.props.cellRender(0, 0, true) : 'Default functions'
            }
        ];


        return (
            <div className="dataTable mt-md">
                <div className="row datatables-header form-inline">
                    <div className="col-md-6"/>
                    <div className="col-md-6">
                        <div className="input-group pull-right mb-md" style={{width: '50%'}}>
                            <input
                                id="q"
                                name="q"
                                type="text"
                                className="form-control"
                                placeholder="Поиск..."
                                value={this.state.search}
                                onChange={(e) => {
                                    e.preventDefault();
                                    this.searchChange(e.target.value);
                                }}
                            />
                            <span className="input-group-btn" style={{width: '0'}}>
								<button className="btn btn-default text-free">
                                    <i className="fa fa-search"/>
                                </button>
							</span>
                        </div>
                    </div>
                </div>


                <Table
                    width={this.state.width}
                    height={300}
                    headerHeight={20}
                    rowHeight={30}
                    rowCount={list.length}
                    rowGetter={({index}) => list[index]}
                    // rowRenderer={this.rowRender}
                >
                    {this.state.headers}
                </Table>

            </div>
        )
    }

    rowRender = () => {
        // return (
        //     <div className="ReactVirtualized__Table__row" key="55">
        //         <div className="ReactVirtualized__Table__rowColumn" style={{flex: '0 1 200px'}}>{this.props.cellRender(0, 0, true)}</div>
        //         <div className="ReactVirtualized__Table__rowColumn" style={{flex: '0 1 200px'}}>{this.props.cellRender(0, 1, 'Артикул')}</div>
        //         <div className="ReactVirtualized__Table__rowColumn" style={{flex: '0 1 200px'}}>{this.props.cellRender(0, 2, 'Что-то')}</div>
        //         <div className="ReactVirtualized__Table__rowColumn" style={{flex: '0 1 200px'}}>{this.props.cellRender(0, 3, 100)}</div>
        //         <div className="ReactVirtualized__Table__rowColumn" style={{flex: '0 1 200px'}}>{this.props.cellRender(0, 4, 200)}</div>
        //         <div className="ReactVirtualized__Table__rowColumn" style={{flex: '0 1 200px'}}>{this.props.cellRender(0, 5, {
        //             good_id: 1,
        //             is_package: true
        //         })}</div>
        //     </div>
        // );
    };


    renderRow = () => {
        let row;

        row = [(
            <tr key="origin">
                {this.renderCells(this.props.data, this.props.index)}
            </tr>
        )];

        // if (this.props.detailed && this.state.expanded) {
        //     let details = null;
        //
        //     if (this.props.detailsRender) {
        //         details = this.props.detailsRender(this.props.details);
        //     }
        //
        //     row.push(
        //         <tr key="details">
        //             <td colSpan={(this.props.data.length + 1).toString()} style={{borderTop: '0px'}}>
        //                 {details}
        //             </td>
        //         </tr>
        //     );
        // }

        return row;
    };

    renderCells = (values, row_index) => {
        const cells = values.map((cell, cell_index) => {
            if (this.props.cellRender) {
                return (
                    <td key={'cell_' + cell_index} className="borderless-left-right"
                        style={this.state.expanded ? {
                            borderBottom: '0px',
                            verticalAlign: 'middle'
                        } : {borderBottom: '5px', verticalAlign: 'middle'}}>
                        {
                            this.props.good ?
                                this.props.cellRender(this.props.good, cell_index, cell, this.props.details, this.props.onCellValueChanged)
                                :
                                this.props.cellRender(row_index, cell_index, cell, this.props.details, this.props.onCellValueChanged)
                        }
                    </td>
                );
            }

            return (
                <td key={'cell_' + cell_index} className="borderless-left-right">
                    {cell}
                </td>
            );
        });

        if (this.props.detailed) {
            cells.unshift(
                <td key={'cell_details'} className="borderless-left-right">
                    <a href="#" onClick={this.expandClick}>
                        <i className={this.state.expanded ?
                            "fa fa-minus-square-o h5 m-none details-control" :
                            "fa fa-plus-square-o h5 m-none details-control"}
                           style={{color: "#0088cc"}}
                        ></i>
                    </a>
                </td>
            );
        }

        return cells;
    };


    renderHeader = () => {
        return this.props.headers.map((header, idx) => {
            return (
                <Column
                    key={idx}
                    width={200}
                    label={header.text}
                    dataKey={header.dataKey}/>
            );
        });
    }
}

export default DataTableVirtualized;
