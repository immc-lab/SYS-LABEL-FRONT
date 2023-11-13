import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button, Modal} from 'antd';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor';
import {
  FastForwardOutlined,
  FastBackwardOutlined,
  PauseOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  RedoOutlined
} 
  from '@ant-design/icons'

import PubSub from 'pubsub-js'
require("./index.css") 



class Waveform extends Component {
  constructor(props) {
    super(props);
    this.waveRef = React.createRef();
    this.timelineRef = React.createRef();
    this.state = {
      regionStartime:null,
      regionEndTime:null,
      waveSurfer: null,
      isPlay:false,
      currentAudioBlob:null,
      totalTime:null,
      reload:false,
      selectedRegion: null,
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
        //这里可能需要一个 加载完成的标志
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
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
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


    wavesurfer.load(require("./111.mp3"))
    const re = wavesurfer.getActivePlugins('regions')

    wavesurfer.on('decode', (duration) => {
      const decodedData = ws.getDecodedData()
      if (decodedData) {
        const regions = extractRegions(decodedData.getChannelData(0), duration)
    
        // Add regions to the waveform
        regions.forEach((region, index) => {
          re.addRegion({
            start: region.start,
            end: region.end,
            content: index.toString(),
            drag: false,
            resize: false,
          })
        })
      }
    })


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
      //加载完成添加总时长
      this.setState({
        totalTime:this.convertToTimeFormat(wavesurfer.getDuration())
      })
    })
     
    // 点击区域
    wavesurfer.on('region-click', (region) => {
      
      region.play(0)
      const start = this.convertToTimeFormat(region.start)
      const end = this.convertToTimeFormat(region.end)
      const timeRange = [start.substring(3,8),end.substring(3,8)]
      //订阅监听事件
      PubSub.publish("getTime",timeRange)
      this.setState({
        regionStartime:start,
        regionEndTime:end,
        selectedRegion: region
      })
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
        isPlay:true,
        selectedRegion:region
      })
      this.createDeleteButton(region)
    })

    this.setState({ 
      waveSurfer: wavesurfer,
    });
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

//时分秒转换
  convertToTimeFormat(floatNumber) {
      const hours = Math.floor(floatNumber / 3600);
      const minutes = Math.floor((floatNumber % 3600) / 60);
      const seconds = Math.floor(floatNumber % 60);
    
      const hoursStr = String(hours).padStart(2, '0');
      const minutesStr = String(minutes).padStart(2, '0');
      const secondsStr = String(seconds).padStart(2, '0');
  
      return hoursStr + ':' + minutesStr + ':' + secondsStr;
  }


  //预切片函数
  extractRegions = (audioData, duration) => {
  const minValue = 0.01
  const minSilenceDuration = 0.1
  const mergeDuration = 0.2
  const scale = duration / audioData.length
  const silentRegions = []

  // Find all silent regions longer than minSilenceDuration
  let start = 0
  let end = 0
  let isSilent = false
  for (let i = 0; i < audioData.length; i++) {
    if (audioData[i] < minValue) {
      if (!isSilent) {
        start = i
        isSilent = true
      }
    } else if (isSilent) {
      end = i
      isSilent = false
      if (scale * (end - start) > minSilenceDuration) {
        silentRegions.push({
          start: scale * start,
          end: scale * end,
        })
      }
    }
  }

  const mergedRegions = []
  let lastRegion = null
  for (let i = 0; i < silentRegions.length; i++) {
    if (lastRegion && silentRegions[i].start - lastRegion.end < mergeDuration) {
      lastRegion.end = silentRegions[i].end
    } else {
      lastRegion = silentRegions[i]
      mergedRegions.push(lastRegion)
    }
  }

  // Find regions that are not silent
  const regions = []
  let lastEnd = 0
  for (let i = 0; i < mergedRegions.length; i++) {
    regions.push({
      start: lastEnd,
      end: mergedRegions[i].start,
    })
    lastEnd = mergedRegions[i].end
  }

  return regions
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
//重新播放
  reLoadAudio = ()=>{
   const {selectedRegion} = this.state
   if(selectedRegion){
    selectedRegion.play()
   }
   this.setState({
    isPlay:true
   })
  }

//删除所有区域

clearRegions = ()=>{
  const {waveSurfer} = this.state
  waveSurfer.clearRegions()
}

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
          <span style={{alignItems:"center",display:"flex",color:"grey"}}>当前选中区域时间范围：
                开始：{this.state.regionStartime}
                
                结束：{this.state.regionEndTime}
                <br/>
                总时长：{this.state.totalTime}
          </span>
          
           <span className='music_controal'>
            <span className='backward'>
              {/*后退3秒  */}
              <Button type="text">
                <FastBackwardOutlined onClick={this.rewind} style={{fontSize:"25px"}}/>
              </Button>
              
            </span>
            <span className='pauseOrbegin'>
              {/*播放或者暂停*/}
              <Button type="text">
              {this.state.isPlay?  <PauseOutlined onClick={this.play} style={{fontSize:"25px"}}/>:
                                   <CaretRightOutlined onClick={this.play} style={{fontSize:"25px"}}/>}
              </Button>
              
            </span>
            <span className='forward'>
              {/* 快进3秒 */}
              <Button type="text">
               <FastForwardOutlined onClick={this.forward} style={{fontSize:"25px"}}/>
              </Button>
              
            </span>
          </span>

          {/* 重新播放 */}
          <span className='button_right'>
            <span>
              <Button type="text">
                <RedoOutlined style={{fontSize:"20px"}} onClick={()=>{this.reLoadAudio()}}/>
              </Button>
           
            </span>
            {/* 删除所有区域 */}
            <span>
              <Button type="text">
                <DeleteOutlined style={{fontSize:"20px"}} onClick={()=>{this.clearRegions()}}/>
              </Button>
              
            </span>
          </span>

        </div>

        {/* <button onClick={this.getRegions}>印区域</button> */}
      </div>
    );
  }
}

export default Waveform;
