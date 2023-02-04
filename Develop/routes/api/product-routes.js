const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// get all products
//localhost:3001/api/Products
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }],
    });
    return res.json(productData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
//localhost:3001/api/Products/:id
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findOne({
      where: { id: req.params.id },
      include: [Category, { model: Tag, through: ProductTag }],
    });

    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
/* req.body should look like this...
  {
    product_name: "Basketball",
    price: 200.00,
    stock: 3,
    tagIds: [1, 2, 3, 4]
  }
*/
router.post("/", async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    console.log(req.body);

    if (req.body.tagIds.length) {
      //Map through req.body.tagIds
      const productTagIdNewArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });

      //return newArr for whats in req.body.tagId
      const productTagIds = await ProductTag.bulkCreate(productTagIdNewArr);

      return res.status(200).json(productTagIds);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id)).map(({ id }) => id);

      // run both actions
      return Promise.all([ProductTag.destroy({ where: { id: productTagsToRemove } }), ProductTag.bulkCreate(newProductTags)]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete("/:id", (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status.json(err);
    });

  // res.send("Product successfully deleted ✅");
});

module.exports = router;