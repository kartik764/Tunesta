import { useMemo, useState } from "react";

export default function useSearch(albums = []) {
  const [query, setQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const filteredAlbums = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return albums;

    return albums.filter((album) => {
      const title = album.title?.toLowerCase() || "";
      const description =
        album.description?.toLowerCase() || "";

      return (
        title.includes(search) ||
        description.includes(search)
      );
    });
  }, [albums, query]);

  return {
    query,
    setQuery,
    filteredAlbums,
    isSearchMode,
    setIsSearchMode,
  };
}