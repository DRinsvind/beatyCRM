import React from 'react';
import {shallow} from 'enzyme';
import ClientsTabServices from './ClientsTabServices';

describe('ClientsTabServices component tests', () => {
    const minProps = {
        client: {},
        appointment_history: [],
        loading: true
    };

    it('should render component', () => {
        expect(
            shallow(
                <ClientsTabServices {...minProps}/>
            ).length
        ).toEqual(1);
    });
});