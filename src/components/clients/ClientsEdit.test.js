import React from 'react';
import {shallow, mount} from 'enzyme';
import ClientsEdit from './ClientsEdit';

describe('Components: ClientsEdit', () => {
    const minProps = {
        client: {},
        questions_groups: [],
        errors: {},
        onLoad: () => {
        },
        onQuestionaryEdit: () => {
        },
        onEdit: () => {
        },
        onCheckInputValue: () => {
        },
        params: {
            client_id: ''
        },
        router: {},
        tags_list: [],
        tag_id: '',
        loading: true
    };

    var component = mount(<ClientsEdit {...minProps}/>);

    it('should render component', () => {
        expect(
            shallow(
                <ClientsEdit {...minProps}/>
            ).length
        ).toEqual(1);
    });

    it('should have ClientsTabEdit', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ClientsTabEdit').exists()
        ).toBe(true);
    });

    it('should have ClientsTabQuestionary', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ClientsTabQuestionary').exists()
        ).toBe(true);
    });

    it('should have ClientsTabServices', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ClientsTabServices').exists()
        ).toBe(true);
    });

    it('should have ClientsTabCalls', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ClientsTabCalls').exists()
        ).toBe(true);
    });

    it('should have 2 ul', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ul.nav.nav-tabs.tabs-primary').length
        ).toEqual(2);
    });

    it('should have 2 ul: first should have 3 tab', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ul.nav.nav-tabs.tabs-primary').at(0).find('li').length
        ).toEqual(3);
    });

    it('should have 2 ul: second should have 2 tabs', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ul.nav.nav-tabs.tabs-primary').at(1).find('li').length
        ).toEqual(2);
    });

    it('should have 2 ul: second should have 2 tabs - first tab is active', () => {
        expect(
            shallow(<ClientsEdit {...minProps}/>).find('ul.nav.nav-tabs.tabs-primary').at(1).find('li').at(0).hasClass('active')
        ).toEqual(true);
    });

    it('should change image on button click', function () {
        const blob = new Blob([{name: 'Image'}, {result: 'data:;base64,'}], {type : 'text/plain'});
        component.find('label#button-photo').find('input').simulate('change', { target: { files: [ blob ] } });
    });

});
