import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message, Modal, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { listUserByPageUsingPost, deleteUserUsingPost } from '@/services/backend/userController';
import UpdateModal from './components/UpdateModel';
import CreateModal from './components/CreateModel';

/**
 *
 * 用户管理页面
 */
const UserAdminPage: React.FC = () => {
  /**
   *
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  /**
   *
   * @zh-CN 更新窗口的弹窗
   * */
  const [updateModalOpen, sethandleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击数据
  const [currentRow, setCurrentRow] = useState<API.User>();

  /**
   *
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleDelete = async (row: API.User) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteUserUsingPost({
        id: row.id,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试!');
      return false;
    }
  };

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.User>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      valueType: 'text',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '简介',
      dataIndex: 'userProfile',
      valueType: 'textarea',
    },
    {
      title: '权限',
      dataIndex: 'userRole',
      valueEnum: {
        user: {
          text: '用户',
        },
        admin: {
          text: '管理员',
        },
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              sethandleUpdateModalOpen(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link
            type="danger"
            onClick={() => {
              Modal.confirm({
                title: '确定要删除吗？',
                content: '删除后数据将无法恢复',
                onOk: () => {
                  handleDelete(record);
                },
              });
            }}
          >
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.User>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          // 要取的排序字段的值  升序或者降序
          const sortField = Object.keys(sort)?.[0];
          // 要取的排序字段
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listUserByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          });
          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalOpen}
        columns={columns}
        onSubmit={() => {
          setCreateModalOpen(false);
          actionRef.current?.reloadAndRest?.();
        }}
        onCancel={() => setCreateModalOpen(false)}
      />
      <UpdateModal
        visible={updateModalOpen}
        columns={columns}
        onSubmit={() => {
          sethandleUpdateModalOpen(false);
          actionRef.current?.reload();
        }}
        onCancel={() => sethandleUpdateModalOpen(false)}
        oldData={currentRow}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.userName && (
          <ProDescriptions<API.User>
            column={2}
            title={currentRow?.userName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.userName,
            }}
            columns={columns as ProDescriptionsItemProps<API.User>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default UserAdminPage;
