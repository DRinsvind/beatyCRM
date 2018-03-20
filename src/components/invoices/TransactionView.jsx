import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FORMAT_DATE_WITH_POINTS} from '../../utils/index';

class TransactionView extends Component {
    render() {
        const date = this.props.invoice.date_doc ? FORMAT_DATE_WITH_POINTS(this.props.invoice.date_doc) : '';
        return (
            <section className="panel panel-default">
                <header className="panel-heading custom-heading">
                    <h2 className="panel-title">
                        <div className="panel-title-name">
                            {this.props.invoice.type}
                        </div>
                    </h2>
                </header>
                <div className="panel-body">
                    <div className="row mt-lg">
                        <div className="col-md-12">
                            <div>
                                <label className="inventoryLabels">
                                    <i className="fa fa-fw fa-tag"
                                       style={{color: 'rgb(170,181,191)'}}></i> {this.props.invoice.num_doc}
                                </label>
                                <label className="inventoryLabels">
                                    <i className="fa fa-fw fa-calendar"
                                       style={{color: 'rgb(170,181,191)'}}></i> {date}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-lg">
                        <div className="col-md-6">
                            <div className="list-group">
                                {this.rederListItem('Со склада', this.props.invoice.from_warehouse)}
                                {this.rederListItem('Товар', this.props.invoice.production_item ? this.props.invoice.production_item.good_name : '')}
                                {this.rederListItem('Количество', this.props.invoice.production_item ?
                                    this.props.invoice.production_item.good_cnt + ' ' + this.props.invoice.production_item.unit : '')}
                            </div>
                        </div>
                        {/*<div className="col-md-1" style={{textAlign: 'center', marginTop: '2.5%'}}>*/}
                        {/*<div className="row">*/}
                        {/*<i className="fa fa-lg fa-arrow-right"></i>*/}
                        {/*</div>*/}
                        {/*<div className="row mt-md">*/}
                        {/*<i className="fa fa-lg fa-arrow-right"></i>*/}
                        {/*</div>*/}
                        {/*<div className="row mt-md">*/}
                        {/*<i className="fa fa-lg fa-arrow-right"></i>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        <div className="col-md-6">
                            <div className="list-group">
                                {this.rederListItem('На склад', this.props.invoice.to_warehouse)}
                                {this.rederListItem('Товар', this.props.invoice.invoice_item ? this.props.invoice.invoice_item.good_name : '')}
                                {this.rederListItem('Количество', this.props.invoice.invoice_item ?
                                    this.props.invoice.invoice_item.good_cnt + ' ' + this.props.invoice.production_item.unit : '')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    rederListItem = (text, value) => {
        return (
            <div className="list-group-item">
                <div className="row">
                    <div className="col-md-4">
                        <label style={{fontWeight: 'bold', fontSize: 14}}>
                            {text}
                        </label>
                    </div>
                    <div className="col-md-8">
                        <label style={{fontWeight: 'bold', fontSize: 14}}>
                            {value}
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

TransactionView.propTypes = {
    invoice: PropTypes.object.isRequired
};

export default TransactionView;