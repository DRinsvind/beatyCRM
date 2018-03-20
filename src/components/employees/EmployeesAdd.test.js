import React from 'react';
import {shallow, mount} from 'enzyme';
import EmployeesAdd from './EmployeesAdd';

describe('EmployeesAdd component tests', () => {
    const minProps = {
        salons: [],
        posts: [],
        roles: [],
        onNotifyShow: () => {},
        onLoad : () => {}
    };

    const component = shallow(<EmployeesAdd {...minProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });

    it('should have one tab "adding_tab"', () => {
        expect(component.find('li#adding_tab').exists()).toBe(true);
    });

    it('should have one tab "adding_tab" named "Добавление сотрудника"', () => {
        expect(component.find('li#adding_tab').text()).toEqual('Добавление сотрудника');
    });

    it('should have GeneralInfoBlock with title "Персональная информация" into adding tab', () => {
        expect(component.find('div.tab-content').find('GeneralInfoBlock').exists()).toBe(true);
        expect(component.find('div.tab-content').find('h4').at(0).text()).toEqual('Персональная информация');
    });

    it('should have 4 h4 tags', () => {
        expect(component.find('h4').length).toEqual(4);
    });

    it('should have 4 h4 tags: second named "Контакты"', () => {
        expect(component.find('h4').at(1).text()).toEqual('Контакты');
    });

    it('should have 4 h4 tags: third named "Занимаемые должности"', () => {
        expect(component.find('h4').at(2).text()).toEqual('Занимаемые должности');
    });

    it('should have 4 h4 tags: fourth named "Авторизационная информация"', () => {
        expect(component.find('h4').at(3).text()).toEqual('Авторизационная информация');
    });

    it('should have tags select', () => {
        expect(component.find('select#tags_select').exists()).toBe(true);
    });

    it('should have checkbox input witch allowed access', () => {
        expect(component.find('div.checkbox-custom').find('input').exists()).toBe(true);
    });

    it('should have checkbox input witch allowed access', () => {
        // expect(component.find('div.checkbox-custom').find('input').prop('checked')).toEqual(true);
    });

    it('should have AuthorizationInfoBlock block', () => {
        expect(component.find('AuthorizationInfoBlock').exists()).toBe(true);
    });

    it('should have panel footer with two buttons', () => {
        expect(component.find('div.panel-footer').find('button').length).toEqual(2);
    });

    it('should have panel footer with two buttons: first save', () => {
        // mount(<EmployeesAdd {...minProps}/>).find('div.panel-footer').find('button').at(0).simulate('click');
        expect(component.find('div.panel-footer').find('button').at(0).text()).toEqual('Сохранить');
    });

    it('should have panel footer with two buttons: first cancel', () => {
        expect(component.find('div.panel-footer').find('button').at(1).text()).toEqual('Отмена');
    });

    it('should have minimum 1 phone input', () => {
        expect(component.state('contacts')[0].contact_type).toEqual('MOBILE_PHONE');
    });

    it('should have minimum 1 email input', () => {
        expect(component.state('contacts')[1].contact_type).toEqual('EMAIL');
    });

    it('should have minimum 1 post block of inputs', () => {
        expect(component.state('posts').length).toEqual(1);
    });
});
