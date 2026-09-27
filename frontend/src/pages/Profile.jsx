import { useAuth } from "../context/AuthContext";
export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="card">
      <div className="card-body">
        <h2>Profile</h2>
        <p>
          <strong>Name:</strong> {user?.firstName} {user?.lastName}
        </p>
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>
    </div>
  );
}
