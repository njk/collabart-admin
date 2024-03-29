import React from "react";
import {
  List,
  Edit,
  Create,
  Datagrid,
  EditButton,
  SimpleForm,
  TextInput,
  Filter,
  FormDataConsumer,
  BooleanInput,
  useRecordContext,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";

const ArtistsFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Nachname" source="name.last" alwaysOn />
  </Filter>
);

const NameTextField = () => {
  const record = useRecordContext();
  return record && record.name ? (
    <span>{record.name.first + " " + record.name.last}</span>
  ) : null;
};

export const ArtistsList = (props) => (
  <List
    {...props}
    title="Künstler"
    filters={[<TextInput label="Nachname" source="name.last" alwaysOn />]}
    filter={{ in_collection: true }}
    sort={{ field: "name.last", order: "ASC" }}
  >
    <Datagrid>
      <NameTextField source="name" title="Name" sortBy="name.last" />
      <EditButton />
    </Datagrid>
  </List>
);

const ArtistsTitle = ({ record }) => {
  return (
    <span>
      Künstler {record ? `"${record.name.first + " " + record.name.last}"` : ""}
    </span>
  );
};

export const ArtistsEdit = (props) => (
  <Edit title={<ArtistsTitle />} {...props}>
    <SimpleForm>
      <TextInput label="Vorname" source="name.first" />
      <TextInput label="Nachname" source="name.last" />
      <BooleanInput source="isPublic" label="öffentlich" />
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          if (formData.isPublic) {
            return (
              <a href={"https://www.werkliste.ch/artists/" + formData.id}>
                {"https://www.werkliste.ch/artists/" + formData.id}
              </a>
            );
          }
        }}
      </FormDataConsumer>
      <BooleanInput source="showDetails" label="Werkdetails immer anzeigen" />
      <RichTextInput source="vita" />
    </SimpleForm>
  </Edit>
);

export const ArtistsCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Vorname" source="name.first" />
      <TextInput label="Nachname" source="name.last" />
      <BooleanInput source="isPublic" label="öffentlich" />
      <BooleanInput source="showDetails" label="Werkdetails immer anzeigen" />
      <RichTextInput source="vita" />
    </SimpleForm>
  </Create>
);
