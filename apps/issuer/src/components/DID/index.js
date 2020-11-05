import React, { Component } from 'react';
import interopApi from '../../interopApi'

import { did } from './did.json'

export default class DidComponent extends Component {
	constructor(props){
		super(props)

		this.onChangeDid = this.onChangeDid.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			did: did,
			response: undefined,
			error: undefined
		}
	}

	onChangeDid(e){
		this.setState({did: e.target.value})
	}

	onSubmit(e){
		e.preventDefault()
		
		const input = {
			did: this.state.did
		}

		const endpoint = 'did-is-resolvable'
		interopApi.post(endpoint, input)
			.then((res) => {
				this.setState({response: res.data.message})
			}).catch((error)=> {
				this.setState({error: error.response.data.message})
			})

		this.setState({response: undefined, errro: undefined})
	}

	render() {
		return (			
			<div className="wrapper">
				<form className="form" onSubmit={this.onSubmit}>
					<div className="form-group">
						<span>Sample Did</span>						
					</div>					
					
					<div className="form-group text-box text-area-centered">	
						<input type="text" className="form-control full-width" value={this.state.did} onChange={this.onChangeDid}/>
					</div>
						
					<div className="form-group text-area-centered">		
						{this.state.response ? (
							<div className="form-group">							
								<span>Response</span>
								<p>{this.state.response}</p>
							</div>
						): (<span></span>)}

						{this.state.error ? (
							<div className="form-group">							
								<span><b>Error</b></span>
								<p>{this.state.error}</p>
							</div>
						): (<span></span>)}
					</div>

					<div className="form-group">
						<input type="submit" value="Resolve DID" className="btn btn-success btn-block btn-width" />
					</div>

				</form>

				<hr className="horizontalRule"/>
			</div>			
		)
	}
}
