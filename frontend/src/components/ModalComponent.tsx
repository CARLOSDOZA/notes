import React from 'react';

type ModalProps = {
  open: boolean; // Indicates whether the modal is open or closed
  onClose: () => void; // Function to close the modal
  children: React.ReactNode; // Content to be displayed inside the modal
}

export default function ModalComponent({ open, onClose, children }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-colors z-50 ${open ? 'visible bg-black/20' : 'invisible'}`}
      onClick={onClose} // Close modal when clicking outside of it
    >
      <div
        className={`bg-white rounded-lg shadow p-6 transition-all max-w-md relative z-60 ${open ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside it
      >
        <button
          className='absolute top-2 right-2 py-1 px-2 border border-neutral-200 rounded-md text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600'
          onClick={onClose} // Close modal when clicking on the close button
        >
          X
        </button>
        {children} {/* Render the content inside the modal */}
      </div>
    </div>
  );
}
