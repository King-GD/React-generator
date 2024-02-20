import { message, Modal } from 'antd';
import  '@umijs/max';
import { updateUserUsingPost } from '@/services/backend/userController';
import { ProTable, ProColumns } from '@ant-design/pro-components';  
import React from 'react';


interface Props {
  oldData?: API.User;
  visible: boolean;
  columns: ProColumns<API.User>[];
  onSubmit?: (values: API.UserAddRequest) => void;
  onCancel?: () => void;
}

/**
 *
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    await updateUserUsingPost({
      ...fields,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败，请重试!');
    return false;
  }
};

const UpdateModal: React.FC<Props> = (props) => {
  const { visible, columns, onSubmit, onCancel, oldData } = props;

  return (
    <Modal
      destroyOnClose
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        form={{ initialValues: oldData}}
        onSubmit={async (values: API.UserAddRequest) => {
          const success = await handleUpdate({
            ...values,
            id: oldData?.id,
          });
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default UpdateModal;