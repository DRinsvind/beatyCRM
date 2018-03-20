import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

class ClientsTabQuestionary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clients_answers: this.props.questions_groups,
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            nextState.clients_answers = nextProps.questions_groups;
        }
    }

    render() {
        return (
            <div id="questionary" className="tab-pane">
                <form className="form-horizontal">
                    <h4 className="mb-xlg">Анкета клиента</h4>
                    {this.mapToQuestions()}
                </form>
                <div className="panel-footer">
                    <div className="row">
                        <div className="col-md-12 text-right">
                            <button type="button" className="btn btn-primary mr-sm" onClick={this.onSave}>
                                <i className="fa fa-fw fa-save"></i>
                                Сохранить
                            </button>
                            <button type="reset" className="btn btn-default" onClick={this.onCancel}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    mapToQuestions = () => {
        return this.state.clients_answers.map((question, qIndex) => {
            return <EmployeeQuestionary
                key={'question_' + qIndex}
                id={qIndex}
                group_label={question.title}
                questions={question.items}
                onCollectAnswers={this.collectAnswer}
            />
        });
    };

    collectAnswer = (group_id, item_id, newValue) => {
        let answers = this.state.clients_answers;
        answers[group_id].items[item_id].client_answer = newValue;

        this.setState({
            clients_answers: answers,
        });
    };

    createData = () => {
        let answers = [];

        this.state.clients_answers.forEach((group) => {
            group.items.forEach((item) => {
                answers.push({id: item.reference_id, value: item.client_answer});
            })
        });

        return answers;
    };

    onSave = (e) => {
        e.preventDefault();

        let data = this.createData();

        this.props.onEditQuestionary(data, +this.props.client_id);
    };

    onCancel = () => {
        this.props.router.goBack();
    };
}

ClientsTabQuestionary.propTypes = {
    onEditQuestionary: PropTypes.func.isRequired,
    questions_groups: PropTypes.array.isRequired
};

/**
 *
 */
export class EmployeeQuestionary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12 col-xs-12">
                    <div className="panel-group" id="accordion">
                        <div className="panel panel-default">
                            <div className="panel-heading" style={{backgroundColor: 'white', padding: '3px'}}>
                                <div className="panel-title">
                                    <h5 style={{margin: '0px'}}>
                                        <a href='#' onClick={(e) => {
                                            e.preventDefault();
                                            this.setState({
                                                expanded: !this.state.expanded
                                            });
                                        }}
                                            className="panelHeading" style={{textDecoration: 'none'}}>
                                            <i className={this.state.expanded ?
                                                "fa fa-minus-square-o h5 m-none details-control" :
                                                "fa fa-plus-square-o h5 m-none details-control"}
                                               style={{padding: '5px', color: '#0088cc'}}
                                            ></i>
                                            {this.props.group_label}
                                        </a>
                                    </h5>
                                </div>
                            </div>
                            <div className={this.state.expanded ? '' : 'hide'}>
                                <div className="panel-body" style={{backgroundColor: 'white', border: 'none'}}>
                                    {this.mapToQuestions()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    mapToQuestions = () => {
        if (this.props.questions === undefined) {
            return null;
        }
        return this.props.questions.map((question, index) => {
            return <EmployeeQuestionaryItem
                key={question.reference_id + '_' + index}
                id={index}
                group_id={this.props.id}
                question_text={question.reference_title}
                possible_answers={question.possible_answers}
                selected_answer={question.client_answer}
                answer_allowed={question.custom_answer_allowed}
                onAnswerSelect={this.props.onCollectAnswers}
            />
        });
    };
}

EmployeeQuestionary.propTypes = {
    questions: PropTypes.array,
    group_label: PropTypes.string.isRequired,
    onCollectAnswers: PropTypes.func.isRequired
};

/**
 *
 */
export class EmployeeQuestionaryItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-11 col-md-offset-1">
                    <div className="input-group">
                        <label>{this.props.question_text}</label>
                        <div className="input-group-btn" style={{fontSize: "12px"}}>
                            <Select2
                                id={'select_' + this.props.id}
                                className="form-control" style={{width: "220px", height: '28px'}}
                                data-tags={this.props.answer_allowed ? 'true' : 'false'}
                                data={this.mapToData()}
                                value={!parseInt(this.props.selected_answer) ? 'Выберите ответ' : this.props.selected_answer}
                                onSelect={this.onChange}
                            />
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        );
    }

    mapToData = () => {
        const answers = [];
        if (!parseInt(this.props.selected_answer)) {
            answers.push({
                reference_item_id: '0',
                reference_item_value: this.props.selected_answer
            });
        }

        return answers.concat(this.props.possible_answers)
            .map((answer) => {
                return {
                    id: answer.reference_item_id,
                    text: answer.reference_item_value
                }
            });
    };

    onChange = (e) => {
        this.props.onAnswerSelect(this.props.group_id, this.props.id, e.target.value);
    }
}

EmployeeQuestionaryItem.propTypes = {
    possible_answers: PropTypes.array.isRequired,
    selectedAnswer: PropTypes.any,
    group_id: PropTypes.number.isRequired,
    question_text: PropTypes.string.isRequired,
    answer_allowed: PropTypes.any.isRequired,
    onAnswerSelect: PropTypes.func.isRequired
};

export default ClientsTabQuestionary;