import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FlashButton, FlashListItem, FlashCheckBox } from '../widgets/FlashBits';
import { IconSelector } from '../widgets/iconselector';
import { FlashTypography } from '../widgets/FlashBits';
import Slider from '@material-ui/core/Slider';
import Confirmation from '../components/confirmation';
import { Gallery } from '../components/gallery';

const someImage = require('../../utility/smimages')

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 10,
    label: '10',
  },
];
function valuetext(value) {
  return `${value}`;
}
class FlashDeckEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const flashDeck = this.props.flashDeck
    if (!flashDeck.image) {
      flashDeck.image = someImage.getRandomSubjectImage();
    }
    var editable = this.props.user.id == flashDeck.owner
    const theme = this.theme;
    console.log('user id', this.props.user.id, 'owner', flashDeck.owner)
    console.log('editable', editable)
    return (
      <Grid container
        direction="column"
        justify="space-between"
        alignItems="stretch"
      >
        <Grid container
          direction="row"
          justify="space-between"
          alignItems="stretch"
          style={{minHeight:'80px'}}
        >
          <Grid item xl='1' lg='1' md='2' sm='2' xs='2'>
            {/*<IconSelector icon={flashDeck.icon} iconClient={flashDeck} />*/}
            <Gallery
              onImageSelected={(image) => {
                flashDeck.image = image;
                flashDeck.dirty = true;
                this.forceUpdate();
              }
              }
              onImageUnselected={(image) => {
                delete flashDeck.image;
                flashDeck.dirty = true;
                this.forceUpdate();
              }}
              imageButton
              closeOnSelect
              image={flashDeck.image}
              station='DECK'
            />
          </Grid>
          <Grid item xl='11' lg='11' md='10' sm='10' xs='10' alignContent='flex-end' direction='row' style={{paddingLeft:'4px'}}>
            <IntegratedInput
              label="FlashDeck Name"
              id='flashCardName'
              placeholder='flash card name'
              onChange={
                (event) => { flashDeck.name = event.target.value; flashDeck.dirty = true; this.forceUpdate() }
              }
              ref={
                input => input ? input.reset(flashDeck.name) : true
              }
            />
          </Grid>
        </Grid>
        <IntegratedInput
          label="Description"
          id='flashCardDescription'
          placeholder='flash card description'
          onChange={
            (event) => { flashDeck.description = event.target.value; flashDeck.dirty = true; this.forceUpdate() }
          }
          ref={
            input => input ? input.reset(flashDeck.description) : true
          }
        />
        <div style={{
          display: editable ? '' : 'none'
        }}>
          <label style={{ color: 'rgba(0,0,0,0.6)', marginTop: '18px' }}>Editable by others</label>
          <FlashCheckBox
            onChange={(event) => { flashDeck.editable = event.target.checked; flashDeck.dirty = true; this.forceUpdate() }}
            ref={flashCheckBox => {
              if (flashCheckBox) {
                flashCheckBox.reset(flashDeck.editable);
              }
            }}
          />
        </div>
        <label style={{ color: 'rgba(0,0,0,0.6)', marginTop: '18px' }}>Fuzziness</label>
        <Slider
          defaultValue={flashDeck.fuzziness ? flashDeck.fuzziness : 0}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={10}
          onChange={
            (event, newValue) => { flashDeck.fuzziness = newValue; flashDeck.dirty = true; this.forceUpdate(); }
          }
        />
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='action'
          icon='filter'
          disabled={!flashDeck.name || flashDeck.name == ''}
          onClick={
            () => this.props.nextCard(flashDeck)
          }
        >
          Edit Cards
          </FlashButton>
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='system'
          icon={!flashDeck.dirty || !flashDeck.name || flashDeck.name == '' ? 'lens' : 'blur_on'}
          disabled={!flashDeck.dirty || !flashDeck.name || flashDeck.name == ''}
          onClick={() => {
            this.props.saveDeck(this.props.flashDeck)
          }}

        >
          Save Deck
          </FlashButton>
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='system'
          icon='delete'
          disabled={!editable}
          onClick={() => { this.confirmation.open('DECKS') }}
        >
          Delete Deck
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
        <Confirmation
          parent={this}
          onConfirm={() => {
            this.props.deleteDeck(flashDeck.id)
            this.props.goHome()
          }}
        />
      </Grid>
    )
  }
}

function mapStateToProps(state, props) {
  return { user: state.user }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashDeckEditor)