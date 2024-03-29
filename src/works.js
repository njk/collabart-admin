import React, { Fragment } from "react";
import {
  Show,
  FormTab,
  TabbedForm,
  TabbedShowLayout,
  Tab,
  Toolbar,
  SaveButton,
  AutocompleteArrayInput,
  List,
  Edit,
  Create,
  Datagrid,
  TextField,
  RichTextField,
  BooleanField,
  FunctionField,
  ReferenceArrayField,
  SingleFieldList,
  ShowButton,
  EditButton,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceArrayInput,
  Filter,
  CardActions,
  CreateButton,
  ExportButton,
  RefreshButton,
  ListButton,
  Pagination,
  DeleteWithConfirmButton,
} from "react-admin";
import { Image, Transformation } from "cloudinary-react";
import { EditImageButton, CreateImageButton } from "./ImageButtons";
import { CreateLocationButton } from "./LocationButtons";
import { EditNoteButton, CreateNoteButton } from "./NoteButtons";
import FilterIcon from "@mui/icons-material/Filter";
import SightedWorksButton from "./SightedWorksButton";
import RichTextInput from "ra-input-rich-text";
import XLSX from "xlsx";
import axiosClient from "./config/axios";

const worksFilters = [
  <TextInput label="Titel" source="title" alwaysOn />,
  <TextInput label="Künstler" source="artistQuery" alwaysOn />,
  <TextInput label="Techniken" source="techniqueQuery" />,
  <TextInput label="Notizen" source="notesQuery" />,
  <TextInput label="Lagerort" source="locationQuery" />,
  <BooleanInput label="gesichtet" source="sighted" />,
];

const SmallImageField = ({ record, width }) => {
  if (record && record.image && record.image.s3_url) {
    const imageUrl = new URL(record.image.s3_url);
    const imageKey = imageUrl.pathname.substring(1);
    const body = {
      bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      key: imageKey,
      edits: {
        resize: {
          width: width,
          fit: "contain",
        },
      },
    };
    const imageRequest = JSON.stringify(body);
    const url = `${process.env.REACT_APP_CLOUDFRONT_API_ENDPOINT}/${btoa(
      imageRequest
    )}`;
    return (
      <span>
        <img src={url} />
      </span>
    );
  }
  return record && record.image ? (
    <span>
      <Image publicId={record.image.public_id} secure="true">
        <Transformation width={width} crop="fill" />
        <Transformation fetchFormat="auto" quality="80" />
      </Image>
    </span>
  ) : null;
};

const ImagesField = ({ record }) =>
  record && record.images && record.images.length > 1 ? (
    <span>
      <FilterIcon />
    </span>
  ) : (
    <span></span>
  );

const DimensionsField = ({ record }) => {
  if (record && record.dimensions) {
    if (record.dimensions.diameter) {
      return <span>&oslash; {record.dimensions.diameter} cm</span>;
    }
    if (record.dimensions.depth) {
      return (
        <span>
          {record.dimensions.height}x{record.dimensions.width}x
          {record.dimensions.depth} cm
        </span>
      );
    }
    return (
      <span>
        {record.dimensions.height}x{record.dimensions.width} cm
      </span>
    );
  }
  return null;
};

const DimensionsInput = ({ record }) => {
  return (
    <span>
      <NumberInput source="dimensions.height" label="Höhe" />
      <NumberInput source="dimensions.width" label="Breite" />
      <NumberInput source="dimensions.depth" label="Tiefe" />
      <NumberInput source="dimensions.diameter" label="Durchmesser" />
    </span>
  );
};

const NameField = ({ record }) => {
  return record && record.name ? (
    <span>{record.name.first + " " + record.name.last}</span>
  ) : null;
};

const LocationNameField = ({ record }) => {
  if (record && record.name) {
    return <span>Lagerort: {record.name}</span>;
  }
  if (record && record.name == "") {
    return <span>Lagerort eingeben</span>;
  }
  return null;
};

const LocationButtonAdd = ({ record }) => {
  return record && record.locations && record.locations.length ? (
    <p>zum Ändern klicken</p>
  ) : (
    <CreateLocationButton record={record} />
  );
};

const WarehouseInfo = ({ record }) => {
  return <span>{record.status}</span>;
};

const LocationField = ({ record }) => {
  return record && record.name ? <span>{record.name}</span> : null;
};

const ImageInformation = ({ record }) => {
  return record && record.image ? (
    <span>
      <p>
        <a href={record.image.s3_url || record.image.secure_url}>
          Link zur vollen Auflösung
        </a>
      </p>
    </span>
  ) : null;
};

