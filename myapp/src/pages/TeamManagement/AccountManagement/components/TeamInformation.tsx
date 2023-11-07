import { ProDescriptions } from '@ant-design/pro-components';
import { Input} from 'antd';
import { truncate } from 'lodash';
import { useRef } from 'react';

const TeamInformation= () => {
  const actionRef = useRef();
  return (
    <ProDescriptions

      actionRef={actionRef}
      // bordered
      formProps={{
        onValuesChange: (e, f) => console.log(f),
      }}
      title="团队信息"
      request={async () => {
        return Promise.resolve({
          success: true,
          data: {
            id:1,
            teamName: '北京航空航天大学',
            creator: '团队管理员1',
            membersNumber: 13,
            serviceType: 'ASR',
            creationTime: '20230907095342',
            teamIntroduction: '优秀的团队......................',
          },
        });
      }}
      editable={{}}
      columns={[
        {
          title: '团队ID',
          key: 'id',
          dataIndex: 'id',
          editable: false,
        },
        {
          title: '团队名称',
          key: 'teamName',
          dataIndex: 'teamName', //datIndex要和上边的data:{}里边的对应，这样才能显示到页面上
          copyable: true,
          ellipsis: true, //当文本内容超过显示区域时，可以使用省略号（...）来表示被截断的内容
        },
         {
          title: '创建人',
          key: 'creator',
          dataIndex: 'creator',
          ellipsis: true,
          editable: false,
        },
        {
          title: '团队人数',
          key: 'membersNumber',
          dataIndex: 'membersNumber',
          ellipsis: true,
          editable: false,
        },
        {
          title: '业务类型',
          key: 'serviceType',
          dataIndex: 'serviceType',
          ellipsis: true,
          editable: false,
        },
        {
          title: '团队创建时间',
          key: 'creationTime',
          dataIndex: 'creationTime',
          valueType: 'dateTime',
          editable: false,
        },
        {
          title: '团队介绍',
          key: 'teamIntroduction',
          dataIndex: 'teamIntroduction',
          copyable: true,
          ellipsis: true,
        },

      ]}
    >

    </ProDescriptions>
  );
};

export default TeamInformation;
