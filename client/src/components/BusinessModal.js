import React from 'react';

const BusinessModal = ({ onClose, children }) => {
  const modalStyles = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    zIndex: 100,
    height: '130px',
  };

  return <div style={modalStyles}>{children}</div>;
};

export default BusinessModal;
