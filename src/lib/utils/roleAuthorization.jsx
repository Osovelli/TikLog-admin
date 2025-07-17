export const hasPermission = (userRoles, allowedRoles) => {
    return userRoles?.some((role) => allowedRoles?.includes(role));
  };