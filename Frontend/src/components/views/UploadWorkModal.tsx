import { useState } from 'react';
import { X, Upload, FileUp } from 'lucide-react';

interface UploadWorkModalProps {
    projectId: string;
    projectTitle: string;
    onClose: () => void;
    onUploaded: () => void;
}

export const UploadWorkModal: React.FC<UploadWorkModalProps> = ({
    projectId,
    projectTitle,
    onClose,
    onUploaded,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();

            formData.append('file', file);
            formData.append('project_id', projectId);

            const response = await fetch(
                'http://127.0.0.1:5000/api/projects/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            alert('Work uploaded successfully!');

            onUploaded();
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Upload Work
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {projectTitle}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-purple-400 hover:bg-purple-50/30">

                        <Upload className="mb-3 h-8 w-8 text-purple-600" />

                        <span className="text-sm font-semibold text-gray-800">
                            Choose your work file
                        </span>

                        <span className="mt-1 text-xs text-gray-500">
                            Video, image, ZIP, PDF, etc.
                        </span>

                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                setFile(e.target.files?.[0] || null);
                            }}
                        />
                    </label>

                    {file && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                            <FileUp className="h-5 w-5 text-purple-600" />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                    {file.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-gray-200 p-5">

                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload Work'}
                    </button>

                </div>
            </div>
        </div>
    );
};