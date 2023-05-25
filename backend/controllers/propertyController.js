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
  let properties = [];
  try {
    if (type) {
      properties = await Property.find(type).populate("owner", "-password");
    } else {
      properties = await Property.find({});
    }
    return res.status(200).json(properties);
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
    const property = await Property.findById(req.params.id).populate(
      "currentOwner",
      "-password"
    );

    if (!property) {
      throw new Error("No such property with this id");
    } else {
      return res.status(200).json(property);
    }
  } catch (error) {
    console.log(req.params.id);
    return res.status(500).json(error.message);
  }
});

//create a property
// make a post request to create a new property using express and enovoking the Router function
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
//make a put request to update your properties using express and envoke the Router function
//
propertyController.put("/:id", verifyToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    //console.log(req.user.id);
    if (property.currentOwner.toString() !== req.user.id.toString()) {
      throw new Error("You are not allowed to update other people properties");
    } else {
      //const findProperty = await Property.findById(req.params.id);
      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedProperty);

      // return res.status(200).json(Property.currentOwner);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//delete property
propertyController.delete("/:id", verifyToken, async (req, res) => {
  try {
    const property = await Property.findById(req.param.id);

    if (property.currentOwner.toString() !== req.user.id.toString()) {
      throw new new Error(
        "You are not allowed to delete other people properties"
      )();
    } else {
      await property.delete();

      return res.status(200).json({ msg: "Successfully deleted property" });
    }
  } catch (error) {
    //const property = await Property.find({});
    //findById(req.param.id);
    return res.status(500).json(
      error.message
      //property
    );
  }
});

module.exports = propertyController;
