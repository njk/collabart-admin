import React from 'react';
import { Show, SimpleShowLayout, FormTab, TabbedForm, List, Edit, Create, Datagrid, ReferenceField, ArrayField, TextField, RichTextField, DateField, ReferenceArrayField, SingleFieldList, ShowButton, EditButton, SimpleForm, SelectInput, ReferenceInput, AutocompleteInput, TextInput, NumberInput, BooleanInput, DateInput, ReferenceArrayInput, SelectArrayInput, Filter } from 'react-admin';
import CloudinaryUpload from './CloudinaryUpload';
import CloudinaryWorkImage from './CloudinaryWorkImage';
import { Image, Transformation } from 'cloudinary-react';
import EditImageButton from './EditImageButton';
import { EditLocationButton } from './LocationButtons';
import { EditNoteButton } from './NoteButtons';
import WorkNoteAdd from './WorkNoteAdd'
import WorkLocationAdd from './WorkLocationAdd'

const WorksFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Titel" source="title" />
        <ReferenceInput 
        	source="notes" 
        	reference="notes" 
        	label="Notizen"
        	perPage={10} 
        	sort={{ field: 'note', order: 'ASC' }}
        	filterToQuery={searchText => ({ 'note': searchText })} >
            <AutocompleteInput
                optionText={choice =>
                    `${choice.note}`
                }
            />
        </ReferenceInput> 
        <ReferenceInput 
        	source="artists" 
        	reference="artists" 
        	label="Künstler"
        	perPage={10} 
        	sort={{ field: 'name.last', order: 'ASC' }}
        	filterToQuery={searchText => ({ 'name.last': searchText })}
        	alwaysOn>
            <AutocompleteInput
                optionText={choice =>
                    `${choice.name.first} ${choice.name.last}`
                }
            />
        </ReferenceInput>        
    </Filter>
);

const ReferenceSearchInput = ( { choices } ) => 
	{
		return (
			<span>
				<TextInput />
			</span>
		    )
	}

const SmallImageField = ( { record } ) => 
	record && record.image
	? 
		(
			<span>
				<Image publicId={record.image.public_id} secure="true">
					<Transformation height="200" crop="fill"/>
					<Transformation fetchFormat="auto" quality="80"/>
				</Image>
			</span>
		)
	: null;

const ImagesField = ( { record } ) => 
	record && record.images
	? 
		(
			<span>
				&#8226;
			</span>
		)
	: (<span></span>);	

const DimensionsField = ( { record } ) => 
	{
		return record && record.dimensions ? (
			<span>{record.dimensions.height}x{record.dimensions.width} cm</span>
		    )
		    : null
	}

const DimensionsInput = ( { record } ) => 
	{
		return (
			<span>
				<NumberInput source="dimensions.height" label="Höhe" />
				<NumberInput source="dimensions.width" label="Breite" />
				<NumberInput source="dimensions.depth" label="Tiefe" />
			</span>
		    )
	}

const NameField = ( { record }) => 
{
	return record && record.name
		?
		(
			<span>
				{record.name.first + " " + record.name.last}
			</span>
		)
		: null
}

const LocationInput = ( { record }) => 
{
	return record && record.name
		?
		(
			<span>
				{record.name}<br/>ändern
			</span>
		)
		: 'kein Ort'
}

const LocationField = ( { record }) => 
{
	return record && record.name
		?
		(
			<span>
				{record.name}
			</span>
		)
		: 'kein Ort'
}

const CloudinaryInput = ({record}) => {

	return (<CloudinaryUpload record={record}/>)
}

const WorkImageCloudinaryInput = ({record}) => {

	return (<CloudinaryWorkImage record={record}/>)
}

const CloudinaryImageField = ({record}) => {
	
	return record ? (
		<Image publicId={record.public_id} secure="true">
			<Transformation width="400" crop="fill"/>
			<Transformation fetchFormat="auto" quality="80"/>
		</Image>
	): "kein Bild";
}


const SharingInputs = ({ record }) => 
	(
		<span>
			<BooleanInput label="online sichtbar" source="isPublic"/>
		</span>
	)

