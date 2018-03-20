import React from 'react';
import {shallow} from 'enzyme';
import CallsNew from './CallsNew';

describe('CallsNew component tests', () => {
    const minProps = {
        calls: [],
        statuses_list: [],
        onAddComment: () => {},
        onCheckCall: () => {},
        onAddStatus: () => {},
    };

    const component = shallow(<CallsNew {...minProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });

});