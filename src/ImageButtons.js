import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import CloudinaryUpload from './CloudinaryUpload';
import { connect } from 'react-redux';
import { change, submit } from 'redux-form';

import {
    fetchEnd,
    fetchStart,
    Button
} from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

const styles = {
  button: {
    marginTop: '1em'
  }
};

class EditImageButtonComp extends Component {

	componentDidMount() {
	}
	render()  {
		const { classes, record } = this.props;
		return (
		  <Button
		    className={classes.button}
		    variant="raised"
		    component={Link}
		    to={`/images/${record._id || record.id}`}
		    label="Bearbeiten"
		    title="Bearbeiten"
		  >
		    <EditIcon />
		  </Button>
	)}
}

export const EditImageButton = withStyles(styles)(EditImageButtonComp);

class CreateImageButtonComp extends Component {
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

    handleSubmit = values => {

        console.log(values)

    };

    render() {
        const { showDialog } = this.state;
        const { record } = this.props;

        return (
            <Fragment>
                <Button onClick={this.handleClick} label="Neue Abbildung hinzufügen">
                    <IconContentAdd />
                </Button>
                <Dialog
                    fullWidth
                    open={showDialog}
                    onClose={this.handleCloseClick}
                    aria-label="Abbildung hinzufügen"
                >
                    <DialogTitle>Abbildung hinzufügen</DialogTitle>
                    <DialogContent>
                    	<CloudinaryUpload record={record} fieldName="images"/>
                    </DialogContent>
                    <DialogActions>
                        <Button label="Fertig" onClick={this.handleCloseClick}>
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
    change,
    fetchEnd,
    fetchStart,
    submit
};

export const CreateImageButton = connect(mapStateToProps, mapDispatchToProps)(
    CreateImageButtonComp
);