export function authorize(roles = ['student', 'teacher', 'admin']) {
  return (req, res, next) => {
    if (!req.user.role) {
      res.status(401).json('You are not logged in!');
    } else if (!roles.includes(req.user.role)) {
      res.status(403).json('You do not have permission for this operation!');
    } else {
      next();
    }
  };
}
