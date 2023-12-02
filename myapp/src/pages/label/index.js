import React, { Component } from 'react';
import Waveform from "./label_core/index"
import EditWave from './label_edit/index'
import HandelWave from './label_user';
import { countSubscriptions } from 'pubsub-js';


class Label extends Component {

    state = {
        ready:false,
        audioKey:null,
        modelKey:null,
    }
    

    componentDidMount(){
        //获取传过来的音频地址和model，音频key
        const searchParams = new URLSearchParams(window.location.search);
        const labelMeeage = JSON.parse(searchParams.get("message"))
        console.log(labelMeeage)
        this.setState({
            audioKey:labelMeeage.audioKey,
            modelKey:labelMeeage.modelKey,
            ready:true,
        },()=>{
            console.log("看下父组件数据",this.state.audioKey)
        })
        
    }


    render() {
        return  (
            <div>
                {this.state.ready?
                <div>
                    <h2 className='label_h1'>开始标注</h2>
                    <Waveform audioKey = {this.state.audioKey} />
                    <EditWave modelKey = {this.state.modelKey} audioKey = {this.state.audioKey}/>
                </div>:null}
            </div>

            
        )
   }

   
}

export default Label;