export const WorksList = (props) => (
    <List {...props} title="Werke" filters={<WorksFilter />} perPage={20}>
        <Datagrid>
            <SmallImageField source="image" label="Abbildung" />
			<ReferenceArrayField
			    label="Künstler"
			    reference="artists"
			    source="artists"
			>
			    <SingleFieldList>
			        <NameField />
			    </SingleFieldList>
			</ReferenceArrayField>         
            <TextField source="title" label="Titel" />
            <DimensionsField label="Maße" source="dimensions"/>
 			<ReferenceArrayField
			    label="Techniken"
			    reference="techniques"
			    source="techniques"
			>
			    <SingleFieldList>
			        <TextField source="name" /> 
			    </SingleFieldList>
			</ReferenceArrayField>
			<DateField label="Jahr" source="publishedDate" options={{ year: 'numeric' }}/>
			<ReferenceField
		          reference="locations"
		          source="locations"
		          label="Lagerort"
		        >
		          	<LocationField source="name" />
		        </ReferenceField>			
		    <ReferenceArrayField
			    label="Notizen"
			    reference="notes"
			    source="notes"
			>
			    <SingleFieldList>
			        <RichTextField source="note" /> 
			    </SingleFieldList>
			</ReferenceArrayField>
			<ArrayField
			    label="Bilder"
			    source="images"
			>
			    <SingleFieldList>
			        <ImagesField /> 
			    </SingleFieldList>
			</ArrayField>
			<ShowButton />
            <EditButton />
        </Datagrid>
    </List>
);

const WorksTitle = ({ record }) => {
    return <span>{record ? `"${record.title}"` : ''}</span>;
};

const artistInputRenderer = choice => `${choice.name.first} ${choice.name.last}`;
const techniquesInputRenderer = choice => `${choice.name}`;

export const WorksEdit = (props) => (
	<Edit {...props} title={<WorksTitle />}>
		<TabbedForm>
			<FormTab label="Hauptinformationen">
				<TextInput source="title" />
				<ReferenceArrayInput source='artists' reference='artists' label={'Künstler'}>
					<SelectArrayInput optionText={artistInputRenderer} />
				</ReferenceArrayInput>
				<DimensionsInput />
				<ReferenceArrayInput source='techniques' reference='techniques' label={'Techniken'}>
					<SelectArrayInput optionText={techniquesInputRenderer} />
				</ReferenceArrayInput>
				<DateInput source="publishedDate" label="Jahr"/>
            <SmallImageField source="image" label="Abbildung" />				
				<WorkImageCloudinaryInput />
		    </FormTab>
		    <FormTab label="Lagerinformationen" path="store">
	    		<ReferenceField
			          reference="locations"
			          source="locations"
			          label="Lagerort"
			        >
			          	<LocationInput source="name" />
		        </ReferenceField>
		        <WorkLocationAdd />	
		    </FormTab>
		    <FormTab label="Notizen" path="notes">
	    		<ReferenceArrayField
			          reference="notes"
			          source="notes"
			          sort={{ field: 'created_at', order: 'DESC' }}
			          label=""
			        >
			          <Datagrid>
						<RichTextField source="note" label="Notizen"/>
						<EditNoteButton />
			          </Datagrid>
		        </ReferenceArrayField>
		        <WorkNoteAdd />		        
		    </FormTab>
		    <FormTab label="Bilder" path="images">
				 <ReferenceArrayField
			          reference="images"
			          source="images"
			          sort={{ field: 'created_at', order: 'DESC' }}
			          label=""
			        >
			          <Datagrid>
						<TextField source="name" label="Titel"/>			          
			            <CloudinaryImageField />
						<RichTextField source="note" label="Notizen"/>
						<EditImageButton/>		            
			          </Datagrid>
		        </ReferenceArrayField>
				<CloudinaryInput source='images' reference='images'/>
		    </FormTab>
			<FormTab label="Freigaben" path="sharing">
	    		<SharingInputs /> 
		    </FormTab>		    
		</TabbedForm>
	</Edit>
);

export const WorksCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
			<ReferenceArrayInput source='artists' reference='artists' label={'Künstler'}>
				<SelectArrayInput optionText={artistInputRenderer} />
			</ReferenceArrayInput>                
        </SimpleForm>
    </Create>
);

export const WorksShow = (props) => (
    <Show {...props} title={<WorksTitle />}>
        <SimpleShowLayout>
            <SmallImageField source="image" label="Abbildung" />
            <ReferenceArrayField
			    label="Künstler"
			    reference="artists"
			    source="artists"
			>
			    <SingleFieldList>
			        <NameField />
			    </SingleFieldList>
			</ReferenceArrayField>
			<TextField source="title" />
            <DimensionsField label="Maße" source="dimensions"/>
 			<ReferenceArrayField
			    label="Techniken"
			    reference="techniques"
			    source="techniques"
			>
			    <SingleFieldList>
			        <TextField source="name" /> 
			    </SingleFieldList>
			</ReferenceArrayField>
			<DateField label="Jahr" source="publishedDate" options={{ year: 'numeric' }}/>
			<ReferenceArrayField
			    label="Notizen"
			    reference="notes"
			    source="notes"
			>
			    <SingleFieldList>
			        <RichTextField source="note" /> 
			    </SingleFieldList>
			</ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);