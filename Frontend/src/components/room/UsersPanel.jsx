import { Crown, Users } from "lucide-react";

export default function UsersPanel({ users, hostId }) {
  return (
    <div className="flex min-w-0 flex-col px-1 sm:px-2">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Users className="text-violet-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Members</h2>
        </div>

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
          {users.length}
        </span>
      </div>

      <div className="mt-2 space-y-3 pr-2">
        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/5 bg-white/[0.015] py-7 text-center text-sm text-zinc-500">
            No members
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user.socketId}
              className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.025] p-3 transition hover:bg-white/[0.06]"
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
