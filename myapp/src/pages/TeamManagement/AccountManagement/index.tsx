
import { PageContainer } from '@ant-design/pro-layout';
import React from "react";
import { ProCard } from '@ant-design/pro-components';
import TeamInformation from "./components/TeamInformation";
import JoinTeam from './components/JoinTeam';
import Test from "./components/EnrollmentApproval";

const AccountManagement = () =>{

  return <PageContainer>
    <ProCard
      tabs={{
        type: 'card',
      }}
    >
      <ProCard.TabPane key="tab1" tab="团队信息">
        <TeamInformation></TeamInformation>
      </ProCard.TabPane>

      <ProCard.TabPane key="tab2" tab="团队人员">
        <JoinTeam></JoinTeam>
      </ProCard.TabPane>

      <ProCard.TabPane key="tab3" tab="入团审批">
        <Test></Test>
      </ProCard.TabPane>
    </ProCard>
  </PageContainer>
}


export default AccountManagement;
