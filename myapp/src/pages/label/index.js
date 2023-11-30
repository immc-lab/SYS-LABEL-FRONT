import React, { Component } from 'react';
import Waveform from "./label_core/index"
import EditWave from './label_edit/index'
import HandelWave from './label_user';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';

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
                <EditWave/>
            </div>


        )
   }


}

export default Label;
