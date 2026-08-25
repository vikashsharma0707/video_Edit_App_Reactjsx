import { useCallback, useState } from 'react';
import mediaStore from '@/store/mediaStore';
import { validateFile } from '@/utils/media';

export default function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  const uploadFiles = useCallback(async (files) => {
    setUploading(true);
    setErrors([]);
    const newErrors = [];

    for (const file of files) {
      const { valid, errors: fileErrors } = validateFile(file);
      if (!valid) {
        newErrors.push(...fileErrors);
        continue;
      }
      try {
        await mediaStore.getState().addMedia(file);
      } catch {
        newErrors.push(`Failed to upload: ${file.name}`);
      }
    }

    if (newErrors.length > 0) setErrors(newErrors);
    setUploading(false);
  }, []);

  return { uploadFiles, uploading, errors };
}
