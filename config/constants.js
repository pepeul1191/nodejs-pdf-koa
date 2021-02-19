module.exports = {
  data: {
    sistema_id: 1,
    base_url: 'http://localhost:3001/',
    static_url: 'http://localhost:3001/',
    static: 'dev',
    csrf: {
      secret: 'mpt/sr6eS2AlCRHU7DVThMgFTN08pnfSDf/C94eZx7udfm0lvgaYWLYJttYPKzGKDTlXwVU/d2FOxbKkgNlsTw==',
      key: 'csrf_val'
    },
  },
  middlewares: {
    csrf : true,
    session : true,
    session_admin : true,
    logs : true,
    csrf_check: true, 
  },
  uploader_options: {
    multipart: true, 
    uploadDir: '.',
    urlencoded: true,
  },
  admin: {
    user: 'admin',
    pass: 'sistema123'
  },
};
