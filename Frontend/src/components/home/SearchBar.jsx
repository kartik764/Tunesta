function SearchBar({
  query,
  setQuery,
}) {
  return (
    <input
      type="text"
      placeholder="Search songs or albums..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500"
    />
  );
}

export default SearchBar;