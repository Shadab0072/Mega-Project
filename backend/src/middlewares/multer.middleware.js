import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
     
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage: storage })



// SYNTAX OF CALLBACK FUNCTION IN NODE JS

// function callback(error, result) {
//     if (error) {
//       // Handle the error
//       console.error('Error:', error);
//       return;
//     }
//     // Handle the result
//     console.log('Result:', result);
//   }


// error: The first parameter is usually an Error object or null if there is no error.
//  This allows you to check if something went wrong.

// result: The second parameter is the result of the operation if it was successful.
//  This is the value or data you want to work with after the operation completes.