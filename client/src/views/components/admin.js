import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import {
    Col,
    Input
} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, GridList } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { FlashTypography } from '../widgets/FlashBits';
import FlashAppBar from '../widgets/flashappbar';
import { RadioButton } from 'material-ui';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AdminUsers from './adminusers';
import AdminDecks from './admindecks';
import AdminGangs from './admingangs'

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = { index: 0, open: false }
        var renderable = <>USER TAB CONTENT</>
    }
    componentDidMount() {
        //console.log('this.state', this.state)
    }
    render() {
        const handleChange = (event, index) => {
            this.setState({ index: index })
        };
        switch (this.state.index) {
            case 0:
                console.log('Index is 0')
                this.renderable = <AdminUsers />
                break;
            case 1:
                console.log('Index is 1')
                this.renderable = <AdminGangs />
                break;
            case 2:
                console.log('Index is 2')
                this.renderable = <AdminDecks />
                break;
            case 3:
                console.log('Index is 3')
                this.renderable = <> MAIL TAB CONTENT </>
                break;
        }
        return (
            <>
                <FlashAppBar title='FlashGang!' station='GANGS' goHome={this.props.goHome} onLogOut={this.props.onLogOut} goSettings={this.props.goSettings} goGangs={this.goGangs} goDecks={this.goDecks} />
                <Grid>
                    <Tabs
                        onChange={handleChange}
                    >
                        <Tab
                            label='USERS'
                            index={0}
                        />
                        <Tab
                            label='GANGS'
                            index={1}
                        />
                        <Tab
                            label='DECKS'
                            index={2}
                        />
                        <Tab
                            label='MAIL'
                            index={3}
                        />
                    </Tabs>
                    {this.renderable}
                </Grid>
            </>
        )
    }

}

function mapStateToProps(state, props) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)