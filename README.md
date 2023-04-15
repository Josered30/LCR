# AWS/LCR Proyect

## Use Instructions

1.  Install the [AWS CLI tool]( https://aws.amazon.com/cli/).

2.  Setup the AWS CLI credentials with administrator acccess (Access Key ID, Access Key Secret and Region).
    ```
    aws configure
    ```
3. Install proyect dependencies.
    ```
    npm run i
    ```
4. Create 2 .env file in each one of the 2 sub proyects.
    ```
    REDIS_URL="redis://redis:6379"
    AWS_REGION= <aws_region>
    AWS_ACCESS_KEY= <aws_access_key_secret>
    AWS_KEY_ID= <aws_access_key_id>
    AWS_SQS_QUEUE= <aws_queue_url>
    ```
5. Open 2 terminal instances.

6. Build and run the client application.
    ```
    docker-compose build
    docker-compose run app
    ```
7. Build and run the service application.
    ```
    npm run build
    npm run start
    ```