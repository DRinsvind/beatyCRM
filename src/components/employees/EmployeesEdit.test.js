import React from 'react';
import {shallow} from 'enzyme';
import EmployeesEdit from './EmployeesEdit';

describe('EmployeesEdit component test', () => {
    const minProps = {
        employee: {},
        salons: [],
        posts: [],
        roles: [],
        errors: {},
        tags: [],
        onNotifyShow: () => {
        }
    };

    const component = shallow(<EmployeesEdit {...minProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });

    // it('should have default state', () => {
    //     expect(component.state()).toEqual(
    //         {
    //             employee: {
    //                 staff_id: '',
    //                 first_name: '',
    //                 last_name: '',
    //                 second_name: '',
    //                 photo: '',
    //                 date_birth: '',
    //                 sex: 'M',
    //                 contacts: [],
    //                 posts: [],
    //                 login: undefined,
    //                 role_id: undefined,
    //                 tags: [],
    //                 is_access_allowed: false
    //             },
    //             salons: [],
    //             posts: [],
    //             roles: [],
    //             image: {
    //                 name: '',
    //                 file: '',
    //                 data: '',
    //                 imagePreviewUrl: 'test-file-stub'
    //             },
    //             errors: {},
    //             tags: [],
    //             tags_bad: [],
    //             tags_good: [],
    //         }
    //     )
    // });

    it('should have panel with photo', () => {
        expect(component.find('div.panel-body').find('div.img-thumbnail').exists()).toBe(true);
    });

    it('should have button for uploading photo', () => {
        expect(component.find('label#button-photo').find('input').exists()).toEqual(true);
    });

    it('should have employee full name', () => {
        expect(component.find('div.panel-body').find('div').find('h4').length).toEqual(3);
    });

    it('should have two tabs', () => {
        expect(component.find('div.tabs').find('li').length).toEqual(2);
    });

    it('should have two tabs: first - profile', () => {
        expect(component.find('div.tabs').find('li').at(0).text()).toEqual('Профайл');
    });

    it('should have two tabs: first - edit', () => {
        expect(component.find('div.tabs').find('li').at(1).text()).toEqual('Редактировать');
    });

    it('should have 4 h5 in tab profile', () => {
        expect(component.find('div#profile').find('h5').length).toEqual(4);
    });

    it('should have EmployeeTabEdit', () => {
        expect(component.find('EmployeeTabEdit').exists()).toBe(true);
    });
});