const ImageLink = ({ record }) => {
  return (
    <span>
      <p>
        <a href={record.s3_url || record.secure_url}>
          Link zur vollen Auflösung
        </a>
      </p>
    </span>
  );
};

const YearField = ({ record }) => {
  if (record.isDateUnknown) {
    return <span>unbekannt</span>;
  }
  if (record.isDateNotExact) {
    return <span>ca. {new Date(record.publishedDate).getFullYear()}</span>;
  }
  if (record.publishedDateAlternative) {
    return (
      <span>
        {new Date(record.publishedDate).getFullYear()}
        {record.dateDivider}
        {new Date(record.publishedDateAlternative).getFullYear()}
      </span>
    );
  }
  if (record.publishedDate) {
    return <span>{new Date(record.publishedDate).getFullYear()}</span>;
  }
  return <span></span>;
};

const CloudinaryImageField = ({ record }) => {
  if (record && record.s3_url) {
    return <SmallImageField width="400" record={{ image: record }} />;
  }
  return record ? (
    <Image publicId={record.public_id} secure="true">
      <Transformation width="400" crop="fill" />
      <Transformation fetchFormat="auto" quality="80" />
    </Image>
  ) : (
    "kein Bild"
  );
};

const SharingInputs = ({ record }) => (
  <span>
    <BooleanInput label="online sichtbar" source="isPublic" />
  </span>
);

const stripHtml = (html) => {
  if (!html) return;
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const exporter = async (records, fetchRelatedRecords) => {
  // will call dataProvider.getMany
  const artists = await fetchRelatedRecords(records, "artists", "artists");
  const techniques = await fetchRelatedRecords(
    records,
    "techniques",
    "techniques"
  );

  let data = await Promise.all(
    records.map(async (record) => {
      const locations = (
        await axiosClient().get("locations", {
          params: {
            _id: { $in: record.locations },
          },
        })
      ).data.data;
      const notes = (
        await axiosClient().get("notes", {
          params: {
            _id: { $in: record.notes },
          },
        })
      ).data.data;

      return {
        ...record.dimensions,
        wvz: record.wvz,
        title: record.title,
        sighted: record.sighted ? "Ja" : "Nein",
        frameSize: record.frameSize,
        insuranceValue: record.insuranceValue,
        artists_list:
          record.artists && record.artists.length > 0
            ? record.artists
                .map((artist) =>
                  artists[artist]
                    ? `${artists[artist].name.first} ${artists[artist].name.last}`
                    : ""
                )
                .toString()
            : "",
        techniques_list:
          record.techniques && record.techniques.length > 0
            ? record.techniques
                .map((technique) =>
                  techniques[technique] ? techniques[technique].name : ""
                )
                .toString()
            : "",
        locations_list:
          locations && locations.map((location) => location.name).toString(),
        notes_list:
          notes && notes.map((note) => stripHtml(note.note)).toString(),
        publishedYear: record.publishedDate
          ? new Date(record.publishedDate).getFullYear()
          : "",
        state: stripHtml(record.state),
        status: stripHtml(record.status),
        showHistory: stripHtml(record.showHistory),
        provenance: stripHtml(record.provenance),
        literature: stripHtml(record.literature),
        bio: stripHtml(record.bio),
        inventoryNumber: record.inventoryNumber,
      };
    })
  );

  data.splice(0, 0, {
    inventoryNumber: "Inventarnummer",
    wvz: "Werkverzeichnisnummer",
    artists_list: "Künstler",
    title: "Titel",
    height: "Höhe",
    width: "Breite",
    depth: "Tiefe",
    techniques_list: "Techniken",
    publishedYear: "Jahr",
    status: "Status",
    state: "Zustand",
    locations_list: "Lagerort",
    sighted: "gesichtet",
    notes_list: "Notizen",
    frameSize: "Rahmenmaß",
    insuranceValue: "Versicherungswert",
    showHistory: "Ausstellungshistorie",
    literature: "Literatur",
    provenance: "Provenienz",
    bio: "Biographie",
  });
  const headers = [
    "inventoryNumber",
    "wvz",
    "artists_list",
    "title",
    "height",
    "width",
    "depth",
    "techniques_list",
    "publishedYear",
    "status",
    "state",
    "locations_list",
    "sighted",
    "notes_list",
    "frameSize",
    "insuranceValue",
    "showHistory",
    "literature",
    "provenance",
    "bio",
  ]; // order fields in the export
  /* create a new blank workbook */
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(data, {
    header: headers,
    skipHeader: true,
  });
  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(wb, ws, "Werke");

  /* output format determined by filename */
  XLSX.writeFile(wb, "Werkliste.xlsx");
};

const WorksActions = ({
  bulkActions,
  basePath,
  displayedFilters,
  filters,
  filterValues,
  onUnselectItems,
  resource,
  selectedIds,
  showFilter,
  total,
  currentSort,
}) => (
  <CardActions>
    {bulkActions &&
      React.cloneElement(bulkActions, {
        basePath,
        filterValues,
        resource,
        selectedIds,
        onUnselectItems,
      })}
    {filters &&
      React.cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: "button",
      })}
    <CreateButton basePath={basePath} />
    <RefreshButton />
    <ExportButton
      disabled={total === 0}
      resource={resource}
      filter={filterValues}
      sort={currentSort}
      exporter={exporter}
    />
  </CardActions>
);

