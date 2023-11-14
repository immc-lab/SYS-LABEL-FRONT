import { Button, DatePicker, Form, Input, Modal, Radio, Select, Space, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { request } from '@umijs/max';

const AddProjectModal = () =>{

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


    //处理新建项目按钮弹出框
    const showAddProjectModal = () => {
      form.resetFields();
      setOpen(true);
    };
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
    const onAddProjectFinish = (values: any) => {
      // const endTime = values.startingAndEndingTime
      console.log('Received values of form: ', JSON.stringify(values));
      const startTime = moment(values.startingAndEndingTime[0]).format('YYYY-MM-DD HH:mm:ss').toString();
      const endTime = moment(values.startingAndEndingTime[1]).format('YYYY-MM-DD HH:mm:ss').toString();
      console.log(startTime,endTime); // 输出：2023-11-14 19:30:49
      const reqJsonObject = {
        "projectName": values.projectName,
        "startTime": startTime,
        "endTime": endTime,
        "projectType": values.projectType,
        "projectArea": values.projectArea,
      }
      console.log("获取Json对象：",JSON.stringify(reqJsonObject));
      request('/api/project/core/saveProjectData', {
        method: 'POST',
        data: JSON.stringify(reqJsonObject),
      }).then(response => {
        if (response.status ==='0') {
          messageApi.success('创建成功');
        }
        // return response.json();
      }).catch(error => {
        // 在这里处理错误情况
        console.error('There was a problem with the fetch operation:', error);
      });

      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        // messageApi.success('创建成功');
      }, 1500);
    };
    //提交失败后进行处理
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    //点击取消创建回调
    const handleAddProjectCancel = () => {
      console.log('Clicked cancel button');
      form.resetFields();
      setOpen(false);
    };





  return (
    <>
    {contextHolder}
    <Button type='primary' style={{marginBottom:'10px'}} onClick={showAddProjectModal}>新建项目</Button>
     <Modal
        title="新建项目"
        open={open}
        // onOk={handleAddProjectOk}
        confirmLoading={confirmLoading}
        onCancel={handleAddProjectCancel}
        width={700}
        footer={[]} //取消默认按钮
      >
        <br></br>
         <Form
            form={form}
            // name="register"
            onFinish={onAddProjectFinish}
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
            <Radio value="testing">测试</Radio>
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
                <Button type="primary" danger onClick={handleAddProjectCancel}>
                  取消创建
                </Button>
            </Form.Item>
            <Form.Item style={{marginRight:'40px'}}>
                <Button type="primary" htmlType="submit" loading={confirmLoading}>
                  立即创建
                </Button>
            </Form.Item>
        </Space>
      </Form>
    </Modal>
    </>
  );
}

export default AddProjectModal;
