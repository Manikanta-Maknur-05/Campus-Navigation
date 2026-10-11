import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user } = useAuth();

  return (
    <main className="page">
      <h1>My Profile</h1>
      <p className="subtitle">This page is only visible when you are logged in.</p>

      <div className="details-card">
        <table className="details-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{user.role}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Profile;