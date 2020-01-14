import { BehaviorSubject } from 'rxjs'

export const field_set$ = new BehaviorSubject(of_field_set())

function of_field_set() {
	return {
		key: '',
		show_in_table: true,
		show_in_search: false,
		show_in_edit: true,
		label: '',
		// 表格项 ↓
		be_extend: false,
	}
}
