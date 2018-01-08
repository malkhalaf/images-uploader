import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import MdClose from 'react-icons/lib/md/close'
import { Button } from 'react-bootstrap';


const rotate360 = keyframes` 
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Spinner = styled.div`
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${rotate360} 2s linear infinite;
`

const Loading = (props) => {
  return <div style={{ textAlign: "center",  marginTop: "27%", marginLeft: "auto", marginRight: "auto" }} {...props}>
  
  <div style={{display: 'inline-block'}}><Spinner style={{ textAlign: "center"}}/></div>
  
</div>
}

const DeleteButton = styled(MdClose)`
  
  width:20px;
  height:20px;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 10px;
  cursor: pointer;
  fill:rgba(255,255,255,.7);
  background:rgba(0,0,0,.8);
  &:hover {
    fill:rgba(0,0,0,1);
    background:rgba(255,255,255,1);
  }
`;

const ConfirmDeleteButton = styled(Button)`
  display:block;
  position: absolute;
  top: 50px;
`
const DialogDiv = styled.div`
  position:  absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background: rgba(34, 34, 34, 0.8);
  border-radius: 10%;
`
const ButtonsDiv = styled.div`
  margin: 30%  auto;
  width: 70%; 
  
`

const ConfirmDeleteDialog = (props) => (
  <DialogDiv>
    <ButtonsDiv>
      <p style={{color: 'white', fontWeight: 'bold', fontSize: 'large'}}>هل تود حذف الصورة</p>
      <Button style={{width: '100%', fontWeight: 'bold', fontSize: 'large'}} bsStyle="danger" onClick={props.onConfirm}>نعم</Button>
      <Button style={{width: '100%', fontWeight: 'bold', fontSize: 'large'}} onClick={props.onCancel}>لا</Button>
    </ButtonsDiv>
  </DialogDiv>
)

const ErrorDialog = (props) => (
  <DialogDiv>
    <ButtonsDiv>
      <p style={{color: 'white', fontWeight: 'bold', fontSize: 'large'}}>نأسف لفشل عملية حذف الصورة. هل تود المحاولة مرة أخرى؟</p>
      <Button style={{width: '100%', fontWeight: 'bold', fontSize: 'large'}} bsStyle="danger" onClick={props.onClickYes}>نعم</Button>
      <Button style={{width: '100%', fontWeight: 'bold', fontSize: 'large'}} onClick={props.onClickNo}>لا</Button>
    </ButtonsDiv>
  </DialogDiv>
)

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
`;

const ImageDiv = styled.div`
  position:  absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #BFBFBF;
  border-radius: 10%;
  &:hover {
    box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
`;

class ImagePreview extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      confirmDelete: false, 
      error: null
    }
  }

  handleImageSelect(){
    console.log('image click and URL is')
    this.props.onImageSelect(this.props.url);
  }

  handleImageDelete(){
    console.log('image will be deleted')
    this.setState({confirmDelete: false}, () => this.setState({loading: true}, 
      () => {
        this.props.onImageDelete(this.props.url, this.props.fromDB)
        //No need to for loading -> false since the component will unmount
        //Just handle errors
        .catch(error => {
          console.log(error)
          this.setState({loading: false}, () => this.setState({error: error}))
        })
      })
    )
  }

  handleConfirmButtonClick(){
    this.handleImageDelete();
  }

  handleImageDeleteButtonClick(){
    this.setState({confirmDelete: true});
  }

  handleCancelButtonClick(){
    this.setState({confirmDelete: false});
  }

  render() {
    return (
      <ImageContainer>
        {this.state.loading?
          <ImageDiv>
            <Loading />
          </ImageDiv>
          :
          <ImageDiv>
            <PreviewImg   src={this.props.url} 
                  className="img-responsive "
                  onClick={this.handleImageSelect.bind(this)}
                  />
            {this.state.confirmDelete
              ?<ConfirmDeleteDialog  onConfirm={this.handleConfirmButtonClick.bind(this)} onCancel={this.handleCancelButtonClick.bind(this)}/>
              : this.state.error
                ? <ErrorDialog 
                        onClickYes={() => this.setState({error: null}, this.handleConfirmButtonClick.bind(this))} 
                        onClickNo={() => this.setState({error: null})} />
                : <DeleteButton onClick={this.handleImageDeleteButtonClick.bind(this)}/>
            }
          </ImageDiv>
        }
      </ImageContainer>
    );
  }
}

export default ImagePreview;