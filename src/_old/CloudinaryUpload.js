import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { fetchStart, fetchEnd, showNotification, REDUX_FORM_NAME } from 'react-admin';
import { imageCreate, s3Upload } from './cloudinaryActions';
import { Image, Transformation } from 'cloudinary-react';


class CloudinaryUpload extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { uploadedPhotos: [], photos: [] };
		this.photoId = 1;
		this.handleFiles = this.handleFiles.bind(this);
		this.drop = this.drop.bind(this);
		this.putImageToDatabase = this.putImageToDatabase.bind(this);
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
		const { s3Upload, fetchStart } = this.props;
		const { putImageToDatabase } = this;
		
		for (const image of files) {
			fetchStart();
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
					putImageToDatabase(imageForDb);
				})
			})			
			reader.readAsDataURL(image);
		}
		console.log("done creating images");
		
		
	}

	putImageToDatabase(image) {
		const { imageCreate, fetchStart } = this.props;
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
						if(image.s3_url) {
							return (<span key={image.id}>
										<Image publicId={image.s3_url} secure="true" type="fetch">
											<Transformation width="200" crop="fill"/>
											<Transformation fetchFormat="auto" quality="80"/>
										</Image>
									</span>)
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

CloudinaryUpload.propTypes = {
    push: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
    imageCreate: PropTypes.func,
    s3Upload: PropTypes.func,
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
	s3Upload,
	change,
	fetchStart,
	fetchEnd
})(CloudinaryUpload);
