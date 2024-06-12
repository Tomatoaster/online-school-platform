export function authorize(roles = ['student', 'teacher', 'admin']) {
  return (req, res, next) => {
    if (!req.user.role) {
      res
        .status(401)
        .render('error', { message: 'You are not logged in!', username: req.user.username, role: req.user.role });
    } else if (!roles.includes(req.user.role)) {
      res.status(403).render('error', {
        message: 'You do not have permission for this operation!',
        username: req.user.username,
        role: req.user.role,
      });
    } else {
      next();
    }
  };
}
