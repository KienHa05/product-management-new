module.exports.requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    const { role } = res.locals;

    if (!role || !role.permissions || !role.permissions.includes(requiredPermission)) {
      return res.status(403).send("Bạn không có quyền truy cập chức năng này!");
    }

    next();
  };
};
