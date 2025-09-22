import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCards = ({ user }) => {
  console.log(user);
  const { _id, firstName, lastName, age, about, photoUrl, skills, gender } =
    user || {};

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
      console.log(res.data);
    } catch (err) {
      console.error({ message: err.message });
    }
  };

  return (
    <>
      <div className="w-full px-4 py-6 flex justify-center">
        <div className="w-full max-w-md">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/6 to-white/3 border border-white/6 shadow-[0_18px_50px_rgba(2,2,12,0.7)] transition-transform duration-300 hover:-translate-y-2">
            {/* Top image area (fits card radius) */}
            {/* Header image with safe-fit avatar */}
            <figure className="relative h-64 w-full overflow-hidden rounded-t-2xl">
              {/* full-bleed cover image but constrained to card bounds */}
              <img
                src={photoUrl}
                alt={`${firstName} ${lastName}`}
                className="h-full w-full object-cover object-center"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/fallback-avatar.jpg";
                }}
                style={{ objectPosition: "50% 40%" }} // bias image slightly upward to better show faces
              />

              {/* subtle overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* name and meta anchored inside card bounds */}
              <div className="absolute left-4 bottom-4 text-white z-10">
                <h2 className="text-2xl font-semibold leading-tight">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="mt-1 text-sm text-white/80">
                    {age}, {gender}
                  </p>
                )}
              </div>

              {/* circular avatar badge placed inside card bounds */}
              <div className="absolute right-4 -top-7 z-20">
                <div className="h-14 w-14 rounded-full ring-4 ring-white/8 overflow-hidden bg-white/6 shadow-lg">
                  <img
                    src={photoUrl}
                    alt="avatar"
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-avatar.jpg";
                    }}
                  />
                </div>
              </div>
            </figure>

            {/* Body (aligned visually with card radius) */}
            <div className="p-6 bg-transparent">
              <p className="text-sm text-gray-200 leading-relaxed">
                {about || "No bio available."}
              </p>

              {skills && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.split?.(",").map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-white/6 text-white/90 border border-white/8"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons (logic unchanged) */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  onClick={() => handleSendRequest("ignored", _id)}
                  className="flex-1 flex items-center justify-center gap-3 px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-md hover:bg-red-700 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Ignore user"
                  title="Ignore"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 opacity-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Ignore
                </button>

                <button
                  onClick={() => handleSendRequest("interested", _id)}
                  className="flex-1 flex items-center justify-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-green-600 text-white font-semibold shadow-xl hover:scale-[1.02] active:translate-y-[1px] transition transform focus:outline-none focus:ring-2 focus:ring-green-300"
                  aria-label="Show interest"
                  title="Interested"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 opacity-95"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 9.25C2 5.5 5 3 8.5 3 10 3 11.5 3.75 12.5 4.9c1-1.15 2.5-1.9 4-1.9 3.5 0 6.5 2.5 6.497 6.25C23 14 12.5 20 10 20S2.003 14 2.003 9.25z" />
                  </svg>
                  Interested
                </button>
              </div>

              <p className="mt-4 text-xs text-white/60 text-center">
                make connection with DevDudes
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCards;
