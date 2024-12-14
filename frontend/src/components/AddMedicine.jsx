import { useState } from "react";
import axios from "axios";

const AddMedicine = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/medicine",
        {
          Name: name,
          Dosage: dosage,
          ScheduleTime: scheduleTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      setSuccess(true);
      setName("");
      setDosage("");
      setScheduleTime("");
      alert("Medicine added successfully!");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Add Medicine
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">
            Medicine added successfully!
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-600"
              htmlFor="name"
            >
              Medicine Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-600"
              htmlFor="dosage"
            >
              Dosage
            </label>
            <input
              type="text"
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-600"
              htmlFor="scheduleTime"
            >
              Schedule Time
            </label>
            <input
              type="time"
              id="scheduleTime"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Adding..." : "Add Medicine"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
