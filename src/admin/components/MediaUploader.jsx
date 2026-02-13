import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdCloudUpload, MdClose, MdCheckCircle } from 'react-icons/md';
import { uploadDetails } from '../../services/cloudinary';
import clsx from 'clsx';

const MediaUploader = ({
  onUploadComplete,
  label = "Upload Image",
  accept = { 'image/*': [] },
  maxSize = 5242880, // 5MB
  currentUrl
}) => {
  const [uploadState, setUploadState] = useState({
    status: 'idle', // idle, uploading, success, error
    progress: 0,
    error: null,
    url: null
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadState({ status: 'uploading', progress: 0, error: null, url: null });

    try {
      const data = await uploadDetails(file, (percent) => {
        setUploadState(prev => ({ ...prev, progress: percent }));
      });

      setUploadState({
        status: 'success',
        progress: 100,
        error: null,
        url: data.secure_url
      });

      if (onUploadComplete) {
        onUploadComplete(data);
      }
    } catch (err) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: err.message,
        url: null
      });
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setUploadState({ status: 'idle', progress: 0, error: null, url: null });
    if (onUploadComplete) onUploadComplete(null);
  };

  const previewUrl = uploadState.url || currentUrl;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer relative overflow-hidden",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          uploadState.status === 'error' && "border-red-500 bg-red-50"
        )}
      >
        <input {...getInputProps()} />

        {uploadState.status === 'uploading' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-gray-600">جاري الرفع ({uploadState.progress}%)</p>
          </div>
        ) : previewUrl ? (
          <div className="relative group">
            {accept && Object.keys(accept).some(k => k.startsWith('video')) ? (
              <video src={previewUrl} className="max-h-48 mx-auto rounded-lg shadow-sm" controls />
            ) : (
              <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm object-contain" />
            )}

            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MdClose size={16} />
            </button>
            <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
              <MdCheckCircle size={16} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <MdCloudUpload size={48} className="mb-2" />
            <p className="text-sm">اسحب الملف هنا أو انقر للاختيار</p>
            <p className="text-xs mt-1 text-gray-400">Max size: {maxSize / 1024 / 1024}MB</p>
          </div>
        )}

        {uploadState.status === 'error' && (
          <p className="text-red-500 text-sm mt-2">{uploadState.error}</p>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
