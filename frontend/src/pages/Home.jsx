import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [medicines, setMedicines] = useState([]);
  const [acknowledgmentLogs, setAcknowledgmentLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const medicineResponse = await axios.get(
          "http://localhost:5000/api/medicine",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const logResponse = await axios.get(
          "http://localhost:5000/api/acknowledgment",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Mapping acknowledgment logs by medicine ID
        const logsByMedicineId = {};
        logResponse.data.acknowledgmentLogs.forEach((log) => {
          logsByMedicineId[log.MedicineID] = {
            status: log.Status,
            timestamp: log.Timestamp,
          };
        });

        setMedicines(medicineResponse.data);
        setAcknowledgmentLogs(logsByMedicineId);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleAcknowledgment = async (medicineID, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/acknowledgment/${medicineID}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update acknowledgment log for the medicine
      setAcknowledgmentLogs((prevLogs) => ({
        ...prevLogs,
        [medicineID]: {
          status: response.data.acknowledgmentLog.Status,
          timestamp: response.data.acknowledgmentLog.Timestamp,
        },
      }));
    } catch (err) {
      alert(err.response ? err.response.data.message : "Server error");
    }
  };

  const handleDeleteMedicine = async (medicineID) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/medicine/${medicineID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines((prev) =>
        prev.filter((medicine) => medicine.ID !== medicineID)
      );
    } catch (err) {
      alert(
        err.response ? err.response.data.message : "Failed to delete medicine"
      );
    }
  };

  const handleUpdateMedicine = (medicine) => {
    setCurrentMedicine(medicine);
    setShowUpdateModal(true);
  };

  const saveUpdatedMedicine = async (updatedMedicine) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/medicine/${updatedMedicine.ID}`,
        updatedMedicine,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedicines((prev) =>
        prev.map((medicine) =>
          medicine.ID === updatedMedicine.ID ? response.data : medicine
        )
      );

      setShowUpdateModal(false);
      setCurrentMedicine(null);
    } catch (err) {
      alert(
        err.response ? err.response.data.message : "Failed to update medicine"
      );
    }
  };

  const isSameDay = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Medicines</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-center">
              Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Dose
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              ScheduleTime
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Timestamp
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Actions
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Manage
            </th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => {
            const acknowledgment = acknowledgmentLogs[medicine.ID] || {};
            const canAcknowledge =
              !acknowledgment.timestamp || !isSameDay(acknowledgment.timestamp);

            return (
              <tr key={medicine.ID} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {medicine.Name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {medicine.Dosage}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {medicine.ScheduleTime}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {acknowledgment.status || "Pending"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {acknowledgment.timestamp
                    ? new Date(acknowledgment.timestamp).toLocaleString()
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() =>
                      canAcknowledge &&
                      handleAcknowledgment(medicine.ID, "Taken")
                    }
                    disabled={!canAcknowledge}
                    className={`${
                      !canAcknowledge ? "bg-gray-400" : "bg-green-500"
                    } text-white px-4 py-2 rounded mr-2 hover:bg-green-600`}
                  >
                    Taken
                  </button>
                  <button
                    onClick={() =>
                      canAcknowledge &&
                      handleAcknowledgment(medicine.ID, "Missed")
                    }
                    disabled={!canAcknowledge}
                    className={`${
                      !canAcknowledge ? "bg-gray-400" : "bg-red-500"
                    } text-white px-4 py-2 rounded hover:bg-red-600`}
                  >
                    Missed
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleUpdateMedicine(medicine)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteMedicine(medicine.ID)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateModal
          medicine={currentMedicine}
          onClose={() => setShowUpdateModal(false)}
          onSave={saveUpdatedMedicine}
        />
      )}
    </div>
  );
};

const UpdateModal = ({ medicine, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...medicine });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Update Medicine</h3>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Dosage</label>
          <input
            type="text"
            name="Dosage"
            value={formData.Dosage}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ScheduleTime</label>
          <input
            type="time"
            name="ScheduleTime"
            value={formData.ScheduleTime}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
