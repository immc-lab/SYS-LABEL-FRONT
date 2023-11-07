import { ProDescriptions} from "@ant-design/pro-components";
import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from "react";
import { Button, Card, Image, Input, message, Divider, Tag} from 'antd'
import { useState } from 'react';
import { Modal } from 'antd';

const PersonalCenter = () =>{

  //处理描述列表
  const actionRef = useRef();

  //处理修改密码弹出框
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   //处理加入新团队弹出框
   const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false);
  //获得修改密码输入框里的密码
  const [updatePassword, setUpdatePassword] = useState('');
  //处理显示到页面上的密码值
  const [showPassword, setShowPassword] = useState('ant.design');
  //处理密码小于6位的提示出现,默认不报错
  const [errorStatus, setErrorStatus] = useState(false);
  //处理密码小于6位的提示出现时输入框的外框颜色变化
  const [errorBorderStatus, setBorderStatus] = useState(false);
  //处理修改密码成功后的全局提示
  const [passwordMessageApi, passwordContextHolder] = message.useMessage();
  //处理加入新团队名称
  const [joinTeamName, setJoinTeamName] = useState('');
  //处理加入新团队对话框团队名称为空的全局提示
  // const [joinTeamErrorMessageApi, jonTeamErrorContextHolder] = message.useMessage();
  //处理加入新团队的全局提示
  const [joinTeamMessageApi, joinTeamContexHolder] = message.useMessage();

  //打开修改密码对话框
  const showPasswordModal = () => {
    setUpdatePassword('');
    setIsPasswordModalOpen(true);
  };
  //修改密码对话框点击确定后
  const handlePasswordOk = () => {
    if (updatePassword.length >= 6) {
      setIsPasswordModalOpen(false);
      setBorderStatus(false);
      setErrorStatus(false);
      //更新显示到页面上的密码，目前没作用
      setShowPassword(updatePassword);
      passwordMessageApi.open({
        type: 'success',
        content: '密码修改成功',
      });
    }else{
      setBorderStatus(true);
      setErrorStatus(true);
      console.log('出错了')
    }
  };
  //修改密码对话框点击取消
  const handlePasswordCancel = () => {
    setIsPasswordModalOpen(false);
    //密码框清空
    setUpdatePassword('');
    setBorderStatus(false);
    setErrorStatus(false);
  };
  //输入框改变就实时更新
  const onChangeUpdatePassword = (e) => {
    setUpdatePassword(e.target.value);
  }


  //打开加入新团队对话框
  const showJoinTeamModal = () => {
    setIsJoinTeamModalOpen(true);
  };
  //修改加入新团队对话框点击确定后
  const handleJoinTeamOk = () => {
    if (joinTeamName !== '') {
      setIsJoinTeamModalOpen(false);
      setJoinTeamName('');
      joinTeamMessageApi.open({
        type: 'success',
        content: '申请成功，等待审核中',
      });
    }else{
      joinTeamMessageApi.open({
        type: 'warning',
        content: '请输入团队名称',
      });
      console.log('出错了')
    }
  };
  //加入新团队对话框点击取消
  const handleJoinTeamCancel = () => {
    setIsJoinTeamModalOpen(false);
    //输入框清空
    setJoinTeamName('');
  };
  //输入框改变就实时更新
  const onChangeJoinTeamName = (e) => {
    setJoinTeamName(e.target.value);
  }

  return <PageContainer>

       {passwordContextHolder}
       {joinTeamContexHolder}
      <Card>
        <div >
            <Tag bordered={false} color="#3b5999" style={{fontSize:16, marginBottom:25, padding:10, borderRadius:50}}>
            个人信息
            </Tag>
        </div>
        <Image
            width={100}
            style={{borderRadius:80, marginBottom:15}}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />,
      <ProDescriptions
        column={4}
        actionRef={actionRef}
        // bordered
        formProps={{
          onValuesChange: (e, f) => console.log(f),
        }}

        request={async () => {
          return Promise.resolve({
            success: true,
            data: {
              account:'tuangaun1',
              name: '团队管理员1',
              role: '团队管理员1',
              userID: 13,
              creationTime: '20230907095342',
              personalIntroduction: '优秀的团队......................',
            },
          });
        }}
        editable={{}}
        columns={[
          {
            title: '账号',
            key: 'account',
            dataIndex: 'account',
            editable: false,
          },
          {
            title: '姓名',
            key: 'name',
            dataIndex: 'name', //datIndex要和上边的data:{}里边的对应，这样才能显示到页面上
            copyable: true,
            ellipsis: true, //当文本内容超过显示区域时，可以使用省略号（...）来表示被截断的内容
          },
          {
            title: '角色',
            key: 'role',
            dataIndex: 'role',
            ellipsis: true,
            editable: false,
          },
          {
            title: '用户ID',
            key: 'userID',
            dataIndex: 'userID',
            ellipsis: true,
            editable: false,
          },

          {
            title: '创建时间',
            key: 'creationTime',
            dataIndex: 'creationTime',
            valueType: 'dateTime',
            editable: false,
          },
          {
            title: '个人介绍',
            key: 'personalIntroduction',
            dataIndex: 'personalIntroduction',
            copyable: true,
            ellipsis: true,
          },
      ]}
      >
      </ProDescriptions>
      <Divider></Divider>
      <div style={{marginBottom:30}}>
          <div>
            <Tag bordered={false} color="#cd201f" style={{fontSize:16, marginBottom:20,padding:10, borderRadius:50}}>
            账号安全
            </Tag>
          </div>
          我的密码：<Input.Password bordered={false} style={{width:100}} value={showPassword} disabled={false}></Input.Password>
          <Button type="primary" size="small" onClick={showPasswordModal}>修改密码</Button>
      </div>
      <Divider></Divider>
      <div>
         <div >
            <Tag bordered={false} color="#DA7C1A" style={{fontSize:16, marginBottom:20, padding:10, borderRadius:50}}>
              我的团队
            </Tag>
         </div>
         <p style={{marginBottom:15}}>您还没有加入团队，暂无团队信息</p>
         <Button type="primary" onClick={showJoinTeamModal}>+ 加入新团队</Button>
      </div>
      </Card>

      <Modal title="修改密码" open={isPasswordModalOpen} onOk={handlePasswordOk} onCancel={handlePasswordCancel}>
        <p style={{fontWeight:185, fontSize:15, marginBottom:20,marginTop:30,marginLeft:70}}>请输入新密码：</p>
        <Input placeholder="请输入新密码" style={{width:300,marginLeft:70,marginBottom:5}}
        status={errorBorderStatus ? 'error' : 'undefined'}  onChange={onChangeUpdatePassword} value={updatePassword}/>
        {errorStatus && <div style={{color:'red', marginLeft:80,marginBottom:20}}>密码长度不能小于6位</div>}
      </Modal>
      <Modal title="加入新团队" open={isJoinTeamModalOpen} onOk={handleJoinTeamOk} onCancel={handleJoinTeamCancel}>
        <p style={{fontWeight:185, fontSize:15, marginBottom:15,marginTop:30,marginLeft:70}}>请输入新团队名称：</p>
        <Input placeholder="请输入新团队名称" style={{width:300,marginLeft:70,marginBottom:20}}
        onChange={ onChangeJoinTeamName} value={joinTeamName}/>
      </Modal>
  </PageContainer>

}


export default PersonalCenter;
