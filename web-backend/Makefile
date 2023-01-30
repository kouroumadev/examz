ecr-login:
	aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 029178759545.dkr.ecr.ap-south-1.amazonaws.com

## Base image ops
ecr-build-base:
<<<<<<< HEAD
	docker build -t web-backend-base:${IMAGE_TAG} --file deployment/ecr-base.Dockerfile .
=======
	docker build -t web-backend-base:latest --file deployment/ecr-base.Dockerfile .
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

ecr-build-base-and-push: ecr-build-base ecr-login
	docker tag web-backend-base:${IMAGE_TAG} 029178759545.dkr.ecr.ap-south-1.amazonaws.com/web-backend/base:${IMAGE_TAG}
    docker push 029178759545.dkr.ecr.ap-south-1.amazonaws.com/web-backend/base:${IMAGE_TAG}

# Main image ops
ecr-build:
	docker build -t web-backend:latest --file ecr.Dockerfile .

ecr-build-push: ecr-login ecr-build
	docker tag web-backend:latest 029178759545.dkr.ecr.ap-south-1.amazonaws.com/web-backend:${IMAGE_TAG}
    docker push 029178759545.dkr.ecr.ap-south-1.amazonaws.com/web-backend:${IMAGE_TAG}

<<<<<<< HEAD
=======
ecs-deploy-dev:
	bash deployment/deploy-dev.sh

>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
ecs-deploy:
	bash deployment/deploy.sh

migrate:
	docker run -e DB_HOST=$$DB_HOST -e DB_USERNAME=$$DB_USERNAME -e DB_PASSWORD=$$DB_PASSWORD -e DB_DATABASE=$$DB_DATABASE web-backend:latest  ./migrate

build:
	docker build -t web-backend:latest .

run-docker:
	docker kill web-backend || true
	docker rm --force web-backend || true
	docker run -p 8080:8765 --name web-backend  --env-file=docker.env -d web-backend:latest

migrate-local:
	docker kill web-backend-migrator || true
	docker rm --force web-backend-migrator || true
	docker run --name web-backend-migrator --env-file=docker.env --entrypoint=./migrate web-backend:latest

