import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";

import './App.css';

import logo from './images/logo.png'
import SimpleMethods from './components/SimpleMethods'
import Issuer from './containers/Issuer.js'
import Verifier from './containers/Verifier.js'


export default function App() {
	return (
		<Router>
			<Container fluid="true">
				<Row className="row" noGutters>
					<Col xs={12} sm={6} md={6} xl={7} className="left-pane">					
						<Nav.Item as="li">
							<Nav.Link as={NavLink} to="/interop" ><img src={logo} className="Affinidi-logo" alt="logo" /></Nav.Link>
						</Nav.Item>

						<Nav defaultActiveKey="/" as="ul">
							<Nav.Item as="li">
								<Nav.Link as={NavLink} to="/interop/checks" >Simple Checks</Nav.Link>
							</Nav.Item>
							<Nav.Item as="li">
								<Nav.Link as={NavLink} to="/interop/issuer" >Issuer</Nav.Link>
							</Nav.Item>
							<Nav.Item as="li">
								<Nav.Link as={NavLink} to="/interop/verifier" >Verifier</Nav.Link>
							</Nav.Item>
						</Nav>
					</Col>

					<Col className="right-pane">
						<Switch>  
							<Route exact path="/"/>  
							<Route path='/interop/checks' component={SimpleMethods} />
							<Route path="/interop/issuer" component={Issuer} />
							<Route path="/interop/verifier" component={Verifier} />							
						</Switch>
					</Col>

				</Row>
			</Container>
		</Router>
	);
}
