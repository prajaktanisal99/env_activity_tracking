const verifyRoles = (allowedRole) => {
  return (req, res, next) => {
    try {
      // Validate presence of role
      const userRole = req?.user?.UserInfo?.role;
      if (userRole === undefined) {
        console.error("No role found in the user object.");
        return res.sendStatus(401); // Unauthorized
      }

      if (userRole !== allowedRole) {
        console.error(`User role '${userRole}' is not authorized.`);
        return res.sendStatus(403); // Forbidden
      }

      next();
    } catch (error) {
      console.error("Error verifying role:", error.message);
      return res.sendStatus(500);
    }
  };
};

export default verifyRoles;
