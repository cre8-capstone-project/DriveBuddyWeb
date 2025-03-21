import axios from "axios";
import { formatDate } from "../utils/utils";
import { getAuth } from "firebase/auth";
//const API_URL = "https://drivebuddy.wmdd4950.com/api/";
const API_URL = "http://localhost:3000/";
// Common setting for API requests
const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosClient.interceptors.request.use(
  async (config) => {
    const { currentUser } = getAuth();
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(true);
        config.headers["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to get token:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
/**
 * Retrieves a driver by their ID.
 * @param id - The ID of the driver.
 * @returns The driver object or undefined if an error occurs.
 */
const getDriverByID = async (id) => {
  try {
    const response = await axiosClient.get(`/drivers/${id}`, {
      timeout: 5000,
    });
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      user_type: response.data.user_type,
      vehicle_type: response.data.vehicle_type,
      birthday: response.data.birthday
        ? new Date(response.data.birthday.seconds * 1000) // Convert Firestore Timestamp to Date
        : null,
      picture_url: response.data.picture_url,
    };
  } catch (error) {
    console.error(error);
  }
};
/**
 * Retrieves drivers by the company ID.
 * @param company_id - The ID of the company.
 * @returns The driver list or undefined if an error occurs.
 */
const getDriversByCompany = async (company_id) => {
  try {
    const response = await axiosClient.get(`/drivers/company/${company_id}`, {
      timeout: 50000,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Deletes a driver by their ID.
 * @param driverId - The ID of the driver to delete.
 * @returns A success message or undefined if an error occurs.
 */
const deleteDriver = async (driverId) => {
  try {
    const response = await axiosClient.delete(`/drivers/${driverId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
/**
 *
 * @param {*} driverId
 * @param {*} date
 * @returns
 */
const getFaceDetectionSummaryByDay = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/daily-summary/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 *
 * @param {*} driverId
 * @param {*} date
 * @returns
 */
const getFaceDetectionSummaryByWeek = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/weekly-summary/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 *
 * @param {*} driverId
 * @param {*} date
 * @returns
 */
const getFaceDetectionSummaryByMonth = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/monthly-summary/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 *
 * @param {*} driverId
 * @param {*} date
 * @returns
 */
const getFaceDetectionSummaryByYear = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/yearly-summary/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 *
 * @param {*} companyId
 * @param {*} date
 * @returns
 */
const getAverageFaceDetectionHistoryDataByDay = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/daily-average/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 *
 * @param {*} companyId
 * @param {*} date
 * @returns
 */
const getAverageFaceDetectionHistoryDataByWeek = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/weekly-average/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 *
 * @param {*} companyId
 * @param {*} date
 * @returns
 */
const getAverageFaceDetectionHistoryDataByMonth = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/monthly-average/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 *
 * @param {*} companyId
 * @param {*} date
 * @returns
 */
const getAverageFaceDetectionHistoryDataByYear = async (companyId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/yearly-average/?companyID=${companyId}&date=${formatDate(date)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

/**
 *
 * @param {*} code
 * @returns
 */
const getInvitationCode = async (code) => {
  try {
    const response = await axiosClient.get(`/invitations/${code}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data);

        // You can handle specific status codes if needed
        if (error.response.status === 404) {
          console.error("Invitation not found");
        }

        throw new Error(
          error.response.data.error || "Error retrieving invitation"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
/**
 *
 * @param {*} company_id
 * @returns
 */
const getInvitationsByCompany = async (company_id) => {
  try {
    const response = await axiosClient.get(
      `/invitations/?company_id=${company_id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data);

        // You can handle specific status codes if needed
        if (error.response.status === 404) {
          console.error("Invitation not found");
        }

        throw new Error(
          error.response.data.error || "Error retrieving invitation"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
/**
 *
 * @param {*} updatedInvitationObj
 * @returns
 */
const updateInvitationStatus = async (updatedInvitationObj) => {
  try {
    const response = await axiosClient.put(
      `/invitations/${updatedInvitationObj.id}`,
      updatedInvitationObj
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data);

        // You can handle specific status codes if needed
        if (error.response.status === 404) {
          console.error("Invitation not found");
        }

        throw new Error(
          error.response.data.error || "Error retrieving invitation"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
/**
 *
 * @param {*} invitationObj
 * @returns
 */
const addInvitation = async (invitationObj) => {
  try {
    const newInvitationObj = {
      company_id: invitationObj.company_id,
      createdAt: invitationObj.createdAt,
      invitation_code: invitationObj.invitation_code,
      recipient_name: invitationObj.recipient_name,
      recipient_email: invitationObj.recipient_email,
      status: "pending",
    };
    const response = await axiosClient.post(`/invitations/`, newInvitationObj);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data);

        // You can handle specific status codes if needed
        if (error.response.status === 404) {
          console.error("Invitation not found");
        }

        throw new Error(
          error.response.data.error || "Error retrieving invitation"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
/**
 *
 * @param {*} invitationID
 * @returns
 */
const deleteInvitation = async (invitationID) => {
  try {
    const response = await axiosClient.delete(`/invitations/${invitationID}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data);

        // You can handle specific status codes if needed
        if (error.response.status === 404) {
          console.error("Invitation not found");
        }

        throw new Error(
          error.response.data.error || "Error retrieving invitation"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
/**
 *
 * @param {*} companyName
 * @returns
 */
const createCompany = async (companyName) => {
  try {
    const response = await axiosClient.post(`/companies`, {
      name: companyName,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data);

        // You can handle specific status codes if needed
        if (error.response.status === 404) {
          console.error("Company not found");
        }

        throw new Error(
          error.response.data.error || "Error retrieving company"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
/**
 *
 * @param {*} adminID
 * @param {*} newAdminObj
 * @returns
 */
const createAdmin = async (adminID, newAdminObj) => {
  try {
    const response = await axiosClient.post(`/admins/${adminID}`, newAdminObj);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data);

        // You can handle specific status codes if needed
        if (error.response.status === 404) {
          console.error("Admin not found");
        }

        throw new Error(error.response.data.error || "Error retrieving admin");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
const getCompanyByID = async (company_id) => {
  try {
    const response = await axiosClient.get(`/companies/${company_id}`, {
      timeout: 5000,
    });
    return {
      id: response.data.id,
      name: response.data.name,
    };
  } catch (error) {
    console.error(error);
  }
};
export {
  getDriverByID,
  getDriversByCompany,
  deleteDriver,
  getFaceDetectionSummaryByDay,
  getFaceDetectionSummaryByWeek,
  getFaceDetectionSummaryByMonth,
  getFaceDetectionSummaryByYear,
  getAverageFaceDetectionHistoryDataByDay,
  getAverageFaceDetectionHistoryDataByWeek,
  getAverageFaceDetectionHistoryDataByMonth,
  getAverageFaceDetectionHistoryDataByYear,
  getInvitationCode,
  getInvitationsByCompany,
  updateInvitationStatus,
  addInvitation,
  deleteInvitation,
  getCompanyByID,
  createCompany,
  createAdmin,
};
