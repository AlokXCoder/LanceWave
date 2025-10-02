import React, { useContext, useState, useRef } from "react";
import Swal from "sweetalert2";
import { FireBaseAuthContext } from "../../Provider/FireBaseAuthContext";
import { storage } from "../../Firebase/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const MyProfile = ({ onClose }) => {
  const { user, logOutUser } = useContext(FireBaseAuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || ""
  });
  const fileInputRef = useRef(null);

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logOutUser()
          .then(() => {
            Swal.fire("Signed out!", "You have been signed out.", "success");
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error!", "Sign out failed.", "error");
          });
      }
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        displayName: user?.displayName || "",
        photoURL: user?.photoURL || ""
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file.'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB.'
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create a reference to the file in Firebase Storage
      const imageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}`);
      
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update the edit data with the new image URL
      setEditData(prev => ({
        ...prev,
        photoURL: downloadURL
      }));

      Swal.fire({
        icon: 'success',
        title: 'Image Uploaded!',
        text: 'Your profile image has been updated.',
        timer: 2000
      });
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!editData.displayName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Name',
        text: 'Please enter a valid display name.'
      });
      return;
    }

    try {
      // Update the user profile
      await updateProfile(user, {
        displayName: editData.displayName.trim(),
        photoURL: editData.photoURL
      });

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been successfully updated.',
        timer: 2000
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || ""
    });
    setIsEditing(false);
  };

  return (
    <div className="flex justify-center items-start pt-8 px-4">
      {/* Enhanced Profile Card with Edit Functionality */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 p-6 rounded-xl transition-all duration-300">
        {/* Profile Header with Edit Button */}
        <div className="flex flex-col items-center gap-3 mb-4">
          {/* Avatar with Edit Overlay */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-md">
              <img
                src={editData.photoURL || user?.photoURL || "/src/assets/user-logo.png"}
                alt="User"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            
            {/* Edit Image Button */}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-content rounded-full shadow-lg hover:bg-primary-focus transition-colors duration-200 flex items-center justify-center"
                title="Change Profile Image"
              >
                {isUploading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            )}
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          {/* Name Display/Edit */}
          {isEditing ? (
            <div className="w-full">
              <input
                type="text"
                name="displayName"
                value={editData.displayName}
                onChange={handleInputChange}
                className="input input-bordered input-sm w-full text-center font-bold"
                placeholder="Enter your name"
              />
            </div>
          ) : (
            <h2 className="text-xl font-bold text-primary">
              {user?.displayName || "User Name"}
            </h2>
          )}
          
          {/* Email Display */}
          <span className="badge badge-outline badge-primary text-xs">
            {user?.email}
          </span>
        </div>

        {/* Profile Details */}
        <div className="divider text-sm font-semibold text-base-content">
          Profile Details
        </div>
        
        <div className="space-y-2 text-sm">
          <DetailRow 
            label="Account Created" 
            value={user?.metadata?.creationTime} 
            type="date" 
          />
          <DetailRow 
            label="Last Sign In" 
            value={user?.metadata?.lastSignInTime} 
            type="datetime" 
          />
          <DetailRow 
            label="User ID" 
            value={user?.uid} 
          />
          <DetailRow
            label="Email Verified"
            value={user?.emailVerified ? "Yes" : "No"}
            color={user?.emailVerified ? "text-success" : "text-error"}
          />
        </div>

        <div className="divider"></div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveChanges}
                className="btn btn-sm flex-1 btn-success text-white font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn btn-sm flex-1 btn-outline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditToggle}
              className="btn btn-sm w-full btn-primary text-white font-medium"
            >
              Edit Profile
            </button>
          )}
          
          <button
            onClick={handleLogOut}
            className="btn btn-sm w-full btn-error text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            title="Logout from your account"
          >
            Logout
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-sm w-full btn-success text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              title="Back to dashboard"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// DetailRow component remains the same
const DetailRow = ({ label, value, type, color }) => {
  let displayValue = "N/A";
  if (value) {
    if (type === "date") {
      displayValue = new Date(value).toLocaleDateString();
    } else if (type === "datetime") {
      displayValue = new Date(value).toLocaleString();
    } else {
      displayValue = value;
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="font-medium text-base-content/70 select-none text-xs">
        {label}:
      </span>
      <span className={`text-right break-all select-text text-xs font-medium ${color || "text-base-content"}`}>
        {displayValue}
      </span>
    </div>
  );
};

export default MyProfile;
