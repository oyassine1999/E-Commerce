const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// find all tags
//localhost:3001/api/tags
router.get("/", async (req, res) => {
  try {
    const tagsData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    return res.json(tagsData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// find a single tag by its `id`
//localhost:3001/api/tags/id
router.get("/:id", async (req, res) => {
  try {
    const tagsData = await Tag.findOne({
      where: { id: req.params.id },
      include: [{ model: Product, through: ProductTag }],
    });
    return res.json(tagsData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create a new tag
//localhost:3001/api/tags/
router.post("/", (req, res) => {
  Tag.create(req.body)
    .then((newData) => {
      res.status(200).json(newData);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// update a tag's name by its `id` value
router.put("/:id", (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedDated) => {
      res.status(200).json(updatedDated);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// delete on tag by its `id` value
router.delete("/:id", (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((delTags) => {
      res.status(200).json(delTags);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;