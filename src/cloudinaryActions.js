import { CREATE, UPDATE } from 'react-admin';

export const IMAGE_CREATE = 'IMAGE_CREATE';
export const imageCreate = (data, callback) => ({
    type: IMAGE_CREATE,
    payload: { data: { ...data } },
    meta: { 
    	fetch: CREATE, 
    	resource: 'images',
    	onSuccess: {
    		notification: {
    	    		body: 'Abbildung wurde in der Datenbank gespeichert.',
    	    		level: 'info'
    	    },
    	    callback:  ({ payload, requestPayload }) => { callback(payload, requestPayload) }
    	},
    	onFailure: {
    		notification: {
    	    		body: 'Fehler: Abbildung wurde nicht in der Datenbank gespeichert.',
    	    		level: 'warning'
    	    }
    	}
    },
});

export const WORK_IMAGES_UPDATE = 'WORK_IMAGES_UPDATE';
export const workImagesUpdate = (id, work) => ({
    type: WORK_IMAGES_UPDATE,
    payload: { id, data: { ...work } },
    meta: { 
    	fetch: UPDATE, 
    	resource: 'works',
    	onSuccess: {
    		notification: {
    	    		body: 'Abbildungen wurden dem Werk zugeordnet.',
    	    		level: 'info'
    	    }
    	},
    	onFailure: {
    		notification: {
    	    		body: 'Fehler: Abbildungen wurden dem Werk nicht zugeordnet.',
    	    		level: 'warning'
    	    }
    	}
    },
});

export const WORK_IMAGE_UPDATE = 'WORK_IMAGE_UPDATE';
export const workImageUpdate = (id, work) => ({
    type: WORK_IMAGE_UPDATE,
    payload: { id, data: { ...work } },
    meta: { 
    	fetch: UPDATE, 
    	resource: 'works',
    	onSuccess: {
    		notification: {
    	    		body: 'Abbildung wurde dem Werk zugeordnet.',
    	    		level: 'info'
    	    }
    	},
    	onFailure: {
    		notification: {
    	    		body: 'Fehler: Abbildung wurde dem Werk nicht zugeordnet.',
    	    		level: 'warning'
    	    }
    	}
    },
});

export const S3_UPLOAD = 'S3_UPLOAD';
export const s3Upload = (data, callback) => ({
    type: S3_UPLOAD,
    payload: { data: { ...data } },
    meta: { 
        fetch: CREATE, 
        resource: 'upload-s3',
        onSuccess: {
            notification: {
                    body: 'Abbildung wurde gespeichert.',
                    level: 'info'
            },
            callback:  ({ payload, requestPayload }) => { callback(payload, requestPayload) }
        },
        onFailure: {
            notification: {
                    body: 'Fehler: Abbildung wurde nicht gespeichert.',
                    level: 'warning'
            }
        }
    },
});