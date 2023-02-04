const router = require("express").Router();
// const { any } = require("sequelize/types/lib/operators");
// const { any } = require("sequelize/types/lib/operators");
const { Category, Product } = require("../../models");

// Find all categories
//localhost:3001/api/categories
router.get("/", async (req, res) => {
  // find all categories
  const categoryData = await Category.findAll({
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
    },
  });

  res.json(categoryData);
});

// find one category by its `id` value
//localhost:3001/api/categories/:id
router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findOne({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create a new category
//localhost:3001/api/categories
router.post("/", async (req, res) => {
  Category.create(req.body)
    .then((response) => {
      res.status(200).json(response);
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// update a category by its `id` value
//localhost:3001/api/categories/:id
router.put("/:id", async (req, res) => {
  const updatedCategory = await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// delete a category by its `id` value
//localhost:3001/api/categories/:id
router.delete("/:id", async (req, res) => {
  const newCategory = await Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedCategory) => {
      res.json(deletedCategory);
    })
    .catch((error) => res.status(400).json(error));
});

module.exports = router;