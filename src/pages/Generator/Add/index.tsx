import FileUploader from '@/components/FileUploader';
import PictureUploader from '@/components/PictureUploader';
import { addGeneratorUsingPost } from '@/services/backend/generatorController';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import React, { useRef } from 'react';

/**
 * 创建生成器页面
 * @constructor
 */
const GeneratorAddPage: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  return (
    <ProCard>
      <StepsForm<API.GeneratorAddRequest> formRef={formRef}>
        <StepsForm.StepForm
          name="base"
          title="基本信息"
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            return true;
          }}
        >
          <ProFormText name="name" label="名称" placeholder="请输入名称" />
          <ProFormTextArea name="description" label="描述" placeholder="请输入描述" />
          <ProFormText name="basePackage" label="基础包" placeholder="请输入基础包" />
          <ProFormText name="version" label="版本" placeholder="请输入版本" />
          <ProFormText name="author" label="作者" placeholder="请输入作者" />
          <ProFormSelect label="标签" mode="tags" name="tags" placeholder="请输入标签列表" />
          <ProForm.Item label="图片" name="picture">
            <PictureUploader biz="generator_picture" />
          </ProForm.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="fileConfig" title="文件配置">
          {/*todo 待补充*/}
        </StepsForm.StepForm>
        <StepsForm.StepForm name="modelConfig" title="模型配置">
          {/*todo 待补充*/}
        </StepsForm.StepForm>
        <StepsForm.StepForm name="dist" title="生成器文件">
          <ProForm.Item label="产物包" name="distPath">
            <FileUploader biz="generator_dist" description="请上传生成器文件压缩包" />
          </ProForm.Item>
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};

export default GeneratorAddPage;