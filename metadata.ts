import { Context, Handler } from 'aws-lambda';

const region = process.env.AWS_REGION

export const handler: Handler = async (event: any, context: Context) => {
    console.log(event, context)
}