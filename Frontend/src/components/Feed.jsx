import React, { useEffect, useState } from "react";
import { addFeed } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCards from "./UserCards";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const loc = useLocation();
  const items = [
    { to: "/", label: "Feed", icon: <i className="bx bx-hdd"></i> },
    {
      to: "/connections",
      label: "Connections",
      icon: <i className="bx bxs-user-detail"></i>,
    },
    {
      to: "/requests",
      label: "Connection Requests",
      icon: <i className="bx bx-mail-send"></i>,
    },
    {
      to: "/premium",
      label: "Premium",
      icon: <i className="bx bxs-diamond"></i>,
    },
    {
      to: "/profile",
      label: "Edit Profile",
      icon: <i className="bx bx-wrench"></i>,
    },
  ];

  return (
    <aside className="hidden md:block md:col-span-3 lg:col-span-3">
      <div className="sticky top-6 space-y-4">
        <div className="p-4 rounded-xl bg-white/3 border border-white/6">
          <div className="flex items-center gap-3">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              className="fill-fuchsia-500"
            >
              <path d="M18.33 6.536l-2.83 4.881 3.67 6.578H15.1l-2.57-4.639-1.83 3.152H6.6l2.83-4.881L5.82 4.049h4.1l2.06 3.717 1.35-2.315h4.1l.9 1.585z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-white">DevDudes</h3>
              <p className="text-sm text-white/70 mt-1">
                Building connections through code
              </p>
            </div>
          </div>
        </div>

        <nav className="rounded-xl p-2" aria-label="Main navigation">
          {items.map((item) => {
            const active = loc.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 mb-2 transition
                  ${
                    active
                      ? "bg-fuchsia-700/20 border border-fuchsia-600 text-fuchsia-300"
                      : "hover:bg-white/3"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {active && (
                  <span className="ml-auto text-xs bg-fuchsia-700/30 px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 text-xs text-white/60">
          <div>Version 1.0 · © {new Date().getFullYear()} DevDudes</div>
        </div>
      </div>
    </aside>
  );
};

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0); // show one user at a time

  const fetchFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      if (res?.data?.users) dispatch(addFeed(res.data.users));
      else if (Array.isArray(res?.data)) dispatch(addFeed(res.data));
      else if (res?.data?.data) dispatch(addFeed(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // clamp index if feed changes length
    if (feed && index >= feed.length) setIndex(Math.max(0, feed.length - 1));
  }, [feed, index]);

  if (!feed) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0410] to-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        <Sidebar />

        <main className="col-span-12 md:col-span-9 lg:col-span-9">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Feed</h1>
          </div>

          {feed.length === 0 || index >= feed.length ? (
            <div className="rounded-xl bg-white/3 border border-white/6 p-8 text-center">
              <h2 className="text-lg font-semibold">No more users</h2>
              <p className="text-sm text-white/70 mt-2">
                You've reached the end of the feed.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* show single user card */}
              <div className="relative">
                <UserCards user={feed[index]} singleView />

                {/* action buttons aligned under the card */}
                {/* <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => handleAction("ignore", feed[index])}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  >
                    Ignore
                  </button>

                  <button
                    onClick={() => handleAction("interested", feed[index])}
                    className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                  >
                    Interested
                  </button>
                </div> */}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Feed;