const WorksBulkActionButtons = (props) => (
  <Fragment>
    {/* Add the default bulk delete action
        <BulkDeleteButton {...props} />*/}
    <SightedWorksButton {...props} />
  </Fragment>
);

const WorksPagination = (props) => (
  <Pagination rowsPerPageOptions={[20, 40, 100]} {...props} />
);

export const WorksList = (props) => (
  <List
    {...props}
    title="Werke"
    filters={worksFilters}
    actions={<WorksActions />}
    perPage={20}
    pagination={<WorksPagination />}
    sort={{ field: "_sortArtists", order: "ASC" }}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
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
      <WarehouseInfo label="Status" sortable={false} />
      <ReferenceArrayField
        reference="locations"
        source="locations"
        label="Lagerort"
        sortable={false}
      >
        <SingleFieldList linkType={false}>
          <LocationField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <BooleanField source="sighted" label="gesichtet" />
      <ImagesField label="Abbildungen" sortable={false} />
      <EditButton />
    </Datagrid>
  </List>
);

const WorksTitle = ({ record }) => {
  return <span>{record ? `"${record.title}"` : ""}</span>;
};

const artistInputRenderer = (choice) =>
  `${choice.name.first} ${choice.name.last}`;
const techniquesInputRenderer = (choice) => `${choice.name}`;

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

const WorksEditActions = ({ basePath, data, resource }) => (
  <CardActions>
    <ShowButton basePath={basePath} record={data} />
    <ListButton />
  </CardActions>
);

export const WorksEdit = (props) => (
  <Edit {...props} title={<WorksTitle />} actions={<WorksEditActions />}>
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
        <CreateNoteButton />
        <ReferenceArrayField
          reference="notes"
          source="notes"
          sort={{ field: "created_at", order: "DESC" }}
          label=""
        >
          <Datagrid>
            <RichTextField source="note" label="Notizen" />
            <EditNoteButton />
          </Datagrid>
        </ReferenceArrayField>
      </FormTab>
      <FormTab label="Bilder" path="images">
        <CreateImageButton />
        <ReferenceArrayField
          reference="images"
          source="images"
          sort={{ field: "created_at", order: "DESC" }}
          label=""
        >
          <Datagrid>
            <TextField source="name" label="Titel" />
            <CloudinaryImageField />
            <RichTextField source="note" label="Notizen" />
            <EditImageButton />
          </Datagrid>
        </ReferenceArrayField>
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
    </SimpleForm>
  </Create>
);

const WorksShowActions = ({ basePath, data, resource }) => (
  <CardActions>
    <ListButton />
  </CardActions>
);

export const WorksShow = (props) => (
  <Show {...props} title={<WorksTitle />} actions={<WorksShowActions />}>
    <TabbedShowLayout>
      <Tab label="Informationen">
        <SmallImageField source="image" label="Abbildung" width="400" />
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
        <DimensionsField label="Maße" source="dimensions" />
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
        <ReferenceArrayField label="Notizen" reference="notes" source="notes">
          <SingleFieldList>
            <RichTextField source="note" />
          </SingleFieldList>
        </ReferenceArrayField>
      </Tab>
      <Tab label="weitere Abbildungen">
        <ReferenceArrayField
          reference="images"
          source="images"
          sort={{ field: "created_at", order: "DESC" }}
          label=""
        >
          <Datagrid>
            <TextField source="name" label="Titel" />
            <CloudinaryImageField />
            <RichTextField source="note" label="Notizen" />
            <ImageLink />
          </Datagrid>
        </ReferenceArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
