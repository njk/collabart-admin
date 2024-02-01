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
    TextInput,
    REDUX_FORM_NAME
} from 'react-admin';
import { locationCreate } from './locationButtonsActions';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

const styles = {
  button: {
    marginTop: '1em'
  }
};

class EditLocationButtonComp extends Component {

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
        submit('location-quick-create');
    };

    handleSubmit = values => {
        const { fetchStart, fetchEnd, change, locationCreate } = this.props;
        const { handleCloseClick } = this;        
        // Dispatch an action letting react-admin know a API call is ongoing
        fetchStart();

        locationCreate(values, (payload, requestPayload) => {
        	const { record } = this.props;        	
			var locations = record.locations;
			if(locations && locations.length) {
				locations.push(payload.data.id);
			} else {
				locations = [payload.data.id];
			}
			change(REDUX_FORM_NAME, 'locations', locations);
			fetchEnd();
			handleCloseClick();
        });
    };

    render() {
        const { showDialog } = this.state;
        const { isSubmitting } = this.props;

        return (
            <Fragment>
                <Button onClick={this.handleClick} label="Lagerort hinzufügen">
                    <IconContentAdd />
                </Button>
                <Dialog
                    fullWidth
                    open={showDialog}
                    onClose={this.handleCloseClick}
                    aria-label="Lagerort hinzufügen"
                >
                    <DialogTitle>Lagerort hinzufügen</DialogTitle>
                    <DialogContent>
                        <SimpleForm
                            // We override the redux-form name to avoid collision with the react-admin main form
                            form="location-quick-create"
                            resource="locations"
                            // We override the redux-form onSubmit prop to handle the submission ourselves
                            onSubmit={this.handleSubmit}
                            // We want no toolbar at all as we have our modal actions
                            toolbar={null}
                        >
                            <TextInput source="name" label="Name"/>
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
    isSubmitting: isSubmitting('location-quick-create')(state)
});

const mapDispatchToProps = {
    change,
    fetchEnd,
    fetchStart,
    submit,
    locationCreate
};

export const CreateLocationButton = connect(mapStateToProps, mapDispatchToProps)(
    CreateLocationButtonComp
);
