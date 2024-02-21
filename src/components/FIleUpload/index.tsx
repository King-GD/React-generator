import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { UploadFile } from 'antd/lib';
import { uploadFileUsingPost } from '@/services/backend/fileController';

const { Dragger } = Upload;

interface Props {
  biz: string;
  value?: UploadFile[];
  description?: string;
  onChange?: (fileList: UploadFile[]) => void;
}

/**
 * 文件上传组件
 * @param props 父组件传过来的值
 */

const FileUploader: React.FC<Props> = (props) => {
  const { biz, value, description, onChange } = props;
  const  [loading, setLoading ] = useState(false)

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    listType: 'text',
    fileList: value,
    disabled: loading,
    maxCount: 1,
    onChange: ({fileList}) => {
      onChange?.(fileList);
    },
    customRequest: async (fileObj: any) => {
      setLoading(true)
      try {
        const res = await uploadFileUsingPost({biz}, {}, fileObj.file)
        fileObj.onSuccess(res.data)
      } catch (error: any) {
        message.error('上传失败'+ error.message)
        fileObj.onError(error)
      }
      setLoading(false)
    }
  };

  return (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或者拖拽上传文件</p>
      <p className="ant-upload-hint">{description}</p>
    </Dragger>
  );
};

export default FileUploader;
