import React, {Component} from 'react';
import DatePicker from '../commons/DatePicker';
import Moment from 'moment';
import PropTypes from 'prop-types';

const $ = window.$;

class SideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCalendar: false
        }
    }

    render() {
        return (
            <menu id="content-menu" className="inner-menu" role="menu" style={{border: 'none'}}>
                <div className="nano">
                    <div className="nano-content p-none">
                        <div className="inner-menu-content">
                            <div className="sidebar-widget" style={{margin: '20px 35px'}}>
                                <div className="widget-header text-center">
                                    <h6 className="title" style={{color: 'white'}}>
                                        <a href="#" className={this.state.showCalendar ? 'hide': ''} style={{color: '#465162', fontSize: '1em', marginRight: '18%'}}
                                           onClick={(e) => {
                                               e.preventDefault();
                                               let date = new Date(this.props.currentDate);
                                               let newDate = date.getDate() - 1;
                                               date.setDate(newDate);
                                               this.props.onCurrentDateChange(date);
                                           }}>
                                            <i className='fa fa-fw fa fa-angle-double-left'/>
                                        </a>
                                        {this.state.showCalendar ? 'КАЛЕНДАРЬ' : this.formatDate(this.props.currentDate)}
                                        <a href="#" className={this.state.showCalendar ? 'hide': ''} style={{color: '#465162', fontSize: '1m', marginLeft: '18%'}}
                                           onClick={(e) => {
                                               e.preventDefault();
                                               let date = new Date(this.props.currentDate);
                                               let newDate = date.getDate() + 1;
                                               date.setDate(newDate);
                                               this.props.onCurrentDateChange(date);
                                           }}>
                                            <i className='fa fa-fw fa fa-angle-double-right'/>
                                        </a>
                                        <a href="#" className="pull-right"
                                           style={{color: '#465162', fontSize: '0.8em'}}
                                           onClick={(e) => {
                                               e.preventDefault();
                                               $('#smallCalendar').stop().slideToggle(() => {
                                                   this.setState({
                                                       showCalendar: !this.state.showCalendar
                                                   });
                                               })
                                           }}>
                                            <i className={'fa fa-fw fa-chevron-' + (this.state.showCalendar ? 'up' : 'down')}/>
                                        </a>
                                    </h6>
                                </div>
                                <div id="smallCalendar"
                                     className="widget-content"
                                     style={{display: this.state.showCalendar ? 'block' : 'none'}}>
                                    <DatePicker
                                        date={this.props.currentDate}
                                        onDateChanged={this.props.onCurrentDateChange}
                                    />
                                </div>
                            </div>

                            <section className="panel mb-none" style={{display: 'block'}}>
                                <div className="panel-body p-xs"
                                     style={{background: '#ECEDF0', borderRadius: '0px'}}>
                                    <div className="row mb-xs m-xs">
                                        <h5 style={{color: 'black', fontWeight: 'bold'}}>Касса за день</h5>
                                        <table className="table table-hover">
                                            <tbody>
                                            {this.renderRow('', 'На утро в кассе', this.props.details ? parseFloat(this.props.details.cash_balance).toFixed(2) : '')}
                                            {this.renderRow('red_table_color', 'ДОХОД', this.props.details ? parseFloat(this.props.details.income).toFixed(2) : '')}
                                            {this.renderRow('', 'Расход', this.props.details ? parseFloat(this.props.details.consumption).toFixed(2) : '')}
                                            {this.renderRow('', 'Положено на счет', '')}
                                            {this.renderRow('red_table_color', 'ВСЕГО', this.props.details ? parseFloat(this.props.details.total).toFixed(2) : '')}
                                            {this.renderRow('table_boder_bottom', 'Внутренние перемещения', this.props.details ? parseFloat(this.props.details.inner_transaction).toFixed(2) : '')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </menu>
        );
    }

    renderRow = (tdclass, text, val) => {
        return (
            <tr>
                <td style={{padding: '1px'}} className={tdclass}>{text}</td>
                <td style={{padding: '1px'}} className={tdclass}>{val}</td>
            </tr>
        );
    };

    formatDate = (dateCreated) => {
        const date = new Date(dateCreated);
        Moment.locale('ru');
        return Moment(date).format('DD MMM YYYY');
    }
}

SideMenu.propsTypes = {
    currentDate: PropTypes.any.isRequired,
    changeDateOnClick: PropTypes.func.isRequired,
    details: PropTypes.object.isRrequired
};

export default SideMenu;