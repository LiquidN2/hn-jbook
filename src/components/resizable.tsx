import { FC, ReactNode, useEffect, useState } from 'react';
import { ResizableProps, Resizable } from 're-resizable';

import './resizable.scss';

interface CustomResizableProps {
  direction: 'horizontal' | 'vertical';
  children: ReactNode;
}

const CustomResizable: FC<CustomResizableProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const windowResizingHandler = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    window.addEventListener('resize', windowResizingHandler);

    return () => {
      window.removeEventListener('resize', windowResizingHandler);
    };
  }, []);

  const resizableProps: ResizableProps =
    direction === 'vertical'
      ? {
          handleClasses: {
            bottom: 'resizable-handle resizable-handle--bottom',
          },
          defaultSize: { height: 300, width: Infinity },
          minHeight: innerHeight * 0.1,
          maxHeight: innerHeight * 0.9,
          onResize(_event, _direction, elementRef, _delta) {
            (
              elementRef.querySelector(
                '.resizable--horizontal'
              ) as HTMLDivElement
            ).style.height = '100%';
          },
        }
      : {
          handleClasses: {
            right: 'resizable-handle resizable-handle--right',
          },
          defaultSize: { height: Infinity, width: innerWidth * 0.75 },
          size: { width, height: Infinity },
          minWidth: innerWidth * 0.2,
          maxWidth: innerWidth * 0.75,
          onResizeStop(_event, _direction, _elementRef, delta) {
            setWidth(width + delta.width);
          },
        };

  return (
    <Resizable
      className={`resizable resizable--${direction}`}
      {...resizableProps}
    >
      {children}
    </Resizable>
  );
};

export default CustomResizable;
