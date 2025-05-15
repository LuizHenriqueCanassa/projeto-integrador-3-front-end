export default function hasPermission(permissions: [any] | undefined, claimName: string, claimValue: string) {
    if (permissions === undefined) {
        return false;
    }

    return permissions?.filter(({type, values}) => {
        return !!(type === claimName && values.includes(claimValue));
    }).length > 0;
}