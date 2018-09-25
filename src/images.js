import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

const ImagesTitle = ({ record }) => {
    return <span>Abbildung: {record ? `"${record.name}"` : ''}</span>;
};

export const ImagesEdit = (props) => {
	return (
    <Edit title={<ImagesTitle />} {...props}>
        <SimpleForm redirect={props.history.goBack}>
            <TextInput label="Name" source="name"/>
            <RichTextInput label="Notizen" source="note"/>          
        </SimpleForm>
    </Edit>
);}