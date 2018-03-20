import React from 'react';
import {shallow} from 'enzyme';
import CallsHistory from './CallsHistory';

describe('CallsHistory component tests', () => {
    const minProps = {
        onLoadCallsHistory: () => {},
        onClientClick: () => {},
        calls_history: () => {},
        calls_history: [],
        loading: true
    };

    const component = shallow(<CallsHistory {...minProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });
});