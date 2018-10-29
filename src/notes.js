import React from 'react';
import { Edit, Create, SimpleForm, TextInput } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

const NotesTitle = ({ record }) => {
    return <span>Notiz</span>;
};

export const NotesEdit = (props) => {
	return (
    <Edit title={<NotesTitle />} {...props}>
        <SimpleForm redirect={props.history.goBack}>
            <TextInput label="Name" source="name"/>
            <RichTextInput label="Notizen" source="note"/>
        </SimpleForm>
    </Edit>
	);
}

export const NotesCreate = (props) => {
	return (
    <Create {...props}>
        <SimpleForm redirect={props.history.goBack}>
            <TextInput label="Name" source="name"/>
            <RichTextInput label="Notizen" source="note"/>
        </SimpleForm>
    </Create>
	);
}