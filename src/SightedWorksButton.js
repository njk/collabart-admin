import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, crudUpdateMany } from 'react-admin';

class SightedWorksButton extends Component {
    handleClick = () => {
        const { basePath, crudUpdateMany, resource, selectedIds } = this.props;
        crudUpdateMany(resource, selectedIds, { sighted: !resource.sighted }, basePath);
    };

    render() {
        return (
            <Button label="Gesichtet" onClick={this.handleClick} />
        );
    }
}

export default connect(undefined, { crudUpdateMany })(SightedWorksButton);