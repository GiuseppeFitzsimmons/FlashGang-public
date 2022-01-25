import React from 'react';
//import logo from './logo.svg';
import '../App.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'
import FlashDeckEditor from './components/flashdeckeditor'
import FlashCardEditor from './components/flashcardeditor'
import FlashDeckTest from './components/flashdecktest';
import FlashTestSingleAnswer from './components/flashtestsingleanswer';
import FlashTestMultipleAnswer from './components/flashtestmultipleanswer';
import FlashCardScore from './components/flashcardscore';
import FlashDeckScore from './components/flashdeckscore';
import FlashAppBar from './widgets/flashappbar'

class FlashDeck extends React.Component {
  constructor(props) {
    super(props)
    this.editFlashDeck = this.editFlashDeck.bind(this)
  }
  componentDidMount() {
    if (!this.props.flashDeckId) {
      this.props.newDeck()
    } else {
      this.props.loadFlashDeck(this.props.flashDeckId, this.props.mode, null, null, this.props.source)
    }
    if (this.props.navEvent) {
      this.props.navEvent.backButton = () => {
        if (this.props.flashDeck && this.props.flashDeck.mode == "EDIT") {
          if (!this.props.flashDeck.hasOwnProperty('currentIndex')) {
            /*this.props.flashDeck.mode = 'TEST'
            delete this.props.flashDeck.currentIndex
            this.forceUpdate()*/
            //TODO if this card hasn't been saved, we might want to offer the user a chance to save it before going back
            //This should just be a matter of testing this.props.flashDeck.dirty;
            this.props.goHome();
          } else {
            this.props.prevCard(this.props.flashDeck)
            console.log('this.props.flashDeck.currentIndex', this.props.flashDeck.currentIndex)
          }
        } else {
          this.props.goHome()
        }
      };
    }
  }
  editFlashDeck(id) {
    this.props.loadFlashDeck(id, 'EDIT')
  }
  render() {
    let helpText=''
    let renderable = <></>
    if (this.props.flashDeck && this.props.flashDeck.mode === 'COMPLETE') {
      renderable = <FlashDeckScore
        flashDeck={this.props.flashDeck}
        onStartOver={() => { this.props.loadFlashDeck(this.props.flashDeck.id, 'TEST', this.props.flashDeck.answerType, this.props.flashDeck.testType) }}
        goHome={this.props.goHome}
      />
    } else if (this.props.flashDeck && this.props.flashDeck.mode === 'EDIT' && this.props.flashDeck.hasOwnProperty('currentIndex')) {
      renderable = <FlashCardEditor flashDeck={this.props.flashDeck} goHome={this.props.goHome} />
      helpText=<>Enter a question and at least one right answer. If you enter multiple right answers, then you're writing a multiple choice test.<br/>
      You can provide as many wrong answers as you like. These will be used for multiple choice<br/> If you don't provide enough wrong answers,
      that's okay - the rest of the choices will be right answers randomly chosen from other questions.<br/>
      You can also select a picture that will be displayed above the question during the test.</>
    } else if (this.props.flashDeck && this.props.flashDeck.mode === 'EDIT') {
      renderable = <FlashDeckEditor flashDeck={this.props.flashDeck} goHome={this.props.goHome} onFlashDeckSelected={this.props.onFlashDeckSelected} />
      helpText=<>You have to choose a name for your deck. You can provide a description too, if you like, and select a picture.<br/>
        If you select "editable by others" then when this deck is shared by a gang, selected members can also make changes to it.</>
    } else if (this.props.flashDeck && this.props.flashDeck.hasOwnProperty('currentIndex') && this.props.flashDeck.mode == 'TEST') {
      if (this.props.flashDeck.answerType == 'SINGLE') {
        renderable = <FlashTestSingleAnswer flashDeck={this.props.flashDeck} onNextCard={this.props.scoreCard} />
      } else {
        renderable = <FlashTestMultipleAnswer flashDeck={this.props.flashDeck} onNextCard={this.props.scoreCard} />
      }
      if (this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].hasOwnProperty('correct')) {
        if (this.props.flashDeck.testType === 'REVISION' || this.props.flashDeck.testType === 'CRAM') {
          renderable = <FlashCardScore flashDeck={this.props.flashDeck} onNextCard={this.props.nextCard} />
        }
      }
    } else if (this.props.flashDeck && this.props.flashDeck.mode == 'TEST') {
      renderable = <FlashDeckTest flashDeck={this.props.flashDeck} onEditButtonPress={this.editFlashDeck} />
      helpText=<>Select a test mode and an answer type. Revision and cram are for studying, and exam is for testing what you've learned.</>
    }
    return (
      <>
        <FlashAppBar
          title={this.props.flashDeck ? this.props.flashDeck.name : null}
          station='DECK'
          goHome={this.props.goHome}
          goGangs={this.props.goGangs}
          onLogOut={this.props.onLogOut}
          goSettings={this.props.goSettings}
          help={helpText}/>
        {renderable}
      </>
    )
  }
}

function mapStateToProps(state, props) {
  return { flashDeck: state.flashDeck }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashDeck)