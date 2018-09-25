import React from 'react';
import { List, Edit, Create, Datagrid, TextField, EditButton, SimpleForm, TextInput, Filter } from 'react-admin';

const TechniquesFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

export const TechniquesList = (props) => (
    <List {...props} title="Techniken" filters={<TechniquesFilter />}>
        <Datagrid>    
            <TextField source="name" title="Name" />            
            <EditButton />
        </Datagrid>
    </List>
);

const TechniquesTitle = ({ record }) => {
    return <span>Technik: {record ? `"${record.name}"` : ''}</span>;
};

export const TechniquesEdit = (props) => (
    <Edit title={<TechniquesTitle />} {...props}>
        <SimpleForm>
            <TextInput label="Name" source="name"/>          
        </SimpleForm>
    </Edit>
);

export const TechniquesCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput label="Name" source="name"/>
        </SimpleForm>
    </Create>
);