import React from "react";
import { css } from '@emotion/core';
import { BarLoader } from 'react-spinners';

class LoadingAnimation extends React.Component {
    /*constructor(props) {
        super(props);
    };*/
    render() {
        const getRenderable=()=>{
            if (this.props.loading) {
                return <div className='sweet-loading' style={{
                    display: 'inline-block',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '0', right: '0', left: '0', bottom: '0',
                    paddingTop: '50%',
                    position: 'absolute',
                    backgroundColor: 'rgb(0,0,0,.3)'
                  }} >
                    <BarLoader
                      override={css}
                      sizeUnit={"px"}
                      size={75}
                      color={'#2885c6'}
                      loading={this.props.loading}
                    />
                  </div>
            } else {
                return <></>
            }
        }
        return(
            <>
            {getRenderable()}
            </>
        )
    }
}

export default LoadingAnimation;