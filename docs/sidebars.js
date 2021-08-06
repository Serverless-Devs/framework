/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  'tutorial-quickstart': [
    {
      type: 'category',
      label: '渐进式体验',
      items: [
        'tutorial-quickstart/progressive/react',
        'tutorial-quickstart/progressive/api',
        'tutorial-quickstart/progressive/deploy',
        'tutorial-quickstart/progressive/tablestore',
        'tutorial-quickstart/progressive/oss',
        'tutorial-quickstart/progressive/scheduler',
      ],
    },

    {
      type: 'category',
      label: '一体化应用',
      items: [
        'tutorial-quickstart/integration/jamstack-react',
        'tutorial-quickstart/integration/jamstack-vue',
      ],
    },
    {
      type: 'category',
      label: '数据库操作',
      items: ['tutorial-quickstart/database/tablestore'],
    },
    'tutorial-quickstart/faq',
  ],
  'tutorial-dk': [
    {
      type: 'category',
      label: '函数计算DK框架介绍',
      items: [
        'tutorial-dk/intro/origin',
        'tutorial-dk/intro/quickstart',
        'tutorial-dk/intro/design',
        'tutorial-dk/intro/route',
        'tutorial-dk/intro/middleware',
      ],
    },
    {
      type: 'category',
      label: 'HTTP中间件',
      items: ['tutorial-dk/middleware/tablestoreInitialzer', 'tutorial-dk/middleware/validator'],
    },
    {
      type: 'category',
      label: '其他事件能力',
      items: [
        'tutorial-dk/event/oss',
        'tutorial-dk/event/tablestore',
        'tutorial-dk/event/scheduler',
        'tutorial-dk/event/gitee',
        'tutorial-dk/event/yuqueInner',
      ],
    },
  ],
  'tutorial-solution': ['tutorial-solution/oss-zip', 'tutorial-solution/idcard-recognition', 'tutorial-solution/github',],
};
