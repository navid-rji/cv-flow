// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "cv-flow",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
