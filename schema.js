const Joi = require("joi");
const review = require("./Models/review");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
          filename:Joi.string().required(),
          url:Joi.string().required()
        }),
        price: Joi.number().required(),
        country: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }).required(),
});

module.exports ={ listingSchema, reviewSchema };