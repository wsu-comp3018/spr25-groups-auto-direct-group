import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import getImageUrl from "../components/getImageUrl";
import api from "../data/api-calls";

const ProfilePage = () =>  {
  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    suburb: "",
    postcode: "",
    phoneNumber: "",
    streetNo: "",
    streetName: "",
    user_status: "Active", // Default to Active
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Fetch profile on load
  useEffect(() => {
    const token = Cookies.get("auto-direct-token");
    fetch(api + '/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.message === 'jwt expired') {
          Cookies.remove("auto-direct-token", { path: '' });
          Cookies.remove('auto-direct-userID', { path: '' });
          return;
        }
        setProfileData(data.user);
        setForm({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          suburb: data.user.suburb || "",
          postcode: data.user.postcode || "",
          phoneNumber: data.user.phone || "",
          streetNo: data.user.streetNo || "",
          streetName: data.user.streetName || "",
          user_status: data.user.user_status || "Active", // Pull from user data
        });
      })
      .catch((err) => console.error("Error retrieving user profile:", err));
  }, []);

  // Input change handler for editing
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save handler for PUT request
  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    const token = Cookies.get("auto-direct-token");
    try {
      // Prepare all 9 fields expected by backend!
      const body = {
        firstName: form.firstName,
        lastName: form.lastName,
        suburb: form.suburb,
        postcode: form.postcode,
        phoneNumber: form.phoneNumber,
        streetNo: form.streetNo,
        streetName: form.streetName,
        emailAddress: profileData.emailAddress, // required but not editable
        user_status: form.user_status || "Active", // must be sent!
      };

      // Double-check: None are undefined or missing!
      for (const key in body) {
        if (body[key] === undefined) body[key] = "";
      }

      const response = await fetch(api + '/user/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to update profile.");

      // Get updated profile from server
      const updatedRes = await fetch(api + '/user/profile', {
        method: 'GET',
        headers: { 'Authorization': token },
      });
      const updatedData = await updatedRes.json();
      setProfileData(updatedData.user);
      setForm({
        firstName: updatedData.user.firstName || "",
        lastName: updatedData.user.lastName || "",
        suburb: updatedData.user.suburb || "",
        postcode: updatedData.user.postcode || "",
        phoneNumber: updatedData.user.phone || "",
        streetNo: updatedData.user.streetNo || "",
        streetName: updatedData.user.streetName || "",
        user_status: updatedData.user.user_status || "Active",
      });
      setEditing(false);
    } catch (err) {
      setSaveError("Failed to save profile. Please try again.");
    }
    setSaving(false);
  };

  if (!profileData) return <div className="p-8">empty profile.</div>;

  return (
    <div className="min-h-screen pt-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Profile Image and Edit */}
          <div className="md:w-1/3 bg-gray-500 flex flex-col items-center justify-center p-6">
            <div>
              <img
                src={getImageUrl("../../public/assets/avatarHolder.png")}
                className="w-28 h-28 bg-gray-200 border-2 border-black rounded-full flex items-center justify-center text-sm text-gray-600 font-medium mb-4"
                alt="avatar"
              />
            </div>
            {!editing ? (
              <button
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-blue-800 transition"
                onClick={() => setEditing(true)}
              >
                Edit Account
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="px-4 py-2 text-sm bg-gray-400 text-white rounded hover:bg-gray-600 transition"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      firstName: profileData.firstName || "",
                      lastName: profileData.lastName || "",
                      suburb: profileData.suburb || "",
                      postcode: profileData.postcode || "",
                      phoneNumber: profileData.phone || "",
                      streetNo: profileData.streetNo || "",
                      streetName: profileData.streetName || "",
                    }); // revert changes
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            )}
            {saveError && <div className="text-red-600 mt-2 text-sm">{saveError}</div>}
          </div>

          {/* Main Content: Account Info */}
          <div className="md:w-2/3 p-8">
            <h2 className="text-2xl font-bold text-black mb-6">
              Account Information
            </h2>
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  First Name
                </span>
                {editing ? (
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="text-lg text-gray-800 border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <p className="text-lg text-gray-800">{profileData.firstName}</p>
                )}
              </div>
              {/* Last Name */}
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  Last Name
                </span>
                {editing ? (
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="text-lg text-gray-800 border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <p className="text-lg text-gray-800">{profileData.lastName}</p>
                )}
              </div>
              {/* Suburb / Postcode */}
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  Suburb / Postcode
                </span>
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      name="suburb"
                      value={form.suburb}
                      onChange={handleChange}
                      className="text-lg text-gray-800 border border-gray-300 rounded px-2 py-1 w-1/2"
                      placeholder="Suburb"
                    />
                    <input
                      name="postcode"
                      value={form.postcode}
                      onChange={handleChange}
                      className="text-lg text-gray-800 border border-gray-300 rounded px-2 py-1 w-1/2"
                      placeholder="Postcode"
                    />
                  </div>
                ) : (
                  <p className="text-lg text-gray-800">{profileData.suburb} / {profileData.postcode}</p>
                )}
              </div>
              {/* Street No / Street Name */}
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  Street No / Street Name
                </span>
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      name="streetNo"
                      value={form.streetNo}
                      onChange={handleChange}
                      className="text-lg text-gray-800 border border-gray-300 rounded px-2 py-1 w-1/3"
                      placeholder="No."
                    />
                    <input
                      name="streetName"
                      value={form.streetName}
                      onChange={handleChange}
                      className="text-lg text-gray-800 border border-gray-300 rounded px-2 py-1 w-2/3"
                      placeholder="Street Name"
                    />
                  </div>
                ) : (
                  <p className="text-lg text-gray-800">{profileData.streetNo} {profileData.streetName}</p>
                )}
              </div>
              {/* Email Address (read only) */}
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  Email Address
                </span>
                <p className="text-lg text-gray-800">{profileData.emailAddress}</p>
              </div>
              {/* Phone Number */}
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  Phone Number
                </span>
                {editing ? (
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="text-lg text-gray-800 border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <p className="text-lg text-gray-800">{profileData.phone}</p>
                )}
              </div>
              <div>
                <button className="text-red-600 text-sm font-medium hover:underline">
                  Remove this account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
