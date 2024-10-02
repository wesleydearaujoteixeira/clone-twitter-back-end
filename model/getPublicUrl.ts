export const getPublicUrl = (url: string | null ) => {
    return `${process.env.BASE_URL}/${url}`;
}