import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { change, submit, isSubmitting } from 'redux-form';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { SimpleForm, Button, SaveButton, fetchEnd, fetchStart } from 'react-admin';
import { noteCreate, workNotesUpdate } from './noteButtonsActions';
import ReactQuill from 'react-quill';
import RichTextInput from 'ra-input-rich-text';

class WorkNoteAdd extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
	}

	handleSaveClick() {
		const {submit} = this.props;

		submit('note-quick-create');
	}

	handleSubmit(values) {
        const { noteCreate, fetchStart, fetchEnd, showNotification } = this.props;
        console.log(values);
        fetchStart();
        noteCreate(values, (payload, requestPayload) => {
        	const { record, workNotesUpdate } = this.props;
			var notes = record.notes;
			if(notes && notes.length) {
				notes.push(payload.data.id);
			} else {
				notes = [payload.data.id];
			}
			record.notes = notes;
			workNotesUpdate(record.id, record, (payload, requestPayload) => {
				fetchEnd();
			});
			
        })
	}

	render()  {
		const { record, isSubmitting } = this.props;
		const { onEditorChange, handleSubmit, handleSaveClick } = this;
		return (
			<span>
				<SimpleForm
					form="note-quick-create"
					resource="notes"
					onSubmit={handleSubmit}
					toolbar={null}
					>
					<RichTextInput source="note" label="Notiz"/>
				</SimpleForm>
				<SaveButton
                    saving={isSubmitting}
                    onClick={handleSaveClick}
                    label="Notiz hinzufügen"
                />
			</span>
	)}
}

WorkNoteAdd.propTypes = {
	noteCreate: PropTypes.func,
	workNotesUpdate: PropTypes.func,
	fetchStart: PropTypes.func,
	fetchEnd: PropTypes.func,
	submit: PropTypes.func
}

Object.assign(
	WorkNoteAdd.propTypes
)

export default connect(null, {
	noteCreate,
	workNotesUpdate,
	fetchStart,
	fetchEnd,
	submit
})(WorkNoteAdd);