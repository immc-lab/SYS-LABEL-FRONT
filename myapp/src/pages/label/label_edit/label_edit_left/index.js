import React, { Component } from 'react';
import { Form, Input,Radio,TimePicker} from 'antd';
const { TextArea } = Input;
import moment from 'moment'
require("./index.css") 
class EditWaveLeft extends Component {
    state = {
       size:3,
       key:"lalal",
       takes:[],
       content:{
        id:null,
        labelText:null,
        beginTime:null,
        endTime:null,
        talk:null,
       },
    }
  componentDidMount() {
    const{preContent} = this.props
    const alphabet = [];
    const{id} = this.props
    const startCharCode = 'A'.charCodeAt(0); // 获取字母'A'的Unicode编码
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(startCharCode + i); // 根据Unicode编码生成字母
      alphabet.push(char); // 将字母添加到数组中
    }  
    this.setState({
      takes:alphabet,
      content:{id:id,...preContent},
    })
    console.log("///////////////////////////////////")
    console.log("子组件接收："+this.props.preContent.talk)
    console.log(this.props.preContent.endTime)
    console.log(moment(this.props.preContent.endTime,"mm:ss"))
  }


  handChange  = (e)=>{
    this.setState({
      key:e.target.value
    })

  }


  saveText = (e)=>{
    const {content} = this.state
    this.setState({
      content:{
        ...content,
        labelText:e.target.value
      }
    })
  }

  saveAreaTime = (time,timeString)=>{
    console.log(timeString)
    const{content}  =this.state
    this.setState({
      content: {
        ...content,
        beginTime: timeString[0],
        endTime: timeString[1]
      }
    });
  }

  saveTalk = (e)=>{
    const{content}  =this.state
    this.setState({
      content:{
        ...content,
        talk:e.target.value
      }
    }) 
  }


  SelectFuntion(type){
    let targetContent
    switch (type){
        case "Text":
            targetContent = <div>
                                <TextArea value="labelText" rows={1} placeholder="请输入音频信息" maxLength={50} style={{width:"80%"}} onChange={(e)=>{this.saveText(e)}}></TextArea>
                            </div> 
            break;
        case "Radio":
            targetContent = <div>
                                <Radio.Group value="talk" style={{marginLeft:"4%"}}  onChange = {(e)=>obj.saveTalk(e)}>
                                    {new Array(this.state.size).fill(null).map((_,i)=>{
                                        const value = i
                                        return(
                                        <Radio key = {value} value={value}>{this.state.takes[i]}</Radio>
                                        )
                                    })}
                                </Radio.Group>
                            </div> 
            break;
        case "Checkbox":
            targetContent = <div>
                                <Checkbox.Group/>
                            </div>
            break;

    }
    return targetContent

  }


  componentWillUnmount() {

  }

  render(){
    const {preContent} = this.props;
    const labelText = preContent.labelText;
    const areaTimeStart = preContent.beginTime || '00:00'
    const areaTimeEnd = preContent.endTime || '59:59'
    console.log(areaTimeEnd)
    const beginTime = moment(areaTimeStart,"mm:ss")
    const endTime = moment(areaTimeEnd,"mm:ss")
    const talk = parseInt(preContent.talk);
    console.log("啊我要疯了！")
    console.log(talk)
    return(
        <div>
          <div className='areaText' style={{marginTop:"1%"}}>
            <strong>区域标注</strong>
            <hr style={{border:"1px solid #eaeaea", marginLeft:"5%",marginRight:"5%"}}></hr>
          </div>
          <Form style={{ marginLeft:"10%", marginTop:"5%"}} initialValues = {{labelText:labelText, areaTime: [beginTime,endTime], talk:talk}}>
            {/* {标注文本表单项} */}
            <Form.Item
              label="标注文本"
              name="labelText"
              rules={[
                {
                  required: true,
                  message: '请填入标注文本!',
                },
              ]}
            >
            {this.SelectFuntion("Text")}
            </Form.Item>
             {/* {时间区域} */}
             <Form.Item
              label="区域时间段"
              name="areaTime"
              rules={[
                {
                  required: true,
                  message: '请选择区域时间段!',
                },
              ]}
            >
            <TimePicker.RangePicker format = {"mm:ss"} value={["areaTime"[0],"areaTime"[1]]} onChange={(time,timeString)=>this.saveAreaTime(time,timeString)}/>
            </Form.Item>

             {/* {说话人表单项} */}
            <Form.Item
               label="说话人"
               name="talk"
               rules={[
                 { 
                   required: true,
                   message: '请选择说话人！',
                 },
               ]}
            >
              <Radio.Group value="talk" style={{marginLeft:"4%"}}  onChange = {(e)=>this.saveTalk(e)}>
                  {new Array(this.state.size).fill(null).map((_,i)=>{
                    const value = i
                    return(
                      <Radio key = {value} value={value}>{this.state.takes[i]}</Radio>
                    )
                  })}
              </Radio.Group>
            </Form.Item>
          </Form>  
        </div>
    )
  }

}
export default EditWaveLeft;
