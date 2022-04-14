const db = require("../config/db");
const multer = require("multer");
const Product = db.products;
const path = require("path");
const _p = require("../utils/promise_errors");
const res = require("express/lib/response");
const router = require("express").Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

// router.post("/addProducts", upload, async (req, res) => {
//   const { name, description, brand, price, title } = req.body;

//   const { image } = req.file.path;

//   const [Err, products] = await _p(
//     Product.create({
//       name,
//       description,
//       brand,
//       price,
//       title,
//       image,
//     })
//   );
//   if (Err && !products) {
//     res.status(400).json({ error: true, message: Err.message });
//   } else {
//     res.json({ error: false, message: "Products created" });
//   }
// });
router.post("/addProducts", upload, async (req, res) => {
  let info = {
    name: req.body.name,
    image: req.file.path,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
  };

  const product = await Product.create(info);
  res.status(200).send(product);
});

router.get("/all", async (req, res) => {
  let [dberr, myDirections] = await _p(Product.findAll({}));
  if (dberr) return next(dberr);
  return res.json(
    myDirections.map((d) => {
      return {
        id: d.id,
        name: d.name,
        price: d.price,
        image: d.image,
        brand: d.brand,
        title: d.title,
        discription: d.discription,
        created_at: d.createdAt,
      };
    })
  );
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  Product.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving  with id=" + id,
      });
    });
});

router.delete("/single/:id", async (req, res) => {
  const id = req.params.id;
  Product.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Products was delete successfully.",
        });
      } else {
        res.send({
          message: `Cannot delete  with id=${id}. Maybe  was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error delete  with id=" + id,
      });
    });
});

router.put("/single/:id", async (req, res) => {
  const id = req.params.id;
  Product.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Products was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update  with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating  with id=" + id,
      });
    });
});

module.exports = router;
