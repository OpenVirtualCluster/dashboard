import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <TailSpin
        height="80"
        width="80"
        color="blue"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loading;