import React from 'react';
import {shallow} from 'enzyme';
import Calls from './Calls';

describe('Calls component tests', () => {
    const minProps = {
        calls: {},
        statuses_list: [],
        onLoadCallsList: () => {},
        onLoadCallsHistory: () => {},
        onCheckCall: () => {},
        onAddComment: () => {},
        onAddStatus: () => {},
        onNotifyShow: () => {},
        filter: [],
        calls_history: [],
        loading: true,
        router: {
            location: {
                pathname: '/calls/'
            }
        },
    };

    const component = shallow(<Calls {...minProps}/>);

    it('should render component', () => {
        expect(component.length).toEqual(1);
    });

    it('should have side menu', () => {
        expect(component.find('menu#content-menu').exists()).toBe(true);
    });

    it('side menu should have button chevron up or down for showing or hiding calendar', () => {
        expect(component.find('a.pull-right').exists()).toBe(true);
    });

    it('should have i teg inside a teg', () => {
        expect(component.find('a.pull-right').contains(
            <i className={'fa fa-fw fa-chevron-' + (component.state('showCalendar') ? 'up' : 'down')}/>
        )).toBe(true);
    });

    it('should have style block: none if showCalendar = false', () => {
        expect(component.find('div#smallCalendar').prop('style')).toEqual({ display: 'none' });
        expect(component.find('i.fa.fa-fw.fa-chevron-down').exists()).toBe(true);
    });

    it('should have style block: block if showCalendar = true', () => {
        component.setState({showCalendar: true});
        expect(component.find('div#smallCalendar').prop('style')).toEqual({ display: 'block' });
        expect(component.find('i.fa.fa-fw.fa-chevron-up').exists()).toBe(true);
    });

    it('should have DatePicker', () => {
        expect(component.find('DatePicker').exists()).toBe(true);
    });

    it('should have nav menu', () => {
        expect(component.find('nav#menu').exists()).toBe(true);
    });

    it('should have 2 ul tags', () => {
        expect(component.find('ul').length).toEqual(2);
    });

    it('should have 2 tabs', () => {
        expect(component.find('ul.nav.nav-tabs.tabs-primary').find('li').length).toEqual(2);
    });

    it('should have tab CallsNew', () => {
        expect(component.find('CallsNew').exists()).toBe(true);
    });

    it('should have tab CallsHistory', () => {
        expect(component.find('CallsHistory').exists()).toBe(true);
    });
});