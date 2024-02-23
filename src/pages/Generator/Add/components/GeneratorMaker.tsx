import FileUploader from '@/components/FileUploader';
import { makeGeneratorUsingPost } from '@/services/backend/generatorController';
import { ProForm } from '@ant-design/pro-components';
import { Collapse, Form, message } from 'antd';
import { saveAs } from 'file-saver';

interface Props {
  meta: API.GeneratorAddRequest | API.GeneratorEditRequest;
}

/**
 * 生成器制作器
 */

export default (props: Props) => {
  const { meta } = props;
  const [form] = Form.useForm();

  const doSubmit = async (values: API.GeneratorMakeRequest) => {
    if (!values.meta) {
      message.error('请先填写名称');
      return;
    }

    const zipFilePath = values.zipFilePath;
    if (!zipFilePath || zipFilePath.length < 1) {
      message.error('请上传模板文件');
      return;
    }

    // 文件列表转url
    // @ts-ignore
    values.zipFilePath = zipFilePath[0].response;

    try {
      const blob = await makeGeneratorUsingPost({
        meta,
        zipFilePath: values.zipFilePath,
      }, {
        responseType: 'blob',
      });
      saveAs(blob, `${meta.name}.zip`);
    } catch (error: any) {
      message.error('制作失败：' + error.message);
    }
  };

  const formView = (
    <ProForm
      form={form}
      submitter={{
        searchConfig: {
          submitText: '制作',
        },
        resetButtonProps: {
          hidden: true,
        },
      }}
      onFinish={doSubmit}
    >
      <ProForm.Item label="模板文件" name="zipFilePath">
        <FileUploader
          biz="generator_make_template"
          description="请上传压缩包，打包时不要添加最外层目录！"
        />
      </ProForm.Item>
    </ProForm>
  );

  return (
    <Collapse
      defaultActiveKey={'maker'}
      items={[
        {
          key: 'maker',
          label: '生成器制作工具',
          children: formView,
        },
      ]}
    />
  );
};
