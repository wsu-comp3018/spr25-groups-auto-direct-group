import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import UserRow from "../components/user-row"
import api from "../data/api-calls";

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("All");
//   const [roles, setRoles] = useState([]);

  useEffect(() => {
	const token = Cookies.get("auto-direct-token");
	fetch(api + '/admin/users', {method: 'GET', headers: {'Authorization': token} })
	.then((res) => { return res.json() })
	.then((data) => {
		setUsers(data.users);
	});
  }, []);

  const handleSaveClick = (user) => {
	const token = Cookies.get("auto-direct-token");
	fetch(api + '/admin/updateUser', 
		{
			method: 'PUT', 
			headers: {"Content-Type": "application/json", "Authorization": token}, 
			body: JSON.stringify({user: user}) 
		})
	.then((res) => {
		let data = res.json();
		if(!res.ok) { 
			window.alert('save failed ' + data.error);
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
			headers: {"Content-Type": "application/json", "Authorization": token}, 
			body: JSON.stringify({userID: id}) 
		})
	.then((res) => {
		let data = res.json();
		if(res.status != 200) { 
			window.alert('disable failed ' + data.error);
			return;
		}
		
		const updatedUsers = users.filter((u) => u.userID !== userID);
		setUsers(updatedUsers);
	})
  };

  let filteredUsers =
    filterRole === "All" ? users : users.filter((u) => u.roles.includes(filterRole));

  return (
    <div className="p-8 w-auto max-w-max mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h2>

      <div className="mb-4 flex gap-3">
        {["All", "Administrator", "Customer", "Manufacturer", "Employee"].map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`text-sm px-4 py-2 rounded border hover:bg-gray-100 ${
              filterRole === role ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-3 px-4 font-medium">First Name</th>
                <th className="py-3 px-4 font-medium">Last Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Phone Number</th>
                <th className="py-3 px-4 font-medium">Roles</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Created</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
				<UserRow userData={user} handleSave={handleSaveClick} handleDelete={handleDelete} key={user.userID}/>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsersPage;
