// 404
export default function handleNotFound(req, res) {
  res.status(404).render('error', {
    message: 'The requested endpoint is not found',
    username: req.user.username,
    role: req.user.role,
  });
}
