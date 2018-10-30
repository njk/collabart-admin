import React from 'react';
import { Admin, Resource } from 'react-admin';
import { WorksShow, WorksList, WorksEdit, WorksCreate } from './works';
import { ArtistsList, ArtistsEdit, ArtistsCreate } from './artists';
import { TechniquesList, TechniquesEdit, TechniquesCreate } from './techniques';
import { ImagesEdit } from './images';
import { NotesEdit } from './notes';
import { LocationsEdit } from './locations';
import myTheme from './theme.js';
import { CloudinaryContext} from 'cloudinary-react';
import Config from './config/config';
import './App.css';
import 'react-quill/dist/quill.snow.css';
import germanMessages from 'ra-language-german';
import { dataProvider, authProvider } from './dataProvider'

const messages = {
    'de': germanMessages,
};

const i18nProvider = locale => messages[locale];

const App = () => (
    <CloudinaryContext cloudName={Config.cloud_name} uploadPreset={Config.upload_preset}>
      <Admin 
        locale="de" i18nProvider={i18nProvider}
        theme={myTheme}
        authProvider={authProvider}
        dataProvider={dataProvider} 
        title="Werkliste" >
          <Resource name="works" options={{ label: 'Werke' }} show={WorksShow} list={WorksList} edit={WorksEdit} create={WorksCreate} />   
          <Resource name="artists" options={{ label: 'Künstler' }} list={ArtistsList} edit={ArtistsEdit} create={ArtistsCreate} />
          <Resource name="techniques" options={{ label: 'Techniken' }} list={TechniquesList} edit={TechniquesEdit} create={TechniquesCreate} />
          <Resource name="locations" edit={LocationsEdit} />          
          <Resource name="images" edit={ImagesEdit} />
          <Resource name="notes" edit={NotesEdit} />
      </Admin>
    </CloudinaryContext>
    );

export default App;
