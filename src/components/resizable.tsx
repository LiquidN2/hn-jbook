import { FC, ReactNode } from 'react';
import { Resizable } from 're-resizable';

import './resizable.scss';

interface CustomResizableProps {
  direction: 'horizontal' | 'vertical';
  children: ReactNode;
}

const CustomResizable: FC<CustomResizableProps> = ({ direction, children }) => {
  return (
    <Resizable
      defaultSize={{ height: 300, width: Infinity }}
      minHeight={window.innerHeight * 0.1}
      maxHeight={window.innerHeight * 0.9}
      handleClasses={{ bottom: 'resizable-handle resizable-handle--bottom' }}
    >
      {children}
    </Resizable>
  );
};

export default CustomResizable;
