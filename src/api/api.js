import axios from "axios";

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
 * Retrieves all drivers from the database.
 * @returns An array of drivers or an empty array if an error occurs.
 */
const getAllDrivers = async () => {
  try {
    const response = await axiosClient.get("/drivers");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Creates a new driver in the database.
 * @param driverObject - The driver data excluding the ID.
 * @returns The created driver object or undefined if an error occurs.
 */
const createDriver = async (driverObject) => {
  try {
    const response = await axiosClient.post("/drivers", driverObject);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates an existing driver by ID.
 * @param driverId - The ID of the driver to update.
 * @param driverObject - The updated driver data.
 * @returns The updated driver object or undefined if an error occurs.
 */
const updateDriver = async (driverId, driverObject) => {
  try {
    const response = await axiosClient.put(
      `/drivers/${driverId}`,
      driverObject
    );
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

//ToDo: Plan to do refactoring in the next sprint
const logFaceDetectionSessionData = async (sessionData) => {
  try {
    const response = await axiosClient.post(
      "/face-detection-session/register",
      sessionData
    );
    return response.data;
  } catch (error) {
    console.error("Error logging face detection session:", error);
    return null;
  }
};

// ToDo: Plan to do refactoring in the next sprint
const getFaceDetectionHistoryDataByDay = async (driverId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/daily/?userId=${driverId}&date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

// ToDo: Plan to do refactoring in the next sprint
const getFaceDetectionHistoryDataByWeek = async (driverId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/weekly/?userId=${driverId}&date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

// ToDo: Plan to do refactoring in the next sprint
const getFaceDetectionHistoryDataByMonth = async (driverId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/monthly/?userId=${driverId}&date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

// ToDo: Plan to do refactoring in the next sprint
const getFaceDetectionHistoryDataByYear = async (driverId, date) => {
  try {
    const response = await axiosClient.get(
      `/face-detection-session/yearly/?userId=${driverId}&date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

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
const addInvitation = async (invitationObj) => {
  try {
    const newInvitationObj = {
      company_id: invitationObj.company_id,
      createdAt: invitationObj.createdAt,
      invitation_code: invitationObj.invitationCode,
      recipient_name: invitationObj.name,
      recipient_email: invitationObj.email,
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
export {
  getDriverByID,
  getDriversByCompany,
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  logFaceDetectionSessionData,
  getFaceDetectionHistoryDataByDay,
  getFaceDetectionHistoryDataByWeek,
  getFaceDetectionHistoryDataByMonth,
  getFaceDetectionHistoryDataByYear,
  getInvitationCode,
  getInvitationsByCompany,
  updateInvitationStatus,
  addInvitation,
  deleteInvitation,
};
