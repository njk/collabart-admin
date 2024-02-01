import React from "react";
import { Admin, Resource } from "react-admin";
import { WorksEdit, WorksList } from "./models/works";
import { ArtistsList, ArtistsEdit, ArtistsCreate } from "./artists";
import { TechniquesList, TechniquesEdit, TechniquesCreate } from "./techniques";
import { ImagesEdit } from "./images";
import { NotesEdit } from "./notes";
import { LocationsEdit } from "./locations";
import { CloudinaryContext } from "cloudinary-react";
import Config from "./config/config";
import "./App.css";
import de from "ra-language-german";
import authClient from "./client/authClient";
import restClient from "./client/restClient";
import polyglotI18nProvider from "ra-i18n-polyglot";

const i18nProvider = polyglotI18nProvider(() => de, "de");

// to rename id field for *all* resources use this syntax:
const options = { id: "_id" };

const App = () => (
  <CloudinaryContext
    cloudName={Config.cloud_name}
    uploadPreset={Config.upload_preset}
  >
    <Admin
      locale="de"
      i18nProvider={i18nProvider}
      authProvider={authClient}
      dataProvider={restClient(options)}
      title="Werkliste"
    >
      <Resource
        name="works"
        options={{ label: "Werke" }}
        list={WorksList}
        edit={WorksEdit}
      />
      <Resource
        name="artists"
        options={{ label: "Künstler" }}
        list={ArtistsList}
        edit={ArtistsEdit}
        create={ArtistsCreate}
      />
      <Resource
        name="techniques"
        options={{ label: "Techniken" }}
        list={TechniquesList}
        edit={TechniquesEdit}
        create={TechniquesCreate}
      />
      <Resource name="locations" edit={LocationsEdit} />
      <Resource name="images" edit={ImagesEdit} />
      <Resource name="notes" edit={NotesEdit} />
    </Admin>
  </CloudinaryContext>
);

export default App;
