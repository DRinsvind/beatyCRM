import React from 'react';
import {shallow} from 'enzyme';
import EmployeesList from './EmployeesList';

describe('EmployeesList component tests', () => {
    const minProps = {
        employees: [],
        salons: [],
        posts: [],
        roles: [],
        categories: [],
        tags_list: [],
        server_response: {},
        loading: true,
        page_info: {
            page: 1,
            pages: 0,
        }
    };

    const component = shallow(<EmployeesList {...minProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });

    // it('should have side menu', () => {
    //     expect(component.find('menu#content-menu').exists()).toBe(true);
    // });
    //
    // it('should have side menu: button to go to calendar', () => {
    //     expect(component.find('menu#content-menu').find('a').contains(<i className="fa fa-fw fa-calendar mr-xs"/>)).toBe(true);
    // });
    //
    // it('should have side menu: sidebar widget named КАТЕГОРИИ', () => {
    //     expect(component.find('menu#content-menu').find('div.sidebar-widget').find('div.widget-header').find('h6').text()).toEqual('КАТЕГОРИИ');
    // });
    //
    // it('should have side menu: sidebar widget with categories tree', () => {
    //     expect(component.find('menu#content-menu').find('div.sidebar-widget').find('div.widget-content').find('TreeView').length).toEqual(1);
    // });
    //
    // it('should have inner body with panel', () => {
    //    expect(component.find('div.inner-body').find('section.panel.panel-default').exists()).toBe(true);
    // });
    //
    // it('should have inner body with panel: panel head named "Сотрудники"', () => {
    //     expect(component.find('section.panel.panel-default').find('header.panel-heading').find('h2.panel-title').text()).toEqual('Сотрудники');
    // });
    //
    // it('should have inner body with panel: panel head with button "Добавить" on left side', () => {
    //     expect(component.find('section.panel.panel-default').
    //     find('header.panel-heading').
    //     find('button.btn.btn-primary.mr-xs.pull-right').text()).toEqual(' Добавить');
    // });
    //
    // it('should have inner body with panel: panel head with button contains i', () => {
    //     expect(component.find('section.panel.panel-default').
    //     find('header.panel-heading').
    //     find('button.btn.btn-primary.mr-xs.pull-right').contains(<i className="fa fa-fw fa-plus"/>)).toEqual(true);
    // });
    //
    // it('should have inner body with panel: panel body with table', () => {
    //     expect(component.find('section.panel.panel-default').find('div.panel-body').find('DataTable').length).toEqual(1);
    // });
    //
    // it('should have inner body with panel: table 3 columns', () => {
    //     expect(component.find('DataTable').prop('headers').length).toEqual(3);
    // });
    //
    // it('should have inner body with panel: table should have header', () => {
    //     expect(component.find('DataTable').prop('headers')).toEqual([
    //         { text: 'Ф. И. О.', sortable: true, searchable: true },
    //         { text: 'Должность', searchable: true },
    //         { text: 'Функции' } ]
    //     );
    // });
    //
    // it('should have inner body with panel: table with pagination', () => {
    //     expect(component.find('Pagination').length).toEqual(1);
    // });

});