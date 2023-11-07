import React, { useState } from 'react';
import { Table, Input, Button } from 'antd';

function transferToCN(toDate) {
  const options = {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
 };
 return toDate.toLocaleString('zh-CN', options);
}

const DataSource = [
  { key: '1', account: 'tuangaun123', name: '作业员1', telephone: '12554856557', applicationTime: transferToCN(new Date())},
  { key: '2', account: 'operator123', name: '作业员2', telephone: '12554856557', applicationTime: transferToCN(new Date())},
];

const columns = [
  { title: '账号', dataIndex: 'account', key: 'account', },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '手机号', dataIndex: 'telephone', key: 'telephone' },
  { title: '申请入团时间', dataIndex: 'applicationTime', key: 'applicationTime' },
  { title:'操作', dataIndex: 'operate', key: 'operate',
    render: () =>(<><Button type="primary">接收申请</Button> <Button type="primary" danger>拒绝申请</Button> </>)}
];

const EnrollmentApproval = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredData = searchText
    ? DataSource.filter((item) =>
        item.name.includes(searchText) || item.account.includes(searchText) || item.telephone.includes(searchText)
      )
    : DataSource;

  return (
    <div>
      <Input
        placeholder="请输入姓名/账号/电话号码"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: '20%', marginRight:10, marginLeft:885, marginBottom:10}}
      />
      <Button type="primary" onClick={() => console.log(filteredData)}>
        查询
      </Button>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );

};

export default EnrollmentApproval;
