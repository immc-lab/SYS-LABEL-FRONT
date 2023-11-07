import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Modal } from 'antd';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor';
import {FastForwardOutlined,FastBackwardOutlined,PauseOutlined,CaretLeftOutlined,CaretRightOutlined} from '@ant-design/icons'
import PubSub from 'pubsub-js'
require("./index.css") 



class Waveform extends Component {
  constructor(props) {
    super(props);
    this.waveRef = React.createRef();
    this.timelineRef = React.createRef();
    this.state = {
      waveSurfer: null,
      isPlay:false,
      currentAudioBlob:null
      // regions: [],
    };
  }


  componentDidMount() {
    try{
    PubSub.subscribe("currentPlayAudioBlob",(_,data) =>{
      const {waveSurfer} = this.state
      waveSurfer.stop();
      waveSurfer.loadBlob(data.currentAudioBlob)
      waveSurfer.on('ready', () => {
        waveSurfer.play()
        this.setState({
          isPlay:true
        })
      });
      this.setState({
        currentAudioBlob:data.currentAudioBlob
      })
    })
  }catch(e){

  }
    // if(currentAudioBlob === null |currentAudioBlob === "" | currentAudioBlob === undefined){
    //   this.state.voiceSrc = "./111.mp3"
    // }
    const container = this.waveRef.current;
    const timelineContainer = this.timelineRef.current;
    console.log('container:', container);
    const wavesurfer = WaveSurfer.create({
      container,
      height:'130',
      waveColor: '#12563e',
      progressColor: '#bbb',
      autoCenter: false,
      plugins: [
        RegionsPlugin.create({
          dragSelection: true,
        }),
        TimelinePlugin.create({
          container: timelineContainer,
        }),
      ],
    });

    wavesurfer.on('finish', () => {
       this.setState({
          isPlay:false
       })
    });

    wavesurfer.on('ready', () => {
      // 为区域追加一个删除按钮
      const regionList = Object.values(wavesurfer.regions.list)
      for (const region of regionList) {
        this.createDeleteButton(region)

      }
    })
      wavesurfer.load(require("./111.mp3"))
    // 点击区域
    wavesurfer.on('region-click', (region) => {
      region.play(0)
        // region.playLoop()
      //记得清除定时器
      // this.$once('hook:beforeDestroy', () => {
      //   clearTimeout(timer)
      //   timer = null
      // })
    })

    wavesurfer.on('region-update-end', (region) => {
      region.playLoop() // 循环播放选中区域
      this.setState({
        isPlay:true
      })
      this.createDeleteButton(region)
    })

    this.setState({ waveSurfer: wavesurfer });
  }

  // 给区域创建删除按钮
  createDeleteButton = (region) => {
    if (!region.hasDeleteButton) {
      const deleteButton = region.element.appendChild(document.createElement('button'))
      const regionStyles = document.getElementsByTagName('region');
      for (let i = 0; i < regionStyles.length; i++) {
          regionStyles[i].style.zIndex = 3;
      }
      const {confirm} = Modal;
      deleteButton.innerText = '删除'
      deleteButton.addEventListener('click', (e) => {
        // e.stopPropagation()
        // confirm({
        //   // title: '提示',
        //   content: '确认删除此区域嘛？',
        //   okText: '确定',
        //   cancelText: '取消',
        //   icon: 'warning',
        //   onOk() {
            // 处理确认操作...
            region.remove();
            this.setState({
               isPlay:true
            })
        //   },
        //   onCancel() {
        //     // 处理取消操作...
        //   },
        // });
      })
      const css = { float: 'right', position: 'relative', cursor: 'pointer', color: 'red' }
      region.style(deleteButton, css)
      region.hasDeleteButton = true
    }
  }
//获取区域列表
  getRegions = () => {
    const {waveSurfer} = this.state
    const regionList = Object.values(waveSurfer.regions.list)
    console.log(regionList)
  }

  rebroadcast =()=> {
    const { waveSurfer } = this.state;
    this.clearLoop()
    waveSurfer.play(0)
  }


  handleStop = ()=>{
    const {wavesurfer} = this.state
    console.log("调用停止")
    this.wavesurfer.stop()
  }
  // 设置每个区域的loop为false
  clearLoop = () => {
    const {waveSurfer} = this.state
    const regionList = Object.values(waveSurfer.regions.list)
    regionList.forEach((regions) =>{regions.remove()})
  }




  componentWillUnmount() {
    const { waveSurfer } = this.state;
    if (waveSurfer && waveSurfer.isReady) {
      waveSurfer.destroy();
    }
  }



  play = () => {
    // 播放/暂停
    const { waveSurfer } = this.state;
    if (waveSurfer.isPlaying()) {
      waveSurfer.pause();
      this.setState({
        isPlay:false
      })
    } else {
      waveSurfer.play();
      this.setState({
        isPlay:true
      })
    }
  };

  rewind = () => {
    // 后退3秒
    const { waveSurfer } = this.state;
    console.log("后退")
    waveSurfer.skipBackward(3);
  };

  forward = () => {
    // 前进3秒
    const { waveSurfer } = this.state;
    const currentTime = waveSurfer.getCurrentTime();
    console.log("快进到"+currentTime)
    waveSurfer.skipForward(3);
  };

  // changeIcon = ()=>{
  //   const {isPlay} = this.state
  //   console.log(isPlay)
  //   return(
  //     isPlay? <PauseOutlined onClick={this.play}/>:
  //             <CaretLeftOutlined onClick={this.play}/>
  //   )
  // }

  render() {
    return (
      <div style={{border:"2px solid #eaeaea"}}>
        <div className='label_contain' ref={this.waveRef}></div>
        <div ref={this.timelineRef} style={{borderBottom:"2px solid #eaeaea"}}></div>
        <div className='music_controal_contain'>
           <span className='music_controal'>
            <span className='backward'>
              {/*后退3秒  */}
              <FastBackwardOutlined onClick={this.rewind}/>
            </span>
            <span className='pauseOrbegin'>
              {/*播放或者暂停*/}
              {this.state.isPlay?  <PauseOutlined onClick={this.play}/>:
                                   <CaretRightOutlined onClick={this.play}/>}
            </span>
            <span className='forward'>
              {/* 快进3秒 */}
              <FastForwardOutlined onClick={this.forward}/>
            </span>
            </span>
        </div>
        {/* <button onClick={this.getRegions}>印区域</button> */}
      </div>
    );
  }
}

export default Waveform;
