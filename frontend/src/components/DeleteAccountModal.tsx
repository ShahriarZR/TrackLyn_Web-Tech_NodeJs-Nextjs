'use client';

import React from 'react';
import Modal from '@/components/Modal'; // adjust path
import { Trash2 } from 'lucide-react'; // icon for delete
import router from 'next/router';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const onConfirm = async () => {
  try {
    setDeleteLoading(true);
    const token = localStorage.getItem('token');
    console.log('Token from localStorage for delete:', token);
    if (!token) {
      router.push('/');
      return;
    }

    await axios.delete('http://localhost:3030/employee/dashboard/deleteAcc', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    // Clear and redirect
    localStorage.removeItem('token');
    setDeleteModalOpen(false);
    router.push('/');
    alert('Your account has been deleted successfully.');
  } catch (err) {
    console.error('Failed to delete account:', err);
    alert('Failed to delete account.');
  } finally {
    setDeleteLoading(false);
  }
};

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Trash2 className="w-12 h-12 text-red-600" />
        <p className="text-gray-800 font-medium">
          Are you sure you want to delete your account? <br />
          This action <span className="font-bold text-red-600">cannot be undone</span>.
        </p>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
function setDeleteLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

function setDeleteModalOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}

