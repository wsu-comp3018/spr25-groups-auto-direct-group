import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import api from "../data/api-calls";

function AdviceRequestQueue() {
  const [adviceRequests, setAdviceRequests] = useState([]);
  const [employees, setEmployees] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [initialAssignments, setInitialAssignments] = useState({});
  const [showSave, setShowSave] = useState({});
  const [activeFilter, setActiveFilter] = useState("unassigned");
  const userID = Cookies.get("auto-direct-userID");
  const token = Cookies.get("auto-direct-token");
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Dynamically fetch requests based on filter and search term

  const fetchAdviceRequests = useCallback(async (status, query) => {
    let adviceRequestAPI = "";

    switch (status) {
      case "unassigned":
        adviceRequestAPI = api + "/admin/advice-requests/unassigned";
        break;
      case "in-progress":
        adviceRequestAPI = api + "/admin/advice-requests/in-progress";
        break;
      case "completed":
        adviceRequestAPI = api + "/admin/advice-requests/completed";
        break;
    }

    if (query) {
      adviceRequestAPI += `?search=${encodeURIComponent(query)}`;
    }

    try {
      const res = await fetch(adviceRequestAPI);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
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
      console.error("Error fetching " + status + " advice requests:", err);
    }
  }, []);

  // Re-trigger getting requests when filter changes
  useEffect(() => {
    fetchAdviceRequests(activeFilter, searchQuery);
  }, [activeFilter, fetchAdviceRequests, searchQuery]);

  // Set a delay when searching
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (searchQuery.length > 0 || searchQuery === '') {
        fetchAdviceRequests(activeFilter, searchQuery);
      }
    }, 300);

    setSearchTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
  }, [searchQuery, activeFilter, fetchAdviceRequests]);

  // Get the employees for the assignment dropdown
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-6 text-black">
        Advice Request Queue
      </h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={() => handleFilterClick("unassigned")}
            className={`text-sm px-4 py-2 rounded font-semibold transition ${
              activeFilter === "unassigned"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            Unassigned
          </button>
          <button
            onClick={() => handleFilterClick("in-progress")}
            className={`text-sm px-4 py-2 rounded font-semibold transition ${
              activeFilter === "in-progress"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleFilterClick("completed")}
            className={`text-sm px-4 py-2 rounded font-semibold transition ${
              activeFilter === "completed"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300 hover:bg-gray-800 hover:text-white"
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
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:outline-none w-70"
          />
        </div>
      </div>

      {adviceRequests.length === 0 ? (
        <p className="text-gray-500">No {activeFilter} requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
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
                <th className="py-3 px-6 font-medium text-center">Save</th>
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
                        className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-xs"
                      >
                        View
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
                    <td className="py-3 px-4">
                      {showSave[req.id] && (
                        <button
                          onClick={() => handleAssignEmployee(req.id, assignments[req.id])}
                          className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded"
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
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdviceRequestQueue;