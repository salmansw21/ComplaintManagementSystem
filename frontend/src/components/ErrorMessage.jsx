export default function ErrorMessage({ message }) {
  return message ? <div className="alert alert-danger">{message}</div> : null;
}
