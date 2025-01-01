export const verifyAccess = (userRole, requiredRole) => {
  return userRole === requiredRole;
};
