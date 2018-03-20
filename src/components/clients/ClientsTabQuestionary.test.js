import React from 'react';
import { shallow, mount } from 'enzyme';
import ClientsTabQuestionary, { EmployeeQuestionary, EmployeeQuestionaryItem } from './ClientsTabQuestionary';

describe('ClientsTabQuestionary component tests', () => {
    const minProps = {
        onEditQuestionary: () => {},
        questions_groups: []
    };

    const minPropsEmplQuest = {
        questions: [],
        group_label: '',
        onCollectAnswers: () => {}
    };

    const minPropsItemQuest = {
        possible_answers: [],
        selectedAnswer: '',
        group_id: 0,
        question_text: '',
        answer_allowed: '',
        onAnswerSelect: () => {}
    };

    const component = shallow(<ClientsTabQuestionary {...minProps}/>);
    const componentEmpl = shallow(<EmployeeQuestionary {...minPropsEmplQuest}/>);
    const componentItem = shallow(<EmployeeQuestionaryItem {...minPropsItemQuest}/>);

    it('should render component ClientsTabQuestionary', () => {
        expect(component.length).toEqual(1);
    });

    it('should have form with title "Анкета клиента"', () => {
        expect(component.find('form').find('h4').text()).toEqual('Анкета клиента');
    });

    it('should have panel footer with 2 buttons', () => {
        expect(component.find('div.panel-footer').find('button').length).toEqual(2);
    });

    it('should have panel footer with 2 buttons: first save button', () => {
        expect(component.find('div.panel-footer').find('button').at(0).text()).toEqual('Сохранить');
    });

    // it('simulates click events of button save', () => {
    //     const onClick = sinon.spy();
    //     const wrapper = mount(<ClientsTabQuestionary {...minProps} onClick={onClick} />);
    //     wrapper.find('button').at(0).simulate('click');
    //     expect(onClick.calledOnce).toEqual(false);
    // });

    it('should have panel footer with 2 buttons: second cancel button', () => {
        expect(component.find('div.panel-footer').find('button').at(1).text()).toEqual('Отмена');
    });

    it('should render component class EmployeeQuestionary', () => {
        expect(componentEmpl.length).toEqual(1);
    });

    it('should render component class EmployeeQuestionary witch has a', () => {

        mount(<EmployeeQuestionary {...minPropsEmplQuest}/>).find('a').simulate('click');
        expect(componentEmpl.find('a').exists()).toEqual(true);
    });

    it('should render component class EmployeeQuestionary witch has a witch incude i', () => {
        expect(componentEmpl.find('a').contains(<i className={componentEmpl.state('expanded') ?
            "fa fa-minus-square-o h5 m-none details-control" :
            "fa fa-plus-square-o h5 m-none details-control"}
                                                   style={{padding: '5px', color: '#0088cc'}}
        ></i>)).toEqual(true);
    });

    it('should has i class "fa fa-minus-square-o h5 m-none details-control" when expanded = true', () => {
        componentEmpl.setState({expanded: true});
        expect(componentEmpl.find('i').hasClass('fa fa-minus-square-o h5 m-none details-control')).toEqual(true);
        expect(componentEmpl.find('div.hide').exists()).toEqual(false);
    });

    it('should has i class "fa fa-plus-square-o h5 m-none details-control" when expanded = false', () => {
        componentEmpl.setState({expanded: false});
        expect(componentEmpl.find('i').hasClass('fa fa-plus-square-o h5 m-none details-control')).toEqual(true);
        expect(componentEmpl.find('div.hide').length).toEqual(1);
    });

    it('should render component class EmployeeQuestionaryItem', () => {
        expect(componentItem.length).toEqual(1);
    });

    it('should render EmployeeQuestionaryItem with select inside', () => {
        mount(<EmployeeQuestionaryItem {...minPropsItemQuest}/>).find('Select2').simulate('select');
        expect(componentItem.find('Select2').length).toEqual(1);
    });
});
