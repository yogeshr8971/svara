import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import AvatarValidationModal from './AvatarValidationModal';
import * as avatarService from '../../services/avatarService';
import toast from 'react-hot-toast';

export default function AvatarUploader({ onAvatarUploaded, currentAvatar }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be under 10MB.');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setValidationError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setStatusMessage('Validating photo with AI...');
      const formData = new FormData();
      formData.append('image', selectedFile);

      setStatusMessage('Checking full-body visibility & pose...');
      const response = await avatarService.uploadAvatar(formData);

      toast.success('Your avatar is verified and ready for virtual try-on!');
      setSelectedFile(null);
      setPreview(null);
      onAvatarUploaded?.(response.avatar);
    } catch (err) {
      const data = err.response?.data;
      if (data?.validationFailed && data.validation) {
        setValidationError(data.validation);
      } else {
        toast.error(data?.message || 'Failed to upload photo');
      }
    } finally {
      setUploading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-charcoal-700">Your AI Avatar</h3>
          <p className="text-xs text-charcoal-400 mt-0.5">Upload a full-body standing photo to preview outfits accurately</p>
        </div>
        {currentAvatar && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 size={14} /> Active Avatar
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual Preview / Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-champagne-300 hover:border-champagne-400 bg-white/40 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors overflow-hidden group"
        >
          {preview || currentAvatar?.imageUrl ? (
            <img
              src={preview || currentAvatar.imageUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-charcoal-400 group-hover:text-charcoal-600">
              <div className="p-4 rounded-full bg-champagne-100/80 text-champagne-500">
                <Upload size={28} />
              </div>
              <p className="font-display text-sm font-medium text-charcoal-600">Click or drag photo here</p>
              <p className="text-[11px] text-charcoal-300 max-w-xs">Supports JPG, PNG, WEBP up to 10MB</p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </div>

        {/* Instructions & Upload Trigger */}
        <div className="space-y-4">
          <div className="space-y-2.5 text-xs text-charcoal-500 bg-white/50 rounded-2xl p-4 border border-white/60">
            <p className="font-semibold text-charcoal-700 uppercase tracking-wider text-[11px]">Photo Guidelines:</p>
            <ul className="space-y-1.5 list-disc list-inside text-charcoal-400">
              <li>One person standing upright</li>
              <li>Full body visible from head to feet</li>
              <li>Good natural lighting, minimal shadows</li>
              <li>Plain or uncluttered background works best</li>
            </ul>
          </div>

          {selectedFile && (
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleUpload}
                loading={uploading}
                className="w-full justify-center"
              >
                <Sparkles size={16} />
                <span>Verify & Save Avatar</span>
              </Button>
              {statusMessage && (
                <p className="text-xs text-center text-champagne-500 font-medium animate-pulse">
                  {statusMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Validation Fail Modal */}
      <AvatarValidationModal
        isOpen={!!validationError}
        onClose={() => setValidationError(null)}
        validation={validationError}
        onRetry={() => {
          setValidationError(null);
          fileInputRef.current?.click();
        }}
      />
    </div>
  );
}
