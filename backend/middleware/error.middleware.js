// 404
export default function handleNotFound(req, res) {
  res.status(404).json('The requested endpoint is not found');
}
