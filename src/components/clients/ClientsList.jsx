import React, {Component} from 'react';
import PropTypes from 'prop-types';
import picture from '../../../public/assets/images/dummy/client.jpg';
import {API_HOST} from '../../constants';
import TreeView from '../commons/TreeView';
import DataTable from '../commons/tables/DataTable';
import Pagination from '../commons/Pagination';
import {FORMAT_DATE_WITH_POINTS, FORMAT_PHONE_NUMBER} from '../../utils';

const $ = window.$;

class ClientsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clients: [],
            categories: [],
            selected_key: 0,
            selected_category_path: '/clients/',
            loading: props.loading,
            page_info: props.page_info,
            table_sort: {}
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.categories !== nextProps.categories || this.state.selected_key !== nextState.selected_key) {
            nextState.categories = this.mapToDataCategories(nextProps.categories, nextState.selected_key);
        }

        if (nextProps.page_info !== this.props.page_info) {
            nextState.page_info = nextProps.page_info;
        }

        if (this.props.clients !== nextProps.clients) {
            nextState.clients = nextProps.clients;
        }

        if (nextProps.loading !== this.props.loading) {
            nextState.loading = nextProps.loading;
            nextState.categories = this.mapToDataCategories(nextProps.categories, nextState.selected_key);
        }
    }

    onCalendarClick = (e) => {
        e.preventDefault();
        this.props.router.push('/calendar/');
    };

    toggleTree(e){
      e.preventDefault();
      $('.fa-caret-down').toggleClass('fa-caret-right');
      if($( "li" ).hasClass( "jstree-open" )){
        $( "li" ).removeClass("jstree-open");
        $( "li" ).addClass('jstree-closed');
      } else {
        $( "li" ).removeClass('jstree-closed');
        $( "li" ).addClass('jstree-open');
      }
    }

    render() {
        return (
            <section className="content-with-menu">
                <div className="content-with-menu-container">
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="nano-content">
                                <div className="inner-menu-content">
                                    <div className="sidebar-widget m-none">
                                        <div className="widget-header mt-md">
                                            <a href="#" className="toggle-link" onClick={this.toggleTree}>
                                            <i className="fa fa-caret-down" aria-hidden="true" style={{'margin-right':'5px'}}></i>
                                                <h6 className="title"
                                                    style={{paddingTop: 5, 'display': 'inline-block'}}>
                                                      КАТЕГОРИИ
                                                </h6>
                                            </a>
                                        </div>
                                        <div className="widget-content">
                                            <TreeView items={this.state.categories}
                                                      onItemSelect={this.onItemSelect}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </menu>

                    <div className="inner-body mg-main">
                        <div className="row">
                            <div className="col-md-12">
                                <section className="panel panel-default">
                                    <header className="panel-heading">
                                        <h2 className="panel-title">Клиенты</h2>
                                    </header>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <ClientsTable items={this.state.clients}
                                                              onEditRow={this.onEditRow}
                                                              onDeleteRow={this.onDeleteRow}
                                                              router={this.props.router}
                                                              loading={this.state.loading}
                                                              onTableSort={this.tableSort}
                                                              table_sort={this.state.table_sort}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 text-right mt-md">
                                                <Pagination
                                                    active={this.state.page_info.page}
                                                    total={this.state.page_info.pages}
                                                    loading={this.state.loading}
                                                    onChangeActivePage={this.changeActivePage}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    componentDidMount() {
        this.props.onLoad();
        this.props.onClearClientsList();
    }

    mapToDataCategories = (categories, category_id) => {
        const loadNodes = (items) => {
            return items.map((item) => {
                if (item.items) {
                    return {
                        item: item,
                        id: item.key,
                        text: item.category_name,
                        children: loadNodes(item.items),
                        state: item.key === category_id ? {
                            opened: true,
                            selected: true,
                            disabled: this.state.loading
                        } : {
                            opened: true,
                            selected: false,
                            disabled: this.state.loading
                        }

                    };
                }

                return {
                    item: item,
                    id: item.key,
                    text: item.category_name,
                    type: 'file',
                    state: item.key === category_id ? {
                        selected: true,
                        disabled: this.state.loading
                    } : {
                        selected: false,
                        disabled: this.state.loading
                    }
                };
            });
        };

        return loadNodes(categories);
    };

    // EVENTS

    changeActivePage = (active_page) => {
        if (active_page !== this.state.page_info.page) {
            this.setState({
                ...this.state,
                page_info: {
                    ...this.state.page_info,
                    page: active_page
                }
            });
            let params = '?page=' + active_page;
            const asc_param = (this.state.table_sort.order ?
                                    ('&order=' + this.state.table_sort.order + '&asc=' +
                                        (this.state.table_sort.asc === 'asc' ? 1 : 0)
                                    ) : '');
            params = params + asc_param;
            this.props.onLoadClientsWithParams(this.state.selected_category_path + params);
        }
    };

    tableSort = (order, asc) => {
        this.setState({
            ...this.state,
            table_sort: {
                order: order,
                asc: asc
            }
        });
        const asc_par = (asc === 'asc' ? 1 : 0);
        const par = '?page=' + this.state.page_info.page + '&order=' + order + '&asc=' + asc_par;
        this.props.onLoadClientsWithParams(this.state.selected_category_path + par);

    };

    onItemSelect = (selected) => {
        this.props.onLoadClientsWithParams(selected.item.path);
        this.setState({
            clients: [],
            selected_key: selected.id,
            selected_category_path: selected.item.path,
            table_sort: {}
        });

    };

    onEditRow = (client) => {
        if (this.props.onEditItem) {
            this.props.onEditItem(this.props.router, client);
        }
    };

    onDeleteRow = (client) => {
        if (this.props.onDeleteItem) {
            this.props.onDeleteItem(this.props.router, client);
        }
    };
}

ClientsList.propTypes = {
    clients: PropTypes.array,
    categories: PropTypes.array.isRequired,
    // EVENTS
    onLoad: PropTypes.func.isRequired,
    onEditItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onClearClientsList: PropTypes.func.isRequired,
    onLoadClientsWithParams: PropTypes.func.isRequired
};

ClientsList.defaultProps = {
    clients: [],
    categories: []
};


export class ClientsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            load: props.loading
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.items !== this.props.items) {
            nextState.rows = this.mapToData(nextProps.items);
        }

        if (this.props.loading !== nextProps.loading) {
            nextState.load = nextProps.loading;
        }
    }

    render() {
        return (
            <DataTable
                headers={[
                    {
                        text: 'Ф. И. О.',
                        sortable: true,
                        sorted: (this.props.table_sort.order === 'name' ? this.props.table_sort.asc : ''),
                        searchable: true,
                        name: 'name'
                    },
                    {
                        text: 'Дата рождения',
                        sortable: true,
                        sorted: (this.props.table_sort.order === 'date' ? this.props.table_sort.asc : ''),
                        searchable: true,
                        date_birth_search: true,
                        name: 'date'
                    },
                    {
                        text: 'Телефон',
                        searchable: true,
                        phone_client_number: true
                    },
                    {
                        text: 'Категория'
                    },
                    {
                        text: 'Функции'
                    }
                ]}
                data={this.state.rows}
                detailed={true}
                detailsRender={this.detailsRender}
                cellRender={this.cellRender}
                customSearch={this.customSearch}
                loading={this.state.load}
                onServerSort={this.props.onTableSort}
            />
        );
    }

    mapToData = (props) => {
        return props.map((client) => {
            return {
                values: [
                    client.client_name,
                    client.date_birth,
                    FORMAT_PHONE_NUMBER(client.main_contact),
                    {
                        category_id: client.category ? client.category.category_id : null,
                        category_name: client.category ? client.category.category_name : ''
                    },
                    client.client_id
                ],
                details: client
            };
        });
    };

    // EVENTS
    onEditClick = (e, client_id) => {
        e.preventDefault();
        this.props.router.push('/clients/edit/' + client_id);
    };

    onCalendarClick = (e) => {
        e.preventDefault();
        this.props.router.push('/calendar/');
    };

    onItemClick = (e, client_id) => {
        e.preventDefault();
        this.props.router.push('/clients/profile/' + client_id);
    };

    detailsRender = (details) => {
        return (<table className="table mb-none borderless ml-lg">
            <tbody>
            {this.renderServices(details)}
            </tbody>
        </table>)
    };

    renderServices = (details) => {
        return <tr>
            <td className="borderless">
                <div className="row">
                    <div className="col-md-2">
                        <img className="img-responsive"
                             src={details.photo !== null ? API_HOST + details.photo : picture}
                             style={{width: '100%'}}
                             alt="Фото клиента"/>
                    </div>
                    <div className="col-md-3 pl-lg">
                        {this.renderProfileElements("row mb-md", details.sex === 'M' ? "fa fa-fw fa-male" : "fa fa-fw fa-female",
                            details.sex === 'M' ? "Мужской" : "Женский")}
                        {this.renderProfileElements(details.date_birth ? "row mb-md" : "hide", "fa fa-fw fa-birthday-cake",
                            details.date_birth ? FORMAT_DATE_WITH_POINTS(details.date_birth) : '')}
                        {this.renderProfileElements(this.mapToDataPhones(details.contacts).length > 0 ? "row mb-sm" : "hide", "fa fa-fw fa-phone",
                            this.mapToDataPhones(details.contacts))}
                        {this.renderProfileElements(this.mapToDataEmails(details.contacts).length > 0 ? "row mb-sm" : "hide", "fa fa-fw fa-envelope",
                            this.mapToDataEmails(details.contacts))}
                    </div>
                    <div className="col-md-7">
                        <h5 className={details.note === '' ? 'hidden' : 'row'}>
                            <div className="col-md-1">
                                <i className="fa fa-fw fa-info-circle"/>
                            </div>
                            <div className="col-md-11">
                                {details.note}
                            </div>
                        </h5>
                        <h5 className="row">
                            <div className="col-md-1">
                                <i className="fa fa-fw fa-area-chart"></i>
                            </div>
                            <div className="col-md-11">
                                <div className="col-md-5" style={{padding: '0px'}}>
                                    <p>{FORMAT_DATE_WITH_POINTS(details.last_appointment.appointment_date)}</p>
                                    <p style={{fontWeight: '200'}}>{details.last_appointment.appointment_salon}</p>
                                </div>
                                {this.mapToDataLastAppointment(details.last_appointment.services)}
                            </div>
                        </h5>
                        <h5 className={details.last_call ? "row" : "hide"}>
                            <div className="col-md-1">
                                <i className="fa fa-fw fa-volume-control-phone"></i>
                            </div>
                            <div className="col-md-11">
                                {details.last_call ? FORMAT_DATE_WITH_POINTS(details.last_call) : ''}
                            </div>
                        </h5>
                        {/*<h5 className={this.mapToDataRelatives(details.relative).length > 0 ? "row mt-sm" : "hide"}>*/}
                        {/*<div className="col-md-1 pr-sm">*/}
                        {/*<i className="fa fa-fw fa-cloud"></i>*/}
                        {/*</div>*/}
                        {/*<div className="col-md-11 pl-sm">*/}
                        {/*{this.mapToDataRelatives(details.relative)}*/}
                        {/*</div>*/}
                        {/*</h5>*/}
                    </div>
                </div>
            </td>
        </tr>;
    };

    renderProfileElements = (hclass, iclass, spancont) => {
        return (
            <h5 className={hclass}>
                <div className="col-md-1 pr-sm">
                    <i className={iclass}></i>
                </div>
                <div className="col-md-10 pl-sm">
                    <span>{spancont}</span>
                </div>
            </h5>
        );
    };


    cellRender = (row_index, cell_index, data, details) => {
        switch (cell_index) {
            case 0:
                return <a href="#" style={{
                    color: '#33353F',
                    fontWeight: '700'
                }} onClick={(e) => this.onItemClick(e, details.client_id)}>
                    {data}
                </a>;
            case 1:
                return data ? FORMAT_DATE_WITH_POINTS(data) : <span>&mdash;</span>;
            case 2:
                return data;
            case 3:
                return <span style={{fontSize: '1em', fontWeight: '300'}}
                             className={"label mr-xs label-client-" + data.category_id }>
        {data.category_name}
        </span>;
            case 4:
                return (
                    <span>
        <a className="p-xs" href="#" onClick={(e) => this.onEditClick(e, data)}>
        <i className="fa fa-fw fa-pencil text-warning"></i>
        </a>
                        {/*<a className="p-xs mr-xs" href="#" onClick={(e) => this.onCalendarClick(e)}>*/}
                        {/*<i className="fa fa-fw fa-calendar text-success"></i>*/}
                        {/*</a>*/}
        </span>);
            default:
                break;
        }
    };

    // EVENTS
    onEditClick = (e, client_id) => {
        e.preventDefault();
        this.props.router.push('/clients/edit/' + client_id);
    };

    onCalendarClick = (e) => {
        e.preventDefault();
        this.props.router.push('/calendar/');
    };

    onItemClick = (e, client_id) => {
        e.preventDefault();
        this.props.router.push('/clients/profile/' + client_id);
    };

    renderProfileElements = (hclass, iclass, spancont) => {
        return (
            <h5 className={hclass}>
                <div className="col-md-1 pr-sm">
                    <i className={iclass}></i>
                </div>
                <div className="col-md-10 pl-sm">
                    <span>{spancont}</span>
                </div>
            </h5>
        );
    };

    mapToDataPhones = (contacts) => {
        return contacts.filter((contact) => contact.contact_type === 'MOBILE_PHONE')
            .map((contact, idx) => {
                return (
                    <div className="mb-xs" key={idx}>
                        <span style={{color: "#0088cc"}}>{FORMAT_PHONE_NUMBER(contact.contact)}</span>
                    </div>
                );
            });
    };

    mapToDataEmails = (contacts) => {
        return contacts.filter((contact) => contact.contact_type === 'EMAIL')
            .map((contact, idx) => {
                return (
                    <div className="mb-xs" key={idx}>
                        <span style={{color: "#0088cc"}}>{contact.contact}</span>
                    </div>
                )
            });
    };

    mapToDataRelatives = (relatives) => {
        return relatives.map((relative) => {
            return (
                <a href={"/clients/profile/" + relative.client_id} style={{color: "#0088cc"}}
                   key={relative.client_id}>
                    {relative.client_name}
                </a>
            )
        });
    };

    mapToDataLastAppointment = (services) => {
        return (
            <div className="col-md-7" style={{borderLeft: '1px solid #ccc'}}>
                {services.map((service, idx) => {
                    return <div key={idx}>
                        <p className="mb-xs">{service.service_name}</p>
                        <div className="mb-md"><i className="fa fa-fw fa-user-circle-o"></i><a
                            href={"/employees/profile/" + service.master_id}
                            style={{color: "#0088cc"}}>{service.trainer_name}</a></div>
                    </div>
                })}
            </div>
        )
    };
}

ClientsTable.propTypes = {
    items: PropTypes.array,
    onEditRow: PropTypes.func.isRequired,
    onDeleteRow: PropTypes.func.isRequired,
    onTableSort: PropTypes.func
};

export default ClientsList;
