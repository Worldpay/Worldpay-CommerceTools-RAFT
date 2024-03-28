# Docker based deployment

The docker container will have endpoints for `/service` and a `/health` endpoint to support container management in tools like Kubernetes.
To build and test this, run the following commands:

```shell
# Build the docker image (do NOT run it from apps/container/docker, but from the application root)
docker build -t wp-raft -f ./docker/Dockerfile .

# Run and test the container locally:
docker run -p 8080:8080 --env-file .env wp-raft
```

For deployment of this container in your cloud provider's environment, please refer to the documentation from your provider.
