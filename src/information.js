import React from 'react';
import { List, Edit, Create, Datagrid, TextField, NumberField, ReferenceField, EditButton, SimpleForm, TextInput, Filter } from 'react-admin';
import cloudinary from 'cloudinary'

const InformationFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

export const InformationList = (props) => (
    <List {...props} title="Informationen" filters={<InformationFilter />}>
        <Datagrid>    
            <NumberField source="width" title="Breite" />            
            <EditButton />
        </Datagrid>
    </List>
);

const InformationTitle = ({ record }) => {
    return <span>Information: {record ? `"${record.name}"` : ''}</span>;
};

export const InformationEdit = (props) => (
    <Edit title={<InformationTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

export const InformationCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);