const Property = require("../models/Property");
const propertyController = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

//get all
propertyController.get("/getAll", async (req, res) => {
  try {
    const properties = await Property.find({});

    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
//get featured
propertyController.get("/find/featured", async (req, res) => {
  try {
    const featuredProperties = await Property.find({ featured: true }).populate(
      "currentOwner",
      "-password"
    );

    return res.status(200).json(featuredProperties);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
//get all from a specific type
propertyController.get("/find", async (req, res) => {
  const type = req.query;
  //{type: 'beach'}
  try {
    if (type) {
      const properties = await Property.find(type).populate(
        "currenctOwner",
        "-password"
      );
      return res.status(200).json(properties);
    } else {
      return res.status(500).json({ msg: "No such type" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
//get counts of types => ex: {beach: 2, village: 5, mountain: 12}
propertyController.get("/find/types", async (req, res) => {
  try {
    const beachType = await Property.countDocuments({ type: "beach" });
    const mountainType = await Property.countDocuments({ type: "mountain" });
    const villageType = await Property.countDocuments({ type: "village" });

    return res.status(200).json({
      beach: beachType,
      mountain: mountainType,
      village: villageType,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//get individual property
propertyController.get("/find/:id", async (req, res) => {
  try {
    const property = await Property.find(req.params.id).populate(
      "currentOwner",
      "-password"
    );

    if (!property) {
      throw new Error("No such property with this id");
    } else {
      return res.status(200).json(property);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//create a property
propertyController.post("/", verifyToken, async (req, res) => {
  try {
    const newProperty = await Property.create({
      ...req.body,
      currentOwner: req.user.id,
    });
    return res.status(201).json(newProperty);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//update property

//delete property
