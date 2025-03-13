
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars 
{
PORT :number;
DATABASE_URL:string; 
PRODUCTS_MICROSERVICE_PORT :number;
PRODUCTS_MICROSERVICE_HOST :string;
}
const envsSchema = joi.object({
    PORT:joi.number().required(),
    DATABASE_URL:joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT:joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST:joi.string().required()
}).unknown(true)

const {error , value} = envsSchema.validate(process.env)



if(error){
    throw new Error(`config validation error: ${error.message}`)
}

const envVars:EnvVars = value
export const envs ={

    port: envVars.PORT ,
    databaseUrl : envVars.DATABASE_URL,
    productsMicroservicePort : envVars.PRODUCTS_MICROSERVICE_PORT,
    productsMicroserviceHost : envVars.PRODUCTS_MICROSERVICE_HOST
}