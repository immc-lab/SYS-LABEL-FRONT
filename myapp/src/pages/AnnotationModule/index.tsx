import { PageContainer } from '@ant-design/pro-layout';
import React from "react";
import AnnotationTaskList from './AnnotationTaskList/AnnotationTaskList';

interface DataType {
  key: number;
  taskName: string;
  taskID: number;
  totalNumber: number;
  state: string;
  receivedNumber: number;
  toBeMarkedNumber: number;
  qualityInspectionFailuresNumber: number;
  acceptanceFailuresNumber: number;
}


const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    taskName: `Edward King ${i}`,
    taskID: i,
    totalNumber: 10,
    state:'进行中',
    receivedNumber: 50,
    toBeMarkedNumber: 50,
    qualityInspectionFailuresNumber: 48,
    acceptanceFailuresNumber: 10,
  });
}

console.log('我是data',data)


const AnnotationModule = () =>{
    return (
    <PageContainer>
      <AnnotationTaskList data={data}></AnnotationTaskList>
    </PageContainer>

    )
}


export default AnnotationModule;
