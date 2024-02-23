import FileUploader from '@/components/FileUploader';
import PictureUploader from '@/components/PictureUploader';
import {
  addGeneratorUsingPost,
  getGeneratorVoByIdUsingGet,
  editGeneratorUsingPost,
} from '@/services/backend/generatorController';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { useSearchParams } from '@@/exports';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history } from '@umijs/max';
import ModelConfigForm from './components/ModelConfigForm';
import FileConfigForm from './components/FileConfigForm';
import GeneratorMaker from './components/GeneratorMaker';

/**
 * 创建生成器页面
 * @constructor
 */
const GeneratorAddPage: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  // 原始数据
  const [oldData, setOldData] = useState<API.GeneratorEditRequest>();
  // 从当前页面获取的数url参数
  const [searchParms] = useSearchParams();
  const id = Number(searchParms.get('id'));
  // 记录表单数据
  const [fileConfig, setFileConfig] = useState<API.FileConfig>();
  const [modelConfig, setModelConfig] = useState<API.ModelConfig>();
  const [baseicInfo, setBaseicInfo] = useState<API.GeneratorEditRequest>();

  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!id) {
      return;
    }
    try {
      const res = await getGeneratorVoByIdUsingGet({ id });
      if (res.data) {
        const { distPath } = res.data || {};
        if (distPath) {
          // @ts-ignore
          res.data.distPath = [
            {
              uid: id,
              name: '文件' + id,
              status: 'done',
              url: distPath,
              response: distPath,
            },
          ];
        }
        setOldData(res.data);
      }
    } catch (error: any) {
      message.error('加载数据失败：' + error.message);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  /**
   * 创建
   * @param value
   */
  const doAdd = async (value: API.GeneratorAddRequest) => {
    try {
      const res = await addGeneratorUsingPost(value);
      if (res.data) {
        message.success('创建成功');
        history.push(`/generator/detail/${res.data}`);
      }
    } catch (error: any) {
      message.error('创建失败：' + error.message);
    }
  };

  /**
   * 更新
   * @param value
   */
  const doUpdate = async (value: API.GeneratorEditRequest) => {
    try {
      const res = await editGeneratorUsingPost(value);
      if (res.data) {
        message.success('更新成功');
        history.push(`/generator/detail/${res.data}`);
      }
    } catch (error: any) {
      message.error('更新失败：' + error.message);
    }
  };

  /**
   * 提交表单
   * @param value
   */
  const doSubmit = async (value: API.GeneratorAddRequest) => {
    // 数据转换
    if (!value.fileConfig) {
      value.fileConfig = {};
    }

    if (!value.modelConfig) {
      value.modelConfig = {};
    }
    // 文件列表转url
    if (value.distPath && value.distPath.length > 0) {
      // @ts-ignore
      value.distPath = value.distPath[0].response;
    }
    if (id) {
      await doUpdate({ id, ...value });
    } else {
      await doAdd(value);
    }
  };

  return (
    <ProCard>
      {/* 创建或者已加载要更新的数据时，才渲染表单，顺利填充默认值 */}
      {(!id || oldData) && (
        <StepsForm<API.GeneratorAddRequest | API.GeneratorEditRequest>
          formRef={formRef}
          formProps={{
            initialValues: oldData,
          }}
          onFinish={doSubmit}
        >
          <StepsForm.StepForm
            name="base"
            title="基本信息"
            onFinish={async (values) => {
              setBaseicInfo(values);
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
          <StepsForm.StepForm
            name="modelConfig"
            title="模型配置"
            onFinish={async (value) => {
              setModelConfig(value);
              return true;
            }}
          >
            <ModelConfigForm formRef={formRef} oldData={oldData} />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="fileConfig"
            title="文件配置"
            onFinish={async (values) => {
              setFileConfig(values);
              return true;
            }}
          >
            <FileConfigForm formRef={formRef} oldData={oldData} />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="dist" title="生成器文件">
            <ProForm.Item label="产物包" name="distPath">
              <FileUploader biz="generator_dist" description="请上传生成器文件压缩包" />
            </ProForm.Item>
            <GeneratorMaker
              meta={{
                ...baseicInfo,
                ...modelConfig,
                ...fileConfig,
              }}
            />
            <div style={{marginBottom: 24}}></div>
          </StepsForm.StepForm>
        </StepsForm>
      )}
    </ProCard>
  );
};

export default GeneratorAddPage;
