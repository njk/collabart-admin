import React from 'react';
import { List, Edit, Create, Datagrid, EditButton, SimpleForm, TextInput, Filter } from 'react-admin';

const ArtistsFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

const NameTextField = ( { record, ...rest } ) => 
	record && record.name
	? 
		(
			<span>
				{record.name.first + " " + record.name.last}
			</span>
		)
	: null;

export const ArtistsList = (props) => (
    <List {...props} title="Künstler" filters={<ArtistsFilter />}>
        <Datagrid>    
            <NameTextField source="name" title="Name" />            
            <EditButton />
        </Datagrid>
    </List>
);

const ArtistsTitle = ({ record }) => {
    return <span>Künstler {record ? `"${record.name.first + " " +record.name.last}"` : ''}</span>;
};

export const ArtistsEdit = (props) => (
    <Edit title={<ArtistsTitle />} {...props}>
        <SimpleForm>
            <TextInput label="Vorname" source="name.first"/>
            <TextInput label="Nachname" source="name.last"/>            
        </SimpleForm>
    </Edit>
);

export const ArtistsCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput label="Vorname" source="name.first"/>
            <TextInput label="Nachname" source="name.last"/>  
        </SimpleForm>
    </Create>
);