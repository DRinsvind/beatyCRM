import React from 'react';
import {shallow, mount} from 'enzyme';
import ClientsTabEdit from './ClientsTabEdit';

describe('ClientsTabEdit component tests', () => {
    const minProps = {
        client: {},
        client_id: '',
        photo: {},
        router: {},
        tags: [],
        errors_messages: {},
        onEditClient: (e) => {
        },
        onCheckInput: (e) => {
        },
    };

    it('should render edit tab', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).length
        ).toEqual(1);
    });

    it('should have GeneralInfoBlock', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('GeneralInfoBlock').exists()
        ).toBe(true);
    });

    it('should have 3 fieldset', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').length
        ).toEqual(3);
    });

    it('should have textarea in first fieldset', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(0).find('textarea').exists()
        ).toBe(true);
    });

    it('should have tags select in second fieldset', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(1).find('select').exists()
        ).toBe(true);
    });

    it('should have 2 buttos select in third fieldset', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(2).find('button').length
        ).toEqual(2);
    });

    it('should have 2 buttos select in third fieldset: first - add phone number', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(2).find('button').at(0).text()
        ).toEqual(' Телефон');
    });

    it('should have 2 buttos select in third fieldset: first - add email', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(2).find('button').at(1).text()
        ).toEqual(' Email');
    });

    it('should have label with text "Комментарий" in first fieldset', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(0).find('label').text()
        ).toEqual('Комментарий');
    });

    it('should have label with text "Заметки" in second fieldset', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(1).find('label').text()
        ).toEqual('Заметки');
    });

    it('should have textarea with exact props', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(0).find('textarea').prop('name')
        ).toEqual('note');

        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(0).find('textarea').prop('className')
        ).toEqual('form-control');

        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('fieldset').at(0).find('textarea').prop('rows')
        ).toEqual('3');
    });

    it('should have panel footer with two buttons', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('div.panel-footer').find('button').length
        ).toEqual(2);
    });

    it('should have panel footer with two buttons: first button "Сохранить"', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('div.panel-footer').find('button').at(0).text()
        ).toEqual('Сохранить');
    });

    it('should have panel footer with two buttons: second button "Отмена"', () => {
        expect(
            shallow(
                <ClientsTabEdit {...minProps}/>
            ).find('div.panel-footer').find('button').at(1).text()
        ).toEqual('Отмена');
    });

    it('should change text area', function () {
        // mount(<ClientsTabEdit {...minProps}/>).find('textarea').simulate('change', {target: {name: 'note', value: 'SOME'}});
    })
});
