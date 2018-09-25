import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { showNotification } from 'react-admin';
import { imageCreate, workImagesUpdate } from './cloudinaryActions';


class CloudinaryUpload extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { uploadedPhotos: [] };
		this.photoId = 1;
	}

	componentDidMount() {


		var dropbox = document.getElementById("dropbox");
		dropbox.addEventListener("dragenter", this.dragenter, false);
		dropbox.addEventListener("dragover", this.dragover, false);
		dropbox.addEventListener("drop", this.drop, false);

		var fileSelect = document.getElementById("fileSelect"),
		fileElem = document.getElementById("fileElem");

		fileSelect.addEventListener("click", function(e) {
			if (fileElem) {
				fileElem.click();
			}
	  e.preventDefault(); // prevent navigation to "#"
	}, false);	

	}

	// *********** Upload file to Cloudinary ******************** //
	uploadFile(file) {
		var url = `https://api.cloudinary.com/v1_1/${this.context.cloudName}/upload`;
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		xhr.open('POST', url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	  // Reset the upload progress bar
	  document.getElementById('progress').style.width = 0;
	  
	  // Update progress (can be used to show progress indicator)
	  xhr.upload.addEventListener("progress", function(e) {
	  	var progress = Math.round((e.loaded * 100.0) / e.total);
	  	document.getElementById('progress').style.width = progress + "%";

	  	console.log(`fileuploadprogress data.loaded: ${e.loaded},
	  		data.total: ${e.total}`);
	  });

	  xhr.onreadystatechange = function(e) {
	  	if (xhr.readyState == 4 && xhr.status == 200) {
	      // File uploaded successfully
	      var response = JSON.parse(xhr.responseText);
	      //put to database
	      this.putImageToDatabase(response);
	      this.state.uploadedPhotos.push(response);
	      this.setState({
	      	uploadedPhotos: this.state.uploadedPhotos
	      });
	      // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
	      var url = response.secure_url;
	      // Create a thumbnail of the uploaded image, with 150px width
	      var tokens = url.split('/');
	      tokens.splice(-2, 0, 'w_150,c_scale');
	      var img = new Image(); // HTML5 Constructor
	      img.src = tokens.join('/');
	      img.alt = response.public_id;
	      document.getElementById('gallery').appendChild(img);
	  }
	}.bind(this);

		fd.append('upload_preset', this.context.uploadPreset);
		fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
		fd.append('file', file);
		xhr.send(fd);
	}    

	// ************************ Drag and drop ***************** //
	dragenter(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	dragover(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	drop(e) {
		e.stopPropagation();
		e.preventDefault();

		var dt = e.dataTransfer;
		var files = dt.files;

		this.handleFiles(files);
	}

	// *********** Handle selected files ******************** //
	handleFiles(files) {
		for (var i = 0; i < files.length; i++) {
		    this.uploadFile(files[i]); // call the function to upload the file
		}
	}

	putImageToDatabase(image) {
		const { imageCreate } = this.props;
		console.log("creating image");
		imageCreate(image, (payload, requestPayload) => {
			const { record, workImagesUpdate } = this.props;
			var images = record.images;
			if(images && images.length) {
				images.push(payload.data.id);
			} else {
				images = [payload.data.id];
			}
			record.images = images;
			workImagesUpdate(record.id, record);
		});
	}

	render() {
		return (
			<div id="dropbox">
				<div className="form_line">
					<h4>Neue Abbildungen hier hineindroppen.</h4>
					<div className="form_controls">
						<div className="upload_button_holder">
							<input type="file" id="fileElem" multiple accept="image/*"
								onChange={ e => { 
									this.handleFiles(e.target.files)
								}
								}/>
							<a href="#" id="fileSelect">Dateien auswählen</a>
						</div>
					</div>
				</div>
				<div className="progress-bar" id="progress-bar">
					<div className="progress" id="progress"></div>
				</div>
				<div id="gallery" />
			</div>
			);
		}
}

CloudinaryUpload.propTypes = {
    push: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
    imageCreate: PropTypes.func,
    workImagesUpdate: PropTypes.func
};

CloudinaryUpload.contextTypes = {
    cloudName: PropTypes.string,
    uploadPreset: PropTypes.string,
};

Object.assign(
    CloudinaryUpload.contextTypes,
    CloudinaryUpload.propTypes
);

export default connect(null, {
	showNotification,
	push,
	imageCreate,
	workImagesUpdate
})(CloudinaryUpload);
