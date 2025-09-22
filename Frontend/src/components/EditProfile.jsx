import React, { useState } from "react";
import UserCards from "./UserCards";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [skills, setSkills] = useState(user?.skills || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          about,
          photoUrl,
          skills,
          gender,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0b0410] via-[#120617] to-[#17061a] py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Edit form card */}
          <div className="w-full">
            <div className="bg-white/6 backdrop-blur-sm rounded-2xl border border-white/8 shadow-[0_18px_50px_rgba(2,2,12,0.65)] overflow-hidden">
              <div className="px-6 py-6 border-b border-white/6">
                <h2 className="text-2xl font-semibold text-white">
                  Edit Profile
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Update your details — data format remains unchanged.
                </p>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Row: Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm text-white/80 mb-1">
                      First Name
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      onChange={(e) => setFirstName(e.target.value)}
                      aria-label="First name"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-white/80 mb-1">
                      Last Name
                    </span>
                    <input
                      type="text"
                      value={lastName}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      onChange={(e) => setLastName(e.target.value)}
                      aria-label="Last name"
                    />
                  </label>
                </div>

                {/* Photo URL */}
                <label className="flex flex-col">
                  <span className="text-sm text-white/80 mb-1">Photo URL</span>
                  <input
                    type="text"
                    value={photoUrl}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    aria-label="Photo URL"
                  />
                </label>

                {/* Age and Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm text-white/80 mb-1">Age</span>
                    <input
                      type="number"
                      value={age}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      onChange={(e) => setAge(e.target.value)}
                      aria-label="Age"
                      min="0"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-white/80 mb-1">Gender</span>

                    <div className="relative overflow-visible">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 relative z-50"
                        aria-label="Gender"
                      >
                        <option value="" style={{ background: "#fff", color: "#222" }}>Select Gender</option>
                        <option value="male" style={{ background: "#fff", color: "#222" }}>Male</option>
                        <option value="female" style={{ background: "#fff", color: "#222" }}>Female</option>
                        <option value="others" style={{ background: "#fff", color: "#222" }}>Others</option>
                      </select>
                    </div>
                  </label>
                </div>

                {/* About */}
                <label className="flex flex-col">
                  <span className="text-sm text-white/80 mb-1">About</span>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="px-3 py-3 rounded-lg bg-white/5 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none h-28"
                    placeholder="Write something about yourself..."
                    aria-label="About"
                  />
                </label>

                {/* Skills */}
                <label className="flex flex-col">
                  <span className="text-sm text-white/80 mb-1">Skills</span>
                  <input
                    type="text"
                    value={skills}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="comma, separated, skills"
                    aria-label="Skills"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Enter skills separated by commas (keeps existing format).
                  </p>
                </label>

                {/* Error */}
                {error && <p className="text-sm text-red-400">{error}</p>}
              </div>

              {/* Save area */}
              <div className="px-6 py-4 border-t border-white/6 bg-gradient-to-t from-transparent to-white/2">
                <div className="flex gap-3">
                  <button
                    onClick={saveProfile}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 text-white font-semibold shadow-lg hover:brightness-105 active:scale-[0.99] transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-90"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17 8V7a3 3 0 00-3-3H6a3 3 0 00-3 3v1H2v7a2 2 0 002 2h12a2 2 0 002-2V8h-1z" />
                      <path d="M8 12l3-3 3 3" />
                    </svg>
                    Save Profile
                  </button>

                  <button
                    onClick={() => {
                      // keep UI-only reset local fields to current user props if needed
                      setFirstName(user?.firstName || "");
                      setLastName(user?.lastName || "");
                      setAge(user?.age || "");
                      setAbout(user?.about || "");
                      setPhotoUrl(user?.photoUrl || "");
                      setSkills(user?.skills || "");
                      setGender(user?.gender || "");
                    }}
                    className="px-4 py-3 rounded-lg bg-white/6 text-white border border-white/8 hover:bg-white/8 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live preview card */}
          <div className="w-full flex justify-center items-start">
            <div className="w-full max-w-md">
              <div className="rounded-2xl overflow-hidden bg-white/4 border border-white/8 shadow-[0_16px_40px_rgba(2,2,12,0.6)]">
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={photoUrl || user?.photoUrl}
                    alt={`${firstName || user?.firstName} ${
                      lastName || user?.lastName
                    }`}
                    className="h-full w-full object-cover object-center"
                    style={{ objectPosition: "50% 40%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute left-4 bottom-4 text-white z-10">
                    <h3 className="text-2xl font-semibold leading-tight">
                      {firstName || user?.firstName}{" "}
                      {lastName || user?.lastName}
                    </h3>
                    {(age || user?.age) && (gender || user?.gender) && (
                      <p className="mt-1 text-sm text-white/80">
                        {age || user?.age}, {gender || user?.gender}
                      </p>
                    )}
                  </div>
                  <div className="absolute right-4 -top-7 z-20">
                    <div className="h-14 w-14 rounded-full ring-4 ring-white/8 overflow-hidden bg-white/6 shadow-lg">
                      <img
                        src={photoUrl || user?.photoUrl}
                        alt="avatar"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-transparent">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {about || user?.about || "No bio available."}
                  </p>

                  {(skills || user?.skills) &&
                    String(skills || user?.skills).trim() !== "" && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {String(skills || user?.skills)
                          .split(",")
                          .map((s, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-full bg-white/6 text-white/90 border border-white/8"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                  {/* <div className="mt-6 flex gap-3">
                    <button
                      className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-md"
                      disabled
                    >
                      Ignore
                    </button>
                    <button
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-green-600 text-white font-semibold shadow-xl"
                      disabled
                    >
                      Interested
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast (same as before) */}
      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully Boss</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
