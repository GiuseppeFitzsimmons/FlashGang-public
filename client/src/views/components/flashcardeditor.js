import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import { MdDelete } from 'react-icons/md'
import { Input } from 'reactstrap'
import IntegratedInput from '../widgets/IntegratedInput'
import {
    Col, Row
} from "reactstrap";
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import { FlashTypography, FlashButton, FlashListItem } from '../widgets/FlashBits';
import Icon from '@material-ui/core/Icon';
//https://material.io/resources/icons/?style=baseline
import Upgrade from '../components/upgrade';
import { Gallery } from '../components/gallery';


class FlashCardEditor extends React.Component {
    constructor(props) {
        super(props)
        this.addCorrectAnswer = this.addCorrectAnswer.bind(this)
        this.addIncorrectAnswer = this.addIncorrectAnswer.bind(this)
        this.removeCorrectAnswer = this.removeCorrectAnswer.bind(this)
        this.removeIncorrectAnswer = this.removeIncorrectAnswer.bind(this)
        this.onImageSelected = this.onImageSelected.bind(this)
    }
    componentDidMount() {
        if (this.props.navEvent) {
            this.props.navEvent.backButton = this.props.goHome;
        }
    }
    addCorrectAnswer() {
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].correctAnswers.push('')
        this.forceUpdate()
    }
    removeCorrectAnswer(index) {
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].correctAnswers.splice(index, 1)
        this.forceUpdate()
    }
    removeIncorrectAnswer(index) {
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers.splice(index, 1)
        this.forceUpdate()
    }
    addIncorrectAnswer() {
        if (!this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers) {
            this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers = []
        }
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers.push('')
        this.forceUpdate()
    }
    onImageSelected(url) {
        const flashCard = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        flashCard.image = url
        this.props.flashDeck.dirty = true
        this.forceUpdate()
    }
    componentDidUpdate() {
    }
    render() {
        const flashCard = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        if (!flashCard.correctAnswers) {
            flashCard.correctAnswers = []
            flashCard.correctAnswers.push('')
        }

        const generateCorrectAnswerList = () => {
            const thisCardEditor = this
            console.log("generateCorrectAnswerList", flashCard);
            var _display = flashCard.correctAnswers.map((answer, i) => {
                let removeButton = ''
                let _gridWidth = 12;
                {
                    if (i > 0 && i == flashCard.correctAnswers.length - 1) {
                        _gridWidth = 11
                        removeButton =
                            <Grid >
                                <MdDelete
                                    onClick={
                                        () => {
                                            this.removeCorrectAnswer(i)
                                        }
                                    }
                                />
                            </Grid>
                    }
                }
                let label = "Correct Answer";
                if (i > 0) {
                    label = '';
                }
                return (
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-end">
                        <Grid item xs={_gridWidth} sm={_gridWidth}>
                            <IntegratedInput
                                label={label}
                                placeholder={'Correct answer ' + (i + 1)}
                                onChange={
                                    (event) => { flashCard.correctAnswers[i] = event.target.value; this.props.flashDeck.dirty = true; this.forceUpdate() }
                                }
                                ref={
                                    input => input ? input.reset(answer) : true
                                }
                            />
                        </Grid>
                        {removeButton}
                    </Grid>
                )
            })
            return (
                <div>
                    {_display}
                </div>
            )
        }
        const descriptionInput = flashCard => {
            if (flashCard.description || flashCard.description == '') {

                return (


                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-end">
                        <Grid item xs={11} sm={11}>
                            <IntegratedInput
                                label='Description'
                                placeholder='Description'
                                onChange={
                                    (event) => {
                                        if (event.target.value.length > 0) {
                                            flashCard.description = event.target.value;
                                            this.props.flashDeck.dirty = true;
                                        }
                                    }
                                }
                                ref={
                                    input => input ? input.reset(flashCard.description) : true
                                }
                            />
                        </Grid>
                        <Grid >
                            <MdDelete
                                onClick={
                                    () => {
                                        delete flashCard.description;
                                        this.props.flashDeck.dirty = true;
                                        this.forceUpdate()
                                    }
                                }
                            />
                        </Grid>
                    </Grid>
                )
            } else {
                return (
                    <Grid>
                        <FlashButton
                            color='primary'
                            variant='contained'
                            buttonType='system'
                            style={{ width: '100%' }}
                            startIcon={<Icon style={{ fontSize: 20, color: 'green' }}>done_all</Icon>}
                            onClick={
                                () => {
                                    flashCard.description = ''
                                    this.props.flashDeck.dirty = true;
                                    this.forceUpdate()
                                }
                            }
                        >
                            Add answer decription
                    </FlashButton>
                    </Grid>
                )
            }

        }

        const generateIncorrectAnswerList = () => {
            if (!flashCard.incorrectAnswers) {
                return (
                    <></>
                )
            }
            var _display = flashCard.incorrectAnswers.map((answer, i) => {
                let removeButton = ''
                let _gridWidth = 12;
                {
                    if (i == flashCard.incorrectAnswers.length - 1) {
                        _gridWidth = 11
                        removeButton =
                            <Grid >
                                <MdDelete
                                    onClick={
                                        () => {
                                            this.removeIncorrectAnswer(i)
                                        }
                                    }
                                />
                            </Grid>
                    }
                }
                let label = "Incorrect Answer";
                if (i > 0) {
                    label = '';
                }
                return (
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-end">
                        <Grid item xs={_gridWidth} sm={_gridWidth - 1}>
                            <IntegratedInput
                                label={label}
                                placeholder={'Incorrect answer ' + (i + 1)}
                                onChange={
                                    (event) => {
                                        if (event.target.value.length > 0) {
                                            flashCard.incorrectAnswers[i] = event.target.value;
                                            this.props.flashDeck.dirty = true;
                                        }
                                        this.forceUpdate()
                                    }
                                }
                                ref={
                                    input => input ? input.reset(answer) : true
                                }
                            />
                        </Grid>
                        {removeButton}
                    </Grid>)
            })
            return (
                <div>
                    {_display}
                </div>
            )
        }
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="stretch"
            >

                <IntegratedInput
                    label='Question'
                    placeholder='flash card question'
                    onChange={
                        (event) => {
                            if (event.target.value.length > 0) {
                                flashCard.question = event.target.value;
                                this.props.flashDeck.dirty = true;
                            }
                            this.forceUpdate()
                        }
                    }
                    ref={
                        input => input ? input.reset(flashCard.question) : true
                    }
                />
                {
                    flashCard.image &&
                    <div
                        style={{
                            /*background: 'url('+flashCard.image+') no-repeat',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center center',
                            height:'132px',
                            backgroundRepeat: 'no-repeat'*/
                            textAlign: 'center'
                        }}
                    >
                        <img src={flashCard.image} height='132px' />
                    </div>
                }
                <Gallery
                    onImageSelected={this.onImageSelected}
                />
                {flashCard.image &&
                    <FlashButton
                        color='secondary'
                        variant='contained'
                        buttonType='system'
                        startIcon={<Icon style={{ fontSize: 20, color: 'green' }}>delete_outline</Icon>}
                        onClick={
                            () => {
                                delete flashCard.image;
                                this.forceUpdate();
                            }
                        }
                    >
                        Remove image
                    </FlashButton>
                }
                {generateCorrectAnswerList()}
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    startIcon={<Icon style={{ fontSize: 20, color: 'green' }}>check_box</Icon>}
                    onClick={
                        this.addCorrectAnswer
                    }
                >
                    Add correct answer
                </FlashButton>
                {descriptionInput(flashCard)}
                {generateIncorrectAnswerList()}
                <FlashButton
                    color='secondary'
                    variant='contained'
                    buttonType='system'
                    startIcon={<Icon style={{ fontSize: 20, color: 'red' }}>check_box</Icon>}
                    onClick={
                        this.addIncorrectAnswer
                    }
                >
                    Add incorrect answer
                </FlashButton>
                <Grid container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                >

                    <FlashButton
                        color='primary'
                        variant='contained'
                        style={{ width: '49%' }}
                        icon='navigate_before'
                        buttonType='system'
                        onClick={() => this.props.prevCard(this.props.flashDeck)}
                    >
                        Previous Card
                </FlashButton>
                    <FlashButton
                        color='primary'
                        variant='contained'
                        style={{ width: '49%' }}
                        iconRight='navigate_next'
                        buttonType='system'
                        disabled={(!flashCard.question || flashCard.question == '') || (!flashCard.correctAnswers || flashCard.correctAnswers.length == 0 || flashCard.correctAnswers[0] == '')}
                        onClick={() => {
                            if (this.props.flashDeck.remainingCardsAllowed > 0 || this.props.flashDeck.currentIndex < this.props.flashDeck.flashCards.length - 1) {
                                this.props.nextCard(this.props.flashDeck)
                            } else {
                                this.upgrade.open('DECK')
                            }
                        }}
                    >
                        Next Card
                </FlashButton>
                </Grid>
                <FlashButton
                    color='primary'
                    variant='contained'
                    icon='delete'
                    buttonType='system'
                    onClick={() => {
                        this.props.deleteCard(this.props.flashDeck)

                    }
                    }
                >
                    Delete Card
                </FlashButton>
                <FlashButton
                    color='primary'
                    variant='contained'
                    icon='work'
                    buttonType='system'
                    disabled={!this.props.flashDeck.dirty}
                    onClick={() => {
                        this.props.saveDeck(this.props.flashDeck)
                    }
                    }
                >
                    Save Deck
                </FlashButton>
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    icon='home'
                    onClick={this.props.goHome}
                >
                    Home
                </FlashButton>
                <Upgrade
                    parent={this}
                >
                </Upgrade>
            </Grid>

        )
    }
}

function mapStateToProps(state, props) {
    return { flashCard: state.flashCard }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashCardEditor)