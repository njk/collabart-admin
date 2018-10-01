import { CREATE, UPDATE } from 'react-admin';

export const LOCATION_CREATE = 'LOCATION_CREATE';
export const locationCreate = (data, callback) => ({
    type: LOCATION_CREATE,
    payload: { data: { ...data } },
    meta: { 
    	fetch: CREATE, 
    	resource: 'locations',
    	onSuccess: {
    		notification: {
    	    		body: 'Lagerort wurde in der Datenbank gespeichert.',
    	    		level: 'info'
    	    },
    	    callback:  ({ payload, requestPayload }) => { callback(payload, requestPayload) }
    	},
    	onFailure: {
    		notification: {
    	    		body: 'Fehler: Lagerort wurde nicht in der Datenbank gespeichert.',
    	    		level: 'warning'
    	    }
    	}
    },
});

export const WORK_LOCATIONS_UPDATE = 'WORK_LOCATIONS_UPDATE';
export const workLocationsUpdate = (id, work) => ({
    type: WORK_LOCATIONS_UPDATE,
    payload: { id, data: { ...work } },
    meta: { 
    	fetch: UPDATE, 
    	resource: 'works',
    	onSuccess: {
    		notification: {
    	    		body: 'Lagerort wurde dem Werk zugeordnet.',
    	    		level: 'info'
    	    }
    	},
    	onFailure: {
    		notification: {
    	    		body: 'Fehler: Lagerort wurde dem Werk nicht zugeordnet.',
    	    		level: 'warning'
    	    }
    	}
    },
});