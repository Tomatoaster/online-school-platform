export function authorize(roles = ['student', 'teacher', 'admin']) {
  return (req, res, next) => {
    if (!req.session.role) {
      res
        .status(401)
        .render('error', { message: 'You are not logged in!', username: req.session.username, role: req.session.role });
    } else if (!roles.includes(req.session.role)) {
      res.status(403).render('error', {
        message: 'You do not have permission for this operation!',
        username: req.session.username,
        role: req.session.role,
      });
    } else {
      next();
    }
  };
}
