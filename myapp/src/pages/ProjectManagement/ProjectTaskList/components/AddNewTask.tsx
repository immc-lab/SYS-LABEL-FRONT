import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Upload,
  UploadFile,
  message,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { request, useLocation, useNavigate } from '@umijs/max';



const AddNewTask: React.FC = () => {

   const location = useLocation();
   console.log("我是addNewTask接收的项目编号:",location.state.projectID);
  //  const [projectID, setProjectID] = useState('');

  //   useEffect(() => {
  //     if (location.state && location.state.projectID) {
  //       setProjectID(location.state.projectID);
  //     }
  //   }, [location.state]);

  //   console.log("我是addNewTask的projectID值：",projectID);

   const [allModel, setAllModel] = useState([]);
   const [allTeam, setAllTeam] = useState([]);
   const [missionKey, setMissionKey] = useState();
   const [selectedTeamKey,setSelectedTeamKey] = useState();
   const [selectedModelKey,setSelectedModelKey] = useState();
   const [selectedTeamName,setSelectedTeamName] = useState();
   const [selectedModelName,setSelectedModelName] = useState();
   const [shouldModelFetch, setShouldModelFetch] = useState(true);
   const [shouldTeamFetch, setShouldTeamFetch] = useState(true);
   const [shouldUpload, setShouldUpload] = useState(false);
   const [uploadFile, setUploadFile] = useState();
      //全局提示信息
    const [messageApi, contextHolder] = message.useMessage();
    const { Option } = Select;
    const navigator = useNavigate(); //必须写在外面，不能写函数里

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span:14 },
    };

    const normFile = (e: any) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    useEffect(() => {
      if (shouldModelFetch) {
        request('/api/model/core/getModelAll', {
          method: 'POST',
        })
          .then(response => {
            if (response.status === '0') {
              console.log("我是接收的所有model:", response.data);
              setAllModel(response.data);
            }
          })
          .catch(error => {
            messageApi.error("出错了！！！");
            console.error('There was a problem with the fetch operation:', error);
          });
      }
      setShouldModelFetch(false);
    }, [shouldModelFetch]);


    useEffect(() => {
      if (shouldTeamFetch) {
        request('/api/team/core/getAllTeam', {
          method: 'POST',
        })
          .then(response => {
            if (response.status === '0') {
              console.log("我是接收的所有Team:", response.data);
              setAllTeam(response.data);
            }
          })
          .catch(error => {
            messageApi.error("出错了！！！");
            console.error('There was a problem with the fetch operation:', error);
          });
      }
      setShouldTeamFetch(false);
    }, [shouldTeamFetch]);

    //mp3转bse64
    const convertToBase64 =  (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
    //上传单个文件
    const uploadBase64Audio = async (audioFile, isLastFile) => {
      try {
       console.log("我是AddNewTask接收的audioFile:",audioFile);
       const base64String = convertToBase64(audioFile.originFileObj);
       base64String.then((value) => {
        console.log("我是转base64String:",value); // 输出 "data:aud"
      }).catch((error) => {
        console.error(error);
      });
      // console.log("我是转base64:",base64String);
       console.log("我是uploadBase64Audio方法，我已经获得missionKey:",missionKey);
       console.log("我是最后一个文件吗?",isLastFile,audioFile);
       //判断是否为最后一个文件
       let requestData;
       if (isLastFile) {
          requestData = {
            "audioBase64":base64String,
            "projectKey": location.state.projectID,
            "modelKey": selectedModelKey,
            "missionKey": missionKey,
            "format": "mp3",
            "last": 1,
          }
       }else{
         requestData = {
            "audioBase64":base64String,
            "projectKey": location.state.projectID,
            "modelKey": selectedModelKey,
            "missionKey": missionKey,
            "format": "mp3",
         }
      }
       request('/api/project/core/saveProjectAudioData', {
           method: 'POST',
           data:requestData,
         //  timeout: 40000, //
           // headers: {
           //   'Content-Type': 'multipart/form-data'
           // }
         }).then(response => {
           //  message.success(`${info.file.name}文件上传成功.`);
           //  message.success('新建成功');
             navigator('/projectManagement/homePage/projectTaskList');
             console.log("上传音频成功后返回的data:",response.data);
         })
       .catch(error => {
         // 在这里处理错误情况
         messageApi.error("出错了！！！")
         console.error('There was a problem with the fetch operation:', error);
       });
     } catch (error) {
       console.error("Failed to upload base64 audio file", error);
     }
   };
  //实现批量异步上传
    const uploadFiles = async (audioFile) => {
      try {
        for (const file of audioFile) {
          let isLastFile = false;
          if (file === audioFile[audioFile.length-1]){
             isLastFile = true;
          }
          await uploadBase64Audio(file,isLastFile); // 上传单个文件，这里假设有一个名为 uploadSingleFile 的函数
          console.log("我是批量文件上传ing：",file);
        }
        // 所有文件上传完成后执行的操作
        message.success('所有文件上传成功');
        navigator('/projectManagement/homePage/projectTaskList');
      } catch (error) {
        // 处理错误情况
        message.error('文件上传出错啦！！！');
        console.error('上传文件时发生错误:', error);
      }
    };



    const onFinish = (values: any) => {
      console.log("新任务提交的表单：",values);
      const reqJsonObject = {
        "missionName": values.taskName,
        "model": values.model,
        // "assignTeam": values.assignTeam,
        "projectKey": location.state.projectID,
        "teamKey": selectedTeamKey,
        "teamName": selectedTeamName,
        "modelName": selectedModelName,
        "modelKey": selectedModelKey,
        // "projectType": updatedData.projectType,
        // "projectArea": updatedData.projectArea,
      }
      console.log("我是获取添加新任务表单值：",reqJsonObject);
      request('/api/project/core/saveNewMission', {
            method: 'POST',
            data: reqJsonObject,
          }).then(response => {
            if (response.status ==='0') {
              messageApi.success('添加成功');
              console.log("我是addNewTask添加成功后返回的data:",response.data);
           //   setShouldUpload(true);
              setMissionKey(response.data);
            //  uploadBase64Audio(uploadFile);
              // if (missionKey !==null && missionKey !== undefined){
              //   uploadBase64Audio(uploadFile);
              // }else{
              //   messageApi.error('任务编号异常');
              // }

              //  request('/api/project/core/saveProjectAudioData', {
              //   method: 'POST',
              //   data: {
              //               missionKey: response.data,

              //         }
              // }).then(response => {
              //   if (response.status ==='0') {
              //     messageApi.success('添加成功');
              //     // setData(response.data);
              //   }
              //   // return response.json();
              // }).catch(error => {
              //   // 在这里处理错误情况
              //   messageApi.error("出错了！！！")
              //   console.error('There was a problem with the fetch operation:', error);
              // });
              // navigator('/projectManagement/homePage/projectTaskList');
              // setData(response.data);
            }
            // return response.json();
          }).catch(error => {
            // 在这里处理错误情况
            messageApi.error("出错了！！！")
            console.error('There was a problem with the fetch operation:', error);
          });
          // request('/api/project/core/saveNewMusic', {
          //   method: 'POST',
          //   data: reqJsonObject,
          // }).then(response => {
          //   if (response.status ==='0') {
          //     messageApi.success('添加成功');
          //     // setData(response.data);
          //   }
          //   // return response.json();
          // }).catch(error => {
          //   // 在这里处理错误情况
          //   messageApi.error("出错了！！！")
          //   console.error('There was a problem with the fetch operation:', error);
          // });
   
      console.log('Received values of form: ', values);
    };

    useEffect(() => {
      if (missionKey) {
        console.log('我是missionKey:', missionKey);
        // request('/api/project/core/saveProjectAudioData', {
        //   method: 'POST',
        //   data: {
        //     missionKey: missionKey,
        //   },
        // }).then(response => {
        //   if (response.status === '0') {
        //     messageApi.success('添加成功');
        //     navigator('/projectManagement/homePage/projectTaskList');
        //   } else {
        //     messageApi.error('添加失败');
        //   }
        // }).catch(error => {
        //   messageApi.error('出错了！！！');
        //   console.error('There was a problem with the fetch operation:', error);
        // });
        console.log("我是调用uploadBase64Audio时的uploadFile:",uploadFile);
        //uploadBase64Audio(uploadFile);
        uploadFiles(uploadFile);
      }
    }, [missionKey, uploadFile]);
      //处理上传MP3文件
//  const { Dragger } = Upload;  //从Upload模块中导入Dragger组件，用于显示拖拽上传按钮

  const [fileList, setFileList] = useState<UploadFile[]>([]);



  const props: UploadProps = {
    name: 'files',  //指定上传的文件字段名
    multiple: true,
    // maxCount:1,
    method: 'post',

    beforeUpload: (file) => {
      //筛选上传文件类型
      const isMp3 = file.type === "audio/mpeg";
      // const isMp3 = file.type === "application/pdf";
      if (!isMp3) {
        message.error(`${file.name}不是mp3文件`);
      }
      // console.log('我是上传的文件2：',file,fileList,isMp3);
      return isMp3 || Upload.LIST_IGNORE;
    },

    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') { //上传未开始或已完成
        console.log('我是上传的文件：',info.file,info.file.type, info.fileList);
        setUploadFile(info.fileList);
      }
      if (status === 'done') { //上传成功完成
        // const formData = new FormData();
        // formData.append('file', info.file.originFileObj);
        // console.log("文件类型：",typeof info.file, typeof info.file.originFileObj)
        // formData.append("reqString","upload to houduan");
        // request<string>('/api/admin/core/upload', {
        //   method: 'POST',
        //   data: formData,
        // });

        // if (info.fileList.length) {
        // }
        if (missionKey !==null){
          console.log("我是shouldUpload:",info.file.originFileObj);
        //  setUploadFile(info.file.originFileObj);
         // uploadBase64Audio(info.file.originFileObj);
              // if (info.file === info.fileList[info.fileList.length - 1]) {
                // 最后一个文件上传完成，执行逻辑并传递标志
                //  messageApi.success(`所有文件上传完成，最后一个文件uid:${info.file.uid}`);
                // 执行你的逻辑，比如发送 last=1 标志给服务器
              //   console.log("我是最后一个文件：",info.file.uid);
              // }
        }else{
          message.warning("请等待！");
        }

      } else if (status === 'error') { //上传失败
        // setFileList([...fileList, info.file]);
        message.error(`${info.file.name}文件上传失败.`);

      }
      setFileList(info.fileList);
    },
    onDrop(e) { //文件被拖入上传区域时执行的回调功能
      console.log('Dropped files', e.dataTransfer.files);
    },
  };


