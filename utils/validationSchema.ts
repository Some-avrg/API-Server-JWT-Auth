import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const complexityOptions = {
    min: 8,
    max: 255,
}

const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: passwordComplexity(complexityOptions).required(),
        phone: Joi.string().empty(''),
        website: Joi.string().empty(''),
        intro: Joi.string().empty(''),
        gender: Joi.string().required(),
    });
    return schema.validate(body);
};

const logInBodyValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(body);
};


export {
    signUpBodyValidation,
    logInBodyValidation,
};