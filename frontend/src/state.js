import { observable } from 'mobx';

export const serverLink = 'http://52.55.4.4:443';
export const picPath = serverLink+'/public/'

export class User {
	@observable selected = false;
	@observable comment = '';
	@observable rating = '';
	constructor(id, name, pic) {
		this.id = id;
		this.name = name;
		this.pic = pic;
	}
}
export const appState = observable({
	fields: observable({
		loaded: false,
		data: [],
	}),
	stage: 'user',
	userName: '',
	userPosition: '',
	submitValid: true,
})

export const ResultState = observable({
	loaded: false,
	students: observable({}),
})

export class StudentData {
	name = '';
	id = 0;
	comments = [];
	@observable ratings = {
		great: 0,
		yes: 0,
		soso: 0,
		no: 0,
	}
	constructor(name, id) {
		this.id = id;
		this.name = name;
	}
}
