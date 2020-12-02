import React, { Component } from 'react'

import '../style.css'
import VerifyVC from './VerifyVC'

export default class VC extends Component {
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

				<div className="container">

					<div className="row no-margin no-padding">
	
						<button className="btn btn-success btn-block btn-width" onClick={this.handleVCIsVerifiable}>VC Verification Check</button>


					</div>

				
					<div className="row no-margin no-padding">
						<div className="col-md-12">				
							{ (this.state.component === "verify") ? <VerifyVC/> : ''}					
						</div>              
					</div>         
				</div>

				<hr className="horizontalRule"/>
			</div>			
		)
	}
}
