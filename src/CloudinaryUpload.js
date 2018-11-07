import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { fetchStart, fetchEnd, showNotification, REDUX_FORM_NAME } from 'react-admin';
import { imageCreate } from './cloudinaryActions';
import { Image, Transformation } from 'cloudinary-react';


class CloudinaryUpload extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { uploadedPhotos: [], photos: [] };
		this.photoId = 1;
		this.handleFiles = this.handleFiles.bind(this);
		this.drop = this.drop.bind(this);
		this.fileInput = React.createRef();
		this.progressBar = React.createRef();
		this.progressElement = React.createRef();
	}

	componentDidMount() {
		const { record } = this.props;
		this.setState({
			photos: record.images && record.images.length ? record.images : [] 
		});
	}

	// *********** Upload file to Cloudinary ******************** //
	uploadFile(file) {
		var url = `https://api.cloudinary.com/v1_1/${this.context.cloudName}/upload`;
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		xhr.open('POST', url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	  // Reset the upload progress bar
	  this.progressElement.current.style.width = 0;
	  
	  // Update progress (can be used to show progress indicator)
	  xhr.upload.addEventListener("progress", function(e) {
	  	var progress = Math.round((e.loaded * 100.0) / e.total);
	  	this.progressElement.current.style.width = progress + "%";

	  	console.log(`fileuploadprogress data.loaded: ${e.loaded},
	  		data.total: ${e.total}`);
	  }.bind(this));

		  xhr.onreadystatechange = function(e) {
		  	if (xhr.readyState === 4 && xhr.status === 200) {
		      // File uploaded successfully
		      var response = JSON.parse(xhr.responseText);
		      //put to database
		      this.putImageToDatabase(response);
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
		console.log("creating images");
		for (const image of files) {
			
		    this.uploadFile(image); // call the function to upload the file
		}
		console.log("done creating images");
		
		
	}

	putImageToDatabase(image) {
		const { imageCreate, fetchStart } = this.props;
		fetchStart();
		console.log("creating image");
		imageCreate(image, (payload, requestPayload) => {
			this.state.uploadedPhotos.push(payload.data);
		    this.setState({
		    	uploadedPhotos: this.state.uploadedPhotos
		    });
			const { record, change, fieldName, fetchEnd } = this.props;
			this.state.photos.push(payload.data.id);
			this.setState({
				photos: this.state.photos
			});
			change(REDUX_FORM_NAME, fieldName, this.state.photos);
			console.log("fotos: "+this.state.photos.length);
			console.log("new fotos: "+this.state.uploadedPhotos.length);
			console.log("changed form");
			fetchEnd();
		});
	}

	render() {
		return (
			<div className="dropbox" onDragEnter={this.dragenter} onDragOver={this.dragover} onDrop={this.drop}>
				<div className="form_line">
					<h4>Neue Abbildungen hier hineindroppen.</h4>
					<div className="form_controls">
						<div className="upload_button_holder">
							<input type="file" className="file-elem" ref={this.fileInput} multiple accept="image/*"
								onChange={ e => { 
									this.handleFiles(e.target.files)
								}
								}/>
							<a href="#" 
								onClick={(
										(e) => {
											this.fileInput.current.click();
											e.preventDefault();
											}
								).bind(this)}>Dateien auswählen</a>
						</div>
					</div>
				</div>
				<div className="progress-bar" ref={this.progressBar} >
					<div className="progress" ref={this.progressElement} ></div>
				</div>
				<div className="uploaded-images">
					{this.state.uploadedPhotos.map(image => {
						return (
							<span key={image.public_id}>
								<Image publicId={image.public_id} secure="true">
									<Transformation width="200" crop="fill"/>
									<Transformation fetchFormat="auto" quality="80"/>
								</Image>
							</span>
						)
					})}
				</div>
			</div>
			);
		}
}

CloudinaryUpload.propTypes = {
    push: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
    imageCreate: PropTypes.func,
    change: PropTypes.func,
    fetchEnd: PropTypes.func,
    fetchStart: PropTypes.func
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
	change,
	fetchStart,
	fetchEnd
})(CloudinaryUpload);
