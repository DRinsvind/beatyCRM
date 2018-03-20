import React from 'react';
import {shallow} from 'enzyme';
import GoodsAdd from './GoodsAdd';

describe('GoodsAdd component tests', function () {
    const minProps = {
        goods_tags: [],
        units: [],
        brands: [],
        onAddGood: () => {
        },
        onCheckGood: () => {
        },
        onNotifyShow: () => {
        },
        onErrorsClear: () => {
        }
    };

    const component = shallow(<GoodsAdd {...minProps}/>);

    const names = ['name', 'article', 'barcode', 'sale_price', 'is_package_sale',
        'is_piece', 'per_piece_qnt', 'per_package_qnt', 'is_multi_use', 'multi_use', 'amnt_min_limit'];

    it('should render component', function () {
        expect(component.length).toEqual(1);
    });

    it('should have 11 form groups at start', function () {
        expect(component.find('div.form-group').length).toEqual(11);
    });

    it('should have 12 form groups if is_multi_use equal true', function () {
        component.setState({
            item: {
                transfer_form: {
                    is_multi_use: true
                }
            }
        });
        expect(component.find('div.form-group').length).toEqual(12);
    });

    it('should have 11 inputs', function () {
        expect(component.find('input').length).toEqual(11);
    });

    it('should have inputs with exact names', function () {
        component.find('input').forEach(function (input, idx) {
           expect(input.prop('name')).toEqual(names[idx]);
        });
    });

    it('should change input "name" onChange', function () {
        var inputName = component.find('input.form-control').at(0).prop('name');
        component.find('input.form-control').at(0).simulate('change', {
            target: {name: inputName, value: 'SOME'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').name).toEqual('SOME');
    });

    it('should change input "article" onChange', function () {
        var inputName = component.find('input.form-control').at(1).prop('name');
        component.find('input.form-control').at(1).simulate('change', {
            target: {name: inputName, value: 'SOME'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').article).toEqual('SOME');
    });

    it('should change input "barcode" onChange', function () {
        var inputName = component.find('input.form-control').at(2).prop('name');
        component.find('input.form-control').at(2).simulate('change', {
            target: {name: inputName, value: 'SOME'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').barcode).toEqual('SOME');
    });

    it('should change input "sale_price" onChange', function () {
        var inputName = component.find('input.form-control').at(3).prop('name');
        component.find('input.form-control').at(3).simulate('change', {
            target: {name: inputName, value: '300'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').sale_price).toEqual('300');
    });

    it('should change input "is_package_sale" onChange', function () {
        component.find('input#package').simulate('change', {
            target: {checked: true},
            preventDefault: () => {}
        });

        expect(component.state('item').transfer_form.is_package_sale).toEqual(true);
    });

    it('should change input "is_piece" onChange', function () {
        component.find('input#piece').simulate('change', {
            target: {checked: true},
            preventDefault: () => {}
        });

        expect(component.state('item').transfer_form.is_piece).toEqual(true);
    });

    it('should change input "per_piece_qnt" onChange', function () {
        component.find('input#per_piece_qnt').simulate('change', {
            target: {name: "per_piece_qnt", value: '300'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').transfer_form.per_piece_qnt).toEqual('300');
    });

    it('should change input "per_package_qnt" onChange', function () {
        component.find('input#per_package_qnt').simulate('change', {
            target: {name: "per_package_qnt", value: '300'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').transfer_form.per_package_qnt).toEqual('300');
    });

    it('should change input "is_multi_use" onChange', function () {
        component.find('input#is_multi_use').simulate('change', {
            target: {checked: true},
            preventDefault: () => {
            }
        });

        expect(component.state('item').transfer_form.is_multi_use).toEqual(true);
    });

    it('should change input "multi_use" onChange', function () {
        component.find('input#multi_use').simulate('change', {
            target: {name: "multi_use", value: '300'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').multi_use).toEqual('300');
    });

    it('should change input "amnt_min_limit" onChange', function () {
        component.find('input#amnt_min_limit').simulate('change', {
            target: {name: "amnt_min_limit", value: '300'},
            preventDefault: () => {
            }
        });

        expect(component.state('item').amnt_min_limit).toEqual('300');
    });

    it('should have one label at every div form-group', function () {
        var inputLabels = ['Название', 'Артикул/Штрих-код', 'Категория товара', 'Теги', 'Бренд', 'Цена'];
        component.find('div.form-group').forEach(function (block, idx) {
            if(idx < 6) {
                expect(block.find('label.control-label').length).toEqual(1);
                expect(block.find('label.control-label').text()).toEqual(inputLabels[idx]);
            }
        });
    });

    it('div with input "name" should have 1 label with class "control-label"', function () {
        expect(component.find('div.form-group').at(0).find('label.control-label').length).toEqual(1);
        expect(component.find('div.form-group').at(0).find('label.control-label').text()).toEqual('Название');
    });

    it('should add error with key "name" onBlur if data in input is invalid', function () {
        var inputName = component.find('input.form-control').at(0).prop('name');
        component.find('input.form-control').at(0).simulate('blur', {
            target: {name: inputName, value: 'SOME3'},
            preventDefault: () => {
            }
        });


        // expect(component.state('errors')[inputName].exists()).toEqual(true);
    });

    it('div with input "name" should have class "form-group has-error" if state has error with key "name"', function () {
        component.setState({errors: {
            name: {message: 'Error'}
        }});

        expect(component.find('div.form-group').at(0).hasClass('form-group has-error')).toEqual(true);
        expect(component.find('div.form-group').at(0).find('label.control-label').length).toEqual(2);
        expect(component.find('div.form-group').at(0).find('div.col-md-9').find('label.control-label').length).toEqual(1);
    });

    it('div with input "name" should have class "form-group has-error" if state has error with key "name', function () {

    });
});
