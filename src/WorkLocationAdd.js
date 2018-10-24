import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { Button, REDUX_FORM_NAME } from 'react-admin';
import { locationCreate, workLocationsUpdate } from './locationButtonsActions';
import ReactQuill from 'react-quill';
import { change } from 'redux-form';

class WorkLocationAdd extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			name: ''
		}
		this.onTextChange = this.onTextChange.bind(this);
		this.saveLocationToWork = this.saveLocationToWork.bind(this);
	}
	componentDidMount() {
	}

	saveLocationToWork(e) {
		const { locationCreate } = this.props;
		locationCreate({name: this.state.name}, (payload, requestPayload) => {
			const { record, workLocationsUpdate } = this.props;
			var locations = record.locations;
			if(locations && locations.length) {
				locations.push(payload.data.id);
			} else {
				locations = [payload.data.id];
			}
			change(REDUX_FORM_NAME, 'locations', locations);
			this.setState({
				name: ''
			})
		})
		e.preventDefault();
		console.log("clicked")
	}

	onTextChange(e) {
		this.setState({name: e.target.value});
	}

	render()  {
		const { record } = this.props;
		const { saveLocationToWork, onTextChange } = this;
		if(record.locations && record.locations.length && record.locations.length > 0) {
			return null
		}
		return (
			<span>
				<input type="text" value={this.state.name} onChange={onTextChange} />
				<Button
					variant="raised"
					component={Link}
					onClick={saveLocationToWork}
					to={`/works/${record.id}/store`}
					label="Lagerort hinzufügen"
					title="Lagerort hinzufügen"
					>
					<AddIcon />
				</Button>
			</span>
	)}
}

WorkLocationAdd.propTypes = {
	locationCreate: PropTypes.func,
	workLocationsUpdate: PropTypes.func,
	change: PropTypes.func
}

Object.assign(
	WorkLocationAdd.propTypes
)

export default connect(null, {
	locationCreate,
	workLocationsUpdate,
	change
})(WorkLocationAdd);