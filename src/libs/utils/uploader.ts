import path from "path";
import multer from "multer";
import { v4 } from "uuid";

/** MULTER IMAGE UPLOADER **/
function getTargetImageStorage(address: any) {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `./uploads/${address}`);
      },
      filename: function (req, file, cb) {
        const extension = path.parse(file.originalname).ext;
        const random_name = v4() + extension;
        cb(null, random_name);
      },
    });
  }
  
  const makeUploader = (address: string) => {
    const storage = getTargetImageStorage(address);
    return multer({ storage: storage });
  };
  
  export default makeUploader;

// Uncommented and properly structured `uploadProductImage`
// const productStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads/products");
//     },
//     filename: function (req, file, cb) {
//         console.log(file);
//         const extension = path.extname(file.originalname).ext; // ext bu yuklanyotgan rasm di type aniqleydi  png , jpg va etc 
//         const random_name = v4() + extension;
//         cb(null, random_name);
//     }
// });

// export const uploadProductImage = multer({ storage: productStorage });