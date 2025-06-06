# Docker starts with two things:
# 1. YOUR CODE (.)
# 2. THE CONTAINER IMAGE

# setup the bun base image
# an image is like a snapshot of a VM (container)
# so basically this is a base image that already has bun pre-installed and ready to go on the virtual machine
FROM oven/bun:1


# in the container: mkdir app && cd app
WORKDIR /app

# copy all my code into the container's current working directory
COPY . .

# inside the container
RUN bun install

EXPOSE 3000

CMD ["bun", "run", "serv"]