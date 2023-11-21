import {Button, Card, Modal, Pagination, Table, Upload, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React from 'react';
import { useState } from 'react';
import SearchProjectTaskDetailList from './components/SearchProjectTaskDetailList';
import styles from './index.css';
import { PageContainer } from '@ant-design/pro-layout';
import { history, useLocation} from '@umijs/max';
import { type } from './../../../../types/index.d';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from "@/services/swagger/pet";
import { getAudioData } from "../service/api";
import { request } from '@umijs/max';
import pako from 'pako';
import base64 from 'base-64';
// import { useLocation } from 'umi';


interface DataType {
  key: number;
  audioName: string;
  audioID: number;
  originalDuration: number;
  targetDuration: number;
  annotator: string;
  markUsedTime: string;
  qualityInspector: string;
  qualityInspectionUsedTime: string;
  state: string;
  internalInspector: string;
  acceptanceUsedTime: string;
}


const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    audioName: `Edward King ${i}`,
    audioID: i,
    state:'未领取',
    originalDuration: 10,
    targetDuration: 10,
    annotator: 'test1',
    markUsedTime: '2分20秒',
    qualityInspector: '团管理1',
    qualityInspectionUsedTime: '2分20秒',
    internalInspector: '',
    acceptanceUsedTime: '0秒',
  });
}


//默认每页初始显示的条数
const EveryPageData = 10

const ProjectTaskDetail: React.FC = () => {
  //控制新建任务对话框弹出
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  //处理表格选中项
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //初始显示数据,10是初始显示的每页的条数，默认为EveryPageData
  const initalDataIndex = Math.min(EveryPageData, data.length);
  //currentData是显示到页面的实时数据，而curentSearchData是基于searchText实时搜素出来的总的数据，注意区分
  //也就是说curentSearchData是包含currentData的，curentSearchData存储总的查询出来的数据，currentData是从curentSearchData挑出来数据进行渲染
  const [currentData, setCurrentData] = React.useState(data.slice(0,initalDataIndex));
  const [currentSearchData, setCurrentSearchData] = React.useState(data.slice(0,data.length));
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  // const {search} = location.state;
  console.log("我是search:",location);
  //接收传过来的searchText参数，只要输入框一变，就立马执行setCurrentData()
  // const [newsearchText, setNewsearchText] = useState('');
 // console.log('我是currentData的length',currentData.length)

  //处理表格选中项
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys); //返回的是数组，数组里是表格中选中的那一行的下标Array [ 0, 1 .....]
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onSelect = (record, selected, selectedRows, nativeEvent) => {
    console.log("我是选择的项onselect:",record, selected, selectedRows, nativeEvent); //能获取选中的项的信息，选多个也能获得多个
 }
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    onSelect:onSelect,
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
   const handleSearch = (searchText: string) => {
    const filtered = data.filter((item) =>
        // if (item.taskName !=='' && item.taskName !==''){
        //   item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
        // }
        // item.taskName.includes(searchText[0])
        item.audioName.includes(searchText[0]) && item.audioID.toString().includes(searchText[1]) && item.state.includes(searchText[2])
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

  //跳转到标注页面
  const goAnnotationPage = () => {
     history.push('./annotationPage')
  }

  //处理上传MP3文件
  const { Dragger } = Upload;  //从Upload模块中导入Dragger组件，用于显示拖拽上传按钮
  // const handleUpload = (file) => {
  //   const formData = new FormData();
  //   formData.append(file.name, file);
  //   console.log('执行了handleUpload',formData,file);
  //     // 发送请求到后端服务器
  //     request('https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188', {
  //       method: 'POST',
  //       data: formData,
  //       })
  //     // }).then(response => {
  //     //   // 处理后端返回的数据
  //     //   console.log('处理后端返回的数据',response);
  //     // }).catch(error => {
  //     //   // 处理错误
  //     //   console.error('处理错误',error);
  //     // });
  // };
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const uploadBase64Audio = async (audioFile) => {
    try {
      const base64String = await convertToBase64(audioFile);
      console.log("我是转base64:",JSON.stringify({ base64String }));

    request<string>('/api/audio/core/upload', {
        method: 'POST',
        data: JSON.stringify({ base64String }),
        // data:{"base64String":'sfsdfsdfsdssfd'},
        timeout: 40000, //
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // }
      });

      console.log("Base64 audio file uploaded successfully");
    } catch (error) {
      console.error("Failed to upload base64 audio file", error);
    }
  };
  const props: UploadProps = {
    name: 'file',  //指定上传的文件字段名
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
        uploadBase64Audio(info.file.originFileObj);
        message.success(`${info.file.name}文件上传成功.`);
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

  //处理新建任务按钮弹出框
  const showAddTaskModal = () => {

    setIsAddTaskModalOpen(true);
  }
  //新建任务弹出框点击确定后
  const handleAddTaskOk = () => {
    setFileList([]);
    setIsAddTaskModalOpen(false);
  }
  //新建任务弹出框关闭后
  const handleAddTaskCancel = () => {
    setFileList([]);
    setIsAddTaskModalOpen(false);
  }



  //移动到这个位置是因为要实现分配人员按钮功能的实现，如果在上边的话，分配人员的onClick就识别不了任何函数了
  const columns: ColumnsType<DataType> = [
      {
        title: '音频编号',
        dataIndex: 'audioID',
        render: (text: string) => (
                      <a>{text}</a>
                ),
        align: 'center',
      },
      {
        title: '音频名称',
        dataIndex: 'audioName',
        render: (text: string) => (
                      <a>{text}</a>
                ),
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
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
        dataIndex: 'annotator',
        align: 'center',
      },
      {
        title: '标注已用时',
        dataIndex: 'markUsedTime',
        align: 'center',
      },
      {
        title: '质检员',
        dataIndex: 'qualityInspector',
        align: 'center',
      },
      {
        title: '质检已用时',
        dataIndex: 'qualityInspectionUsedTime',
        align: 'center',
      },
      {
        title: '内部验收员',
        dataIndex: 'internalInspector',
        align: 'center',
      },
      {
        title: '验收已用时',
        dataIndex: 'acceptanceUsedTime',
        align: 'center',
      },
  ];



return (
  <>
  <PageContainer>
  {contextHolder}{/*全局提示信息 */}

  <Card>
    <SearchProjectTaskDetailList handleSearch={handleSearch} afterReset={afterReset}></SearchProjectTaskDetailList>
    <Button type="primary" onClick={showAddTaskModal}>添加音频</Button>
    <Modal title="新建任务" open={isAddTaskModalOpen} onOk={handleAddTaskOk} onCancel={handleAddTaskCancel}>
              <Dragger {...props} directory fileList={fileList}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击这里开始上传音频</p>
                <p className="ant-upload-hint">
                     支持单次或批量上传
                </p>
              </Dragger>
    </Modal>

    <Table
    rowSelection={rowSelection}
    columns={columns}
    dataSource={currentData}
    pagination={false} //是否显示表格自带分页器
    scroll={{  y: 400 }} //
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
  </PageContainer>
  </>
  )
};

export default ProjectTaskDetail;
