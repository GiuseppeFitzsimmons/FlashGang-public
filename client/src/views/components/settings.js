import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import { MdDelete } from 'react-icons/md'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import { FlashButton } from '../widgets/FlashBits'
import Avatar from '@material-ui/core/Avatar';
import FlashAppBar from '../widgets/flashappbar';
import { Gallery } from './gallery';
import Confirmation from '../components/confirmation';
import ErrorDialog from '../components/errordialog';

const someImages = require('../../utility/smimages')

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = { user: {}, confirm: function(){} }
        this.deleteAccount=this.deleteAccount.bind(this)
        this.downloadData=this.downloadData.bind(this)
        this.confirmDownloadData=this.confirmDownloadData.bind(this)
    }
    deleteAccount() {
        this.setState({...this.state, confirm: this.props.deleteAccount});
        this.confirmation.open('SETTINGS_DELETE');
    }
    downloadData() {
        this.setState({...this.state, confirm: this.confirmDownloadData});
        this.confirmation.open('DOWNLOAD_DATA');
    }
    confirmDownloadData() {
        this.props.downloadData()
        this.setState({...this.state, error: 'You should receive your email shortly'});
    }
    componentDidMount() {
        //this.setState({ user: this.state.user })
        if (this.props.navEvent) {
            this.props.navEvent.backButton = this.props.goHome;
        }
    }
    render() {
        if (!this.state.user.picture) {
            this.state.user.picture = this.props.user.picture ? this.props.user.picture : someImages.getRandomGangsterImage();
        }
        return (
            <>
                <FlashAppBar title='FlashGang Settings' station='SETTINGS'
                    goGangs={this.props.goGangs}
                    onLogOut={this.props.onLogOut}
                    goHome={this.props.goHome}
                    user={this.props.user} />
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="stretch">


                    <Grid item xs={2} sm={2} md={1}>
                        <Gallery
                            onImageSelected={(image) => {
                                this.state.user.picture = image;
                                this.forceUpdate();
                            }}
                            imageButton
                            closeOnSelect
                            image={this.state.user.picture}
                            station='GANGSTER'
                        />
                    </Grid>
                    <Grid item xs={8} sm={8} md={7}
                        justify="center"
                        alignItems="stretch"
                        style={{marginLeft:'2px'}}>
                        <IntegratedInput
                            label={'First Name'}
                            onChange={
                                (event) => { this.state.user.firstName = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(this.props.user.firstName) : true
                            }
                        >
                        </IntegratedInput>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <IntegratedInput
                            label={'Last Name'}
                            onChange={
                                (event) => { this.state.user.lastName = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(this.props.user.lastName) : true
                            }
                        >
                        </IntegratedInput>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <IntegratedInput
                            label={'Nickname'}
                            onChange={
                                (event) => { this.state.user.nickname = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(this.props.user.nickname) : true
                            }
                        >
                        </IntegratedInput>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <FlashButton
                            onClick={() => { this.props.setSettings(this.state.user) }}
                            buttonType='system'
                            square
                            style={{ width: '100%' }}
                        >
                            Save
                    </FlashButton>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <FlashButton
                            onClick={this.deleteAccount}
                            buttonType='system'
                            square
                            style={{ width: '100%' }}
                        >
                            Delete my account
                    </FlashButton>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <FlashButton
                            onClick={this.downloadData}
                            buttonType='system'
                            square
                            style={{ width: '100%' }}
                        >
                            Download my data
                    </FlashButton>
                    </Grid>
                </Grid>
                <Confirmation
                    parent={this}
                    onConfirm={this.state.confirm}
                    />
                <ErrorDialog error={this.state.error} 
                    onClose={() => {
                            this.setState({ error: null });
                        }
                    }
                />
            </>
        )
    }
}

function mapStateToProps(state, props) {
    console.log('state user settings', state, props)
    if (!state.user || !state.user.id) {
        props.goHome();
    }
    return {
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)