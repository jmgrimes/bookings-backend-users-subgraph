FROM node:20-slim
LABEL maintainer=jonah.grimes@gmail.com

# Image and Build Labels.
LABEL org.label-schema.name="bookings-backend-users"
LABEL org.label-schema.description="Backend application presenting the Users subgraph for the Bookings application."
LABEL org.label-schema.vcs-url="https://github.com/jmgrimes/bookings-backend-users"

# Environment.
ENV MONGODB_URI=mongodb://localhost/users

# Image Composition.
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Image Executable.
CMD ["node", "dist/main.js"]