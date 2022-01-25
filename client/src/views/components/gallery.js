import { FlashButton } from '../widgets/FlashBits'
import Icon from '@material-ui/core/Icon';
import React from 'react';
import { withTheme } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { ActionYoutubeSearchedFor } from 'material-ui/svg-icons';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickNHold from 'react-click-n-hold';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

const loadImage = require('blueimp-load-image');
const someImages=require('../../utility/smimages');

//const allImages = [];
const holder = {}
const getGridListCols = () => {
    if (window.innerWidth>600) {
      return 5;
    }

    if (window.innerWidth>500) {
      return 4;
    }

    if (window.innerWidth>300) {
      return 2;
    }

    return 2;
  }

class GalleryStyled extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, selecting: false }
        this.handleCancel = this.handleCancel.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        holder.gallery = this
    }
    handleEntering() {
    }
    handleDelete() {

        this.props.deleteImages(this.props.images)
    }
    handleCancel() {
        for (var i in this.props.images) {
            this.props.images[i].isSelected = false
        }
        this.setState({ open: false, selecting: false })
    }
    setImage() {
        this.setState({
            open: false,
        })
    }
    imageSelected(url) {
        this.setState({image:url})
        if (this.props.onImageSelected) {
            this.props.onImageSelected(url)
        }
        if (this.props.closeOnSelect) {
            this.setState({open:false});
        }
    }
    componentDidUpdate(prevProps) {
        /*if (this.props.images) {
            this.props.images.forEach(image => {
                allImages.push(image)
            })
        }*/
    }
    componentDidMount() {
        this.props.getImages()
    }
    handleFileChange(e) {
        let file = e.target.files;
        if (file) {
            var loadingImage = loadImage(
                file[0],
                function (img, data) {
                    try {
                        let binaryData = img.toDataURL();
                        holder.gallery.props.images.splice(0, 0, {url: binaryData})
                        holder.gallery.forceUpdate()
                        //binaryData is all we need to send back to the server
                        console.log("dataUrl", binaryData);
                    } catch (err) {
                        //TODO something's gone wrong with this file
                        alert("Unsupported format")
                    }
                },
                {
                    maxWidth: 320,
                    canvas: true

                }
            );
            if (!loadingImage) {
            }
        }
        document.getElementById("file-upload").reset();
    }
    
    render() {
        var images = this.props.images ? this.props.images : []
        
        if (this.props.station==='GANG') {
            const gangImages=someImages.getGangImages();
            images=gangImages.concat(images);
        } else if (this.props.station==='DECK') {
            const subjectImages=someImages.getSubjectImages();
            images=subjectImages.concat(images);
        } else if (this.props.station==='GANGSTER') {
            const gangsterImages=someImages.getGangsterImages();
            images=gangsterImages.concat(images);
        }
        //console.log('allImages', allImages)
        var button=
            <FlashButton
                buttonType='system'
                startIcon={<Icon style={{ fontSize: 20, color: 'green' }}>add_photo_alternate</Icon>}
                onClick={
                    () => this.setState({ open: true })
                }>
                Add image
            </FlashButton>
        if (this.props.imageButton) {
            button=
            <ClickNHold
                style={{
                    backgroundImage: `url(${this.state.image || this.props.image})`,
                    backgroundSize: 'cover',
                    width: '100%',
                    height: '100%',
                    backgroundPosition: 'center center',
                    backgroundColor: this.props.theme.palette.secondary.main
                }}
                time={1} 
                onStart={() => {  }}
                onClickNHold={() => {  }}
                onEnd={(event, enough) => {
                    if (enough) {
                        if (this.props.onImageUnselected) {
                            this.props.onImageUnselected();
                        }
                    } else {
                        this.setState({ open: true })
                    }
                }}>
                    {!this.state.image && !this.props.image &&
                    <Icon style={{ fontSize: '16vw', color: 'green' }}>add_photo_alternate</Icon>
                    }
                </ClickNHold>
        }
        return (
            <>
                <form id="file-upload" autocomplete="off" style={{ display: 'none' }}>
                    <input id="input-file-upload" type="file" onChange={this.handleFileChange} accept="image/png, image/jpeg" />
                </form>
                {button}
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    onEntering={this.handleEntering}
                    contentStyle={{ width: "100%", maxWidth: "none" }}
                    aria-labelledby="confirmation-dialog-title"
                    open={this.state.open}
                    fullWidth={true}
                    maxWidth='xl'
                >
                    <DialogTitle id="confirmation-dialog-title">Gallery</DialogTitle>
                    <FlashButton square buttonType='system'
                        disabled={!this.props.images}
                        onClick={() => document.getElementById("input-file-upload").click()}
                    >
                            Upload
                    </FlashButton>
                    <DialogContent>
                        <GridList cols={getGridListCols()} spacing={4}>
                            {images.map((image, index) => (
                                <GridListTile key={index} id={index} cols={1} imgFullWidth={true}>
                                    <ClickNHold
                                        style={{
                                            height: '100%'
                                        }}
                                        time={2} // Time to keep pressing. Default is 2
                                        onStart={() => { console.log('onStart called') }}//this.start} // Start callback
                                        onClickNHold={() => { console.log('onClickNHold called') }}//this.clickNHold} //Timeout callback
                                        onEnd={(event, enough) => {
                                            console.log('onEnd called', 'event', event, 'enough', enough)
                                            if (enough) {
                                                image.isSelected = true
                                                this.setState({ selecting: true })
                                                console.log('it was enough')
                                            } else {
                                                if (this.state.selecting) {
                                                    image.isSelected = !image.isSelected
                                                    var _isSelecting = false
                                                    for (var i in images) {
                                                        if (images[i].isSelected) {
                                                            _isSelecting = true
                                                            break
                                                        }
                                                    }
                                                    this.setState({ selecting: _isSelecting })
                                                } else {
                                                    if (!image.loading) {
                                                        this.imageSelected(image.url);
                                                    }
                                                }
                                            }
                                        }}>
                                        <>
                                            <ImageUploadComponentRedux
                                                imageRecord={image}
                                                source={image.url}
                                                id={index}
                                                isSelected={image.isSelected}
                                            />
                                        </>
                                    </ClickNHold>
                                </GridListTile>
                            ))}
                        </GridList>
                    </DialogContent>

                    <DialogActions>
                        <FlashButton disabled={!this.state.selecting} onClick={this.handleDelete} color="primary" buttonType='action'>
                            Delete
                        </FlashButton>
                        <FlashButton onClick={this.handleCancel} color="primary" buttonType='action'>
                            Close
                        </FlashButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

class ImageUploadComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidUpdate() {
        if (this.props.imageRecord) {
            this.props.imageRecord.url=this.props.source;
            this.props.imageRecord.loading=this.props.loading;
        }
    }
    componentDidMount() {
    }
    render() {
        if (this.props.source) {
            let isBinary = this.props.source.indexOf('data:image') == 0
            if (isBinary) {
                this.props.uploadImage(this.props.source, this.props.id)
            }
        }
        if (this.props.imageRecord) {
            this.props.imageRecord.url=this.props.source;
        }
        return (
            <>
                {
                    this.props.loading &&
                    <div className='sweet-loading' style={{
                        display: 'inline-block',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        top: '0', right: '0', left: '0', bottom: '0',
                        position: 'absolute',
                        backgroundColor: 'rgb(255,255,255,.5)',
                        paddingTop: '32px'
                    }} >
                        <CircularProgress />
                    </div>
                }
                {
                    this.props.isSelected &&
                    <div style={{
                        display: 'inline-block',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        top: '0', right: '0', left: '0', bottom: '0',
                        position: 'absolute',
                        backgroundColor: 'rgb(255,255,255,.5)',
                        paddingTop: '32px'
                    }} >
                    </div>
                }
                <div
                    style={{
                        background: `url(${this.props.source})`,
                        backgroundSize: 'cover',
                        width: '100%',
                        height: '100%',
                        backgroundPosition: 'center center'
                    }}
                >

                </div>
            </>
        )
    }
}
function mapStateToProps(state, props) {
    if (state.id == props.id) {
        console.log("UPLOADBUG mapStateToProps", state, props);
        return { loading: state.loading, source: state.url, errors: state.errors }
    }
    return {};
}
function mapStateToPropsGallery(state, props) {
    return { images: state.images };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}
const ImageUploadComponentRedux = connect(mapStateToProps, mapDispatchToProps)(ImageUploadComponent)

const GalleryStyle = withTheme(GalleryStyled);
const Gallery = connect(mapStateToPropsGallery, mapDispatchToProps)(GalleryStyle)
export {
    Gallery
}