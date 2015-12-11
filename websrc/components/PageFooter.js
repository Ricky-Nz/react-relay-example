import React from 'react';
import { Row, Col, Input, Button } from 'react-bootstrap';

class PageFooter extends React.Component {
	render() {
		const footer = {
			padding: '50px 0px 30px 0px',
			backgroundColor: '#29B6F6',
			color: 'white',
			textAlign: 'center',
			fontSize: '1.2em'
		};

		return (
			<Row style={footer}>
				<Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3}>
					<p>DOWNLOAD THE FEATURED PROJECT PDF</p>
					<Input type='text' buttonAfter={<Button>Submit</Button>}/>
					<p style={{fontSize: '0.7em'}}>&#169; ARC STUDIO ALL RIGHTS RECEIVED.</p>
				</Col>
			</Row>
		);
	}
}

export default PageFooter;