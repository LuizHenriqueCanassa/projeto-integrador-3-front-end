export default function hasPermission(permissions: [object] | undefined, claimName: string, claimValue: string) {
    return permissions?.filter(({type, values}) => {
        return !!(type === claimName && values.includes(claimValue));
    }).length > 0;
}