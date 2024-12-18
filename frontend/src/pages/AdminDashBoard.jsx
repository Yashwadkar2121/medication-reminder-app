import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/auth/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    console.log(userId);
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center m-10 text-3xl">{error}</div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                No.
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Name
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Email
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Role
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Created At
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.ID} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                  {index + 1}
                </td>

                <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                  {user.Name}
                </td>
                <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                  {user.Email}
                </td>
                <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                  {user.Role}
                </td>
                <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                  {new Date(user.CreatedAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal whitespace-nowrap">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 md:px-2 md:py-2 lg:px-4 lg:py-1 rounded text-xs md:text-sm lg:text-normal"
                    onClick={() => handleViewDetails(user.ID)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashBoard;
