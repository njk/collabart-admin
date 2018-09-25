import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import { Button } from 'react-admin';

const styles = {
  button: {
    marginTop: '1em'
  }
};

class EditImageButton extends Component {
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
		    to={`/images/${record.id}`}
		    label="Bearbeiten"
		    title="Bearbeiten"
		  >
		    <EditIcon />
		  </Button>
	)}
}

export default withStyles(styles)(EditImageButton);
