import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, Music, Album, FileMusic, FileText, X } from "lucide-react";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";

const FileModal = ({ isUploadOpen, handleCloseUpload, fetchalbums }) => {
  const [songFile, setsongFile] = useState(null);
  const [imageFile, setimageFile] = useState(null);
  const [albumTitle, setalbumTitle] = useState("");
  const [albumDescription, setalbumDescription] = useState("");
  const [songName, setsongName] = useState("");

  const { Token } = useAuth();

  if (!isUploadOpen) return null;

  const handlefileselection = (e) => {
    setsongFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Uploading your masterpiece 🎧...");

    const formdata = new FormData();

    formdata.append("song", songFile);
    formdata.append("albumTitle", albumTitle);
    formdata.append("songName", songName);
    formdata.append("description", albumDescription);

    if (imageFile) {
      formdata.append("cover", imageFile);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload-song`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          body: formdata,
        },
      );

      await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Song Uploaded Successfully 🎵");

        fetchalbums();
        handleCloseUpload();
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to upload song.");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to upload song.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
          }}
          transition={{
            duration: 0.25,
          }}
          className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl"
        >
          <button
            onClick={handleCloseUpload}
            className="absolute right-5 top-5 rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15">
              <Upload size={30} className="text-violet-400" />
            </div>

            <h2 className="text-2xl font-bold text-white">Upload to Studio</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Share your music with everyone.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-8 transition hover:border-violet-500 hover:bg-violet-500/5">
              <FileMusic size={34} className="text-violet-400" />

              <span className="text-sm text-zinc-300">
                {songFile ? songFile.name : "Choose MP3 File"}
              </span>

              <input
                type="file"
                accept="audio/*"
                onChange={handlefileselection}
                className="hidden"
              />
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <Music size={16} />
                Song Name
              </label>

              <input
                type="text"
                value={songName}
                onChange={(e) => setsongName(e.target.value)}
                placeholder="Enter song name"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <Album size={16} />
                Album Title
              </label>

              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setalbumTitle(e.target.value)}
                placeholder="New or Existing Album"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <FileText size={16} />
                Description
              </label>

              <textarea
                value={albumDescription}
                onChange={(e) => setalbumDescription(e.target.value)}
                placeholder="Write something about this album..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-500"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-violet-500 hover:bg-violet-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15">
                <Image size={22} className="text-violet-400" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  Cover Image
                </span>

                <span className="text-xs text-zinc-400">
                  {imageFile ? imageFile.name : "Optional"}
                </span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setimageFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500"
            >
              <Upload size={18} />
              Upload Track
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FileModal;
