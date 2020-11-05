import React, { Component } from 'react';
import interopApi from '../../interopApi'

import { vp } from './vp.json'

export default class VerifyVP extends Component {
	constructor(props){
		super(props)

		this.state = {
			vp,
			response: undefined,
			error: undefined
		}

		this.onChangeVp = this.onChangeVp.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChangeVp(e){
		this.setState({vp: e.target.value})
	}

	onSubmit(e){
		e.preventDefault()
		
		const input = {
			vp: this.state.vp
		}

		const endpoint = 'vp-is-verifiable'
		interopApi.post(endpoint, input)
			.then((res) => {
				this.setState({response: res.data.message})
			}).catch((error)=> {
				this.setState({error: error.response.data.message})
			})

		this.setState({response: undefined, error: undefined})
	}

	render() {
		return (	            
			<div >
				<form onSubmit={this.onSubmit}>	
					<div className="form-group">	
						<hr className="horizontalRule"/>
						<span>Sample VP</span>	
					</div>

					<div className="form-group text-area-centered">					
						<textarea 
							className="form-control text-area" 
							value={JSON.stringify(this.state.vp, null, 2)} 
							onChange={this.onChangeVp}
						/>
					</div>					
			
					{this.state.response ? (
						<div className="form-group">
							<span>Response</span>
							<p>{this.state.response}</p>
						</div>
					): ''}

					{this.state.error ? (
						<div className="form-group">
							<span><b>Error</b></span>
							<p>{this.state.error}</p>
						</div>
					): ''}

					<div className="form-group">
						<input type="submit" value="Verify VP" className="btn btn-success btn-block btn-width" />
					</div>

				</form>				
			</div>			
		)
	}
}
