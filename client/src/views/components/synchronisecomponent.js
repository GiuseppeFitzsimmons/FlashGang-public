import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

class SynchroniseComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        if (this.props.callSynchronise) {
            this.props.synchronise()
        }
        if (this.props.socialLogin) {
            console.log('we have social login', this.props.socialLogin)
            this.props.loginSocial(this.props.socialLogin)
        }
    }
    componentDidUpdate() {
        if (this.props.session && this.props.session.expired === true) {
            this.props.session.expired = false;
            this.props.onSessionExpired(this.props.logout);
        }
    }

    render() {
        return (
            <>
            </>
        )

    }
}

function mapStateToProps(state, props) {
    return {
        session: { expired: state.sessionExpired }
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SynchroniseComponent)