module.exports = {
  apps: [{
    name: 'elika-backend',
    script: 'server.js',
    cwd: '/var/www/elika/testing_elika/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/elika-backend-error.log',
    out_file: './logs/elika-backend-out.log',
    log_file: './logs/elika-backend.log',
  }]
};
