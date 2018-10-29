import React from 'react';
import {
	Show,
	SimpleShowLayout,
	Responsive,
	SimpleList,
	FormTab,
	TabbedForm,
	Toolbar,
	SaveButton,
	AutocompleteArrayInput,
	DisabledInput,
	List,
	Edit,
	Create,
	Datagrid,
	TextField,
	RichTextField,
	ReferenceArrayField,
	SingleFieldList,
	ShowButton,
	EditButton,
	SimpleForm,
	ReferenceInput,
	AutocompleteInput,
	TextInput,
	NumberInput,
	BooleanInput,
	ReferenceArrayInput,
	Filter,
	FormDataConsumer
	}
	from 'react-admin';
import CloudinaryWorkImage from './CloudinaryWorkImage';
import { Image, Transformation } from 'cloudinary-react';
import { EditImageButton, CreateImageButton } from './ImageButtons';
import {  CreateLocationButton } from './LocationButtons';
import { EditNoteButton, CreateNoteButton } from './NoteButtons';
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
		if(record && record.dimensions){
			if(record.dimensions.diameter) {
				return <span>&oslash; {record.dimensions.diameter} cm</span>
			}
			if(record.dimensions.depth) {
				return <span>{record.dimensions.height}x{record.dimensions.width}x{record.dimensions.depth} cm</span>
			}
			return <span>{record.dimensions.height}x{record.dimensions.width} cm</span>
		}
		return null;
	}

const DimensionsInput = ( { record } ) => 
	{
		return (
			<span>
				<NumberInput source="dimensions.height" label="Höhe" />
				<NumberInput source="dimensions.width" label="Breite" />
				<NumberInput source="dimensions.depth" label="Tiefe" />
				<NumberInput source="dimensions.diameter" label="Durchmesser" />
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

const LocationButtonAdd = ( { record }) => 
{
	return record && record.locations && record.locations.length
		?
		<p>zum Ändern klicken</p>
		: <CreateLocationButton record={record}/>
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

const ImageInformation = ( { record } ) => {
	return record && record.image
		?
		(
			<span>
				<p>Auflösung</p>
				<p>{record.image.height}x{record.image.width}</p>
				<p>Format: {record.image.format}</p>
				<p>Oringinal</p>
				<p>Komprimiert</p>
			</span>
		)
		: null
}

const YearField = ({ record }) => {
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
	return <span></span>
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

let showNotes = true;

export const WorksList = (props, showNotes) => (
	<List {...props} title="Werke" filters={<WorksFilter />} perPage={20}>

	<Responsive
		small={
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={	record => <ReferenceArrayField
					    label="Künstler"
					    reference="artists"
					    source="artists"
					    record={record}
					    basepath="artists"
					>
					    <SingleFieldList>
					        <NameField />
					    </SingleFieldList>
					</ReferenceArrayField> 
					}
                    tertiaryText={record => <YearField record={record}/>}
                    leftIcon={record => <SmallImageField record={record} source="image" label="Abbildung" width="200"/>}
                />
            }
        medium={
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
			        { showNotes ?
			        	<ReferenceArrayField
					    label="Notizen"
					    reference="notes"
					    source="notes"
					    sortable={false}
					>
					    <SingleFieldList>
					        <RichTextField source="note" /> 
					    </SingleFieldList>
					</ReferenceArrayField>
					: <span>Hallo</span>
			        }			
				    
					<ImagesField label="Abbildungen" sortable={false}/> 
					<ShowButton />
		            <EditButton />
		        </Datagrid>
        }
        />
		    </List>

);

const WorksTitle = ({ record }) => {
    return <span>{record ? `"${record.title}"` : ''}</span>;
};

const artistInputRenderer = choice => `${choice.name.first} ${choice.name.last}`;
const techniquesInputRenderer = choice => `${choice.name}`;

const WorksEditToolbar = props => (
    <Toolbar {...props} >
    	<SaveButton
            label="Speichern"
            redirect={false}
            submitOnEnter={true}
        />
		<SaveButton
            label="Speichern und zur Liste"
            redirect="list"
            submitOnEnter={false}
            variant="flat"
        />
    </Toolbar>
);


export const WorksEdit = (props) => (
	<Edit {...props} title={<WorksTitle />}>
		<TabbedForm toolbar={<WorksEditToolbar />}>
			<FormTab label="Hauptinformationen" >
				<SmallImageField source="image" label="Abbildung" width="400"/>
				<WorkImageCloudinaryInput />
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
							return ''
						}
					}} 
					parse={v => {
						if(v){
							const date = new Date().setFullYear(v);
							return date;
						} else {
							return ''
						}
					}} label="Jahr" />
				<NumberInput source="publishedDateAlternative" 
					format={v => {
						if(v){
							const date = new Date(v);
							return date.getFullYear();
						} else {
							return ''
						}
					}} 
					parse={v => {
						if(v){
							const date = new Date().setFullYear(v);
							return date;
						} else {
							return ''
						}
					}} label="alternatives Jahr" />
				<TextInput source="dateDivider" label="Trennzeichen" />
				<BooleanInput source="isDateNotExact" label="ungenaue Jahresangabe"/>
				<BooleanInput source="isDateUnknown" label="Jahr unbekannt"/>
				
		    </FormTab>
		    <FormTab label="Lagerinformationen" path="locations">
	    		<ReferenceArrayField
			          reference="locations"
			          source="locations"
			          label="Lagerort"
			          sort={{ field: 'created_at', order: 'DESC' }}	
			        >
			        	<SingleFieldList>
			          		<TextField source="name" />
			          	</SingleFieldList>
		        </ReferenceArrayField>
		        <LocationButtonAdd />		    		        
		    </FormTab>
		    <FormTab label="Notizen" path="notes">
		    	
		    	<CreateNoteButton />
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
		        <DisabledInput source="notes" className="no-display"/>
		    </FormTab>
		    <FormTab label="Bilder" path="images">
		    	
		    	<CreateImageButton />
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
		        <DisabledInput source="images" className="no-display"/>
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
            <ImageInformation source="image" />
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
			<YearField label="Jahr" />
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