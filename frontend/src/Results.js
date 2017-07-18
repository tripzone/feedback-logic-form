import React, { Component } from 'react';
import {observer} from 'mobx-react';

import { ResultState, picPath } from './state';



export function loadResults (school) {

}



@observer export class StudentFeedback extends Component {
	render() {
		return (
			<div className='user-feedback'>
				<div className="card horizontal">
						<div className="results-image">
							<img
								src={picPath+'pics-'+this.props.school+'/'+this.props.student.id+'.jpg'} />
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

@observer export class Results extends Component {
	componentDidMount(){
		ResultState.getAllUsers(this.props.school);
	}

	render() {
		const { students } = ResultState;
		return (
			<div className="flow-text ">
				{Object.keys(students).map((x=> {
					return (
						<div>
							<StudentFeedback student={students[x]} school={this.props.school}/>
						</div>
					)}
				))}
				{ResultState.loaded}
			</div>
		);
	}
}

export default Results;
