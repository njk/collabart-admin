import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { Image, Transformation } from 'cloudinary-react';

const ImagesTitle = ({ record }) => {
    return <span>Abbildung: {record ? `"${record.name}"` : ''}</span>;
};

const SmallImageField = ( { record, width } ) => 
	(
		<span>
			<Image publicId={record.public_id} secure="true">
				<Transformation width={width} crop="fill"/>
				<Transformation fetchFormat="auto" quality="80"/>
			</Image>
		</span>
	)

export const ImagesEdit = (props) => {
	return (
    <Edit title={<ImagesTitle />} {...props}>
        <SimpleForm redirect={props.history.goBack}>
        	<SmallImageField width="400" />
            <TextInput label="Name" source="name"/>
            <RichTextInput label="Notizen" source="note"/>          
        </SimpleForm>
    </Edit>
);}