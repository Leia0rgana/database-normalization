import React from 'react';

type ModalProps = {
  label: string;
  children: React.ReactNode;
};

export const Modal = (props: ModalProps) => {
  const { label, children } = props;

  return (
    <div className="fixed flex items-center justify-center inset-0 bg-black/50">
      <div className="bg-white text-gray-600 p-6 rounded-lg shadow-xl">
        <h3 className="text-center text-xl text-[#252b35] font-medium mb-4">
          {label}
        </h3>
        {children}
      </div>
    </div>
  );
};
