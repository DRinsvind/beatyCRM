import React from 'react';
import {shallow, mount} from 'enzyme';
import EmployeeTabEdit from './EmployeeTabEdit';

describe('EmployeeTabEdit component tests', () => {
    const minProps = {
        employee: {},
        salons: [],
        posts: [],
        roles: [],
        errors: {},
        onNotifyShow: () => {},
    };

    const component = shallow(<EmployeeTabEdit {...minProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });

    it('should have GeneralInfoBlock', () => {
       expect(component.find('GeneralInfoBlock').exists()).toBe(true);
    });

    // it('should have tags select', () => {
    //     expect(component.find('fieldset').find('label').text()).toEqual('Заметки');
    //     expect(component.find('div.input-group').contains(<select className="form-control tags_select"></select>)).toEqual(true);
    // });
});