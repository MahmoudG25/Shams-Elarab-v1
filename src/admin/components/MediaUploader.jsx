import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdCloudUpload, MdClose, MdCheckCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { uploadStart, uploadProgress, uploadSuccess, uploadError, resetUpload } from '../../store/slices/uploadsSlice';
import { uploadDetails } from '../../services/cloudinary';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

const MediaUploader = ({
  onUploadComplete,
  label = "Upload Image",
  accept = { 'image/*': [] },
  maxSize = 5242880, // 5MB
  currentUrl
}) => {
  const dispatch = useDispatch();
  // We use a unique ID for this uploader instance to track its specific upload state
  // ideally this ID should be stable across renders if possible, or passed in
  // For simplicity, we'll just use a local ref or state if needed, but here
  // we are dispatching global state. Let's just use local state for the ID.
  const [uploadId] = React.useState(() => uuidv4());

  const uploadState = useSelector(state => state.uploads.uploads[uploadId]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    dispatch(uploadStart({ id: uploadId }));

    try {
      const data = await uploadDetails(file, (percent) => {
        dispatch(uploadProgress({ id: uploadId, progress: percent }));
      });

      dispatch(uploadSuccess({
        id: uploadId,
        url: data.secure_url,
        public_id: data.public_id
      }));

      if (onUploadComplete) {
        onUploadComplete(data);
      }
    } catch (err) {
      dispatch(uploadError({ id: uploadId, error: err.message }));
    }
  }, [dispatch, uploadId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(resetUpload({ id: uploadId }));
    if (onUploadComplete) onUploadComplete(null);
  };

  const previewUrl = uploadState?.url || currentUrl;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer relative overflow-hidden",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          uploadState?.status === 'error' && "border-red-500 bg-red-50"
        )}
      >
        <input {...getInputProps()} />

        {uploadState?.status === 'uploading' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-gray-600">Jari al-raf' ({uploadState.progress}%)</p>
          </div>
        ) : previewUrl ? (
          <div className="relative group">
            {accept['video/*'] ? (
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

        {uploadState?.status === 'error' && (
          <p className="text-red-500 text-sm mt-2">{uploadState.error}</p>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
