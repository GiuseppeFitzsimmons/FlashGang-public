import React, { Component } from 'react';
//import { Tooltip } from 'reactstrap';
import { Input, Container } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import {
    Col, Row
} from "reactstrap";

class IntegratedInput extends Component {
    constructor(props) {
        super(props);
    }
    state = { isOpen: false };

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    componentDidUpdate(prevProps) {
        this.state.value = this.props.value;
    }
    handleChange(event) {
        this.state.value = event.target.value
    };
    componentDidMount() {
    }
    reset(value) {
        if (!value) {
            value = "";
        }
        this.setState({ value })
    }
    render() {
        var message = this.props.message
        var _invalid = false;
        if (this.props.errors && this.props.errors.fields) {
            this.props.errors.fields.forEach(field => {
                let keys = Object.keys(field)
                if (keys[0]==this.props.id) {
                    message = field[keys[0]]
                    _invalid = true;
                }
            })
        }
        /*var _tooltip = <i />
        if (_invalid || (message && message != '')) {
            _tooltip = <Tooltip isOpen={this.state.isOpen} toggle={this.toggle} placement="bottom" target={this.props.id}>{message}</Tooltip>
        }*/
        let _label = ''
        if (this.props.label && this.props.label != '') {
            let color = 'rgba(0,0,0,0.6)'
            if (_invalid){
                color = 'rgba(255,0,0,0.6)'
            }
            _label = <><label style={{ color: color }}>{this.props.label}</label><br /></>
        }
        let _input=<Input
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        if (this.props.onEnterKey){
                            this.props.onEnterKey(e)
                        }
                    }
                }}
                /*onBlur = {()=>{
                    if (this.props.onBlur){
                        this.props.onBlur()
                    }
                }}*/
                invalid={_invalid}
                label={this.props.label}
                id={this.props.id}
                placeholder={message ? message : this.props.placeholder}
                type={this.props.type}
                value={this.state.value}
                onChange={
                    (e) => {
                        this.setState({ value: e.target.value })
                        this.props.onChange(e)
                    }
                }
                style={{ width: '100%' }}
            />
        let _error=<></>
        if (_invalid || (message && message != '')) {
            //_input =  <Tooltip title={message} placement="top">{_input}</Tooltip>
            _error=<><br /><label style={{ color: 'rgba(255,0,0,0.6)', fontSize:'1em' }}>{message}</label></>
        }
        return (
            <span>
                <div style={{ marginTop: '10px' }}>
                    {_label}
                    {_input}
                    {_error}
                </div>

            </span>
        );
    }
}

export default IntegratedInput;