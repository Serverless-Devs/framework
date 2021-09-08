/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'DK',
  tagline: '为函数计算而生',
  url: 'http://serverless-dk.oss.devsapp.net',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Serverless Devs', // Usually your GitHub org/user name.
  projectName: 'framework', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'DK',
      logo: {
        alt: 'DK Logo',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //   to: 'docs/tutorial-quickstart/progressive/react',
        //   position: 'left',
        //   label: '快速开始',
        //   activeBasePath: 'docs/tutorial-quickstart',
        // },
        {
          to: 'docs/tutorial-dk/intro/react',
          position: 'left',
          label: 'DK文档',
          activeBasePath: 'docs/tutorial-dk',
        },
        {
          to: 'docs/tutorial-solution/http',
          position: 'left',
          label: '解决方案',
          activeBasePath: 'docs/tutorial-solution',
        },
        // { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/Serverless-Devs/framework',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/tutorial-dk/intro/quickstart',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: '仓库',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Serverless-Devs/framework',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DK Framework, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/Serverless-Devs/framework/edit/master/docs',
          remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/Serverless-Devs/framework/edit/master/docs',
          remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
