import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

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