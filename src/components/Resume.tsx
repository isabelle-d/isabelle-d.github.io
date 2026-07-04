
import { createRoot } from 'react-dom/client';

function Resume() {
  return (

  <object data="/assets/Resume.pdf" type="application/pdf" width="100%" height="100%">
      <p>This browser doesn't support PDF Viewing :( </p>
  </object>

  );
}

export default Resume;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Resume />);
}