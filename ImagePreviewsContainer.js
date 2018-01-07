import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Grid, Row, Col, Panel, Collapse, Alert} from 'react-bootstrap'
import ImagePreview from './ImagePreview'
import styled from 'styled-components'
import MdAddAPhoto from 'react-icons/lib/md/add-a-photo'
import _ from 'lodash'



const FlexRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
  text-align: center;
`;


const ErrorMessages = ({reportError, errorMessages}) => (
  
    errorMessages.map( 
      (errorMsg) => 
        <Collapse key={errorMsg} in={reportError}>
          <Alert bsStyle={"danger"}>
                  {errorMsg}
          </Alert>
        </Collapse>
    )
  
);

const MainImage = styled.img`
  width: 100%;
`;
const MainImageContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 100%;
  max-height: 100%;
  border: solid 1px;
  overflow: hidden;
`;

const LargeImagePreview = ({mainImageDataURL}) => (
  <Collapse in={mainImageDataURL !== ''}>
    <MainImageContainer>
      <MainImage src={mainImageDataURL}/>
    </MainImageContainer>
  </Collapse>
);

const AddImageIcon = styled(MdAddAPhoto)`
  
  position:relative;
  
`;
const FileInputContainer = styled.div`
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative;
`;
const FileInputDiv = styled.div`
  position:  absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding-top: 15%;
  margin-bottom: 20px;
  border: 1px solid #BFBFBF;
  border-radius: 10%;
  text-align: center;
  vertical-align: middle;
  &:hover {
    box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
  }
`;

const FileInput = ({handleFileUpload}) => (
  <FileInputContainer>
    <FileInputDiv>
    <label style={{width: '100%'}} htmlFor="image">
      <input type="file" name="image" id="image" multiple accept=".jpg, .jpeg, .png" style={{display:'none'}} onChange={handleFileUpload}/>
      <AddImageIcon size={140}/>
      <p><a>أضف صورة</a></p>
    </label>
    </FileInputDiv>
  </FileInputContainer>
);


class ImagePreviewsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgError: false,
      imgErrorMessages: [],
      mainImageDataURL: ''
    }
  }

  handleFileUpload( e ) {
    e.preventDefault();
    console.log(e.target.files)
    if (!e.target.files.length > 0)//user canceled selecting a file
      return  
    
    //remove previous error messages
    this.setState({
      imgError: false,
      imgErrorMessages: []
    });

    _.map(e.target.files, (file) => {
      let reader = new FileReader();
      let imageMaxSize = 1024 * 1024;//1MB
      if (file.size > imageMaxSize){ 
        var nBytes = file.size;
        var sOutput = nBytes + " bytes" 
        for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
          sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple];
        }
        let errorMsg = 'خطأ في الملف( ' + file.name + '). يجب أن يكون حجم الصورة أقل من ١ ميجابايت. حجم الملف الحالي هو: ' + sOutput
        this.setState({
          imgError: true,
          imgErrorMessages: [...this.state.imgErrorMessages, errorMsg]
        })
        return;
      } else if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')){
        let errorMsg = 'خطأ في الملف ' + file.name + '. يجب أن يتم تحميل صورة من نوع JPEG/PNG'
        this.setState({
          imgError: true,
          imgErrorMessages: [...this.state.imgErrorMessages, errorMsg]
        })
        return;
      }

      //process selected files
      reader.onloadend = () => {
        this.props.addImage(
          file,
          reader.result//of type Data URL for preview purposes only see (https://en.wikipedia.org/wiki/Data_URI_scheme & https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL))
        );
      }

      reader.readAsDataURL(file)
  });
  }

  handleImageSelect(imageDataURL){
    this.setState({mainImageDataURL: imageDataURL})
  }

  handleDeleteImage(imageDataURL, fromDB){
    if(this.state.mainImageDataURL === imageDataURL)
      this.setState({mainImageDataURL: ''})
    return this.props.onImageDelete(imageDataURL, fromDB);
  }

  

  render(){
    return (
      <Panel>
        <ErrorMessages reportError={this.state.imgError } errorMessages={this.state.imgErrorMessages || []}/>
        <LargeImagePreview mainImageDataURL={this.state.mainImageDataURL}/>
        <FlexRow>
          <Col xs={12} sm={6} md={4}lg={3} >
            <FileInput handleFileUpload={this.handleFileUpload.bind(this)}/>
          </Col>
          {
            this.props.imagesFromDB.map( 
              (image) => (
                <Col xs={12} sm={6} md={4} lg={3} key={image.url} >
                  <ImagePreview url={image.url} fromDB={true} onImageSelect={this.handleImageSelect.bind(this)}
                  onImageDelete={this.handleDeleteImage.bind(this)}/>
                </Col>
              )
            )
          }
          {
            this.props.newImages.map( 
              (image) => ( 
                <Col xs={12} sm={6} md={4} lg={3} key={image.url} >
                  <ImagePreview url={image.url} fromDB={false} onImageSelect={this.handleImageSelect.bind(this)}
                  onImageDelete={this.handleDeleteImage.bind(this)}/>
                </Col>
              )
            )
          }
      </FlexRow>
      </Panel>
    )
  }
}

export default ImagePreviewsContainer;