import apiClient from "../api/apiClient";

const attendanceService = {
  getAll(params) {
    return apiClient.get("/attendance", {
      params,
    });
  },

  get(id) {
    return apiClient.get(`/attendance/${id}`);
  },

  create(data) {
    return apiClient.post("/attendance", data);
  },

  update(id, data) {
    return apiClient.put(`/attendance/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/attendance/${id}`);
  },

  upload(formData) {
    return apiClient.post("/attendance/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  downloadTemplate() {
    return apiClient.get("/attendance/template/download", {
      responseType: "blob",
    });
  },

  employeeOptions() {
    return apiClient.get("/employees/options");
  },
};

export default attendanceService;
