import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { Button } from 'react-admin';
import { noteCreate, workNotesUpdate } from './noteButtonsActions';
import ReactQuill from 'react-quill'

class WorkNoteAdd extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			note: ''
		}
		this.onEditorChange = this.onEditorChange.bind(this);
		this.saveNoteToWork = this.saveNoteToWork.bind(this);
	}
	componentDidMount() {
	}

	saveNoteToWork(e) {
		const { noteCreate } = this.props;
		noteCreate({note: this.state.note}, (payload, requestPayload) => {
			const { record, workNotesUpdate } = this.props;
			var notes = record.notes;
			if(notes && notes.length) {
				notes.push(payload.data.id);
			} else {
				notes = [payload.data.id];
			}
			record.notes = notes;
			workNotesUpdate(record.id, record);
			this.setState({
				note: ''
			})
		})
		e.preventDefault();
		console.log("clicked")
	}

	onEditorChange(value) {
		this.setState({note: value});
	}

	render()  {
		const { record } = this.props;
		const { saveNoteToWork, onEditorChange } = this;
		return (
			<span>
				<ReactQuill value={this.state.note} onChange={onEditorChange} />
				<Button
					variant="raised"
					component={Link}
					onClick={saveNoteToWork}
					to={`/works/${record.id}/notes`}
					label="Neue Notiz hinzufügen"
					title="Neue Notiz hinzufügen"
					>
					<NoteAddIcon />
				</Button>
			</span>
	)}
}

WorkNoteAdd.propTypes = {
	noteCreate: PropTypes.func,
	workNotesUpdate: PropTypes.func
}

Object.assign(
	WorkNoteAdd.propTypes
)

export default connect(null, {
	noteCreate,
	workNotesUpdate
})(WorkNoteAdd);