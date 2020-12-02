import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import interopApi from '../../interopApi'
import { vp } from './vp.json'

export default class VerifyVP extends Component {
	constructor(props){
		super(props)

		this.state = {
			vp,
			response: undefined,
			error: undefined,
			reason: undefined,
			edit: false
		}

		this.changeVp = this.changeVp.bind(this);
		this.acceptChange = this.acceptChange.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	changeVp(e){
		e.preventDefault()
		this.setState({
			edit: true,
			response: undefined,
			error: undefined,
			reason: undefined,
		})
	}

	acceptChange(e){
		e.preventDefault()
		this.setState({edit: false})
	}

	onEdit(e){
		this.setState({ vp: e.updated_src })
	}

	onUpdate(e){
		this.setState({ vp: JSON.parse(e.clipboardData.getData('Text')) })
	}

	onDelete(e){
		this.setState({ vp: e.updated_src })
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
				this.setState({reason: error.response.data.error.message})
			})

		this.setState({response: undefined, error: undefined})
	}

	render() {
		return (	            
			<div >
				<form onSubmit={this.onSubmit}>	
					<div className="form-group">	
						<hr className="horizontalRule"/>
						{this.state.edit === false ? (
							<span>Sample VP</span>	
						):
							<span>Paste New VP</span>
						}
					</div>

					<div className="form-group text-area-centered">			
						{this.state.edit ? (
							<textarea 
								className="form-control text-area" onPaste={this.onUpdate}
							/>
						):
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
								enableClipboard={false}
								sortKeys={true}
								groupArraysAfterLength={5}
								collapseStringsAfterLength={50}
								src={this.state.vp} 
								onEdit={this.onEdit}
								onDelete={this.onDelete}
							/>
						}
					</div>					
			
					{this.state.response ? (
						<div className="form-group">
							<span>Response</span>
							<p>{this.state.response}</p>
						</div>
					): ''}

					{this.state.error && this.state.edit === false ? (
						<div className="form-group">
							<span><b>Error</b></span>
							<p>{this.state.error}</p>
							<p><b>(Reason: {this.state.reason})</b></p>
						</div>
					): ''}

					{this.state.edit === false ? (
						<div className="row form-group no-margin no-padding">					
							<div className="col-s-3 col-md-6">	
								<input type="submit" value="Verify VP" className="btn btn-success btn-block btn-width" />
							</div>
							<div className="col-s-3 col-md-6">	
								<button className="btn btn-info btn-block btn-width" onClick={this.changeVp}>Paste a New Value</button>
							</div>
						</div>
					): 
						<div className="row form-group">					
							<button className="btn btn-info btn-block btn-width" onClick={this.acceptChange}>Update VP</button>
						</div>
					}

				</form>				
			</div>			
		)
	}
}
