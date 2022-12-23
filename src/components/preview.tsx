import { FC, useEffect, useRef } from 'react';

import './preview.scss';

interface PreviewProps {
  code: string;
  bundlingError: string;
}

const html = `
  <html lang='en'>
    <head>
      <title>Code Preview</title>
      <style>
        body { background-color: white }
        .error { color: red }
      </style>
    </head>
    <body>
      <div id="preview-root" />
      <script>        
        const handleError = error => {
          const root = document.getElementById('preview-root');
          root.innerHTML = '<div class="error"><h4>Runtime Error</h4>' + error + '</div>';
        };
     
        // Listens to any error (bundling and/or runtime)
        window.addEventListener('error', event => handleError(event.error));
        
        // Listens to the message event sent by the Preview component and execute it
        window.addEventListener('message', event => eval(event.data), false);
      </script>
    </body>
  </html>
`;

const Preview: FC<PreviewProps> = ({ code, bundlingError }) => {
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Reset iframe srcdoc
    ref.current.srcdoc = html;

    // Ensure sufficient time to initialize srcdoc html
    setTimeout(() => {
      // Send the bundled code to the iframe via message event
      (ref.current as HTMLIFrameElement).contentWindow?.postMessage(code, '*');
    }, 50);
  }, [code]);

  console.log('rendering preview component...');

  return (
    <div className="preview-wrapper">
      {bundlingError && <div className="preview-err">{bundlingError}</div>}
      <iframe sandbox={'allow-scripts'} srcDoc={html} ref={ref} />
    </div>
  );
};

export default Preview;
