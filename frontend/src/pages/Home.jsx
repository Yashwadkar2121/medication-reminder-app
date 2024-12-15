import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/medicine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicines(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Medicines</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Dose</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              ScheduleTime
            </th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            // Using medicine.id as the key, ensure it's unique in your data
            <tr
              key={medicine.id || `${medicine.Name}-${medicine.ScheduleTime}`}
              className="hover:bg-gray-100"
            >
              <td className="border border-gray-300 px-4 py-2">
                {medicine.Name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {medicine.Dosage}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {medicine.ScheduleTime}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
