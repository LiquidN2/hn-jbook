import { FC, ReactNode } from 'react';
import { ResizableProps, Resizable } from 're-resizable';

import './resizable.scss';

interface CustomResizableProps {
  direction: 'horizontal' | 'vertical';
  children: ReactNode;
}

const CustomResizable: FC<CustomResizableProps> = ({ direction, children }) => {
  const resizableProps: ResizableProps =
    direction === 'vertical'
      ? {
          handleClasses: {
            bottom: 'resizable-handle resizable-handle--bottom',
          },
          defaultSize: { height: 300, width: Infinity },
          minHeight: window.innerHeight * 0.1,
          maxHeight: window.innerHeight * 0.9,
        }
      : {
          handleClasses: {
            right: 'resizable-handle resizable-handle--right',
          },
          defaultSize: { height: Infinity, width: window.innerWidth * 0.6 },
          minWidth: window.innerWidth * 0.2,
          maxWidth: window.innerWidth * 0.75,
        };

  return <Resizable {...resizableProps}>{children}</Resizable>;
};

export default CustomResizable;
