import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { withStyles } from '@material-ui/core/styles';
import { Button } from 'react-admin';
import { noteCreate, workNotesUpdate } from './noteButtonsActions';

const styles = {
  button: {
    marginTop: '1em'
  }
};

class EditNoteButtonComp extends Component {
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
		    label="Bearbeiten"
		    title="Bearbeiten"
		  >
		    <EditIcon />
		  </Button>
	)}
}

export const EditNoteButton = withStyles(styles)(EditNoteButtonComp);

class CreateNoteButtonComp extends Component {
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

CreateNoteButtonComp.propTypes = {
	noteCreate: PropTypes.func,
	workNotesUpdate: PropTypes.func
}

Object.assign(
	CreateNoteButtonComp.propTypes
)

export const CreateNoteButton = connect(null, {
	noteCreate,
	workNotesUpdate
})(withStyles(styles)(CreateNoteButtonComp));
