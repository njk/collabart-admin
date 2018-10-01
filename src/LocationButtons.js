import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { withStyles } from '@material-ui/core/styles';
import { Button } from 'react-admin';
import { locationCreate, workLocationsUpdate } from './locationButtonsActions';

const styles = {
  button: {
    marginTop: '1em'
  }
};

class EditLocationButtonComp extends Component {
	constructor(props, context) {
		super(props, context);
	}
	componentDidMount() {
	}
	render()  {
		const { classes, record } = this.props;
		return (
		  <Button
		    className={classes.button}
		    variant="raised"
		    component={Link}
		    to={`/information/${record.id}`}
		    label="Bearbeiten"
		    title="Bearbeiten"
		  >
		    <EditIcon />
		  </Button>
	)}
}

export const EditLocationButton = withStyles(styles)(EditLocationButtonComp);

class CreateLocationButtonComp extends Component {
	constructor(props, context) {
		super(props, context);
	}
	componentDidMount() {
	}
	render()  {
		const { classes, record } = this.props;
		return (
		  <Button
		    className={classes.button}
		    variant="raised"
		    component={Link}
		    to={`/notes/${record.id}`}
		    label="Neue Notiz hinzufügen"
		    title="Neue Notiz hinzufügen"
		  >
		    <NoteAddIcon />
		  </Button>
	)}
}

CreateLocationButtonComp.propTypes = {
	locationCreate: PropTypes.func,
	workLocationsUpdate: PropTypes.func
}

Object.assign(
	CreateLocationButtonComp.propTypes
)

export const CreateLocationButton = connect(null, {
	locationCreate,
	workLocationsUpdate
})(withStyles(styles)(CreateLocationButtonComp));
