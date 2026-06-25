import React from 'react';
import { useApp } from '../context/AppContext';

const Toast = () => {
  const { toast } = useApp();
  return (
    <div className={`toast ${toast.show ? 'show' : ''}`}>
      ✅ {toast.msg}
    </div>
  );
};

export default Toast;
