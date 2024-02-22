import {
  getGeneratorVoByIdUsingGet,
  useGeneratorUsingPost,
} from '@/services/backend/generatorController';
import {  useModel, useParams } from '@@/exports';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Image,
  message,
  Row,
  Space,
  Typography,
  Divider,
  Form,
  Input,
  Collapse,
} from 'antd';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';

/**
 * 生成器详细页面
 * @constructor
 */
const GeneratorUsePage: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.GeneratorVO>({});
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  const models = data?.modelConfig?.models || [];

  const loadData = async () => {
    if (id) {
      setLoading(true);
      try {
        // @ts-ignore
        const res = await getGeneratorVoByIdUsingGet({ id });

        setData(res.data || {});
      } catch (error: any) {
        message.error('获取数据失败' + error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  /**
   * 下载按钮
   */

  const downloadButton = data.distPath && currentUser && (
    <Button
      icon={<DownloadOutlined />}
      onClick={async () => {
        try {
          const values = form.getFieldsValue();
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const blob = await useGeneratorUsingPost(
            { id: data.id, dataModel: values },
            {
              response: 'blob',
            },
          );
          // 使用file-saver保存文件
          const fullPath = data.distPath || '';
          saveAs(blob, fullPath.substring(fullPath.lastIndexOf('/') + 1));
        } catch (error: any) {
          message.error('下载失败' + error.message);
        }
      }}
    >
      生成代码
    </Button>
  );

  return (
    <PageContainer title={<></>} loading={loading}>
      <Card>
        <Row justify="space-between" gutter={[32, 32]}>
          <Col flex="auto">
            <Space size="large" align="center">
              <Typography.Title level={4}>{data.name}</Typography.Title>
            </Space>
            <Typography.Paragraph>{data.description}</Typography.Paragraph>
            <Divider />

            <Form form={form}>
              {models.map((model, index) => {
                if (model.groupKey) {
                  if (!model.models) {
                    return <></>;
                  }

                  return (
                    <Collapse
                      key={index}
                      items={[
                        {
                          key: index,
                          label: model.groupName + '(分组)',
                          children: model.models.map((subModel, subIndex) => {
                            return (
                              <Form.Item
                                key={subIndex}
                                label={subModel.fieldName}
                                name={subModel.fieldName}
                              >
                                <Input />
                              </Form.Item>
                            );
                          }),
                        },
                      ]}
                      bordered={false}
                      defaultActiveKey={index}
                    />
                  );
                }
                return (
                  <Form.Item key={model.fieldName} label={model.fieldName} name={model.fieldName}>
                    <Input />
                  </Form.Item>
                );
              })}
            </Form>

            <div style={{ marginBottom: 24 }}></div>
            <Space size="middle">{downloadButton}</Space>
          </Col>
          <Col flex="320px">
            <Image src={data.picture} />
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default GeneratorUsePage;
