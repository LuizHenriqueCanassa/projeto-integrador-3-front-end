export default function hasRole(roles: Array<string>, userRoles: string[] | undefined): boolean {
    if (userRoles === undefined) {
        return false;
    }

    if (userRoles.includes("Root")) {
        return true;
    }

    return roles.filter(role => {
        return userRoles.includes(role);
    }).length > 0
}