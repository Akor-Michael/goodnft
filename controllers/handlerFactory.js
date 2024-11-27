const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAll = (Module, altQueryString = {}) => {
  return catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Module.find({}), req.query, altQueryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const data = await features.query;
    return res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });
};

exports.getOne = (Model, moduleName, popOptions = false) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const data = await query;
    if (!data) {
      return next(
        new AppError(`No ${moduleName} with the id ${req.params.id}`, 404)
      );
    }
    return res.status(200).json({
      status: "success",
      data,
    });
  });
};

exports.createOne = (Module) => {
  return catchAsync(async (req, res, next) => {
    const newDoc = await Module.create(req.body);
    return res.status(201).json({
      status: "success",
      data: newDoc,
    });
  });
};

exports.deleteOne = (Module, moduleName) => {
  return catchAsync(async (req, res, next) => {
    const deletedDoc = await Module.findByIdAndDelete(req.params.id);
    if (!deletedDoc) {
      return next(
        new AppError(`No ${moduleName} with the id ${req.params.id}`, 404)
      );
    }
    return res.status(204).json({
      status: "success",
      data: null,
    });
  });
};

exports.updateOne = (Module, moduleName) => {
  return catchAsync(async (req, res, next) => {
    // console.log("body",req.body)
    const updatedDoc = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(
        new AppError(`No ${moduleName} with the id ${req.params.id}`, 404)
      );
    }
    return res.status(200).json({
      status: "success",
      data: updatedDoc,
    });
  });
};

exports.filterOutDataFromObj = (obj, ...rejectedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!rejectedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.selectDataFromObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  // console.log("newObj", newObj);
  // console.log(obj, allowedFields);
  return newObj;
};

exports.selectDataFromObjBody = (obj, allowedFields) => {
  const newObj = {};
  const allowedFieldsInBody = allowedFields.split(",");
  Object.keys(obj).forEach((el) => {
    if (allowedFieldsInBody.includes(el)) newObj[el] = obj[el];
  });
  // console.log("newObj", newObj);
  // console.log(obj, allowedFieldsInBody);
  return newObj;
};

// exports.selectDataFromBody = (...allowedFields) => {
//   const newObj = {};
//   Object.keys(req.body).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   req.body = newObj;
//   return newObj;
// };