return (
  <PageContainer>
    {contextHolder}
  <Card>
  {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
  <Form
    name="validate_other"
    {...formItemLayout}
    onFinish={onFinish}
    // initialValues={{
    //   'input-number': 3,
    //   'checkbox-group': ['A', 'B'],
    //   rate: 3.5,
    //   'color-picker': null,
    // }}
    // style={{ maxWidth: 600 }}
  >
    <Form.Item
      name="taskName"
      label="任务名称"
      rules={[{ required: true, message: '任务名称不能为空' }]}
    >
      <Input placeholder='请输入项目名称'></Input>
    </Form.Item>
    <Form.Item
      name="assignTeam"
      label="分配团队"
      hasFeedback
      rules={[{ required: true, message: '团队不能为空' }]}
    >
       <Select placeholder="请选择要分配的团队"
         onChange={(value, option) => {
           console.log("我是选中的团队的key:",value,option);
           setSelectedTeamKey(option.key);
           setSelectedTeamName(option.value);
        }}
       >
        {allTeam.map((item) => (
          <Option key={item.teamKey} value={item.teamName}>
            {item.teamName}
          </Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      name="model"
      label="模板"
      hasFeedback
      rules={[{ required: true, message: '模板不能为空' }]}
    >
      <Select placeholder="请选择要分配的模板"
         onChange={(value, option) => {
          console.log("我是选中的模板的key:",value,option);
          setSelectedModelKey(option.key);
          setSelectedModelName(option.value);
        }}
      >
        {allModel.map((item) => (
          <Option key={item.key} value={item.modelName}>
            {item.modelName}
          </Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item label="Dragger">
      <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
        <Upload.Dragger directory={true} {...props} fileList={fileList}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>

    <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
      <Space>
        <Button type="primary" htmlType="submit">
          新建
        </Button>
        <Button htmlType="reset">重置</Button>
      </Space>
    </Form.Item>
  </Form>
  {/* </div> */}
  </Card>
  </PageContainer>
);
}
export default AddNewTask;
