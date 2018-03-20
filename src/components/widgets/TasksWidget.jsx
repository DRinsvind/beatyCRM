import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TasksWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.tasks !== nextProps.tasks) {
            nextState.tasks = this.mapToData(nextProps.tasks);
        }
    }

    render() {
        return (
            <div id={this.props.id}>
                <div className="panel panel-default">
                    <header className="panel-heading portlet-handler">
                        <div className="panel-actions">
                            <a href="#" className="panel-action panel-action-dismiss" id={"panel-" + this.props.id}
                               onClick={(e) => {
                                   e.preventDefault();

                                   this.props.onCloseClick(this.props.widget);
                               }} data-panel-dismiss> </a>
                        </div>

                        <h2 className="panel-title" style={{color: 'rgb(0,128,197)'}}>{this.props.title}</h2>
                    </header>
                    <div className="panel-body">
                        TASKS
                    </div>
                </div>
            </div>
        )
    }
}

TasksWidget.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    tasks: PropTypes.array,
    widget: PropTypes.object,
    onCloseClick: PropTypes.func
};

export default TasksWidget;