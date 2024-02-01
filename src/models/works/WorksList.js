import {
  List,
  Datagrid,
  TextField,
  ReferenceArrayField,
  SingleFieldList,
  FunctionField,
  BooleanField,
  EditButton,
  TextInput,
  BooleanInput,
} from "react-admin";
import {
  SmallImageField,
  DimensionsField,
  YearField,
  ImagesField,
} from "./Components";

const worksFilters = [
  <TextInput label="Titel" source="title" alwaysOn />,
  <TextInput label="Künstler" source="artistQuery" alwaysOn />,
  <TextInput label="Techniken" source="techniqueQuery" />,
  <TextInput label="Notizen" source="notesQuery" />,
  <TextInput label="Lagerort" source="locationQuery" />,
  <BooleanInput label="gesichtet" source="sighted" />,
];

export const WorksList = () => (
  <List filters={worksFilters}>
    <Datagrid>
      <TextField source="inventoryNumber" label="Inventarnummer" />
      <TextField source="wvz" label="Werkverzeichnisnummer" />
      <SmallImageField
        source="image"
        label="Abbildung"
        width="200"
        sortable={false}
      />
      <ReferenceArrayField
        label="Künstler"
        source="artists"
        reference="artists"
        sortBy={"_sortArtists"}
      >
        <SingleFieldList linkType={false}>
          <FunctionField
            render={(record) => `${record.name.first} ${record.name.last}`}
          />
        </SingleFieldList>
      </ReferenceArrayField>
      <TextField source="title" label="Titel" />
      <DimensionsField label="Maße" source="dimensions" />
      <ReferenceArrayField
        label="Techniken"
        reference="techniques"
        source="techniques"
        sortable={false}
      >
        <SingleFieldList linkType={false}>
          <TextField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <YearField label="Jahr" sortBy="publishedDate" />
      <TextField source="status" label="Status" sortable={false} />
      <ReferenceArrayField
        reference="locations"
        source="locations"
        label="Lagerort"
        sortable={false}
      >
        <SingleFieldList linkType={false}>
          <TextField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <BooleanField source="sighted" label="gesichtet" />
      <ImagesField label="Abbildungen" sortable={false} />
      <EditButton />
    </Datagrid>
  </List>
);
