import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '极致的编程体验',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        相比的纯函数的编程体验,DK提供了Koa的框架的编程体验。同时兼备函数的灵活性，可以为某一类的函数配置不同的实例规格，满足不同业务场景的需求。
      </>
    ),
  },
  {
    title: '丰富的插件生态',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
       通过经典的洋葱模型，构建丰富的插件生态。不仅提供web编程体验，同时很好的编排云资源比如
       <a href="https://help.aliyun.com/document_detail/108581.html">tablestore</a>，
       <a href="https://help.aliyun.com/product/31815.html">oss</a>等。
      </>
    ),
  },
  {
    title: '强大的性能',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        配合serverless devs部署工具，将公共的依赖打入到<a href="https://help.aliyun.com/document_detail/193057.html">layer层</a>中。
        在数据库连接的场景，充分发挥<a href="https://help.aliyun.com/document_detail/94670.html">Initializer</a>的优势，仅在实例初始化的时候连接一次。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
