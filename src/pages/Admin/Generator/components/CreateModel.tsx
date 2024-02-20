import { message, Modal } from 'antd';
import  '@umijs/max';
import { addUserUsingPost } from '@/services/backend/userController';
import { ProTable, ProColumns } from '@ant-design/pro-components';  
import React from 'react';


interface Props {
  visible: boolean;
  columns: ProColumns<API.User>[];
  onSubmit?: (values: API.UserAddRequest) => void;
  onCancel?: () => void;
}

/**
 *
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.User) => {
  const hide = message.loading('正在添加');
  try {
    await addUserUsingPost({
      ...fields,
    });
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
        onSubmit={async (values: API.UserAddRequest) => {
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