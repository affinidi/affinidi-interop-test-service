import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, NavLink, useLocation } from "react-router-dom";

import '../App.css';
import DidComponent from './DID'
import VcComponent from './VC'
import VpComponent from './VP'

const SimpleMethods = () => {
	const {pathname} = useLocation()
	const [activeTab, setActiveTab] = useState(pathname.substring(8)) // default based on current link, that way deep links works correctly

	return (
		<Router>
			<Container>
				<Row>
					<Col>					
						<Nav fill variant="tabs" activeKey={activeTab} onSelect={(newTab) => setActiveTab(newTab)} >
							<Nav.Item>
								<Nav.Link as={NavLink} to="/interop/checks/did" eventKey={"did"}>Did Methods</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link as={NavLink} to="/interop/checks/vc" eventKey={"vc"}>VC Methods</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link as={NavLink} to="/interop/checks/vp" eventKey={"vp"}>VP Methods</Nav.Link>
							</Nav.Item>
						</Nav>		
					</Col>
				</Row>

				<Row>
					<Col>
						<Switch>  					
							<Route path='/interop/checks/did' component={DidComponent} />
							<Route path="/interop/checks/vc" component={VcComponent} />
							<Route path="/interop/checks/vp" component={VpComponent} />							
						</Switch>					
					</Col>

				</Row>
			</Container>
		</Router>
	);
	
}

export default SimpleMethods;
