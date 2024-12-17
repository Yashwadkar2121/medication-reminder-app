import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

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
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/medicine/${medicineID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted medicine from the state
      setMedicines((prev) =>
        prev.filter((medicine) => medicine.ID !== medicineID)
      );

      alert("Medicine deleted successfully!");
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

      // Update the medicines list
      setMedicines((prev) =>
        prev.map((medicine) =>
          medicine.ID === updatedMedicine.ID ? response.data : medicine
        )
      );

      // Reset acknowledgment log for the updated medicine
      setAcknowledgmentLogs((prevLogs) => ({
        ...prevLogs,
        [updatedMedicine.ID]: null,
      }));

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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center text-3xl mt-10"> {error}</div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Medicines</h2>
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
                Dose
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Time
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Status
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Timestamp
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Actions
              </th>
              <th className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                Manage
              </th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => {
              const acknowledgment = acknowledgmentLogs[medicine.ID] || {};
              const canAcknowledge =
                !acknowledgment.timestamp ||
                !isSameDay(acknowledgment.timestamp);

              return (
                <tr key={medicine.ID} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                    {medicine.Name}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                    {medicine.Dosage}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                    {medicine.ScheduleTime}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 lg:px-2 lg:py-2 text-center text-xs md:text-sm lg:text-normal">
                    {acknowledgment.status || "Pending"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center text-xs md:text-sm lg:text-normal">
                    {acknowledgment.timestamp
                      ? new Date(acknowledgment.timestamp).toLocaleString([], {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center text-xs md:text-sm lg:text-normal whitespace-nowrap">
                    <button
                      onClick={() =>
                        canAcknowledge &&
                        handleAcknowledgment(medicine.ID, "Taken")
                      }
                      disabled={!canAcknowledge}
                      className={`${
                        !canAcknowledge ? "bg-gray-400" : "bg-green-500"
                      } text-white px-2 py-1 md:px-2 md:py-2 lg:px-4 lg:py-1 rounded mr-2 hover:bg-green-600 text-xs md:text-sm lg:text-normal`}
                    >
                      Take
                    </button>
                    <button
                      onClick={() =>
                        canAcknowledge &&
                        handleAcknowledgment(medicine.ID, "Missed")
                      }
                      disabled={!canAcknowledge}
                      className={`${
                        !canAcknowledge ? "bg-gray-400" : "bg-red-500"
                      } text-white px-2 py-1  md:px-2 md:py-2 lg:px-4 lg:py-1 rounded hover:bg-red-600 text-xs md:text-sm lg:text-normal`}
                    >
                      Miss
                    </button>
                  </td>
                  <td className="border border-gray-300  text-center text-xs md:text-sm lg:text-normal whitespace-nowrap">
                    <button
                      onClick={() => handleUpdateMedicine(medicine)}
                      className="text-blue-500 py-1 lg:px-2 lg:py-2 rounded mr-2 hover:text-blue-600 text-sm md:text-lg lg:text-xl"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteMedicine(medicine.ID)}
                      className="text-red-500 py-1 lg:px-2 lg:py-2 rounded hover:text-red-800 text-sm md:text-lg lg:text-xl"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-5 md:p-0">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
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
            className="bg-gray-500 text-white px-2 py-1 lg:px-2 lg:py-2 rounded mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-2 py-1 lg:px-2 lg:py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Prop validation for UpdateModal component
UpdateModal.propTypes = {
  medicine: PropTypes.shape({
    ID: PropTypes.number.isRequired,
    Name: PropTypes.string.isRequired,
    Dosage: PropTypes.string.isRequired,
    ScheduleTime: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Home;
