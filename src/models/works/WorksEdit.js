import {
  Edit,
  TabbedForm,
  FormTab,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  TextInput,
  useRecordContext,
  TopToolbar,
  Toolbar,
  SaveButton,
  ShowButton,
  ListButton,
  DeleteWithConfirmButton,
  NumberInput,
  BooleanInput,
  ReferenceArrayField,
  SingleFieldList,
  Datagrid,
  RichTextField,
  TextField,
} from "react-admin";
import {
  DimensionsInput,
  SmallImageField,
  LocationNameField,
  LocationButtonAdd,
} from "./Components";
import { RichTextInput } from "ra-input-rich-text";

const WorksTitle = () => {
  const record = useRecordContext();
  return <span>{record ? `"${record.title}"` : ""}</span>;
};

const WorksEditActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <ShowButton basePath={basePath} record={data} />
    <ListButton />
  </TopToolbar>
);

const WorksEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="Speichern" redirect={false} submitonenter={true} />
    <SaveButton
      label="Speichern und zur Liste"
      redirect="list"
      submitonenter={false}
      variant="flat"
    />
    <DeleteWithConfirmButton />
  </Toolbar>
);

const artistInputRenderer = (choice) =>
  `${choice.name.first} ${choice.name.last}`;
const techniquesInputRenderer = (choice) => `${choice.name}`;

export const WorksEdit = () => {
  return (
    <Edit title={<WorksTitle />} actions={<WorksEditActions />}>
      <TabbedForm toolbar={<WorksEditToolbar />}>
        <FormTab label="Hauptinformationen">
          <SmallImageField source="image" label="Abbildung" width="400" />
          <ReferenceArrayInput
            source="artists"
            reference="artists"
            label={"Künstler"}
            perPage={10}
            sort={{ field: "name.last", order: "ASC" }}
            filterToQuery={(searchText) => ({ "name.last": searchText })}
          >
            <AutocompleteArrayInput
              optionValue="id"
              optionText={artistInputRenderer}
              allowEmpty
            />
          </ReferenceArrayInput>
          <TextInput source="title" label="Titel" />
          <DimensionsInput />
          <ReferenceArrayInput
            source="techniques"
            reference="techniques"
            label={"Techniken"}
            perPage={10}
            sort={{ field: "name", order: "ASC" }}
            filterToQuery={(searchText) => ({ name: searchText })}
          >
            <AutocompleteArrayInput
              optionText={techniquesInputRenderer}
              allowEmpty
            />
          </ReferenceArrayInput>
          <NumberInput
            source="publishedDate"
            format={(v) => {
              if (v) {
                const date = new Date(v);
                return date.getFullYear();
              } else {
                return "";
              }
            }}
            parse={(v) => {
              if (v) {
                const date = new Date().setFullYear(v);
                return date;
              } else {
                return "";
              }
            }}
            label="Jahr"
          />
          <NumberInput
            source="publishedDateAlternative"
            format={(v) => {
              if (v) {
                const date = new Date(v);
                return date.getFullYear();
              } else {
                return "";
              }
            }}
            parse={(v) => {
              if (v) {
                const date = new Date().setFullYear(v);
                return date;
              } else {
                return "";
              }
            }}
            label="alternatives Jahr (1948/1949)"
          />
          <TextInput source="dateDivider" label="Trennzeichen (z.B. /)" />
          <BooleanInput source="isDateNotExact" label="ungenaue Jahresangabe" />
          <BooleanInput source="isDateUnknown" label="Jahr unbekannt" />
          <TextInput source="wvz" label="Werkverzeichnisnummer" />
          <TextInput source="signature" label="Signatur/Bezeichnung" />
        </FormTab>
        <FormTab label="Lagerinformationen" path="locations">
          <TextInput source="inventoryNumber" label="Inventarnummer" />
          <BooleanInput source="sighted" label="gesichtet" />
          <ReferenceArrayField
            reference="locations"
            source="locations"
            label="Lagerort"
            sort={{ field: "created_at", order: "DESC" }}
          >
            <SingleFieldList>
              <LocationNameField />
            </SingleFieldList>
          </ReferenceArrayField>
          <LocationButtonAdd />
          <RichTextInput source="state" label="Zustand" />
          <TextInput source="status" label="Status" />
          <TextInput source="insuranceValue" label="Versicherungswert" />
          <TextInput source="frameSize" label="Rahmenmaß" />
        </FormTab>
        <FormTab label="Sonstiges" path="other">
          <RichTextInput source="showHistory" label="Ausstellungshistorie" />
          <RichTextInput source="literature" label="Literatur" />
          <RichTextInput source="provenance" label="Provenienz" />
          <RichTextInput source="bio" label="Biographie" />
        </FormTab>
        <FormTab label="Notizen" path="notes">
          <ReferenceArrayField
            reference="notes"
            source="notes"
            sort={{ field: "created_at", order: "DESC" }}
            label=""
          >
            <Datagrid>
              <RichTextField source="note" label="Notizen" />
            </Datagrid>
          </ReferenceArrayField>
        </FormTab>
        <FormTab label="Bilder" path="images">
          <ReferenceArrayField
            reference="images"
            source="images"
            sort={{ field: "created_at", order: "DESC" }}
            label=""
          >
            <Datagrid>
              <TextField source="name" label="Titel" />
              <SmallImageField width={200} />
              <RichTextField source="note" label="Notizen" />
            </Datagrid>
          </ReferenceArrayField>
        </FormTab>
        <FormTab label="Freigaben" path="sharing">
          <BooleanInput label="online sichtbar" source="isPublic" />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};
