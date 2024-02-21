import { message, Modal } from 'antd';
import '@umijs/max';
import { addGeneratorUsingPost } from '@/services/backend/generatorController';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';

interface Props {
  visible: boolean;
  columns: ProColumns<API.Generator>[];
  onSubmit?: (values: API.GeneratorAddRequest) => void;
  onCancel?: () => void;
}

/**
 *
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.GeneratorAddRequest) => {
  const hide = message.loading('正在添加');
  fields.fileConfig = JSON.parse((fields.fileConfig || '{}') as string);
  fields.modelConfig = JSON.parse((fields.modelConfig || '{}') as string);
  try {
    await addGeneratorUsingPost(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试!');
    return false;
  }
};

const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title={'创建'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (values: API.GeneratorAddRequest) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default CreateModal;
