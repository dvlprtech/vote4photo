
export const forceExactType = <T>(obj: T) => {
    const exactObj = Object.keys(obj as object).reduce((acc: T, key: string) => {
        if (obj[key as keyof T]) {
            acc[key as keyof T] = obj[key as keyof T];
        }
        return acc;
    }, {} as T);
    return exactObj as T;
}
