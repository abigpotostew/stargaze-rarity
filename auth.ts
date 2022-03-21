exports.handler = (evt, ctx, callback) => {
    const authorizationHeader = evt.headers.Authorization;
  
    if (!authorizationHeader) {
      return callback("Unauthorized");
    }
  
    const encodedCreds = authorizationHeader.split(" ")[1];
    const [username, password] = Buffer.from(encodedCreds, "base64")
      .toString()
      .split(":");
  
    const allowedUsers = process.env.AUTH_USERS ? JSON.parse(process.env.AUTH_USERS) : {};
    console.log("authing")    
    if(allowedUsers[username] !== password){
        return callback("Unauthorized");
    }    
  
    callback(null, buildAllowAllPolicy(evt, username));
  };
  
  function buildAllowAllPolicy(evt, principalId) {
    const tmp = evt.methodArn.split(":");
    const apiGatewayArnTmp = tmp[5].split("/");
    const awsAccountId = tmp[4];
    const awsRegion = tmp[3];
    const restApiId = apiGatewayArnTmp[0];
    const stage = apiGatewayArnTmp[1];
    const apiArn = `arn:aws:execute-api:${awsRegion}:${awsAccountId}:${restApiId}/${stage}/*/*`;
    const policy = {
      principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [apiArn]
          }
        ]
      }
    };
  
    return policy;
  }