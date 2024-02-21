import React, { useState } from 'react';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { uploadFileUsingPost } from '@/services/backend/fileController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
  biz: string;
  value?: string;
  onChange?: (url: string) => void;
}

/**
 * 图片上传组件
 * @param props 父组件传过来的值
 */

const PictureUploader: React.FC<Props> = (props) => {
  const { biz, value, onChange } = props;
  const [loading, setLoading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    listType: 'picture-card',
    maxCount: 1,
    showUploadList: false,
    customRequest: async (fileObj: any) => {
      setLoading(true);
      try {
        const res = await uploadFileUsingPost({ biz }, {}, fileObj.file);
        // 拼接完整的图片地址
        // const fullPath = res.data
        onChange?.(res.data);
        fileObj.onSuccess(res.data);
      } catch (error: any) {
        message.error('上传失败' + error.message);
        fileObj.onError(error);
      }
      setLoading(false);
    },
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>点击上传</div>
    </div>
  );

  return (
    <Upload {...uploadProps}>
      {value ? <img src={value} alt="picture" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default PictureUploader;
