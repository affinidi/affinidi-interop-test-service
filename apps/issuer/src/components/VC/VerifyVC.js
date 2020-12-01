import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import interopApi from '../../interopApi'
import { credential } from './vc.json'

export default class VerifyVC extends Component {
	constructor(props){
		super(props)

		this.state = {
			vc: credential,
			response: undefined,
			error: undefined
		}

		this.onChangeVc = this.onChangeVc.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChangeVc(e){
		this.setState({ src: e.updated_src });
	}

	onSubmit(e){
		e.preventDefault()
		
		const input = {
			credential: this.state.vc
		}

		const endpoint = 'vc-is-verifiable'
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
						<span>Sample VC</span>	
					</div>					

					<div className="form-group text-area-centered">			
						<ReactJson 
							style={{ 
								padding: "20px", 
								backgroundColor: "white", 
								borderRadius: '5px',
								width: '90%',
								maxWidth: '95%',
								textAlign: 'left' 
							}}
							collapsed={true}
							groupArraysAfterLength={10}
							collapseStringsAfterLength={40}
							src={this.state.vc} 
							onEdit={this.onChangeVc}
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
						<input type="submit" value="Verify VC" className="btn btn-success btn-block btn-width" />
					</div>

				</form>				
			</div>			
		)
	}
}
