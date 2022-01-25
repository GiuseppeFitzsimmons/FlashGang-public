import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput';
import { FlashButton } from '../widgets/FlashBits';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Grid, GridList } from '@material-ui/core';
import queryString, { parse } from 'query-string'
import '../../App.css'
import { CSSTransition } from 'react-transition-group';
import InlineSplashScreen from './inlinesplashscreen';

const env = require('../../middleware/environment.js');
const environment = env.getEnvironment(window.location.origin);
var googleUrl = environment.googleLogin;


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = { user: {}, mode: 'LOGIN', showSplash: true }
    }
    componentDidUpdate() {
        console.log('this.props from login', this.props)
        console.log('this.state from login', this.state)
        if (this.props.loggedIn) {
            if (this.props.onLoggedIn) {
                this.props.onLoggedIn()
            }
        }
        /*if (this.props.errors && this.props.errors.suspended==true){
            console.log('suspended')
        }*/
    }
    componentDidMount() {
        const login=this;
    }

    render() {
        const parsedurl = queryString.parseUrl(window.location.href)
        console.log('parsedurl', parsedurl)
        let renderable =
            <>
            <InlineSplashScreen/>
                <IntegratedInput
                    errors={this.props.errors}
                    id='id'
                    label='Email address'
                    placeholder='user@name.com'
                    onChange={
                        (event) => {
                            this.state.user.id = event.target.value
                        }
                    }
                    ref={
                        input => input ? input.reset(this.state.user.id) : true
                    }
                />
                <IntegratedInput
                    errors={this.props.errors}
                    id='password'
                    type='password'
                    label='Password'
                    placeholder='Password'
                    onChange={
                        (event) => {
                            this.state.user.password = event.target.value
                        }
                    }
                    ref={
                        input => input ? input.reset('') : true
                    }
                />
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    style={{ width: '100%' }}
                    onClick={
                        () => { this.props.logIn(this.state.user) }
                    }
                >
                    Log in
                </FlashButton>
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    style={{ width: '100%' }}
                    onClick={
                        () => {
                            if (this.props.errors) {
                                this.props.errors.fields = []
                            }
                            this.setState({ mode: 'CREATE' })
                        }
                    }
                >
                    Create account
                </FlashButton>
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    style={{ width: '100%' }}
                    onClick={
                        
                        () => {window.location.href = googleUrl}
                    }
                    
                >
                    <svg aria-hidden="true" class="svg-icon native iconGoogle" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path>
                        <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"></path>
                        <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"></path>
                        <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"></path>
                    </svg>
                    Log in with Google
                </FlashButton>
                <div style={{textAlign: 'right', marginTop:'96%'}}>
                    <a href='/privacy-statement.html'>FlashGang 2020 privacy statement</a>
                </div>
                {this.props.errors && this.props.errors.fields.length > 0 &&
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => {
                                if (this.props.errors) {
                                    this.props.errors.fields = []
                                }
                                this.setState({ mode: 'FORGOTTENPW' })
                            }
                        }
                    >
                        Forgotten password
                </FlashButton>
                }
            </>
        if (this.state.mode == 'FORGOTTENPW') {
            renderable =
                <>
                    <IntegratedInput
                        errors={this.props.errors}
                        id='id'
                        label='Email address'
                        placeholder='user@name.com'
                        onChange={
                            (event) => {
                                this.state.user.id = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset(this.state.user.id) : true
                        }
                    />
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => { this.props.resetPassword(this.state.user) }
                        }
                    >
                        Reset password
                </FlashButton>
                </>
        }
        else if (this.state.mode == 'CREATE') {
            renderable =
                <>
                    <IntegratedInput
                        errors={this.props.errors}
                        id='id'
                        label='Email address'
                        placeholder='user@name.com'
                        onChange={
                            (event) => {
                                this.state.user.id = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset(this.state.user.id) : true
                        }
                    />
                    <IntegratedInput
                        errors={this.props.errors}
                        id='password'
                        type='password'
                        label='Password'
                        placeholder='Password'
                        onChange={
                            (event) => {
                                this.state.user.password = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        type='password'
                        label='Confirm password'
                        placeholder='Confirm password'
                        onChange={
                            (event) => {
                                this.state.user.confirmPassword = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        label='First name'
                        placeholder='First name'
                        onChange={
                            (event) => {
                                this.state.user.firstName = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        label='Last name'
                        placeholder='Last name'
                        onChange={
                            (event) => {
                                this.state.user.lastName = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => { this.props.createAccount(this.state.user) }
                        }
                    >
                        Create account
                    </FlashButton>
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => {
                                if (this.props.errors) {
                                    this.props.errors.fields = []
                                }
                                this.setState({ mode: 'LOGIN' })
                            }
                        }
                    >
                        Cancel
                    </FlashButton>
                </>
        } if (parsedurl.query.resetpassword) {
            let email = atob(parsedurl.query.email)
            this.state.user.id = email
            renderable =
                <>
                    <IntegratedInput
                        errors={this.props.errors}
                        id='id'
                        label='Email address'
                        placeholder='user@name.com'
                        onChange={
                            (event) => {
                                this.state.user.id = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset(email) : true
                        }
                    />
                    <IntegratedInput
                        errors={this.props.errors}
                        id='password'
                        type='password'
                        label='Password'
                        placeholder='Password'
                        onChange={
                            (event) => {
                                this.state.user.password = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        type='password'
                        label='Confirm password'
                        placeholder='Confirm password'
                        onChange={
                            (event) => {
                                this.state.user.confirmPassword = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => { this.props.setPassword(this.state.user, parsedurl.query.token) }
                        }
                    >
                        Set password
                    </FlashButton>
                </>
        }
        return (
            <>{renderable}
                {
                    this.props.loading &&
                    <div className='sweet-loading' style={{
                        display: 'inline-block',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: '0', right: '0', left: '0', bottom: '0',
                        paddingTop: '50%',
                        position: 'fixed',
                        backgroundColor: 'rgb(255,255,255,.5)'
                    }} >
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <CircularProgress />
                        </Grid>
                    </div>
                }
            </>
        )
    }
}

function mapStateToProps(state, props) {
    return { loggedIn: state.loggedIn, errors: state.errors, user: state.user, loading: state.loading }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)