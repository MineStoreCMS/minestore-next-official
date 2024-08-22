export const imagePath = (path: string | null) => {
    if (!path) {
        return null;
    }

    const image = (process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '') + path;

    return image;
};
