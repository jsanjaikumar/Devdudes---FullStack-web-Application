import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  console.log(connections);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connection", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
      //console.log(res?.data?.data)
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px-80px)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <i className="bx bx-message-dots text-6xl text-fuchsia-500 mb-4"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            No Connections Found
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Start connecting with other DevDudes to see your messages here!
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Find Connections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0410] to-[#1a1a2e]">
      <div className="text-center py-10 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">
          Let's say Hello to your DevDudes
        </h1>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {connections.map((connection) => {
            const { _id, firstName, lastName, about, photoUrl, age, gender } =
              connection;
            return (
              <Link to={`/chat/${_id}`} key={_id}>
                <div className="flex items-center bg-gradient-to-br from-[#1a1a2e] to-[#2f2f46] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-shadow rounded-xl p-6 w-full shadow-md">
                  {/* Avatar */}
                  <img
                    className="w-20 h-20 rounded-full object-cover border-4 border-fuchsia-700"
                    src={photoUrl}
                    alt="userProfile"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-avatar.jpg";
                    }}
                  />

                  {/* Info */}
                  <div className="ml-4 text-left flex-1">
                    <h2 className="text-2xl font-bold text-white">
                      {firstName} {lastName}
                    </h2>
                    {(age || gender) && (
                      <p className="text-sm text-white/70">
                        {age ? `${age}` : ""}
                        {age && gender ? ", " : ""}
                        {gender || ""}
                      </p>
                    )}
                    <p className="text-sm text-white/80 mt-1">
                      {about || "No bio available."}
                    </p>
                  </div>

                  {/* Optional Chat Button */}
                  <button className="btn btn-secondary text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition hidden sm:flex">
                    <i className="bx bxs-chat mr-2"></i> Say Hello
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;
