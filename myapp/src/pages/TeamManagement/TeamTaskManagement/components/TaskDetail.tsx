import { Breadcrumb, Button, Card, Col, ConfigProvider, Divider, Modal, Pagination, Row, Select, SelectProps, Space, Table, message, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import styles from './TeamTaskList.css';
import OperateTableButton from './OperateTableButton';
import SearchTask from './SearchTask';
import { Link, useLocation } from '@umijs/max';
import { Tabs } from 'antd';
import router from '../../../../../config/routes';
import TeamTaskList from './../../AccountManagement/components/TeamTaskList';
import SearchTaskDetail from './SearchTaskDetail';

interface DataType {
  audioID: string;
  audioName: string;
  audioState: string;
  lastStoreTime: string;
  originalDuration: string;
  targetDuration: string;
  audioAnnotator: string;
  audioQualityInspector: string;
}

const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    audioID: i.toString(),
    audioName: `Edward King ${i}`,
    audioState: '未领取',
    lastStoreTime: new Date().toDateString(),
    originalDuration: '0.0',
    targetDuration: '0',
    audioAnnotator: '',
    audioQualityInspector: '',
  });
}


//默认每页初始显示的条数
const EveryPageData = 10

const TaskDetail: React.FC = ({searchText}) => {
  //处理表格选中项
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //初始显示数据,10是初始显示的每页的条数，默认为EveryPageData
  const initalDataIndex = Math.min(EveryPageData, data.length);
  //currentData是显示到页面的实时数据，而curentSearchData是基于searchText实时搜素出来的总的数据，注意区分
  //也就是说curentSearchData是包含currentData的，curentSearchData存储总的查询出来的数据，currentData是从curentSearchData挑出来数据进行渲染
  const [currentData, setCurrentData] = React.useState(data.slice(0,initalDataIndex));
  const [currentSearchData, setCurrentSearchData] = React.useState(data.slice(0,data.length));
  //控制分配人员对话框的弹出
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  const [selectedAnnotatorOptions, setSelectedAnnotatorOptions] = useState([]);
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  const [selectedQualityInspectorOptions, setSelectedQualityInspectorOptions] = useState([]);

  //接收传过来的searchText参数，只要输入框一变，就立马执行setCurrentData()
  // const [newsearchText, setNewsearchText] = useState('');
 // console.log('我是currentData的length',currentData.length)

  //处理表格选中项
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys); //返回的是数组，数组里是表格中选中的那一行的下标Array [ 0, 1 .....]
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

   //实现分页函数
   function handlePageChange(page,pageSize) {
     // 根据用户点击的页码更新当前页码，并重新渲染数据列表和 Pagination 组件
     // 用于存储当前页的数据

     // 计算当前页码对应的数据范围

     const startIndex = (page - 1) * pageSize;
    //  const endIndex = Math.min(startIndex + pageSize, currentData.length);
     const endIndex = Math.min(startIndex + pageSize, currentSearchData.length);
     let newSelectedRowKeys = [];
     // 从数据源中获取当前页的数据
    //  newSelectedRowKeys = currentData.slice(startIndex, endIndex);
    //  setCurrentData(newSelectedRowKeys)
    newSelectedRowKeys = currentSearchData.slice(startIndex,endIndex);
    setCurrentData(newSelectedRowKeys);
    console.log('我是handlePageChange里的page和pageSize和currentData和currentSearchData',page,pageSize,currentSearchData.length,currentSearchData.length)
   }

   //实现输入框查询
   const handleSearch = (searchText) => {
    const filtered = data.filter((item) =>
        // if (item.taskName !=='' && item.taskName !==''){
        //   item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
        // }
        // item.taskName.includes(searchText[0])
        item.audioName.includes(searchText[0]) && item.audioID.toString().includes(searchText[1]) && item.audioState.includes(searchText[2])
        // item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
      );
      // item.taskName.includes(searchText) || item.age.toString().includes(text)

    console.log('我正在搜索',searchText);

    //必须在这里先算一下initalDataIndex
    const initalDataIndex = Math.min(EveryPageData, filtered.length);
    console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered);
    setCurrentData(filtered.slice(0,initalDataIndex)); //这一句是为了显示基于searchText实时搜索时显示到页面的那部分数据。
    // 用filtered，用currentSearchData好像没用
    setCurrentSearchData(filtered); //这句是为了更新基于当前的serachText所搜索到的总的数据，和上边的数据不一样，这个是总数据。
    console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered)
  };

  //实现点击重置按钮，就把原来的数据重新渲染回来
  const afterReset = () => {
    //为防止出错，先按这样的逻辑写，直接强行全部回归原始数据
    const initalDataIndex = Math.min(EveryPageData, data.length);

    setCurrentData(data.slice(0,initalDataIndex));
    setCurrentSearchData(data);
  }

  //处理分配人员按钮
  const showAllocationModal = () => {
      setIsAllocationModalOpen(true);
  };
  //处理分配人员按钮里的多选框选中后的数据
  const handleSelectedAnnotatorChange = (value: string[]) => {
    setSelectedAnnotatorOptions(value);
    console.log('我是选中的数据selectedAnnotatorOptions：',selectedAnnotatorOptions);//注意这里selectedOptions慢半拍，比value少一个
    console.log(`selected ${value}`);//这里输出的是value实时的
  };
  const handleSelectedQualityChange= (value: string[]) => {
    setSelectedQualityInspectorOptions(value);
    console.log('我是选中的数据selectedQualityOptions：',selectedQualityInspectorOptions);//注意这里selectedOptions慢半拍，比value少一个
    console.log(`selected ${value}`);//这里输出的value是实时的
  };
  // useEffect可解决这个慢半拍问题，本质是异步问题，如果有必须等selectedQualityInspectorOptions更新到最新值才能进行下一步的，可以用这个
  // useEffect(() => {
  //   console.log('我是用useEffect选中的数据selectedQualityOptions：', selectedQualityInspectorOptions);//输出的是实时的
  // }, [selectedQualityInspectorOptions]); // 当selectedQualityInspectorOptions改变时，这个useEffect就会被调用
  // useEffect(() => {
  //   console.log('我是用useEffect选中的数据selectedAnnotatorOptions：', selectedAnnotatorOptions);//输出的是实时的
  // }, [selectedAnnotatorOptions]); // 当selectedQualityInspectorOptions改变时，这个useEffect就会被调用

  const handleAllocationOk = () => {
    setIsAllocationModalOpen(false);
    messageApi.open({
      type: 'success',
      content: '设置成功',
      className: 'custom-class',
      style: {
        marginTop: '10vh',
      },
    });
    setSelectedAnnotatorOptions([]);
    setSelectedQualityInspectorOptions([]);
  };
  const handleAllocationCancel = () => {
    setIsAllocationModalOpen(false);
    setSelectedAnnotatorOptions([]);
    setSelectedQualityInspectorOptions([]);
  };
  //处理分配人员对话框里的多选框
  const options: SelectProps['options'] = [];
  //构造数据
  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }

   //处理面包屑
  //  const { Item } = Breadcrumb;
  //  const location = useLocation();
  //  const pathnames = location.pathname.split('/').filter((x) => x); //location.pathname是当前的路径: /teamManagement/teamTaskManagement
  //  const currentRoute = router.find((route) => route.path === '/'+pathnames[0]);
  //  console.log('我是BreadcrumbComponent获取的路由信息：',location,router,pathnames,currentRoute,pathnames);
  //  if (!currentRoute) {
  //    return null;
  //  }


  //移动到这个位置是因为要实现分配人员按钮功能的实现，如果在上边的话，分配人员的onClick就识别不了任何函数了
  const columns: ColumnsType<DataType> = [
      {
        title: '音频编号',
        dataIndex: 'audioID',
        align: 'center',
      },
      {
        title: '音频名称',
        dataIndex: 'audioName',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'audioState',
        align: 'center',
      },
      {
        title: '最近一次保存时间',
        dataIndex: 'lastStoreTime',
        align: 'center',
      },
      {
        title: '原始时长(秒)',
        dataIndex: 'originalDuration',
        align: 'center',
      },
      {
        title: '目标时长(秒)',
        dataIndex: 'targetDuration',
        align: 'center',
      },
      {
        title: '标注员',
        dataIndex: 'audioAnnotator',
        align: 'center',
      },
      {
        title: '质检员',
        dataIndex: 'audioQualityInspector',
        align: 'center',
    },
  ];

return (
  <>
  {/* <Breadcrumb>
      <Item key={currentRoute.path}>
        <Link to={currentRoute.path}>{currentRoute.name}</Link>
      </Item>
      <Item key={currentRoute.routes[1].path}>
        <Link to={currentRoute.path}>{currentRoute.routes[1].name}</Link>
      </Item>
      <Item key={location.pathname}>{'任务详情'}</Item>
    </Breadcrumb> */}

  <Card>
    <SearchTaskDetail handleSearch={handleSearch} afterReset={afterReset}></SearchTaskDetail>
    <Table
    rowSelection={rowSelection}
    columns={columns}
    dataSource={currentData}
    pagination={false} //是否显示表格自带分页器
    />

    <Pagination
    total={currentSearchData.length}
    showSizeChanger
    showQuickJumper
    showTotal={(total) => `共计 ${total} 条数据`}
    onChange={handlePageChange}
    defaultPageSize={EveryPageData}
    className={styles.pagination}
    />
  </Card>
  </>
  )
};

export default TaskDetail;
