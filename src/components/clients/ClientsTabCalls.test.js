import React from 'react';
import {shallow} from 'enzyme';
import ClientsTabCalls from './ClientsTabCalls';

describe('ClientsTabCalls  component tests', () => {
    const mimProps = {
        calls: [],
        loading: true
    };

    const component = shallow(<ClientsTabCalls {...mimProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });
});