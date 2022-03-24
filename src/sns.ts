import { PublishCommand, PublishCommandInput, SNSClient } from "@aws-sdk/client-sns";

const { AWS_REGION: region, IS_OFFLINE: isOffline, METADATA_TOPIC_ARN: snsTopic } = process.env
const snsClient = new SNSClient({ region });

export const publishSnsTopic = async (data) => {
  try {
    if (!isOffline && snsTopic) {
      const params: PublishCommandInput = {
        Message: JSON.stringify(data),
        TopicArn: snsTopic
      }
      const command = new PublishCommand(params);
      const result = await snsClient.send(command)
      console.log("published sns message to topic", JSON.stringify(params))
      return result
    }
    else {
      console.log("No SNS messages sent in offline mode")
    }

  } catch (err) {
    console.log("Error", err.stack);
  }
}
