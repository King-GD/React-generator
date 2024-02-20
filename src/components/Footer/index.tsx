import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = 'KingGD with ❤️';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'KGD',
          title: 'KGD-React',
          href: 'https://github.com/King-GD/React-template',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <><GithubOutlined /> GitHub源码</>

          ),
          href: 'https://github.com/King-GD/React-template',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
