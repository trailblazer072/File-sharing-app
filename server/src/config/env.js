const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    AWS_ACCESS_KEY_ID: Joi.string().required().description('AWS Access Key'),
    AWS_SECRET_ACCESS_KEY: Joi.string().required().description('AWS Secret Key'),
    AWS_REGION: Joi.string().default('us-east-1'),
    AWS_BUCKET_NAME: Joi.string().required().description('S3 Bucket Name'),
}).unknown();

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGO_URI,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
    },
    aws: {
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
        region: envVars.AWS_REGION,
        bucketName: envVars.AWS_BUCKET_NAME,
    },
};
