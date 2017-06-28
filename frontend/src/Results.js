import React, { Component } from 'react';
import {observer} from 'mobx-react';

import { ResultState, StudentData, Rating, serverLink, picPath } from './state';

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
ResultState.getAllUsers = function (school) {
	fetchData(school).then(x=>{
		x.forEach(
			y=> {
				if (!this.students[y.name]) {
					console.log('didnt find the sucker', y.name)
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


@observer class StudentFeedback extends Component {
	render() {
		return (
			<div className='user-feedback'>
				<div className="card horizontal">
						<div className="results-image">
							<img src={picPath+'/pics-'+this.props.school+'/'+this.props.student.id+'.jpg'} />
						</div>
						<div className="card-stacked">
							<div className="card-content">
								<p className="flow-text">{this.props.student.name}</p>
									<div>
										<div className="feedback-rating center">
											<div className="feedback-rating-icons col s12 m9">
												<div className="results-rating-icon">
													{this.props.student.ratings.no} X<br/>
													<i className="material-icons material-icons-feedback">thumb_down</i>
												</div>
												<div className="results-rating-icon">
													{this.props.student.ratings.soso} X<br/>
													<i className="material-icons material-icons-feedback" >thumbs_up_down</i>
												</div>
												<div className="results-rating-icon">
													{this.props.student.ratings.yes} X<br/>
													<i className="material-icons material-icons-feedback" >thumb_up</i>
												</div>
												<div className="results-rating-icon">
													{this.props.student.ratings.great} X<br/>
													<i className="material-icons material-icons-feedback" >star</i>
												</div>
											</div>
										</div>
										<div>
											{this.props.student.comments.map((x)=>{
												return (<div className="results-comments"><strong>{x.name} :</strong> {x.comment}</div>)
											})}
										</div>
									</div>
							</div>
						</div>
				</div>
			</div>

		)
	}
}

@observer class Results extends Component {
	componentDidMount(){
		// ResultState.getAllUsers('ivey');
		ResultState.getAllUsers('queens');
	}

	render() {
		const { students } = ResultState;
		return (
			<div className="flow-text ">
				Results
				{Object.keys(students).map((x=> {
					return (
						<div>
							<StudentFeedback student={students[x]} school={'queens'}/>

						</div>
					)}
				))}
				{console.log('yako', ResultState.students)}
				{ResultState.loaded}
			</div>
		);
	}
}

export default Results;
