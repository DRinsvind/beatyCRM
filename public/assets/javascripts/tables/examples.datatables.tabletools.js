/*
Name: 			Tables / Advanced - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	1.5.4
*/

(function($) {

	'use strict';

	var datatableInit = function() {
		var $table = $('#datatable-tabletools');

		$table.dataTable({

			// "bServerSide": true,
			// "sAjaxSource": "http://192.168.1.104:5000/api/v1/services/list?period=week&offset=2&page=2",
			// "aoColumns": [{
			//     "mData":"service",
			//     "sTitle": "Услуга"
			//   },

			// ajax: {
			// 	   url: 'http://192.168.1.104:5000/api/v1/services/list?period=week&offset=2&page=2',
			// 	//    "type": "GET"
			// 	//    "dataSrc": "items"
			//    },
			//    columns: [
		    //         { items: 'service' },
		    //         { items: 'master' },
		    //         { items: 'state' },
		    //         { items: 'time' },
		    //         { items: 'date' },
		    //         { items: 'cost' }
		    //     ]






			// "processing": true,
			// 	"serverSide": true,

			// "aoColumns": [{
			// 	"mData":"service",
			// 	"sTitle": "Услуга"
			// }],
			language: {
				 "processing": "Подождите...",
				 "search": "Поиск:",
				 "lengthMenu": "_MENU_ записей",
				 "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
				 "infoEmpty": "Записи с 0 до 0 из 0 записей",
				 "infoFiltered": "(отфильтровано из _MAX_ записей)",
				 "infoPostFix": "",
				 "loadingRecords": "Загрузка записей...",
				 "zeroRecords": "Записи отсутствуют.",
				 "emptyTable": "В таблице отсутствуют данные",
				 "paginate": {
				   "first": "Первая",
				   "previous": "Предыдущая",
				   "next": "Следующая",
				   "last": "Последняя"
				 },
				 "aria": {
				   "sortAscending": ": активировать для сортировки столбца по возрастанию",
				   "sortDescending": ": активировать для сортировки столбца по убыванию"
				 }
			 },
			sDom: "<'text-right mb-md'T>" + $.fn.dataTable.defaults.sDom,
			oTableTools: {
			// 	"ajax": {
			// 	   "url": "http://46.101.148.237:5000/api/v1/services/list?period=week&offset=2&page=2",
			// 	   "type": "GET",
			// 	   "dataSrc": "items"
			//    },
				sSwfPath: $table.data('swf-path'),
				aButtons: [
					{
						sExtends: 'pdf',
						sButtonText: 'День'
					},
					{
						sExtends: 'csv',
						sButtonText: 'Неделя'
					},
					{
						sExtends: 'xls',
						sButtonText: 'Месяц'
					}
				]
			}

		});

	};

	$(function() {
		datatableInit();
	});

}).apply(this, [jQuery]);
