import React, { Component } from 'react';
import Waveform from "./label_core/index"
import HandelWave from './label_user';


class Label extends Component {
    get = ()=>{
        console.log("........................")
        console.log(this.handelWaveRef.state.dataSource)
    }


    render() {
        return  (
            <div>
                <h2 className='label_h1'>开始标注</h2>
                <Waveform/>
                <HandelWave ref={(ref) => this.handelWaveRef = ref}/>
            </div>

            
        )
   }

   
}

export default Label;