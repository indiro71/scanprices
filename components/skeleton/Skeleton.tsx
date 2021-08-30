import React, { FC } from 'react';
import ContentLoader from 'react-content-loader';
import { SkeletonProps, SkeletonTemplate } from './types';
import { Layouts } from './layouts';

export const Skeleton: FC<SkeletonProps> = ({ layout }, props) => {
  const template: SkeletonTemplate = Layouts[layout];
  return (
    <ContentLoader
      style={{ width: '100%' }}
      speed={template.speed}
      height={template.height}
      viewBox={template.viewBox}
      backgroundColor={template.backgroundColor}
      foregroundColor={template.foregroundColor}
      {...props}
    >
      {template.skeletonItems.map((item) => (
        <rect
          x={item.x}
          y={item.y}
          rx={item.rx}
          ry={item.ry}
          width={item.width}
          height={item.height}
        />
      ))}
    </ContentLoader>
  );
};
