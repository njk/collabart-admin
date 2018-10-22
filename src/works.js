import React from 'react';
import { Show, SimpleShowLayout, FormTab, TabbedForm, AutocompleteArrayInput, List, Edit, Create, Datagrid, ReferenceField, ArrayField, TextField, RichTextField, DateField, ReferenceArrayField, SingleFieldList, ShowButton, EditButton, SimpleForm, SearchInput, SelectInput, ReferenceInput, AutocompleteInput, TextInput, NumberInput, BooleanInput, DateInput, ReferenceArrayInput, SelectArrayInput, Filter } from 'react-admin';
import CloudinaryUpload from './CloudinaryUpload';
import CloudinaryWorkImage from './CloudinaryWorkImage';
import { Image, Transformation } from 'cloudinary-react';
import EditImageButton from './EditImageButton';
import { EditLocationButton } from './LocationButtons';
import { EditNoteButton } from './NoteButtons';
import WorkNoteAdd from './WorkNoteAdd'
import WorkLocationAdd from './WorkLocationAdd'
import FilterIcon from '@material-ui/icons/Filter';


const WorksFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Titel" source="title" alwaysOn />        
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

const SmallImageField = ( { record, width } ) => 
	record && record.image
	? 
		(
			<span>
				<Image publicId={record.image.public_id} secure="true">
					<Transformation width={width} crop="fill"/>
					<Transformation fetchFormat="auto" quality="80"/>
				</Image>
			</span>
		)
	: null;

const ImagesField = ( { record } ) => 
	record && record.images && record.images.length > 1
	? 
		(
			<span>
				<FilterIcon />
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
		: null
}



const YearField = ({ record }) => 
	{
		if(record.isDateUnknown) {
			return <span>unbekannt</span>
		}
		if(record.isDateNotExact) {
			return <span>ca. {new Date(record.publishedDate).getFullYear()}</span>
		}
		if(record.publishedDateAlternative) {
			return <span>
					{new Date(record.publishedDate).getFullYear()}
					{record.dateDivider}
					{new Date(record.publishedDateAlternative).getFullYear()}
				</span>
		}
		if(record.publishedDate){
			return <span>
				{new Date(record.publishedDate).getFullYear()}
				</span>
		}
		return <span>
				</span>
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
            <SmallImageField source="image" label="Abbildung" width="200"/>
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
			<YearField label="Jahr" />
			<ReferenceArrayField
		          reference="locations"
		          source="locations"
		          label="Lagerort"
		        >
			    	<SingleFieldList>
		          		<LocationField source="name" />
		          	</SingleFieldList>
	        </ReferenceArrayField>			
		    <ReferenceArrayField
			    label="Notizen"
			    reference="notes"
			    source="notes"
			>
			    <SingleFieldList>
			        <RichTextField source="note" /> 
			    </SingleFieldList>
			</ReferenceArrayField>
			<ImagesField /> 
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
				<SmallImageField source="image" label="Abbildung" width="400"/>
				<TextInput source="title" />
				<ReferenceArrayInput source='artists' reference='artists' label={'Künstler'} perPage={10} 
		        	sort={{ field: 'name.last', order: 'ASC' }}
		        	filterToQuery={searchText => ({ 'name.last': searchText })}>
					<AutocompleteArrayInput optionValue="id" optionText={artistInputRenderer} />
				</ReferenceArrayInput>
				<DimensionsInput />
				<ReferenceArrayInput source='techniques' reference='techniques' label={'Techniken'} perPage={10}
					sort={{ field: 'name', order: 'ASC' }}
					filterToQuery={searchText => ({ 'name': searchText })}>
					<AutocompleteArrayInput optionText={techniquesInputRenderer} />
				</ReferenceArrayInput>
				<NumberInput source="publishedDate" 
					format={v => {
						if(v){
							const date = new Date(v);
							return date.getFullYear();
						} else {
							return null
						}
					}} 
					parse={v => {
						if(v){
							const date = new Date().setFullYear(v);
							return date;
						} else {
							return null
						}
					}} label="Jahr" />
				<NumberInput source="publishedDateAlternative" 
					format={v => {
						const date = new Date(v);
						return date.getFullYear();
					}} 
					parse={v => {
						const date = new Date().setFullYear(v);
						return date;
					}} label="alternatives Jahr" />
				<TextInput source="dateDivider" label="Trennzeichen" />
				<BooleanInput source="isDateNotExact" label="ungenaue Jahresangabe"/>
				<BooleanInput source="isDateUnknown" label="Jahr unbekannt"/>
				<WorkImageCloudinaryInput />
		    </FormTab>
		    <FormTab label="Lagerinformationen" path="store">
	    		<ReferenceArrayField
			          reference="locations"
			          source="locations"
			          label="Lagerort"
			        >
			          	<SingleFieldList>
		          			<LocationInput source="name" />
		          		</SingleFieldList>
		        </ReferenceArrayField>
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
			<ReferenceArrayInput source='artists' reference='artists' label={'Künstler'} perPage={10} 
	        	sort={{ field: 'name.last', order: 'ASC' }}
	        	filterToQuery={searchText => ({ 'name.last': searchText })}>
				<AutocompleteArrayInput optionValue="id" optionText={artistInputRenderer} />
			</ReferenceArrayInput>
			<DimensionsInput />
			<ReferenceArrayInput source='techniques' reference='techniques' label={'Techniken'} perPage={10}
				sort={{ field: 'name', order: 'ASC' }}
				filterToQuery={searchText => ({ 'name': searchText })}>
				<AutocompleteArrayInput optionText={techniquesInputRenderer} />
			</ReferenceArrayInput>
			<NumberInput source="publishedDate" 
				format={v => {
					const date = new Date(v);
					return date.getFullYear();
				}} 
				parse={v => {
					const date = new Date().setFullYear(v);
					return date;
				}} label="Jahr" />
        </SimpleForm>
    </Create>
);

export const WorksShow = (props) => (
    <Show {...props} title={<WorksTitle />}>
        <SimpleShowLayout>
            <SmallImageField source="image" label="Abbildung" width="400"/>
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