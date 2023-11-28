import { Button, Col, Row, Modal, message, Upload} from "antd";
import React, { useState } from "react";
import styles from './OperateProjectTaskListButton.css'
import { Select} from 'antd';
import type { SelectProps} from 'antd';
import { history, useNavigate} from '@umijs/max';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from "@/services/swagger/pet";
import { getAudioData } from "../../service/api";

const OperateProjectTaskListButton = ({selectedRowKeys,handleClearSelection,projectID}) =>{

  console.log("我是OperateProjectTaskListButton接收过来的key:",projectID);

  //控制新建任务对话框弹出
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  //控制分配团队对话框弹出
  const [isAssignTeamsModalOpen, setIsAssignTeamsModalOpen] = useState(false);
  //控制批量通过对话框的弹出
  const [isBatchPassModalOpen, setIsBatchPassModalOpen] = useState(false);
  //控制批量不通过对话框的弹出
  const [isBatchNoPassModalOpen, setIsBatchNoPassModalOpen] = useState(false);
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();
  //得到分配团队按钮已选中的选项
  const [selectedAssignTeams, setSelectedAssignTeams] = useState([]);
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  // const [selectedAnnotatorOptions, setSelectedAnnotatorOptions] = useState([]);
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  // const [selectedQualityInspectorOptions, setSelectedQualityInspectorOptions] = useState([]);
  //接收表格中被选中的行的id值
  const [selectedRowIDs, setSelectedRowIDs] = useState([]);

  //处理任务设置按钮
  const showBatchPassModal = () => {
    //接收过来的选中行的数组不为空
    if (selectedRowKeys !== undefined && selectedRowKeys.length > 0){
      setIsBatchPassModalOpen(true);
      //每次打开对话框必须要重新获取，为保证selectedRowIDs.length正常，否则出现逻辑错误
      const selectedIDArray = selectedRowKeys.map(item => item.audioID);
      setSelectedRowIDs(selectedIDArray);
      console.log('我接收到的选中行的数组：',selectedRowKeys);
    }else{
      messageApi.open({
        type: 'warning',
        content: '请先选中要处理的音频',
      });
    }
  };

  const handleBatchPassOk = () => {
    setIsBatchPassModalOpen(false);
    messageApi.open({
      type: 'success',
      content: '音频已通过',
      className: 'custom-class',
      style: {
        marginTop: '10vh',
      },
    });
   //清空已选的ID
   setSelectedRowIDs([]);
   //清空已选项样式
   handleClearSelection();
  };

  const handleBatchPassCancel = () => {
    setIsBatchPassModalOpen(false);
  };
  // //处理任务设置里的选项
  // const onChange = (e: RadioChangeEvent) => {
  //   console.log('radio checked', e.target.value);
  //   setValue(e.target.value);
  // };

  //处理批量不通过按钮
  const showBatchNoPassModal = () => {
    //接收过来的选中行的数组不为空
    if (selectedRowKeys !== undefined && selectedRowKeys.length > 0){
      setIsBatchNoPassModalOpen(true);
      //每次打开对话框必须要重新获取，为保证selectedRowIDs.length正常，否则出现逻辑错误
      const selectedIDArray = selectedRowKeys.map(item => item.audioID);
      setSelectedRowIDs(selectedIDArray);
      console.log('我接收到的选中行的数组：',selectedRowKeys);
    }else{
      messageApi.open({
        type: 'warning',
        content: '请先选中要处理的音频',
      });
    }
  };
  const handleBatchNoPassOk = () => {
    setIsBatchNoPassModalOpen(false);
    messageApi.open({
      type: 'error',
      content: '已拒绝音频通过',
      className: 'custom-class',
      style: {
        marginTop: '10vh',
      },
    });
    //清空已选的ID
    setSelectedRowIDs([]);
    //清空已选项样式
    handleClearSelection();
  };
  const handleBatchNoPassCancel = () => {
    setIsBatchNoPassModalOpen(false);
  };

  // //处理分配人员按钮里的多选框选中后的数据
  // const handleSelectedAnnotatorChange = (value: string[]) => {
  //     setSelectedAnnotatorOptions(value);
  //     console.log('我是选中的数据selectedAnnotatorOptions：',selectedAnnotatorOptions);//注意这里selectedOptions慢半拍，比value少一个
  //     console.log(`selected ${value}`);//这里输出的是value实时的
  // };
  // const handleSelectedQualityChange= (value: string[]) => {
  //     setSelectedQualityInspectorOptions(value);
  //     console.log('我是选中的数据selectedQualityOptions：',selectedQualityInspectorOptions);//注意这里selectedOptions慢半拍，比value少一个
  //     console.log(`selected ${value}`);//这里输出的value是实时的
  // };

  //处理分配团队对话框里的多选框
  const teamsOptions: SelectProps['options'] = [];
  //构造数据
  for (let i = 1; i < 6; i++) {
    teamsOptions.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }
  //处理分配团队按钮
  const showAssignTeamsModal = () => {
    //接收过来的选中行的数组不为空
    if (selectedRowKeys !== undefined && selectedRowKeys.length > 0){
      setIsAssignTeamsModalOpen(true);
      //每次打开对话框必须要重新获取，为保证selectedRowIDs.length正常，否则出现逻辑错误
      const selectedIDArray = selectedRowKeys.map(item => item.taskID);
      setSelectedRowIDs(selectedIDArray);
      console.log('我接收到的选中行的数组：',selectedRowKeys);
    }else{
      messageApi.open({
        type: 'warning',
        content: '请先选中要处理的任务',
      });
    }
  };
  //处理分配团队按钮确认后
  const handleAssignTeamsOk = () => {
    setIsAssignTeamsModalOpen(false);
    messageApi.open({
        type: 'success',
        content: '分配成功',
        className: 'custom-class',
        style: {
          marginTop: '10vh',
        },
    });
    //清空已选的ID
    setSelectedRowIDs([]);
    //清空已选项样式
    handleClearSelection();
  };
  //关闭分配团队对话框后进行处理
  const handleAssignTeamsCancel = () => {
    setIsAssignTeamsModalOpen(false);
  };
  // 处理分配团队选中后的数据
  const handleSelectedAssignTeamsChange = (value: string[]) => {
    setSelectedAssignTeams(value);
    console.log(`我是分配团队选中的值： ${value}`);
  };

  const navigator = useNavigate(); //必须写在外面，不能写函数里
  //跳转到新增任务页面
  const goAddNewTask = (projectID:string) => {
    //  history.push('./batchOperationRecords');
    console.log("我是OperateProjectTaskListButton接收的项目编号：",projectID);
    navigator('/projectManagement/homePage/projectTaskList/addNewTask',{
          state: {
             //需要传的参数
              projectID: projectID,
          }
    });
  }


  //处理上传MP3文件
  const { Dragger } = Upload;  //从Upload模块中导入Dragger组件，用于显示拖拽上传按钮

  const props: UploadProps = {
    name: 'file',  //指定上传的文件字段名
    multiple: true,
    // maxCount:1,
    method: 'post',
    // action: 'http://localhost:8081/api/upload', //上传的地址
    action: (file) => {
      return new Promise((resolve, reject) => {
          // 在这里执行你的异步操作，例如上传文件到服务器
          console.log('我是请求文件：',file);
          getAudioData(file).then(response => {
            // 如果上传成功，调用 resolve() 方法
            resolve("");
          }).catch(error => {
              // 如果上传失败，调用 reject() 方法
              reject(error);
          });
     })
    },
    beforeUpload: (file) => {
      // const isMp3 = file.type === "audio/mpeg";
      //筛选上传文件类型
      const isMp3 = file.type === "application/pdf";
      if (!isMp3) {
        message.error(`${file.name} is not a png file`);
      }
      // console.log('我是上传的文件2：',file,fileList,isMp3);
      return isMp3 || Upload.LIST_IGNORE;
    },

    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') { //上传未开始或已完成
        console.log('我是上传的文件：',info.file,info.file.type, info.fileList);
      }
      if (status === 'done') { //上传成功完成
        message.success(`${info.file.name}文件上传成功.`);
      } else if (status === 'error') { //上传失败
        message.error(`${info.file.name}文件上传失败.`);

      }
    },
    onDrop(e) { //文件被拖入上传区域时执行的回调功能
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  //处理新建任务按钮弹出框
  const showAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  }
  //新建任务弹出框点击确定后
  const handleAddTaskOk = () => {
    setIsAddTaskModalOpen(false);
  }
  //新建任务弹出框关闭后
  const handleAddTaskCancel = () => {
    setIsAddTaskModalOpen(false);
  }

  return <>
     {contextHolder}{/*这个是全局提示，只需写这一个就够了，它会根据 messageApi.open()方法自动更新，写在任何位置都行*/}
     <Row wrap={false} className={styles.RowStyle} style={{overflow: 'hidden'}}>
        <Col span={8}>
            <Button type="primary" onClick={()=>goAddNewTask(projectID)} size='middle' className={styles.batchPassButton}>
                新建任务
            </Button>
            <Modal title="新建任务" open={isAddTaskModalOpen} onOk={handleAddTaskOk} onCancel={handleAddTaskCancel}>
              <Dragger {...props} >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击这里开始上传音频</p>
                <p className="ant-upload-hint">
                     支持单次或批量上传
                </p>
              </Dragger>
            </Modal>
            <Button type="primary" onClick={showAssignTeamsModal} size='middle' className={styles.batchPassButton}>
                分配团队
            </Button>
            <Modal title="分配团队" open={isAssignTeamsModalOpen} onOk={handleAssignTeamsOk} onCancel={handleAssignTeamsCancel}>
              <div style={{marginBottom:5}}>请选择团队：</div>
              <Select
                  allowClear
                  style={{ width: '80%', marginBottom:15}}
                  placeholder="请选择团队"
                  onChange={handleSelectedAssignTeamsChange}
                  options={teamsOptions}
                  value={selectedAssignTeams}
              />
            </Modal>
            <Button type="primary" danger size='middle' onClick={showBatchNoPassModal}>
                删除
            </Button>
            <Modal title="批量不通过" open={isBatchNoPassModalOpen} onOk={handleBatchNoPassOk} onCancel={handleBatchNoPassCancel}>
              <div className={styles.passTaskFont}>
                 确定删除这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>
        </Col>
        {/* <Col span={8}>
            <Button type="primary" onClick={showBatchPassModal} size='middle' className={styles.batchPassButton}>
                批量通过
            </Button>
            <Modal title="批量通过" open={isBatchPassModalOpen} onOk={handleBatchPassOk} onCancel={handleBatchPassCancel}>
              <div className={styles.passTaskFont}>
                 确定通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>

            <Button type="primary" danger size='middle' onClick={showBatchNoPassModal}>
                批量不通过
            </Button>
            <Modal title="批量不通过" open={isBatchNoPassModalOpen} onOk={handleBatchNoPassOk} onCancel={handleBatchNoPassCancel}>
              <div className={styles.passTaskFont}>
                 确定拒绝通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>
        </Col>
        <Col span={8}>
            <Button type="primary" onClick={showBatchPassModal} size='middle' className={styles.batchPassButton}>
                批量通过
            </Button>
            <Modal title="批量通过" open={isBatchPassModalOpen} onOk={handleBatchPassOk} onCancel={handleBatchPassCancel}>
              <div className={styles.passTaskFont}>
                 确定通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>

            <Button type="primary" danger size='middle' onClick={showBatchNoPassModal}>
                批量不通过
            </Button>
            <Modal title="批量不通过" open={isBatchNoPassModalOpen} onOk={handleBatchNoPassOk} onCancel={handleBatchNoPassCancel}>
              <div className={styles.passTaskFont}>
                 确定拒绝通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>
        </Col>
        <Col span={8}>
            <Button type="primary" onClick={showBatchPassModal} size='middle' className={styles.batchPassButton}>
                批量通过
            </Button>
            <Modal title="批量通过" open={isBatchPassModalOpen} onOk={handleBatchPassOk} onCancel={handleBatchPassCancel}>
              <div className={styles.passTaskFont}>
                 确定通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>

            <Button type="primary" danger size='middle' onClick={showBatchNoPassModal}>
                批量不通过
            </Button>
            <Modal title="批量不通过" open={isBatchNoPassModalOpen} onOk={handleBatchNoPassOk} onCancel={handleBatchNoPassCancel}>
              <div className={styles.passTaskFont}>
                 确定拒绝通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>
        </Col>
        <Col span={8} style={{marginLeft:'710px'}}>
            <Button onClick={goBatchOperationRecords} size='middle' type="primary">
                批量操作记录
            </Button>
        </Col> */}
     </Row>
  </>
}


export default OperateProjectTaskListButton;



