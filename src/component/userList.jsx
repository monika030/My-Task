"use client";

import { useSelector, useDispatch } from "react-redux";
import React ,{ useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { addUser, editUser, deleteUser } from "../store/userSlice";
import { stateAndCity } from "../component/stateAndCity";
import { config } from "../component/config";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function UserList() {
  const users = useSelector((state) => state.users.list);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  console .log("UsersstateAndCity:", stateAndCity);

  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "",
    email: "",
    linkedin: "",
    gender: "Female",
    address: {
      "Line 1": "",
      "Line 2": "",
      state: "",
      city: "",
      PIN: "",
    },
  });

  // Get config settings
  const { editable, deletable, addUser: canAddUser } = config.features;
  const { name: nameValidation, email: emailValidation } = config.validation;

  // Toggle row expansion
  const toggleRow = (userId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Update cities when state changes
useEffect(() => {
  if (selectedState) {
    const state = stateAndCity.states.find((s) => s.name === selectedState);
    Promise.resolve().then(() => {
      setAvailableCities(state ? state.cities : []);
    });
  } else {
     Promise.resolve().then(() => {
      setAvailableCities([]);
    });
  }
}, [selectedState]);



  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!currentUser.name.trim()) {
      newErrors.name = "Name is required";
    } else if (currentUser.name.length < nameValidation.minLength) {
      newErrors.name = `Name must be at least ${nameValidation.minLength} characters`;
    } else if (currentUser.name.length > nameValidation.maxLength) {
      newErrors.name = `Name must not exceed ${nameValidation.maxLength} characters`;
    }

    // Email validation
    if (!currentUser.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = new RegExp(emailValidation.pattern);
      if (!emailRegex.test(currentUser.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    // State and City validation
    if (!currentUser.address.state) {
      newErrors.state = "State is required";
    }
    if (!currentUser.address.city) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open modal for adding new user
  const handleOpenAdd = () => {
    if (!canAddUser) {
      alert("Adding users is disabled in configuration");
      return;
    }
    setEditMode(false);
    setCurrentUser({
      id: null,
      name: "",
      email: "",
      linkedin: "",
      gender: "Female",
      address: {
        "Line 1": "",
        "Line 2": "",
        state: "",
        city: "",
        PIN: "",
      },
    });
    setSelectedState("");
    setErrors({});
    setOpen(true);
  };

  // Open modal for editing existing user
  const handleOpenEdit = (user) => {
    if (!editable) {
      alert("Editing is disabled in configuration");
      return;
    }
    setEditMode(true);
    setCurrentUser(user);
    setSelectedState(user.address.state);
    setErrors({});
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle state selection
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setCurrentUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: state,
        city: "", // Reset city when state changes
      },
    }));
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: "" }));
    }
  };

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Save user (add or edit)
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (editMode) {
      dispatch(editUser(currentUser));
    } else {
      const newUser = {
        ...currentUser,
        id: Date.now(),
      };
      dispatch(addUser(newUser));
    }
    handleClose();
  };

  // Delete user
  const handleDelete = (id) => {
    if (!deletable) {
      alert("Deleting users is disabled in configuration");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  if (!users) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-6 p-6">
      {/* Configuration Info */}
      <div className="flex justify-center shadow-md bg-gradient-to-r from-blue-300 to-purple-600 text-white p-4 mb-6 rounded text-3xl">
        User Management List
      </div>

      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
        <button
          onClick={handleOpenAdd}
          className={`px-4 py-2 bg-gradient-to-r from-blue-300 to-purple-600 rounded-md text-white ${
            canAddUser ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!canAddUser}
        >
          Add New User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="py-3 px-4 text-left w-12"></th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">LinkedIn</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">State</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

         <tbody>
  {users.map((user) => (
    <React.Fragment key={user.id}>
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="py-3 px-4">
          <button
            onClick={() => toggleRow(user.id)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {expandedRows.has(user.id) ? (
              <span className="text-xl">
                <ArrowDropUpIcon />
              </span>
            ) : (
              <span className="text-xl">
                <ArrowDropDownIcon />
              </span>
            )}
          </button>
        </td>
        <td className="py-3 px-4">{user.name}</td>
        <td className="py-3 px-4">{user.email}</td>
        <td className="py-3 px-4">
          <a
            href={user.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {user.linkedin}
          </a>
        </td>
        <td className="py-3 px-4">{user.gender}</td>
        <td className="py-3 px-4">{user.address?.state}</td>
        <td className="py-3 px-4">
          <button
            onClick={() => handleOpenEdit(user)}
            className={`mr-3 ${
              editable
                ? "text-blue-500 hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={!editable}
          >
            <EditIcon />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className={
              deletable
                ? "text-red-600 hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }
            disabled={!deletable}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>

      {/* Expanded Row */}
      {expandedRows.has(user.id) && (
        <tr key={`${user.id}-expanded`} className="bg-gray-50">
          <td colSpan="8" className="py-4 px-4">
            <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Full Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Address Line 1:
                  </p>
                  <p className="text-gray-800">
                    {user.address?.["Line 1"] || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Address Line 2:
                  </p>
                  <p className="text-gray-800">
                    {user.address?.["Line 2"] || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    State:
                  </p>
                  <p className="text-gray-800">{user.address?.state || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    City:
                  </p>
                  <p className="text-gray-800">{user.address?.city || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    PIN Code:
                  </p>
                  <p className="text-gray-800">{user.address?.PIN || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Complete Address:
                  </p>
                  <p className="text-gray-800 text-sm">
                    {[
                      user.address?.["Line 1"],
                      user.address?.["Line 2"],
                      user.address?.city,
                      user.address?.state,
                      user.address?.PIN,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

        </table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <TextField
              label="Name"
              name="name"
              value={currentUser.name}
              onChange={handleChange}
              fullWidth
              requ  ired
              error={!!errors.name}
              helperText={
                errors.name ||
                `${nameValidation.minLength}-${nameValidation.maxLength} characters`
              }
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={currentUser.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="LinkedIn URL"
              name="linkedin"
              value={currentUser.linkedin}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={currentUser.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* State Dropdown (from master data) */}
            <FormControl fullWidth error={!!errors.state}>
              <InputLabel>State *</InputLabel>
              <Select
                value={selectedState}
                onChange={handleStateChange}
                label="State *"
              >
                <MenuItem value="">Select State</MenuItem>
                {stateAndCity.states.map((state) => (
                  <MenuItem key={state.id} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </FormControl>

            {/* City Dropdown (dynamic based on state) */}
            <FormControl
              fullWidth
              error={!!errors.city}
              disabled={!selectedState}
            >
              <InputLabel>City *</InputLabel>
              <Select
                name="city"
                value={currentUser.address.city}
                onChange={handleAddressChange}
                label="City *"
              >
                <MenuItem value="">Select City</MenuItem>
                {availableCities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </FormControl>

            {/* Address Fields */}
            <TextField
              label="Address Line 1"
              name="Line 1"
              value={currentUser.address["Line 1"]}
              onChange={handleAddressChange}
              fullWidth
            />
            <TextField
              label="Address Line 2"
              name="Line 2"
              value={currentUser.address["Line 2"]}
              onChange={handleAddressChange}
              fullWidth
            />
            <TextField
              label="PIN Code"
              name="PIN"
              value={currentUser.address.PIN}
              onChange={handleAddressChange}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}