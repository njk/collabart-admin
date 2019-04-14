import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { showNotification, REDUX_FORM_NAME } from 'react-admin';
import { workImageUpdate } from './cloudinaryActions';
import { Image, Transformation } from 'cloudinary-react';
import { imageCreate, s3Upload } from './cloudinaryActions';


class CloudinaryWorkImage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { uploadedPhotos: [] };
		this.photoId = 1;
		this.handleFiles = this.handleFiles.bind(this);
		this.drop = this.drop.bind(this);
		this.putImageToWork = this.putImageToWork.bind(this)
		this.fileInput = React.createRef();
		this.progressBar = React.createRef();
		this.progressElement = React.createRef();
	}

	componentDidMount() {

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
		const { s3Upload, fetchStart } = this.props;
		const { putImageToWork } = this;

		for (var i = 0; i < files.length; i++) {
			const image = files[i];
		    const reader = new FileReader();
			reader.addEventListener('load', () => {
				s3Upload({uri: reader.result, type: 'image'}, (payload, requestPayload) => {
					console.log("uploaded");
					console.log(payload);
					var imageForDb = payload.data;
					imageForDb.fileName = image.name;
					imageForDb.size = image.size;
					imageForDb.type = image.type;
					delete imageForDb.uri;
					delete imageForDb.id;
					putImageToWork(imageForDb);
				})
			})
			reader.readAsDataURL(image);
		}
	}

	putImageToWork(image) {
		console.log("put image to work")
		const { change, imageCreate } = this.props;
		
		change(REDUX_FORM_NAME, 'image', image);

		// put to database
		this.state.uploadedPhotos.push(image);
		imageCreate(image, (payload, requestPayload) => {
			const { record, change, fieldName } = this.props;
			var images = record.images;
			if(images && images.length) {
				images.push(payload.data.id);
			} else {
				images = [payload.data.id];
			}
			change(REDUX_FORM_NAME, 'images', images);
		      this.setState({
		      	uploadedPhotos: this.state.uploadedPhotos
		      });
		});
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
						if(image.s3_url) {
							return (
								<span key={image.public_id}>
									<Image publicId={image.s3_url} secure="true" type="fetch">
										<Transformation width="200" crop="fill"/>
										<Transformation fetchFormat="auto" quality="80"/>
									</Image>
								</span>
								)
						}
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
    change: PropTypes.func,
    imageCreate: PropTypes.func,
    s3Upload: PropTypes.func
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
	change,
	imageCreate,
	s3Upload
})(CloudinaryWorkImage);