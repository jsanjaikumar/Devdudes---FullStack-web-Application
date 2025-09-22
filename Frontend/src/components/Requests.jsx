import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const [loadingMap, setLoadingMap] = useState({}); // { [requestId]: boolean }

  const setLoading = (id, val) => setLoadingMap((m) => ({ ...m, [id]: val }));

  const reviewRequest = async (status, _id) => {
    if (loadingMap[_id]) return;
    setLoading(_id, true);
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err?.response ?? err);
    } finally {
      setLoading(_id, false);
    }
  };

  const fetchRequest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data || []));
    } catch (err) {
      console.error(err?.response ?? err);
    }
  };

  useEffect(() => {
    fetchRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px-80px)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <i className="bx bx-mail-send text-6xl text-fuchsia-500 mb-4"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">No Connection Requests</h1>
          <p className="text-gray-400 text-lg mb-6">
            No one has sent you connection requests yet. Keep swiping to find your perfect DevDudes!
          </p>
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Start Swiping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-6">
          Connection Requests
        </h1>

        <div className="space-y-4">
          {requests.map((request) => {
            const from = request.fromUserId || {};
            const {
              _id: reqId,
              firstName = "",
              lastName = "",
              about = "",
              photoUrl = "",
              age,
              gender,
            } = from;

            const isLoading = loadingMap[request._id];

            return (
              <article
                key={request._id}
                className="flex items-center gap-4 bg-white/4 border border-white/8 rounded-xl p-4 shadow-sm"
                role="group"
                aria-label={`Connection request from ${firstName} ${lastName}`}
              >
                <div className="flex-shrink-0">
                  <img
                    src={photoUrl || "/fallback-avatar.jpg"}
                    alt={`${firstName} ${lastName}`}
                    className="h-16 w-16 rounded-full object-cover object-center ring-2 ring-white/6"
                    onError={(e) =>
                      (e.currentTarget.src = "/fallback-avatar.jpg")
                    }
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <h2 className="text-lg font-semibold text-white truncate">
                        {firstName} {lastName}
                      </h2>
                      {(age || gender) && (
                        <p className="text-sm text-white/70 mt-1">
                          {age ? `${age}${gender ? ", " : ""}` : ""}
                          {gender || ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-white/70 truncate">{about}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => reviewRequest("accepted", request._id)}
                    disabled={isLoading}
                    aria-label={`Accept request from ${firstName} ${lastName}`}
                    className={`inline-flex items-center justify-center gap-2 min-w-[112px] px-4 py-2 rounded-md text-sm font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      isLoading
                        ? "bg-emerald-500/60 text-white cursor-not-allowed shadow-none"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_6px_18px_rgba(16,185,129,0.12)]"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                    </svg>
                    {isLoading ? "Processing" : "Accept"}
                  </button>

                  <button
                    onClick={() => reviewRequest("rejected", request._id)}
                    disabled={isLoading}
                    aria-label={`Reject request from ${firstName} ${lastName}`}
                    className={`inline-flex items-center justify-center gap-2 min-w-[112px] px-4 py-2 rounded-md text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-red-300 ${
                      isLoading
                        ? "bg-red-500/60 text-white cursor-not-allowed shadow-none"
                        : "bg-transparent hover:bg-red-600 text-white border border-white/10 shadow-[0_6px_18px_rgba(239,68,68,0.08)]"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {isLoading ? "Processing" : "Reject"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
