// Lấy trạng thái sider từ cookie và truyền sang view
module.exports = (req, res, next) => {
  res.locals.sidebarState = req.cookies?.admin_sider || 'show';
  next();
}; 