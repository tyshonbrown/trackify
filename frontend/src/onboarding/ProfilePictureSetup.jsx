import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import LogoLanding from '@/marketing/components/LogoLanding';
import { supabase } from '@/supabaseClient';

const ProfilePictureSetup = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    // Ge user profile on load
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

    }

    // Navigate to the dashboard on save or on skip
    const handleSave = () => {
        navigate("/layout-dash/dashboard");
    };

    const handleSkip = () => {
        navigate("/layout-dash/dashboard");
    };

    return (
        <div className="min-h-screen py-4 px-4 lg:px-10 bg-slate-700/40">
            {/* Logo */}
            <div>
                <LogoLanding />
            </div>

            {/* Back Button to Landing */}
            <div className="text-lg mt-5 text-white">
                <Link
                    to="/"
                    className="flex items-center gap-1 hover:text-gray-300 transition-colors font-thin text-md"
                >
                    <i class="bx bx-chevron-left"></i>
                    Home
                </Link>
            </div>

            <div className="flex flex-col items-center justify-center mt-16">
                <div className="bg-black/40 border border-gray-800 rounded-xl px-6 py-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center gap-4">
                        <h1 className="text-3xl font-thin">Add a Profile Picture</h1>

                        <p className="text-gray-400 text-sm">
                            Upload a photo to personalize your account.
                        </p>

                        {/* Profile Picture */}
                        <img
                            src={profilePicUrl || "/profile.jpg"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border border-gray-700"
                        />

                        {/* Choose Photo button */}
                        <label className="bg-green-700 hover:bg-green-800 rounded py-2 px-6 cursor-pointer">
                            {uploading ? "Uploading..." : "Choose Photo"}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={uploading}
                            className="w-full bg-blue-700 hover:bg-blue-800 rounded py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save and Continue
                        </button>

                        {/* Skip */}
                        <button
                            onClick={handleSkip}
                            disabled={uploading}
                            className="text-gray-400 hover:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProfilePictureSetup