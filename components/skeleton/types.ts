export interface SkeletonProps {
  layout: string;
}

export interface SkeletonItem {
  x: number;
  y: number;
  rx: number;
  ry: number;
  width: number;
  height: number;
}

export interface SkeletonTemplate {
  speed: number;
  height: number;
  viewBox: string;
  backgroundColor: string;
  foregroundColor: string;
  skeletonItems: SkeletonItem[];
}
