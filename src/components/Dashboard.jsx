import React, {Component} from 'react';
import TasksWidget from './widgets/TasksWidget';
import CallsWidget from './widgets/CallsWidget';

import DragSortableList from 'react-drag-sortable'

/**
 *
 */
export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            widgets: [],
            items: [
                {name: 'Задачи', val: 'tasks'},
                {name: 'Обзвоны', val: 'calls'}
            ],
        }
    }

    componentWillUpdate(nextProps, nextState) {
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12 col-xs-12">
                        <div className="btn-group pull-right">
                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                Панель управления <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu">
                                {this.itemsToData()}
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="row mt-lg">
                        {this.widgetsToData()}
                    </div>
                </div>
            </div>
        )


    }

    itemsToData = () => {
        return this.state.items.map((item, iIndex) => {
            return <li key={'item_' + iIndex} id={iIndex}>
                <a href="#" onClick={(e) => {
                    e.preventDefault();

                    this.onItemSelect(item);
                }}>{item.name}</a>
            </li>
        });
    };

    onItemSelect = (e) => {
        const widgets = [...this.state.widgets];
        widgets.push({
            id: widgets.length,
            type: e.val,
            label: e.name
        });

        this.setState({widgets});
    };

    widgetsToData = () => {
        let datas = [];

        this.state.widgets.forEach((wid) => {
            switch (wid.label) {
                case 'Задачи':
                    datas.push({
                        content: (<TasksWidget id={wid.id} widget={wid} title="Задания" onCloseClick={this.closeWidget}/>)
                    });
                    break;
                case 'Обзвоны':
                    datas.push({
                        content: (<CallsWidget id={wid.id} widget={wid} title="Обзвоны" onCloseClick={this.closeWidget}/>)
                    })
            }
        });

        return (
            <DragSortableList items={datas} type="grid"/>
        );
    };

    closeWidget = (widget) => {
        this.setState({
            widgets: this.state.widgets.filter((w) => w !== widget)
        });
    };
}
