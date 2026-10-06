import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertCircle, Camera } from 'lucide-react';

export default function AvatarValidationModal({ isOpen, onClose, validation, onRetry }) {
  if (!validation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Let's Choose a Better Photo" maxWidth="max-w-md">
      <div className="space-y-5 text-center sm:text-left">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700 leading-relaxed font-medium">
            {validation.reason || "Your photo doesn't show your full body clearly enough for virtual try-on."}
          </p>
        </div>

        {validation.issues && validation.issues.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
              Identified Issues:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {validation.issues.map((issue, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white/70 border border-ivory-300 text-charcoal-600 text-xs font-medium"
                >
                  {issue.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-charcoal-400 leading-relaxed">
          For an accurate virtual try-on preview, please take a standing photo showing your entire silhouette from head to feet.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="ghost" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button variant="primary" onClick={onRetry} size="sm">
            <Camera size={16} />
            <span>Upload Another Photo</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
