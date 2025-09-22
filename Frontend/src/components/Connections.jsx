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
            <i className="bx bx-group text-6xl text-fuchsia-500 mb-4"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            No Connections Found
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            You haven't connected with any DevDudes yet. Start swiping to find
            your perfect match!
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Find DevDudes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0410] to-[#1a1a2e]">
      <div className="text-center py-10 px-4">
        <h1 className="text-bold text-3xl text-white mb-8">Connections</h1>

        <div className="max-w-4xl mx-auto space-y-4">
          {connections.map((connection) => {
            const { _id, firstName, lastName, about, photoUrl, age, gender } =
              connection;
            return (
              <div
                key={_id}
                className="bg-gradient-to-br from-[#1a1a2e] to-[#2f2f46] shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] rounded-xl p-6 w-full transition-shadow"
              >
                <div className="flex items-center space-x-6">
                  <img
                    className="w-24 h-24 rounded-full object-cover border-4 border-fuchsia-700"
                    src={photoUrl}
                    alt={`${firstName} ${lastName}`}
                  />
                  <div className="flex-1 text-left">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {firstName} {lastName}
                    </h2>

                    {(age || gender) && (
                      <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                        <i className="bx bx-user mr-1"></i>
                        {age ? `${age}` : ""}
                        {age && gender ? ", " : ""}
                        {gender || ""}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {about}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Link to={`/chat/${_id}`}>
                      <button className="px-4 py-2 bg-fuchsia-700 text-white rounded-lg hover:bg-fuchsia-800 transition">
                        Message
                      </button>
                    </Link>
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer text-xl"
                      >
                        <i className="bx bx-dots-horizontal-rounded"></i>
                      </div>
                      <div
                        tabIndex={0}
                        className="dropdown-content card card-sm bg-base-100 z-10 w-64 shadow-md"
                      >
                        <div className="card-body">
                          <button className="text-red-500 hover:underline">
                            Remove User
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;
