import { SkeletonTemplate } from '../types';

export const productCard: SkeletonTemplate = {
  speed: 2,
  height: 700,
  viewBox: '0 0 1500 700',
  backgroundColor: '#dee1e6',
  foregroundColor: '#395bd5',
  skeletonItems: [
    {
      x: 0,
      y: 38,
      rx: 14,
      ry: 14,
      width: 300,
      height: 300,
    },
    {
      x: 320,
      y: 38,
      rx: 15,
      ry: 15,
      width: 1180,
      height: 300,
    },
    {
      x: 0,
      y: 358,
      rx: 15,
      ry: 15,
      width: 1500,
      height: 340,
    },
    {
      x: 0,
      y: 0,
      rx: 0,
      ry: 0,
      width: 1500,
      height: 23,
    },
  ],
};
