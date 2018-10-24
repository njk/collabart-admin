import { CREATE, UPDATE } from 'react-admin';

export const NOTE_CREATE = 'NOTE_CREATE';
export const noteCreate = (data, callback) => ({
    type: NOTE_CREATE,
    payload: { data: { ...data } },
    meta: { 
    	fetch: CREATE, 
    	resource: 'notes',
    	onSuccess: {
    		notification: {
    	    		body: 'Notiz wurde in der Datenbank gespeichert.',
    	    		level: 'info'
    	    },
    	    callback:  ({ payload, requestPayload }) => { callback(payload, requestPayload) }
    	},
    	onFailure: {
    		notification: {
    	    		body: 'Fehler: Notiz wurde nicht in der Datenbank gespeichert.',
    	    		level: 'warning'
    	    }
    	}
    },
});

export const WORK_NOTES_UPDATE = 'WORK_NOTES_UPDATE';
export const workNotesUpdate = (id, work, callback) => ({
    type: WORK_NOTES_UPDATE,
    payload: { id, data: { ...work } },
    meta: { 
    	fetch: UPDATE, 
    	resource: 'works',
    	onSuccess: {
    		notification: {
    	    		body: 'Notiz wurde dem Werk zugeordnet.',
    	    		level: 'info'
    	    },
            callback:  ({ payload, requestPayload }) => { callback(payload, requestPayload) }
    	},
    	onFailure: {
    		notification: {
    	    		body: 'Fehler: Notiz wurde dem Werk nicht zugeordnet.',
    	    		level: 'warning'
    	    }
    	}
    },
});