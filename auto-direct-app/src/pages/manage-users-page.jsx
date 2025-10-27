import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import UserRow from "../components/user-row";
import AddUserModal from "../components/AddUserModal";
import InviteUserModal from "../components/InviteUserModal";
import api from "../data/api-calls";
import toast from 'react-hot-toast';

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "pending"
//   const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = Cookies.get("auto-direct-token");
    
    // Fetch users
    fetch(api + '/admin/users', {method: 'GET', headers: {'Authorization': `Bearer ${token}`} })
    .then((res) => { return res.json() })
    .then((data) => {
      setUsers(data.users);
    });

    // Fetch pending registrations
    fetch(api + '/admin/pendingRegistrations', {method: 'GET', headers: {'Authorization': `Bearer ${token}`} })
    .then((res) => { return res.json() })
    .then((data) => {
      setPendingRegistrations(data.pendingRegistrations || []);
    });
  }, []);

  const handleSaveClick = (user) => {
	const token = Cookies.get("auto-direct-token");
	fetch(api + '/admin/updateUser', 
		{
			method: 'PUT', 
			headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
			body: JSON.stringify({user: user}) 
		})
	.then((res) => {
		let data = res.json();
		if(!res.ok) { 
			toast.error('Save failed: ' + data.error);
			return;
		}
	})
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;
	const token = Cookies.get("auto-direct-token");
	fetch(api + '/admin/disableUser', 
		{
			method: 'PUT', 
			headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
			body: JSON.stringify({userID: id}) 
		})
	.then(async (res) => {
		const data = await res.json();
		if(res.status != 200) { 
			toast.error('Failed to delete user: ' + data.error);
			return;
		}
		
		const updatedUsers = users.filter((u) => u.userID !== id);
		setUsers(updatedUsers);
		toast.success('User deleted successfully!');
	})
	.catch(error => {
		toast.error('Error deleting user: ' + error.message);
	})
  };

  const handleReactivate = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reactivate this user?"
    );
    if (!confirmed) return;
	const token = Cookies.get("auto-direct-token");
	
	fetch(api + '/admin/reactivateUser', 
		{
			method: 'PUT', 
			headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
			body: JSON.stringify({userID: id}) 
		})
	.then(async (res) => {
		const data = await res.json();
		if(res.status != 200) { 
			toast.error('Failed to reactivate user: ' + data.error);
			return;
		}
		
		// Refresh the users list to show updated status
		refreshUsers();
		toast.success('User reactivated successfully!');
	})
	.catch(error => {
		toast.error('Error reactivating user: ' + error.message);
	})
  };

  const refreshUsers = () => {
    const token = Cookies.get("auto-direct-token");
    fetch(api + '/admin/users', {method: 'GET', headers: {'Authorization': `Bearer ${token}`} })
    .then((res) => { return res.json() })
    .then((data) => {
      setUsers(data.users);
    });
  };

  const handleUserAdded = () => {
    refreshUsers();
  };

  const handleResendInvitation = async (token) => {
    const confirmed = window.confirm("Are you sure you want to resend the invitation email?");
    if (!confirmed) return;

    const tokenAuth = Cookies.get("auto-direct-token");
    try {
      const response = await fetch(api + '/admin/resendInvitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenAuth}`
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Invitation email sent successfully!');
      } else {
        toast.error('Failed to send invitation: ' + data.error);
      }
    } catch (error) {
      toast.error('Error sending invitation: ' + error.message);
    }
  };

  const handleRevokeInvitation = async (token) => {
    const confirmed = window.confirm("Are you sure you want to revoke this invitation? This action cannot be undone.");
    if (!confirmed) return;

    const tokenAuth = Cookies.get("auto-direct-token");
    try {
      const response = await fetch(api + `/admin/pendingRegistrations/${token}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenAuth}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Invitation revoked successfully!');
        // Refresh pending registrations
        const refreshResponse = await fetch(api + '/admin/pendingRegistrations', {
          method: 'GET', 
          headers: {'Authorization': `Bearer ${tokenAuth}`}
        });
        const refreshData = await refreshResponse.json();
        setPendingRegistrations(refreshData.pendingRegistrations || []);
      } else {
        toast.error('Failed to revoke invitation: ' + data.error);
      }
    } catch (error) {
      toast.error('Error revoking invitation: ' + error.message);
    }
  };

  let filteredUsers = users.filter((user) => {
    const roleMatch = filterRole === "All" || user.roles.includes(filterRole);
    const statusMatch = filterStatus === "All" || user.user_status === filterStatus;
    return roleMatch && statusMatch;
  });

  return (
    <div className="p-8 w-auto max-w-max mx-auto pt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">Manage Users</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowInviteUserModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Invite User
          </button>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Active Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Registrations ({pendingRegistrations.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "users" ? (
        <>
          <div className="mb-4 space-y-3">
            <div className="flex gap-3">
              <span className="text-sm font-medium text-gray-700 self-center">Role:</span>
              {["All", "Administrator", "Customer", "Manufacturer", "Employee"].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`text-sm px-4 py-2 rounded hover:bg-gray-800 transition ${
                    filterRole === role ? "bg-black text-white font-semibold" : "bg-white text-black border border-gray-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <span className="text-sm font-medium text-gray-700 self-center">Status:</span>
              {["All", "Active", "Inactive"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`text-sm px-4 py-2 rounded hover:bg-gray-800 transition ${
                    filterStatus === status ? "bg-black text-white font-semibold" : "bg-white text-black border border-gray-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-3 px-6 font-medium text-center">First Name</th>
                    <th className="py-3 px-6 font-medium text-center">Last Name</th>
                    <th className="py-3 px-6 font-medium text-center">Email</th>
                    <th className="py-3 px-6 font-medium text-center">Phone Number</th>
                    <th className="py-3 px-6 font-medium text-center">Roles</th>
                    <th className="py-3 px-6 font-medium text-center">Status</th>
                    <th className="py-3 px-6 font-medium text-center">Created</th>
                    <th className="py-3 px-6 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <UserRow userData={user} handleSave={handleSaveClick} handleDelete={handleDelete} handleReactivate={handleReactivate} key={user.userID}/>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {pendingRegistrations.length === 0 ? (
            <p className="text-gray-500">No pending registrations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-3 px-6 font-medium text-center">Email</th>
                    <th className="py-3 px-6 font-medium text-center">Roles</th>
                    <th className="py-3 px-6 font-medium text-center">Invited</th>
                    <th className="py-3 px-6 font-medium text-center">Expires</th>
                    <th className="py-3 px-6 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRegistrations.map((pending) => (
                    <tr key={pending.token} className="border-b border-gray-200">
                      <td className="py-3 px-4">{pending.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {pending.roles.map((role, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">{new Date(pending.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{new Date(pending.expiresAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleResendInvitation(pending.token)}
                            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs"
                          >
                            Resend Email
                          </button>
                          <button
                            onClick={() => handleRevokeInvitation(pending.token)}
                            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs"
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={handleUserAdded}
      />

      <InviteUserModal
        isOpen={showInviteUserModal}
        onClose={() => setShowInviteUserModal(false)}
      />
    </div>
  );
}

export default ManageUsersPage;
