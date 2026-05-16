// Multer is a middleware and it's work is to make sure that when the file is uploaded from the form on the browser, the file get's stored in to the RAM for a microsecond and then goes to the cloudinary.

// This help in a clean UI, and fast working.
// Otherwise we had to create the state and then use that state to pass it to the cloudinary, but that would be slow.

import multer from 'multer';

// 1. Creating the storage
const storage=multer.memoryStorage();

// 2. Configuring the multer to use this
const upload= multer({
    storage:storage,
    // limits is optional, but we have given to it to make sure the user does not corrupt our system by uploading a 10GB file.

    limits:{filesize: 10*1024*1024}
})

export default upload;