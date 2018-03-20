import React from 'react';
import {shallow} from 'enzyme';
import ClientsList, {ClientsTable} from './ClientsList';

describe('Clients list test', () => {
    const minProps = {
        onLoad: () => {},
        onClearClientsList: () => {},
        onLoadClientsWithParams: () => {},
        page_info: {
            page: 1,
            pages: 0
        }
    };

    const tableMinProps = {
        items: [],
        onEditRow: () => {},
        onDeleteRow: () => {},
        table_sort: {}
    };

    it('should render clients list', () => {
        expect(
            shallow(
                <ClientsList {...minProps}/>
            ).length
        ).toEqual(1);
    });

    it('should have such state', () => {
        const wrapper = shallow(<ClientsList {...minProps}/>);
        expect(wrapper.state()).toEqual({
            clients: [],
            categories: [],
            selected_key: 0,
            selected_category_path: '/clients/',
            loading: undefined,
            page_info: { page: 1, pages: 0 },
            table_sort: {},
        });
    });

    it('should have a tree of categories', () => {
       expect(
           shallow(<ClientsList {...minProps}/>).find('TreeView').length
       ).toEqual(1);

        expect(
            shallow(<ClientsList {...minProps}/>).find('TreeView').exists()
        ).toBe(true);
    });

    it('should have a table with clients', () => {
        expect(
            shallow(<ClientsList {...minProps}/>).find('ClientsTable').length
        ).toEqual(1);
    });

    it('should have pagination', () => {
        expect(
            shallow(<ClientsList {...minProps}/>).find('Pagination').length
        ).toEqual(1);
    });

    it('should render clients table' , () => {
       expect(
           shallow(
               <ClientsTable {...tableMinProps}/>
           ).length
       ).toEqual(1);
    });

    it('should have DataTable component', () => {
        expect(
            shallow(<ClientsTable {...tableMinProps}/>).find('DataTable').length
        ).toEqual(1);
    })
});