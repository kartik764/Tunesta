import { useEffect, useState } from "react";

export default function useAlbums() {
  const [albums, setAlbums] = useState([]);

  const fetchAlbums = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/albums`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            "tunesta_usertoken"
          )}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.log("Backend not reachable");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return {
    albums,
    setAlbums,
    fetchAlbums,
  };
}