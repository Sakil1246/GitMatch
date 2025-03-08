import React, { useState } from "react";
import { BasicURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState(user.age || "");
    const [gender, setGender] = useState(user.gender || "");
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl); // This is for both URL input & uploaded image
    const [about, setAbout] = useState(user.about);
    const [errors, setErrors] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [toast, setToast] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // Store selected file
    const [preview, setPreview] = useState(null); // Store preview image

    const dispatch = useDispatch();

    // Save updated profile details
    const handleSave = async () => {
        setErrors("");

        try {
            const res = await axios.patch(
                BasicURL + "/profile/update",
                { firstName, lastName, photoUrl, age, gender, about },
                { withCredentials: true }
            );

            dispatch(addUser(res?.data));
            setToast(true);
            setTimeout(() => setToast(false), 2000);
        } catch (error) {
            console.log("Failed to update user");
            setErrors(error.message);
        }
    };

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file)); // Show preview before upload
    };

    // Upload file to the server
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await axios.post(BasicURL + "/upload", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setPhotoUrl(res.data.imageUrl); // Auto-fill photoUrl with uploaded image URL
            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
        }
    };

    return (
        <div className="flex justify-center">
            <div className="flex justify-center relative mt-12 mx-5">
                <div className="card bg-base-300 w-96 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Edit Profile</h2>

                        <label className="form-control w-full max-w-xs">
                            <div className="label"><span className="label-text">First Name</span></div>
                            <input type="text" value={firstName} className="input input-bordered w-full max-w-xs" onChange={(e) => setFirstName(e.target.value)} />

                            <div className="label"><span className="label-text">Last Name</span></div>
                            <input type="text" value={lastName} className="input input-bordered w-full max-w-xs" onChange={(e) => setLastName(e.target.value)} />

                            <div className="label"><span className="label-text">Age</span></div>
                            <input type="text" value={age} className="input input-bordered w-full max-w-xs" onChange={(e) => setAge(e.target.value)} />

                            <div className="label"><span className="label-text">Gender</span></div>
                            <div
                                className="relative w-full"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <button className="btn w-full">{gender || "Select gender"}</button>
                                {dropdownOpen && (
                                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[10] w-52 p-2 shadow absolute">
                                        <li><a onClick={() => setGender("male")}>Male</a></li>
                                        <li><a onClick={() => setGender("female")}>Female</a></li>
                                        <li><a onClick={() => setGender("others")}>Others</a></li>
                                    </ul>
                                )}
                            </div>

                            <div className="label"><span className="label-text">Profile Picture</span></div>

                            {/* Manual Photo URL Input */}
                            <input
                                type="text"
                                placeholder="Enter Image URL"
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                className="input input-bordered w-full max-w-xs mb-2"
                            />

                            {/* File Input & Upload Button */}
                            <input type="file" onChange={handleFileChange} accept="image/*" className="mb-2" />
                            {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mb-2 rounded" />}

                            <button className="btn btn-secondary" onClick={handleUpload}>Upload</button>

                            <div className="label"><span className="label-text">About</span></div>
                            <textarea value={about} className="input input-bordered w-full max-w-xs" onChange={(e) => setAbout(e.target.value)} />

                        </label>

                        <p className="text-red-500">{errors}</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary" onClick={handleSave}>Save Profile</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <p>Preview (this is how others will see you!)</p>
                <UserCard user={{ firstName, lastName, age, gender, photoUrl, about }} />
            </div>

            {toast && (
                <div className="toast toast-top toast-center mt-12">
                    <div className="alert alert-success">
                        <span>Profile saved successfully.</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
