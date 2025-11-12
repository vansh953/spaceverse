import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "../style/profile.css";

function Profile() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    dob: "",
    sex: "",
    interests: "",
    photoURL: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFormData((prev) => ({ ...prev, ...userSnap.data() }));
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [db, user]); // ✅ added db and user as dependencies

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    const storageRef = ref(storage, `profilePics/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await setDoc(
      doc(db, "users", user.uid),
      { ...formData, photoURL: url },
      { merge: true }
    );

    setFormData((prev) => ({ ...prev, photoURL: url }));
    setUploading(false);
  };

  if (loading) return <div className="home-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="profile-pic-section">
          <label htmlFor="profile-pic-input">
            <img
              src={
                formData.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="profile-pic"
            />
          </label>
          <input
            id="profile-pic-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          {uploading && <p className="uploading-text">Uploading...</p>}
        </div>

        <label>Name</label>
        <input type="text" value={formData.name} disabled />

        <label>Email</label>
        <input type="email" value={formData.email} disabled />

        <label>Date of Birth (DD/MM/YYYY)</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Sex</label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          disabled={!isEditing}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Interests</label>
        <textarea
          name="interests"
          rows="3"
          value={formData.interests}
          onChange={handleChange}
          disabled={!isEditing}
        ></textarea>

        <div className="btn-row">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
