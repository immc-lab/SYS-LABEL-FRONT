import { Button, DatePicker, Form, Input, Modal, Radio, Select, Space, message } from 'antd';
import moment from 'moment';
// import moment from 'moment';
import React, {useEffect, useState } from 'react';
// import { request } from '@umijs/max';



const  EditProjectModal = ({editingRecord, onUpdate, setIsClearEditingRecord}) =>{

    //处理对话框弹出
    const [open, setOpen] = useState(false);
    //确定按钮的动画显示
    const [confirmLoading, setConfirmLoading] = useState(false);
    //处理表单
    const [form] = Form.useForm();
    //处理起止时间选择器
    const { RangePicker } = DatePicker;
    //处理下拉框
    const { Option } = Select;
    //全局提示信息
    const [messageApi, contextHolder] = message.useMessage();

    // editingRecord发生变化，意味着点击了编辑按钮，对话框应该打开
    useEffect(() => {
      if (editingRecord !==null) {
      console.log("接收到要修改的数据；",editingRecord)
      // form.setFieldsValue(editingRecord);
      // form.setFieldValue("projectName",editingRecord.projectName);
      const values = {
        projectName: editingRecord.projectName,
        startingAndEndingTime: [moment(editingRecord.startTime), moment(editingRecord.endTime)],
        projectType: editingRecord.projectType,
        projectArea: editingRecord.projectArea,
      };
      form.setFieldsValue(values);
      // form.setFieldsValue({projectName: 'dfd'});
      // form.setFieldValue("projectType",form.getFieldValue("projectType"));
      // form.setFieldValue("projectArea",form.getFieldValue("projectArea"));
      setOpen(true);
    }
    }, [editingRecord]);

    //监听ipen，只要open由true变为false，就意味着对话框关闭，那么就开始清空editingRecord
    useEffect(()=>{
        if (open ===false){
          setIsClearEditingRecord(true);
        }
    },[open]);
    // if (isEditModalOpen === true) {
    //    setOpen(true);
    // }

    //处理编辑按钮弹出框
    // const showEditProjectModal = () => {
    //   setOpen(true);
    //   form.resetFields(editingRecord);
    // };
    //点击立即创建回调
    // const handleAddProjectOk = () => {
    //   //获取每个表单项的提交信息，
    //   const errors = form.getFieldsError();
    //   for (const error of errors) {
    //     // 在这里处理每个错误对象
    //     console.log(error);
    //   }
    //       setConfirmLoading(true);
    //       setTimeout(() => {
    //         setOpen(false);
    //         setConfirmLoading(false);
    //       }, 2000);
    //       console.log('我是表单的值',form.getFieldValue('password'),form.getFieldsValue(),  form.getFieldsError());
    // };

    //提交成功后进行处理
    const onEditProjectFinish = (values: any) => {
      console.log("我是修改后的值onEditProjectFinish：",values);
      //传递给首页组件
      onUpdate(values);
      //设置提交状态
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        // messageApi.success('创建成功');
      }, 1500);
      // const endTime = values.startingAndEndingTime
      // console.log('Received values of form: ', JSON.stringify(values));
      // const startTime = moment(values.startingAndEndingTime[0]).format('YYYY-MM-DD HH:mm:ss').toString();
      // const endTime = moment(values.startingAndEndingTime[1]).format('YYYY-MM-DD HH:mm:ss').toString();
      // console.log(startTime,endTime); // 输出：2023-11-14 19:30:49
      // const reqJsonObject = {
      //   "projectName": values.projectName,
      //   "startTime": startTime,
      //   "endTime": endTime,
      //   "projectType": values.projectType,
      //   "projectArea": values.projectArea,
      // }
      // // console.log("获取Json对象：",JSON.stringify(reqJsonObject));
      // request('/api/project/core/editProjectData', {
      //   method: 'POST',
      //   data: reqJsonObject,
      // }).then(response => {
      //   if (response.status ==='0') {
      //     messageApi.success('修改成功');
      //   }
      //   // return response.json();
      // }).catch(error => {
      //   // 在这里处理错误情况
      //   messageApi.error("出错了");
      //   console.error('There was a problem with the fetch operation:', error);
      // });

      //得到项目列表
      // request('/api/core/getProjectList', {
      //   method: 'POST',
      //   // data: reqJsonObject,
      // }).then(response => {
      //   if (response.status ==='0') {
      //     messageApi.success('创建成功');
      //   }
      //   // return response.json();
      // }).catch(error => {
      //   // 在这里处理错误情况
      //   console.error('There was a problem with the fetch operation:', error);
      // });
    };
    //提交失败后进行处理
    const onFinishFailed = (errorInfo: any) => {
      // messageApi.error("修改失败");
      // setOpen(false);
      console.log('Failed:', errorInfo);
    };
    //点击取消创建回调
    const handleEditProjectCancel = () => {
      console.log('Clicked cancel button');
      form.resetFields();
      setOpen(false);
    };



  return (
    <>
    {contextHolder}
    {/* <Button type='primary' style={{marginBottom:'10px'}} onClick={showAddProjectModal}>新建项目</Button> */}
     <Modal
        title="修改项目"
        open={open}
        // onOk={handleAddProjectOk}
        confirmLoading={confirmLoading}
        onCancel={handleEditProjectCancel}
        width={700}
        footer={[]} //取消默认按钮
      >
        <br></br>
         <Form
            form={form}
            name="register"
            onFinish={onEditProjectFinish}
            style={{ maxWidth: 600, marginLeft: '40px', marginRight: '40px'}}
            scrollToFirstError
            onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="projectName"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '请输入项目名称',
            },
          ]}
        >
          <Input />
        </Form.Item>


        <Form.Item
          name="startingAndEndingTime"
          label="起止时间"
          rules={[
            {
              required: true,
              message: '请选择项目起止时间'
            },
          ]}>
             <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>

        <Form.Item
          name="projectType"
          label="项目类型"
          rules={[
            {
              required: true,
              message: '请选择项目类型',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="formal">正式</Radio>
            <Radio value="test">测试</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="projectArea"
          label="项目地区"
          rules={[{ required: true, message: '请选择项目地区' }]}
        >
          <Select placeholder="请选择项目地区">
            <Option value="beiJing">北京</Option>
            <Option value="changChun">长春</Option>
            <Option value="neiMengGu">内蒙古</Option>
          </Select>
        </Form.Item>

        <Space style={{marginLeft:'370px', marginTop:'10px'}}>
            <Form.Item style={{marginRight:'20px'}}>
                <Button type="primary" danger onClick={handleEditProjectCancel}>
                  取消修改
                </Button>
            </Form.Item>
            <Form.Item style={{marginRight:'40px'}}>
                <Button type="primary" htmlType="submit" loading={confirmLoading}>
                  确定修改
                </Button>
            </Form.Item>
        </Space>
      </Form>
    </Modal>
    </>
  );
}

export default EditProjectModal;
