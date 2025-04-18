import React, { useEffect } from 'react';
import { lineSpinner } from 'ldrs';

function Loader() {
  useEffect(() => {
    lineSpinner.register();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center">
        <l-line-spinner
          size="40"
          stroke="3"
          speed="1" 
          color="#334155" // slate-700 color
        ></l-line-spinner>
        <p className="mt-4 text-sm text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default Loader;