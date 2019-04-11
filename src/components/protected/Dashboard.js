import React from 'react';
import firebase from 'firebase';
import { Button, ProgressBar} from 'react-bootstrap';
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
export default class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            images: [],
            uploadValue: 0,
        };
        this.renderProgressBar = this.renderProgressBar.bind(this);
    }

    renderProgressBar() {
        if (this.state.uploadValue > 0 && this.state.uploadValue < 101) {
          return (
            <div>
              
               <ProgressBar active bsStyle="info" now={this.state.uploadValue} />
              <progress value={this.state.uploadValue} max="100"></progress>
              <p> Progress: ${this.state.uploadValue} % Complete</p>
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
          this.setState({
            uploadValue: percentage
          });
          console.log(this.state.uploadValue);
        }, error => {
          console.log(error.message);
        }, () => { //Image already uploaded.
          console.log(task.snapshot.downloadURL)
          this.setState({
            // {this.state.messag} - show 
            messag: `Upload Success`,
            picture: task.snapshot.downloadURL
          })
          const record = {
            id: task.snapshot.metadata.generation,
            name: task.snapshot.metadata.name,
            urlImage: task.snapshot.downloadURL,
            progress: this.state.uploadValue
          };
          const dbRef = firebase.database().ref('files');
          const newImage = dbRef.push();
          //newImage.set(record);
          //Chapuza - After login and upload an image don't refresh image list, but the image is uploaded.
          const prev = this.state.images.length;
          newImage.set(record);
          const post = this.state.images.length;
          if (post === prev) {
            this.setState({
              images: this.state.images.concat(record)
            });
            console.log('File saved!: ' + task.snapshot.downloadURL);
          }
          //end Chapuza
        });
      }
    render() {
        return (
            <div class='containerForm'>
                {this.renderProgressBar()}
                <div className={classNames.uploadImage}>
                    <h3>Upload New Image</h3>
                    <label htmlFor="file-input">
                        <input type="file" onChange={this.fileSelectedHandler} multiple />
                    </label>
                    <Button onClick={this.fileUploadHandler} class='buttonForm' bsSize="large" block>Upload Image</Button>
                </div>
            </div>
        );
    }
}
