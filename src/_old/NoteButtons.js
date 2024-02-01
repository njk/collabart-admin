import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import { change, submit, isSubmitting } from 'redux-form';
import {
    fetchEnd,
    fetchStart,
    Button,
    SaveButton,
    SimpleForm,
    REDUX_FORM_NAME
} from 'react-admin';
import { noteCreate } from './noteButtonsActions';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RichTextInput from 'ra-input-rich-text';

const styles = {
  button: {
    marginTop: '1em'
  }
};

class EditNoteButtonComp extends Component {

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
    state = {
        error: false,
        showDialog: false
    };

    handleClick = () => {
        this.setState({ showDialog: true });
    };

    handleCloseClick = () => {
        this.setState({ showDialog: false });
    };

    handleSaveClick = () => {
        const { submit } = this.props;

        // Trigger a submit of our custom quick create form
        // This is needed because our modal action buttons are oustide the form
        submit('note-quick-create');
    };

    handleSubmit = values => {
        const { change, fetchStart, fetchEnd, noteCreate } = this.props;
        const { handleCloseClick } = this;
        // Dispatch an action letting react-admin know a API call is ongoing
        fetchStart();
        console.log(values)

        noteCreate(values, (payload, requestPayload) => {
        	const { record } = this.props;
			var notes = record.notes;
			if(notes && notes.length) {
				notes.push(payload.data.id);
			} else {
				notes = [payload.data.id];
			}
			change(REDUX_FORM_NAME, 'notes', notes);
			fetchEnd();
			handleCloseClick();
        });
    };

    render() {
        const { showDialog } = this.state;
        const { isSubmitting } = this.props;

        return (
            <Fragment>
                <Button onClick={this.handleClick} label="Neue Notiz erstellen">
                    <IconContentAdd />
                </Button>
                <Dialog
                    fullWidth
                    open={showDialog}
                    onClose={this.handleCloseClick}
                    aria-label="Notiz erstellen"
                >
                    <DialogTitle>Notiz erstellen</DialogTitle>
                    <DialogContent>
                        <SimpleForm
                            // We override the redux-form name to avoid collision with the react-admin main form
                            form="note-quick-create"
                            resource="notes"
                            // We override the redux-form onSubmit prop to handle the submission ourselves
                            onSubmit={this.handleSubmit}
                            // We want no toolbar at all as we have our modal actions
                            toolbar={null}
                        >
                            <RichTextInput source="note" label="Notiz"/>
                        </SimpleForm>
                    </DialogContent>
                    <DialogActions>
                        <SaveButton
                            saving={isSubmitting}
                            onClick={this.handleSaveClick}
                        />
                        <Button label="ra.action.cancel" onClick={this.handleCloseClick}>
                            <IconCancel />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isSubmitting: isSubmitting('note-quick-create')(state)
});

const mapDispatchToProps = {
    change,
    fetchEnd,
    fetchStart,
    submit,
    noteCreate
};

export const CreateNoteButton = connect(mapStateToProps, mapDispatchToProps)(
    CreateNoteButtonComp
);
