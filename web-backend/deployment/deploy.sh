#!/usr/bin/env bash
set -e
TASK_FAMILY=prod-web-backend
SERVICE_NAME=prod-web-backend
CLUSTER_NAME=prod

export TASK_VERSION=$(aws ecs register-task-definition --cli-input-json file://deployment/codebuild/image-definition.json | jq --raw-output '.taskDefinition.revision')
echo "Registered ECS Task Definition: " $TASK_VERSION

if [ -n "$TASK_VERSION" ]; then
    echo "Update ECS Cluster: " $CLUSTER_NAME
    echo "Service: " $SERVICE_NAME
    echo "Task Definition: " $TASK_FAMILY:"$TASK_VERSION"
    DEPLOYED_SERVICE=$(aws ecs update-service --load-balancers="targetGroupArn=arn:aws:elasticloadbalancing:ap-south-1:029178759545:targetgroup/web-backend-tg/505780d1f84500c0,containerName=web-backend,containerPort=8765" --cluster  $CLUSTER_NAME --service $SERVICE_NAME --task-definition "$SERVICE_NAME:$TASK_VERSION" --network-configuration "awsvpcConfiguration={subnets=[subnet-0ea545508bddb86cb,subnet-0c900cfbbc82c5bd7],securityGroups=[sg-0dd9126e92ba383ff]}" | jq --raw-output '.service.serviceName')
    echo "Deployment of $DEPLOYED_SERVICE complete"
    SERVICE_STABLE=$(aws ecs wait services-stable --cluster $CLUSTER_NAME --service $SERVICE_NAME)
    echo "Stable status $SERVICE_STABLE"
else
    echo "exit: No task definition"
    exit 1
fi
