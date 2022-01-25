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
import Divider from '@material-ui/core/Divider';
import HighScores from './highscores'
import { Tooltip } from 'reactstrap';
import Icon from '@material-ui/core/Icon';



class FlashDeckTest extends React.Component {
    constructor(props) {
        super(props)
        this.setTestType = this.setTestType.bind(this)
        this.setAnswerType = this.setAnswerType.bind(this)
        this.state = { valid: false }
    }
    setTestType(event) {
        this.props.flashDeck.testType = event.target.value
        if (this.props.flashDeck.testType && this.props.flashDeck.answerType &&
            this.props.flashDeck.flashCards && this.props.flashDeck.flashCards.length>0) {
            this.setState({ valid: true })
        }
    }
    setAnswerType(event) {
        this.props.flashDeck.answerType = event.target.value
        if (this.props.flashDeck.testType && this.props.flashDeck.answerType &&
            this.props.flashDeck.flashCards && this.props.flashDeck.flashCards.length>0) {
            this.setState({ valid: true })
        }
    }
    render() {
        const flashDeck = this.props.flashDeck
        const editable=(this.props.flashDeck.rank == 'BOSS' || this.props.flashDeck.rank == 'LIEUTENANT' || this.props.flashDeck.owner == this.props.user.id) &&
                (this.props.flashDeck.state!='TO_INVITE' && this.props.flashDeck.state!='INVITED')
        return (
            <>
                <Grid container
                    direction="column"
                    justify="space-between"
                    alignItems="stretch"
                >
                    <FlashTypography variant="h6" gutterBottom>
                        Test mode
                    </FlashTypography>
                    <RadioGroup aria-label="testtype" name="testtype" onChange={this.setTestType}>
                        <FormControlLabel value="REVISION" control={<Radio />} label={
                            <Explanation 
                                label='Revision'
                                id='revision'
                                explanation="With revision, you get one chance to answer each question, in random order, and you see your score as you go."/>
                            }
                             name="FormControlLabelButton"/>
                        
                        <FormControlLabel value="CRAM" control={<Radio />} label={
                            <Explanation 
                                label='Cram'
                                id='cram'
                                explanation="In cram mode, the questions repeat in random order until you've answered them all correctly."/>
                            }
                            name="FormControlLabelButton" />
                        <FormControlLabel value="EXAM" control={<Radio />}  label={
                            <Explanation 
                                label='Exam'
                                id='exam'
                                explanation="In exam mode, you get one chance to answer each question, in order, and you don't see your score until the end."/>
                            }
                            name="FormControlLabelButton" />
                    </RadioGroup>
                    <Divider />
                    <FlashTypography variant="h6" gutterBottom>
                        Answer type
                    </FlashTypography>
                    <RadioGroup aria-label="answertype" name="answertype" onChange={this.setAnswerType}>
                        <FormControlLabel value="SINGLE" control={<Radio />} label={
                            <Explanation 
                                label='Single answer'
                                id='single-answer'
                                explanation="If you choose 'Single answer', you need to enter your answer in text."/>
                            }
                            name="FormControlLabelButton" />
                        <FormControlLabel value="MULTIPLE" control={<Radio />} label={
                            <Explanation 
                                label='Multiple choice'
                                id='multiple-choice'
                                explanation="With multiple choice, you select the right answer (or answers) from a list of options."/>
                            }
                            name="FormControlLabelButton" />
                    </RadioGroup>
                    <Divider />
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                    >
                        <FlashButton
                            name='beginTest'
                            color='primary'
                            icon='flight_takeoff'
                            variant='contained'
                            buttonType='system'
                            style={{ width: editable ? '49%': '100%' }}
                            disabled={!this.state.valid}
                            onClick={() => { 
                                this.props.nextCard(this.props.flashDeck);
                            }}
                        >
                            Begin test
                        </FlashButton>
                        <FlashButton
                            name='editTest'
                            icon='edit'
                            color='primary'
                            variant='contained'
                            buttonType='system'
                            style={{ 
                                width: '49%', 
                                display: editable ? '': 'none' }}
                            onClick={() => { this.props.onEditButtonPress(this.props.flashDeck.id) }}
                        >
                            Edit test
                        </FlashButton>
                    </Grid>
                    <HighScores
                        flashDeck = {this.props.flashDeck}
                        user = {this.props.user}
                    />
                </Grid>
            </>
        )
    }
}
class Explanation extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isOpen:false
        }
    }
    render() {
        return (
            <div id={this.props.id} style={{overflow:'hidden', whiteSpace:'nowrap'}}> {this.props.label}
                <div style={{color:'rgb(0,0,0,0.8)', display:'inline', marginLeft:'6px', marginTop:'14px'}} 
                    onClick={e=>{
                        e.preventDefault();
                        this.setState({isOpen:!this.state.isOpen})
                        }
                    }>
                        <Icon style={{ fontSize: 16 }}>info</Icon>
                </div>
            <Tooltip isOpen={this.state.isOpen} placement="bottom-start"
                target={this.props.id} 
                style={{backgroundColor:'rgb(255,255,255,0.8)', padding:'6px', margin:'8px'}}
                onClick={e=>{
                    e.preventDefault();
                    this.setState({isOpen:!this.state.isOpen})
                    }
                }
            >
        {this.props.explanation}
        </Tooltip>
        </div>
        )
    }
}

function mapStateToProps(state, props) {
    return {user: state.user}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashDeckTest)