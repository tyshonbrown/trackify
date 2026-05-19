import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

const Account = () => {
    const [user, setUser] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [editingName, setEditingName] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [savingName, setSavingName] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        getUserProfile();
    }, []);

    // Gets the current user and their profile pictur url
    const getUserProfile = async () => {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error getting user:", userError?.message);
            return;
        }

        setUser(user);
        setEmail(user.email || "");

        const { data, error } = await supabase
            .from("profiles")
            .select("first_name, last_name, profile_pic_url")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
            return;
        }

        setFirstName(data?.first_name || "");
        setLastName(data?.last_name || "");
        setProfilePicUrl(data?.profile_pic_url || "");
    };

    // Uploading the profile picture
    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];

        if (!file || !user) return;

        setUploading(true);

        // Creating the file path name
        const fileExtension = file.name.split(".").pop();
        const filePath = `${user.id}/profile-${Date.now()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
            .from("profile-pictures")
            .upload(filePath, file);

        if (uploadError) {
            console.error("Error uploading profile picture:", uploadError.message);
            setUploading(false);
            return;
        }

        // setting the pic url in the profiles table
        const { data } = supabase.storage
            .from("profile-pictures")
            .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ profile_pic_url: publicUrl })
            .eq("id", user.id);

        if (updateError) {
            console.error("Error updating profile picture:", updateError.message);
            setUploading(false);
            return;
        }

        setProfilePicUrl(publicUrl);
        setUploading(false);
        window.dispatchEvent(new Event("profilePicUpdated"));
        e.target.value = "";
    };

    // Update Users name
    const handleSaveName = async () => {
        if (!user) return;

        setSavingName(true);

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const fullName = `${cleanFirstName} ${cleanLastName}`.trim();

        const { error } = await supabase
            .from("profiles")
            .update({
                first_name: cleanFirstName,
                last_name: cleanLastName,
            })
            .eq("id", user.id);

        if (error) {
            console.error("Error updating name:", error.message);
            setSavingName(false);
            return;
        }

        const { data, error: authError } = await supabase.auth.updateUser({
            data: {
                name: fullName,
                full_name: fullName,
                display_name: fullName,
            },
        });

        if (authError) {
            console.error("Error updating auth display name:", authError.message);
            setSavingName(false);
            return;
        }

        setUser(data.user);
        setFirstName(cleanFirstName);
        setLastName(cleanLastName);
        setEditingName(false);
        setSavingName(false);
    };

    // Change Password
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        setSavingPassword(true);

        // Verify current password
        const { error: passwordCheckError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        });

        if (passwordCheckError) {
            alert("Current password is incorrect.");
            setSavingPassword(false);
            return;
        }

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (updateError) {
            console.error("Error updating password.", updateError.message);
            setSavingPassword(false);
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
        setSavingPassword(false);

        alert("Password updated successfully.");
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-black">

            {/* Title */}
            <div className="w-full border-b border-gray-900 md:items-start ">
                <h1 className="text-4xl md:text-5xl font-thin mb-2">ACCOUNT</h1>
            </div>

            {/* Profile Picture */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl px-6 py-8 max-w-md">
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={profilePicUrl || "/profile.jpg"}
                        alt="Profile"
                        className="w-32 h-32 mb-6 rounded-full object-cover border border-gray-700"
                    />

                    <label className="bg-green-700 hover:bg-green-800 rounded py-2 px-6 cursor-pointer">
                        {uploading ? "Uploading..." : "Change Profile Picture"}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Name */}
            <div className="border-t border-gray-800 pt-5">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-thin">Name</h2>

                    {!editingName && (
                        <button
                            onClick={() => setEditingName(true)}
                            className="text-green-500 hover:text-green-400">
                            Edit
                        </button>
                    )}

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!editingName}
                        className="bg-black border border-gray-700 rounded px-3 py-2 disabled:opacity-60"
                        placeholder="First name"
                    />

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!editingName}
                        className="bg-black border border-gray-700 rounded px-3 py-2 disabled:opacity-60"
                        placeholder="Last name"
                    />
                </div>

                {editingName && (
                    <div className="flex gap-3 mt-3">
                        <button
                            onClick={handleSaveName}
                            disabled={savingName}
                            className="bg-green-700 hover:bg-green-800 rounded py-2 px-5 disabled:opacity-50"
                        >
                            {savingName ? "Saving..." : "Save"}
                        </button>

                        <button
                            onClick={() => {
                                setEditingName(false);
                                getUserProfile();
                            }}
                            className="bg-gray-700 hover:bg-gray-800 rounded py-2 px-5"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Email */}
            <div className="pt-5">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-thin">Email</h2>
                </div>

                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 opacity-60"
                    placeholder="Email"
                />

                <p className="text-sm text-gray-500 mt-2">
                    Email changes are not available right now.
                </p>
            </div>

            {/* Password */}
            <div className=" pt-5">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-thin px-6">Password</h2>

                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="text-green-500 hover:text-green-400"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {showPasswordForm && (
                    <div className="space-y-3">
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
                            placeholder="Current password"
                        />

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
                            placeholder="New password"
                        />

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
                            placeholder="Confirm new password"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={handleChangePassword}
                                disabled={savingPassword}
                                className="bg-green-700 hover:bg-green-800 rounded py-2 px-5 disabled:opacity-50"
                            >
                                {savingPassword ? "Saving..." : "Save Password"}
                            </button>

                            <button
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className="bg-gray-700 hover:bg-gray-800 rounded py-2 px-5"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
}

export default Account