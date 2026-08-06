import { Crown, Users } from "lucide-react";

export default function UsersPanel({ users, hostId }) {
  return (
    <div className="flex h-[calc(100vh-250px)] flex-col rounded-3xl border border-white/10 bg-[#111118]/80 p-5 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-violet-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Members</h2>
        </div>

        <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-300">
          {users.length}
        </span>
      </div>

      <div className="mt-2 flex-1 space-y-3 overflow-y-auto pr-2">
        {users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-zinc-500">
            No members
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-white">
                  {user.username}
                </p>
              </div>

              {user.socketId === hostId && (
                <Crown size={18} className="text-yellow-400" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
