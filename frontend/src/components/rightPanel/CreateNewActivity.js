import { useContext, useRef, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { axiosPrivate } from "./../../api/axios";
import { ACTIVITY } from "./../../constants/url";
import "./../home.css";

export const CreateNewActivity = ({ setRightPanel }) => {
  const userRef = useRef(null);
  const errRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];
  const { auth } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Outdoor");
  const [location, setLocation] = useState("");
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [date, setDate] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const handleCreateNewActivity = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosPrivate.post(
      ,
        JSON.stringify({
          type,
          description,
          title,
          organizer: auth.user,
          volunteerCount,
          date,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },

          withCredentials: true,
        }
      );
      setRightPanel("viewAllActivities");
      // navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      // errRef.current.focus();
    }
  };

  return (
    <form className="createActivityForm" onSubmit={handleCreateNewActivity}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        ref={userRef}
        autoComplete="off"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required
      />

      <label htmlFor="description">Description:</label>
      <input
        type="text"
        id="description"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        required
      />

      <label htmlFor="type">Type:</label>
      <select
        id="type"
        onChange={(e) => setType(e.target.value)}
        value={type}
        required
      >
        <option value="Beach Cleanup">Beach Cleanup</option>
        <option value="Tree Plantation">Tree Plantation</option>
        <option value="Recycling Drive">Recycling Drive</option>
        <option value="Plogging">Plogging</option>
        <option value="E-waste Collection">E-waste Collection</option>
        <option value="Campaign">Campaign</option>
      </select>

      <label htmlFor="location">Location:</label>
      <input
        type="text"
        id="location"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        // required
      />

      <label htmlFor="volunteerCount">Volunteer Count:</label>
      <input
        type="number"
        id="volunteerCount"
        onChange={(e) => setVolunteerCount(Number(e.target.value))}
        value={volunteerCount}
        min="10" // Minimum volunteer count
        required
      />

      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        onChange={(e) => setDate(e.target.value)}
        value={date}
        min={today} // Ensure date is not in the past
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};
