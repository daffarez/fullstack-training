import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingOverlay } from "./overlay";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [loadingState, setLoadingState] = useState({
    fetch: false,
    add: false,
    edit: false,
    delete: false,
  });
  const { name, email } = formData;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchUsers = async () => {
    setLoadingState((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.get("http://localhost:3001/api/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err.message);
    } finally {
      setTimeout(() => {
        setLoadingState((prev) => ({ ...prev, fetch: false }));
      }, 1000);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addUser = async () => {
    setLoadingState((prev) => ({ ...prev, add: true }));
    try {
      const res = await axios.post("http://localhost:3001/api/users", formData);
      setUsers((prev) => [...prev, res.data]);
      setError("");
    } catch (err) {
      setError("Error adding user");
      console.error("Error adding users:", err.message);
    } finally {
      setTimeout(() => {
        setLoadingState((prev) => ({ ...prev, add: false }));
      }, 1000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address");
      return;
    }

    if (isEdit) {
      editUser(formData.id, formData.name, formData.email);
    } else {
      addUser();
    }
  };

  const deleteUser = async (id) => {
    setLoadingState((prev) => ({ ...prev, delete: true }));
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setError("");
    } catch (error) {
      setError(`failed to delete user with id: ${id}`);
      console.error("Error deleting user:", error.message);
    } finally {
      setTimeout(() => {
        setLoadingState((prev) => ({ ...prev, delete: false }));
      }, 1000);
    }
  };

  const editUser = async (id, name, email) => {
    setLoadingState((prev) => ({ ...prev, edit: true }));
    try {
      await axios.put(`http://localhost:3001/api/users/${id}`, {
        name,
        email,
      });
      await fetchUsers();
      setFormData({ id: "", name: "", email: "" });
      setError("");
      setIsEdit(false);
    } catch (error) {
      setError(`error edit user with id: ${id}`);
      console.error("Error editing user:", error.message);
    } finally {
      setTimeout(() => {
        setLoadingState((prev) => ({ ...prev, edit: false }));
      }, 1000);
    }
  };

  const handleEditButton = (id, name, email) => {
    setFormData({
      id,
      name,
      email,
    });
    setIsEdit(true);
  };

  const isLoading = Object.values(loadingState).some(Boolean);

  return (
    <>
      {isLoading && <LoadingOverlay loadingState={loadingState} />}
      <div style={{ padding: "2rem" }}>
        <h1>Users List</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.name} - {u.email}{" "}
                <button onClick={() => deleteUser(u.id)}>delete</button>
                <button onClick={() => handleEditButton(u.id, u.name, u.email)}>
                  edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <h2>{isEdit ? "Edit User" : "Add User"}</h2>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
