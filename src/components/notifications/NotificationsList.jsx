import React, {Component} from 'react';
import {FORMAT_DATE_WITH_TIME} from '../../utils'

class NotificationsList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <section className="panel panel-default">
                        <header className="panel-heading pb-lg">
                            <h2 className="panel-title">Уведомления</h2>
                        </header>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-12">
                                    {this.props.notifications ? this.mapToNotifications() :
                                        <div className="col-md-4 col-md-offset-4" style={{textAlign: 'center'}}>Уведомлений нет</div>}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }

    mapToNotifications = () => {
        return this.props.notifications.map((notification, i) => {
            return <NotificationShow
                key={'notification_' + i}
                id={notification.message.message_id}
                note_title={notification.message.title}
                note_body={notification.message.body}
                created_date={FORMAT_DATE_WITH_TIME(notification.message.date_created)}
                state={notification.state}
            />
        });
    };

    componentDidMount() {
        this.props.onLoad();
    }
}

class NotificationShow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12 col-xs-12">
                    <div className="list-group">
                        <div className="list-group-item">
                            <h4 className="list-group-item-heading">
                                <i className="fa fa-sm fa-bell mr-md"></i>
                                {this.props.note_title}
                            </h4>
                            <h5 className="list-group-item-text" style={{color: 'black', marginBottom: '10px'}}>{this.props.note_body}</h5>
                            <div className="list-group-item-text" style={{fontSize: '11px', color: 'lightgray'}}>{this.props.created_date}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default NotificationsList;