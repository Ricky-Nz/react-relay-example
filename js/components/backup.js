import React from 'react';
import Relay from 'react-relay';
import { Navbar, Button, Grid, Row, Col } from 'react-bootstrap';
import BuildingEditor from './BuildingEditor';

class Application extends React.Component {
	_onCreateClicked() {
		Relay.Store.update(new CreateUserMutation({username: 'ruiqi', user: this.props.user}));
	}
	_onScroll(event) {
		const position = event.srcElement.body.scrollTop;
		if (position <= 100) {
			this.setState({
				scrollTop: position
			});
		}
	}
	componentDidMount() {
		window.addEventListener('scroll', this._onScroll.bind(this));

	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this._onScroll.bind(this));
	}
	render() {
		const content = {
			marginTop: 80
		};

		return (
			<div>
				<Navbar fixedTop>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">Dashboard</a>
						</Navbar.Brand>
						<Navbar.Toggle/>
					</Navbar.Header>
					<Navbar.Collapse>
						<Navbar.Text>
							Signed in as: <Navbar.Link href="#">Mark Otto</Navbar.Link>
						</Navbar.Text>
						<Navbar.Text pullRight>
							Have a great day!
						</Navbar.Text>
					</Navbar.Collapse>
				</Navbar>
				<Grid style={content}>
					<Row>
						<Col xs={10} xsOffset={1} md={8} mdOffset={2}>
							<BuildingEditor user={this.props.user}/>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

export default Relay.createContainer(Application, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				${BuildingEditor.getFragment('user')}
			}
		`
	}
});