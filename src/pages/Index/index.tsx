import { listGeneratorVoByPageFastUsingPost } from '@/services/backend/generatorController';
import { UserOutlined } from '@ant-design/icons';
import { PageContainer, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-components';
import { Avatar, Card, Flex, Image, Input, List, message, Tabs, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from '@@/exports';

/**
 * 默认分页参数
 */
const DEFAULT_PAGE_PARAMS = {
  current: 1,
  pageSize: 8,
  sortField: 'createTime',
  sortOrder: 'descend',
};

const IndexPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataList, setDataList] = useState<API.GeneratorVO[]>([]);
  const [total, setTotal] = useState<number>(0);
  // 搜索条件
  const [searchParams, setSearchParams] = useState<API.GeneratorQueryRequest>({
    ...DEFAULT_PAGE_PARAMS,
  });

  const doSearch = async () => {
    setLoading(true);
    try {
      const res = await listGeneratorVoByPageFastUsingPost(searchParams);
      setDataList(res.data?.records ?? []);
      setTotal(Number(res.data?.total ?? 0));
      setLoading(false);
    } catch (error: any) {
      message.error('获取数据失败，请重试' + error.message);
    }
  };

  useEffect(() => {
    doSearch();
  }, [searchParams]);

  /**
   * 标签列表
   */
  const tagListView = (tags?: string[]) => {
    if (!tags) {
      return <></>;
    }
    return (
      <div style={{ marginBottom: 8 }}>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    );
  };

  return (
    <PageContainer title={<></>}>
      <Input.Search
        placeholder="搜索代码生成器"
        allowClear
        enterButton="搜索"
        size="large"
        onChange={(e) => {
          searchParams.searchText = e.target.value;
        }}
        onSearch={(value) => {
          setSearchParams({ ...searchParams, searchText: value });
        }}
      />

      <div style={{ marginBottom: 16 }}></div>

      <QueryFilter
        span={12}
        labelWidth="auto"
        split
        defaultCollapsed={false}
        labelAlign="left"
        onFinish={async (value) => {
          setSearchParams({
            ...DEFAULT_PAGE_PARAMS,
            ...value,
            searchText: searchParams.searchText,
          });
        }}
      >
        <ProFormSelect label="标签" name="tags" mode="tags" />
        <ProFormText label="名称" name="name" />
        <ProFormText label="描述" name="description" />
      </QueryFilter>

      <Tabs
        size="large"
        defaultActiveKey="newest"
        items={[
          {
            key: 'newest',
            label: '最新',
          },
          {
            key: 'recommend',
            label: '推荐',
          },
        ]}
        onChange={() => {}}
      />

      <List<API.GeneratorVO>
        rowKey="id"
        loading={loading}
        style={{ marginTop: 16 }}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={dataList}
        pagination={{
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total,
          onChange(current: number, pageSize: number) {
            setSearchParams({
              ...searchParams,
              current,
              pageSize,
            });
          },
        }}
        renderItem={(data) => (
          <List.Item>
            <Card hoverable cover={<Image alt={data.name} src={data.picture} />}>
              <Link to={`/generator/detail/${data.id}`}>
                <Card.Meta
                  title={<a>{data.name}</a>}
                  description={
                    <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                      {data.description}
                    </Typography.Paragraph>
                  }
                />
                {tagListView(data.tags)}
                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {moment(data.createTime).fromNow()}
                  </Typography.Text>
                  <div>
                    <Avatar src={data.user?.userAvatar ?? <UserOutlined />} />
                  </div>
                </Flex>
              </Link>
            </Card>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default IndexPage;
