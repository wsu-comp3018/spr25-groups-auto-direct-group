import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import api from "../data/api-calls";

function MyAdviceRequestsPage({ token }) {
  const [adviceRequests, setAdviceRequests] = useState([]);
  const [employees, setEmployees] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [initialAssignments, setInitialAssignments] = useState({});
  const [showSave, setShowSave] = useState({});
  const [activeFilter, setActiveFilter] = useState("in-progress");
  const userID = Cookies.get("auto-direct-userID");
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [closureNotes, setClosureNotes] = useState('');

  // Get requests of the user, dynamically filter per status and search

  const fetchAdviceRequests = useCallback(async (status, query) => {
    let adviceRequestAPI = "";
    const params = new URLSearchParams();

    switch (status) {
      case "in-progress":
        adviceRequestAPI = api + "/admin/my-requests/in-progress";
        break;
      case "completed":
        adviceRequestAPI = api + "/admin/my-requests/completed";
        break;
    }

    if (userID) {
      params.append('userID', userID);
    } else {
      console.warn("Frontend: userID is undefined or empty. Requests will not be filtered by employee.");
    }

    if (query) {
      params.append('search', query);
    }

    const queryString = params.toString();
    if (queryString) {
      adviceRequestAPI += `?${queryString}`;
    }

    try {
      const res = await fetch(adviceRequestAPI, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, Message: ${errorText}`);
      }
      const data = await res.json();

      const formattedData = data.map(req => ({
        id: req.requestID,
        name: `${req.firstName} ${req.lastName}`,
        email: req.emailAddress,
        phone: req.phone,
        carMake: req.makeName,
        carModel: req.modelName,
        message: req.description,
        submittedAt: req.submittedAt,
        status: req.status,
        employeeID: req.employeeID
      }));
      setAdviceRequests(formattedData);

      const newInitialAssignments = {};
      const newAssignments = {};
      formattedData.forEach(req => {
        newInitialAssignments[req.id] = req.employeeID || "";
        newAssignments[req.id] = req.employeeID || "";
      });
      setInitialAssignments(newInitialAssignments);
      setAssignments(newAssignments);
      setShowSave({});
    } catch (err) {
      console.error(`Error fetching ${status} advice requests:`, err);
    }
  }, [userID, token]);

  // Delay in search queries so it doesn't do every letter

  useEffect(() => {
    if (!searchTimeout) {
        fetchAdviceRequests(activeFilter, searchQuery);
    }
  }, [activeFilter, fetchAdviceRequests]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchAdviceRequests(activeFilter, searchQuery);
    }, 300);

    setSearchTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
  }, [searchQuery, activeFilter, fetchAdviceRequests]);

  // Get list of employees for drop-down

  useEffect(() => {
    fetch(api + "/admin/advice-requests/employees")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setEmployees(data);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const handleAssignEmployee = (requestID, employeeID) => {
    fetch(api + `/admin/advice-requests/assign/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ requestID, employeeID }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to assign employee");
        }
        return res.json();
      })
      .then(() => {
        setInitialAssignments((prev) => ({ ...prev, [requestID]: employeeID }));
        setShowSave((prev) => ({ ...prev, [requestID]: false }));
        fetchAdviceRequests(activeFilter, searchQuery);
      })
      .catch((err) => console.error(err));
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
  };

  const handleViewDescription = (data) => {
    setRequestData(data);
    setIsRequestOpen(true);
  };

  const closeRequest = () => {
    setIsRequestOpen(false);
  };

  const closeResolve = () => {
    setIsResolveOpen(false);
  };

  const handleOpenResolveModal = (data) => {
    setRequestData(data);
    setIsResolveOpen(true);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Process details entered and pass to closing API
  const handleConfirmResolve = async () => {

    try {
      const res = await fetch(api + `/admin/my-requests/close/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestID: requestData.id,
          closeNotes: closureNotes
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error status: ${res.status}, Message: ${errorText}`);
      }

      const data = await res.json();
      console.log("Request closed successfully:", data);

      closeResolve();
      fetchAdviceRequests(activeFilter, searchQuery);
    } catch (err) {
      console.error("Error closing request:", err);
    }
  };  

  return (
    <div className="p-8 max-w-7xl mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        My Requests
      </h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={() => handleFilterClick("in-progress")}
            className={`text-sm px-4 py-2 rounded border font-semibold ${
              activeFilter === "in-progress"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleFilterClick("completed")}
            className={`text-sm px-4 py-2 rounded border font-semibold ${
              activeFilter === "completed"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search requests by email address"
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded border hover:bg-gray-100 w-70"
          />
        </div>
      </div>

      {adviceRequests.length === 0 ? (
        <p className="text-gray-500">No {activeFilter} requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-3 px-6 font-medium text-center">Name</th>
                <th className="py-3 px-6 font-medium text-center">Email</th>
                <th className="py-3 px-6 font-medium text-center">Phone</th>
                <th className="py-3 px-6 font-medium text-center">Car</th>
                <th className="py-3 px-6 font-medium text-center"></th>
                <th className="py-3 px-6 font-medium text-center">Submitted</th>
                <th className="py-3 px-6 font-medium text-center">Status</th>
                <th className="py-3 px-6 font-medium text-center">Assigned To</th>
                <th className="py-3 px-6 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adviceRequests.map((req) => (
                <React.Fragment key={req.id}>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{req.name}</td>
                    <td className="py-3 px-4">{req.email}</td>
                    <td className="py-3 px-4">{req.phone}</td>
                    <td className="py-3 px-4">{req.carMake} {req.carModel}</td>
                    <td className="py-2 px-1">
                      <button
                        onClick={() => handleViewDescription({
                          description: req.message,
                          name: req.name,
                          makeName: req.carMake,
                          modelName: req.carModel
                        })}
                        className="hover:bg-gray-100 p-1 rounded"
                      >
                        <img
                          src="../../public/assets/speech_bubble.png"
                          alt="View question"
                          title="View question"
                          className="w-6 h-6"
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4 ">
                      {new Date(req.submittedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{req.status}</td>
                    <td>
                      <select
                        value={assignments[req.id] || ""}
                        onChange={(e) => {
                          const selected = e.target.value;
                          setAssignments((prev) => ({ ...prev, [req.id]: selected }));
                          const initialValue = initialAssignments[req.id] || "";
                          const shouldShowSave = selected !== "" && selected !== initialValue;
                          setShowSave((prev) => ({ ...prev, [req.id]: shouldShowSave }));
                        }}
                        className="border p-1 rounded"
                        disabled={activeFilter === "completed"}
                      >
                        <option value="">
                          {activeFilter === "completed" ? "N/A" : "Assign employee"}
                        </option>
                        {employees && employees.length > 0 && (
                          employees.map((emp) => (
                            <option key={emp.userID} value={emp.userID}>
                              {emp.firstName + " " + emp.lastName}
                            </option>
                          ))
                        )}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right flex gap-2">
                      {req.status === "In Progress" && (
                        <>
                          <button
                            className="hover:bg-gray-100"
                            onClick={() => handleOpenResolveModal({
                              id: req.id,
                              name: req.name,
                              makeName: req.carMake,
                              modelName: req.carModel
                            })}
                          >
                            <img
                              src="../../public/assets/approve_icon.png"
                              alt="Resolve Request"
                              title="Resolve Request"
                              className="w-6 h-6"
                            />
                          </button>
                        </>
                      )}
                      {showSave[req.id] && (
                        <button
                          onClick={() => handleAssignEmployee(req.id, assignments[req.id])}
                          className="bg-black hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Save
                        </button>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for viewing the question */}
      {isRequestOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsRequestOpen(false)}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-900">{requestData.name} has asked the below question about {requestData.makeName + " " +
              requestData.modelName}:
            </h3>
            <p className="text-gray-700">{requestData.description}</p>
            <div className="mt-6 text-right">
              <button
                onClick={closeRequest}
                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for closing the request */}
      {isResolveOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsResolveOpen(false)}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900">Please enter closure notes for {requestData.name}'s question about {requestData.makeName + " " +
              requestData.modelName}:
            </h3>
            <div className="mb-4">
              <textarea
                id="closureNotes"
                rows="5"
                className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="Enter notes about the answer you provided to the customer..."
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}                
              ></textarea>
            </div>            
            <div className="mt-6 text-right flex justify-end gap-2">
              <button
                onClick={closeResolve}
                className="bg-gray-100 hover:bg-white text-black font-bold py-2 px-4 rounded border border-black-300"
              >
                Cancel
              </button>              
              <button
                onClick={handleConfirmResolve}
                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Close Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAdviceRequestsPage;
