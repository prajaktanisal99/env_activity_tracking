import { useContext, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { ADMIN_ACCESS } from "../../constants/url";
import AuthContext from "../../context/AuthProvider";
import "./styles.css";

export const ViewAdminRequests = () => {
  const { auth } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminRequests, setAdminRequests] = useState([]);
  const [processingRequests, setProcessingRequests] = useState([]);

  const fetchAdminRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(ADMIN_ACCESS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });
      setAdminRequests(response?.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch admin requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminRequests();
  }, []);

  const handleGrantRequest = async (username, permission) => {
    try {
      // Add request to the processing list
      setProcessingRequests((prev) => [...prev, username]);

      const response = await axiosPrivate.post(
        ADMIN_ACCESS,
        JSON.stringify({ username, permission }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );

      alert(response?.data?.message || "Request processed successfully");

      // Update the state to remove the processed request
      setAdminRequests((prevRequests) =>
        prevRequests.filter((request) => request.username !== username)
      );
    } catch (err) {
      alert(err.message || "Failed to process the request");
    } finally {
      // Remove the request from the processing list
      setProcessingRequests((prev) =>
        prev.filter((processing) => processing !== username)
      );
    }
  };

  return (
    <div>
      {loading && <p>Loading requests...</p>}
      {adminRequests.length > 0 ? (
        <ul className="requestsContainer">
          {adminRequests.map((request) => (
            <div className="requestCard">
              <div className="requestDetails">
                <h3>{request.username}</h3>
                <div className="requestActionButtons">
                  <button
                    onClick={() => handleGrantRequest(request.username, true)}
                    className=""
                    disabled={processingRequests.includes(request.username)}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleGrantRequest(request.username, false)}
                    className=""
                    disabled={processingRequests.includes(request.username)}
                  >
                    Reject
                  </button>
                </div>
              </div>
              <p>
                <strong>Requested At:</strong>{" "}
                {new Date(request.requestedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </ul>
      ) : (
        <p>No pending admin requests found.</p>
      )}
    </div>
  );
};
