import React from 'react';
import {Table,Card,Row,Col,Button,Pagination,Space} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
// import {useRequest} from 'umi';

const Index = () => {
  // const initData = useRequest('http://localhost:8000/public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd')
  // console.log(initData)
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },

    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      phone: '12346',
    },

  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone',
    },
  ];

  const searchLayout = () => {};
  const beforeTableLayout = () => {
    return <Row>
      <Col xs={24} sm={12}>...</Col>
      <Col xs={24} sm={12} className={styles.tableToolbar}>
        <Space>{/*Space在组件之间加个间距，否则两个按钮会紧紧挨着*/}
          <Button type="primary">Add</Button>
          <Button type="primary">Add</Button>
        </Space>

      </Col>
    </Row>
  };

  const afterTableLayout = () => {
    return <Row>
      <Col xs={24} sm={12}>...</Col>
      <Col xs={24} sm={12} className={styles.tableToolbar}>
        {/* ||1和||0是默认值，万一没有数据可不行 */}
        <Pagination
          className={styles.tableToolbar}
          current={5 || 1} total={10 || 0}
          pageSize={5 || 5}
          showSizeChanger //显示 ：5条/页
          showQuickJumper //显示：跳至....页
          showTotal={(total)=>{ return `总共${total}条数据`}}
       ></Pagination>
      </Col>
    </Row>
  }


  return <PageContainer>
    {searchLayout()}
    <Card>
      {beforeTableLayout()}
      <Table dataSource={dataSource} columns={columns} pagination={false}/> {/*pagination={false}是取消表格自带的分页*/}
      {afterTableLayout()}
    </Card>
  </PageContainer>

}

export default Index;
