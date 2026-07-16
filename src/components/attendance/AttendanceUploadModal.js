import React, { useState } from "react";
import { Modal } from "bootstrap";
import attendanceService from "../../services/attendanceService";
import { getSafeApiErrorMessage } from "../../api/apiClient";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

function AttendanceUploadModal({ modalRef, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [year, setYear] = useState(new Date().getFullYear());

  const [file, setFile] = useState(null);

  const [error, setError] = useState("");

  const resetForm = () => {
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setFile(null);
    setError("");

    const fileInput = document.getElementById("attendanceCsv");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!file) {
      setError("Please select CSV file.");
      return;
    }

    const formData = new FormData();

    formData.append("attendance_month", month);
    formData.append("attendance_year", year);
    formData.append("file", file);

    setLoading(true);

    try {
      await attendanceService.upload(formData);

      resetForm();

      if (onSuccess) {
        onSuccess();
      }

      Modal.getOrCreateInstance(modalRef.current).hide();
    } catch (err) {
      setError(getSafeApiErrorMessage(err, "Failed to upload attendance."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Upload Attendance CSV</h5>

              <button
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                type="button"
              />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Month</label>

                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Year</label>

                <input
                  className="form-control"
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">CSV File</label>

                <input
                  id="attendanceCsv"
                  type="file"
                  accept=".csv"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              <button
                className="btn btn-success"
                type="submit"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AttendanceUploadModal;
