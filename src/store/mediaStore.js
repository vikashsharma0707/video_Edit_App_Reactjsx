import { create } from 'zustand';
import { uid } from '@/utils/time';
import { getMediaType, generateMediaThumbnail } from '@/utils/media';

const mediaStore = create((set, get) => ({
  mediaItems: [],
  uploading: false,
  uploadProgress: {},

  addMedia: async (file) => {
    const id = uid();
    const type = getMediaType(file);
    const url = URL.createObjectURL(file);

    set((state) => ({
      mediaItems: [
        ...state.mediaItems,
        {
          id,
          name: file.name,
          type,
          url,
          file,
          size: file.size,
          thumbnail: null,
          duration: 0,
          width: 0,
          height: 0,
          loading: true,
        },
      ],
    }));

    try {
      const meta = await generateMediaThumbnail(file);
      set((state) => ({
        mediaItems: state.mediaItems.map((m) =>
          m.id === id
            ? {
                ...m,
                thumbnail: meta.thumbnail,
                duration: meta.duration,
                width: meta.width,
                height: meta.height,
                loading: false,
              }
            : m
        ),
      }));
    } catch {
      set((state) => ({
        mediaItems: state.mediaItems.map((m) =>
          m.id === id ? { ...m, loading: false } : m
        ),
      }));
    }
    return id;
  },

  removeMedia: (id) => {
    const item = get().mediaItems.find((m) => m.id === id);
    if (item?.url) URL.revokeObjectURL(item.url);
    set((state) => ({
      mediaItems: state.mediaItems.filter((m) => m.id !== id),
    }));
  },

  clearMedia: () => {
    get().mediaItems.forEach((m) => m.url && URL.revokeObjectURL(m.url));
    set({ mediaItems: [] });
  },

  getMedia: (id) => get().mediaItems.find((m) => m.id === id),

  setUploadProgress: (id, progress) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [id]: progress },
    })),
}));

export default mediaStore;
