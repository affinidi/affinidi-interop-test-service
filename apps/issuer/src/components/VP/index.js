import React, { Component } from 'react'

import VerifyVP from './VerifyVP'

export default class VP extends Component {
	constructor(props){
		super(props)

		this.state = {
			component: ''			
		}

		this.handleVCIsVerifiable = this.handleVCIsVerifiable.bind(this);
	}

	handleVCIsVerifiable(){
		this.setState({component: "verify"})
	}
	render() {
		return (
			<div className="wrapper">
				<div>
					<button className="btn btn-success btn-block btn-width" onClick={this.handleVCIsVerifiable}>VP Verification Check</button>
				</div>

				<div className="container">
					<div className="row no-margin no-padding">
						<div className="col-md-12">				
							{ (this.state.component === "verify") ? <VerifyVP/> : ''}					
						</div>              
					</div>         
				</div>

				<hr className="horizontalRule"/>
			</div>	
		)
	}
}
