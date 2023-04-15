# AWS/LCR Project

## Use Instructions

1.  Install the [AWS CLI tool](https://aws.amazon.com/cli/).

2.  Setup the AWS CLI credentials with administrator acccess (Access Key ID, Access Key Secret and Region).
    ```
    aws configure
    ```
3.  Deploy the cloudformation template
    ```
    aws cloudformation deploy --template-file cloudformation.yaml --stack-name lcr
    ```
4.  Check the deployment
    ```
    aws cloudformation describe-stacks --stack-name lcr
    
    {
    "Stacks": [
        {
            "StackId": "arn:aws:cloudformation:us-east-1:905802233663:stack/lcr/3e9b2320-db04-11ed-b682-0a41fe0ace1b",
            "StackName": "lcr",
            "ChangeSetId": "arn:aws:cloudformation:us-east-1:905802233663:changeSet/awscli-cloudformation-package-deploy-1681516020/1def64ad-6713-439b-88da-5f707fea663a",
            "Description": "Creating DynamoDB tables with CloudFormation",
            "CreationTime": "2023-04-14T20:37:59.636000+00:00",
            "LastUpdatedTime": "2023-04-14T23:47:12.385000+00:00",
            "RollbackConfiguration": {},
            "StackStatus": "UPDATE_COMPLETE",
            "DisableRollback": false,
            "NotificationARNs": [],
            "Outputs": [
                {
                    "OutputKey": "Player",
                    "OutputValue": "Player",
                    "Description": "Player table"
                },
                {
                    "OutputKey": "Game",
                    "OutputValue": "Game",
                    "Description": "Game table"
                }
            ],
            "Tags": [],
            "EnableTerminationProtection": false,
            "DriftInformation": {
                "StackDriftStatus": "NOT_CHECKED"
            }
        }
    ]
    }
}
    ``` 
5.  Install proyect dependencies in each subproject.
    ```
    cd lcr-client
    npm i
    ```
    ```
    cd lcr-service
    npm i
    ```
6.  Create 2 .env file in each one of the 2 sub projects.
    ```
    touch lcr-client/.env
    touch lct-client/.env
    ```
    .env
    ```
    REDIS_URL="redis://redis:6379"
    AWS_REGION= <aws_region>
    AWS_ACCESS_KEY= <aws_access_key_secret>
    AWS_KEY_ID= <aws_access_key_id>
    AWS_SQS_QUEUE= <aws_queue_url>
    ```
7.  Open 2 terminal instances.

8.  Build and run the client application.
    ```
    docker-compose build
    docker-compose run app
    ```
9.  Build and run the service application.
    ```
    npm run build
    npm run start
    ```
