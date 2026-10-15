module.exports = {
  apps: [{
    name: "mail-manager-api",
    script: "./src/server.js",
    instances: 1, // ou "max" pour utiliser tous les coeurs CPU
    exec_mode: "cluster",
    watch: false,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
