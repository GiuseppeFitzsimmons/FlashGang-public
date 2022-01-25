import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class SimpleTooltip extends Component {
  state = { isOpen: false };

  toggle = () => {
    //if ((this.props.message && this.props.message!='') || this.props.errors) {
      this.setState({ isOpen: !this.state.isOpen });
    //}

  };

  render() {
    var message = this.props.message
    if (message || message==''){
      if (this.props.errors){
        this.props.errors.fields.forEach(field=>{
          if (field.fieldId==this.props.targetId || field.fieldName==this.props.targetId){
            message = field.message
          }
        })
      }
    }
    return <Tooltip isOpen={this.state.isOpen} toggle={this.toggle} placement="bottom" target={this.props.targetId}>{message}</Tooltip>;
  }
}

export default SimpleTooltip;