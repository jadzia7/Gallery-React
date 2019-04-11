import React, { Component } from 'react';
import firebase from 'firebase';
import { Button, ProgressBar } from 'react-bootstrap';
import Modal from 'react-modal';
const classNames = require('./ImageGallery.css');
const customStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    right: 'auto',
    bottom: 'auto',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'none',
    border: 'none',
    overflow: 'visible'
  }
};
export default class ImageGallery extends Component {
  constructor() {
    super();

    this.state = {
      uploadValue: 0,
      images: [],
      openImage: null,
      selectedFile: null
    };
    this.openModalImage = this.openModalImage.bind(this);
    this.openImage = this.openImage.bind(this);
    this.closeImage = this.closeImage.bind(this);
    this.renderProgressBar = this.renderProgressBar.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement('body');
    firebase.database().ref('files').on('child_added', snapshot => {
      this.setState({
        images: this.state.images.concat(snapshot.val())
      });
    });
  }

  renderProgressBar() {
    if (this.state.uploadValue > 0 && this.state.uploadValue < 101) {
      return (
        <div style={{width: '700px'}}>
          <ProgressBar bsStyle="info" now={this.state.uploadValue} />
          <p> Progress: {this.state.uploadValue} % Complete</p>
        </div>
      );
    }
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }
  fileUploadHandler = () => {
    const file = this.state.selectedFile;
    const storageRef = firebase.storage().ref();
    const task = storageRef.child(`/files/${file.name}`).put(file);
    //Firebase utility to receive the file status.
    task.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({uploadValue: percentage});
      console.log(this.state.uploadValue);
    }, error => {console.log(error.message);
    }, () => { //Image already uploaded.
      console.log(task.snapshot.downloadURL)
      this.setState({messag: `Upload Success`,picture: task.snapshot.downloadURL})
      const record = {
        id: task.snapshot.metadata.generation,
        name: task.snapshot.metadata.name,
        urlImage: task.snapshot.downloadURL,
        progress: this.state.uploadValue
      };
      const dbRef = firebase.database().ref('files');
      const newImage = dbRef.push();
      const prev = this.state.images.length;
      newImage.set(record);
      const post = this.state.images.length;
      if (post === prev) {this.setState({images: this.state.images.concat(record)});
      }});}

  openModalImage() {
    return (
      <Modal
        isOpen={this.state.openImage !== null}
        onRequestClose={this.closeImage}
        style={customStyles}
        contentLabel="Image Modal">
        <img class='openImage' className={classNames.openImage} className={classNames.imageZoom} src={this.state.openImage} alt="" />
      </Modal>
    );
  }

  openImage(event) {
    this.setState({ openImage: event.target.src });
  }

  closeImage() {
    this.setState({ openImage: null });
  }

  render() {
    return (
      <div>
        <div class='containerForm'>
          <div className={classNames.uploadImage}>
            <h3>Upload New Image</h3>
            <label htmlFor="file-input">
              {this.renderProgressBar()}
              <input type="file" onChange={this.fileSelectedHandler} multiple />
            </label>
            <Button onClick={this.fileUploadHandler} class='buttonForm' bsSize="large" block>Upload Image</Button>
          </div>
        </div>
        <h3>Latest Photos</h3>
        {this.state.images.map(image => (
          <img class='imgGallery' className={classNames.image} src={image.urlImage} key={image.id} alt=""
            onClick={this.openImage} />
        )).reverse()}
        {this.openModalImage()}
      </div>
    );
  }
}
