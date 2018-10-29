import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const LocationsTitle = ({ record }) => {
    return <span>Lagerort</span>;
};

export const LocationsEdit = (props) => {
	return (
    <Edit title={<LocationsTitle />} {...props}>
        <SimpleForm redirect={props.history.goBack}>
            <TextInput label="Name" source="name"/>
        </SimpleForm>
    </Edit>
);}

export const LocationsCreate = (props) => {
	return (
    <Edit {...props}>
        <SimpleForm redirect={props.history.goBack}>
            <TextInput label="Name" source="name"/>
        </SimpleForm>
    </Edit>
);}