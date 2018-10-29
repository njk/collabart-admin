import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { showNotification, REDUX_FORM_NAME } from 'react-admin';
import { workImageUpdate } from './cloudinaryActions';
import { Image, Transformation } from 'cloudinary-react';


class CloudinaryWorkImage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { uploadedPhotos: [] };
		this.photoId = 1;
		this.handleFiles = this.handleFiles.bind(this);
		this.drop = this.drop.bind(this);
		this.fileInput = React.createRef();
		this.progressBar = React.createRef();
		this.progressElement = React.createRef();
	}

	componentDidMount() {

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
	      this.putImageToWork(response);
	      this.state.uploadedPhotos.push(response);
	      this.setState({
	      	uploadedPhotos: this.state.uploadedPhotos
	      });
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

	putImageToWork(image) {
		const { change } = this.props;
		change(REDUX_FORM_NAME, 'image', image);
	}

	render() {
		return (
			<div className="dropbox" onDragEnter={this.dragenter} onDragOver={this.dragover} onDrop={this.drop}>
				<div className="form_line">
					<h4>Neue Abbildung hier hineindroppen.</h4>
					<div className="form_controls">
						<div className="upload_button_holder">
							<input type="file" className="file-elem" ref={this.fileInput} accept="image/*"
								onChange={ e => { 
									this.handleFiles(e.target.files);
								}
								}/>
							<a href="#"
								onClick={(
									(e) => {
										this.fileInput.current.click();
										e.preventDefault();
										}
								).bind(this)}>Datei auswählen</a>
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

CloudinaryWorkImage.propTypes = {
    push: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
    workImageUpdate: PropTypes.func,
    change: PropTypes.func
};

CloudinaryWorkImage.contextTypes = {
    cloudName: PropTypes.string,
    uploadPreset: PropTypes.string,
};

Object.assign(
    CloudinaryWorkImage.contextTypes,
    CloudinaryWorkImage.propTypes
);

export default connect(null, {
	showNotification,
	push,
	workImageUpdate,
	change
})(CloudinaryWorkImage);