import { observable } from 'mobx';

export const serverLink = 'http://52.55.4.4:443';
// export const serverLink = 'http://localhost:443';

export const picPath = serverLink+'/public/'

const fetchData = (school) => {
	var myHeaders = new Headers();
	myHeaders.append("collection", school);
	return new Promise ((resolve, reject) => {
		fetch(serverLink+'/feedback', {
			method: 'GET',
			headers: myHeaders
		}).then((x)=>resolve(x.json()))
			.catch((x)=>reject(null))
	});
}

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
ResultState.getAllUsers = function (school) {
	fetchData(school).then(x=>{
		x.forEach(
			y=> {
				if (!this.students[y.name]) {
					this.students[y.name] = new StudentData(y.name, y.id)
				}
				if (y.comment !=="") {
					this.students[y.name].comments.push({comment: y.comment, name: y.userName})
				}
				this.students[y.name].ratings[y.rating] += 1
			}
		)
		this.loaded = true;
	})
}

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
