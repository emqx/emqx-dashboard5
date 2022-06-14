export default {
  authn: {
    mysql: `
      CREATE TABLE IF NOT EXISTS \`mqtt_user\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
        \`username\` varchar(100) DEFAULT NULL,
        \`password_hash\` varchar(100) DEFAULT NULL,
        \`salt\` varchar(35) DEFAULT NULL,
        \`is_superuser\` tinyint(1) DEFAULT 0,
        \`created\` datetime DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`mqtt_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
    postgresql: `
      CREATE TABLE mqtt_user (
        id SERIAL primary key,
        is_superuser boolean,
        username character varying(100),
        password_hash character varying(100),
        salt character varying(40)
      )
      `,
    mongodb: `
      {
        username: "emqx_user",
        password_hash: "******",
        salt: "foo+bar",
        is_superuser: false,
        created: "2021-01-01 12:00:01"
      }

      db.mqtt_user.findOne({"username": "emqx_user"})
      `,
    redis: `
      # sample data
      HMSET mqtt_user:emqx_u password_hash *** salt foo+bar is_superuser 1

      # sample cmd
      # HMGET mqtt_user:\${username}

      ## only password
      HMGET mqtt_user:emqx_u password_hash

      ## password + salt
      HMGET mqtt_user:emqx_u password_hash salt

      ## password + salt, enable superuser
      HMGET mqtt_user:emqx_u password_hash salt is_superuser

      ## only password, enable superuser
      HMGET mqtt_user:emqx_u password_hash is_superuser
      `,
  },
  authz: {
    mysql: `
      CREATE TABLE \`mqtt_acl\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`ipaddress\` VARCHAR(60) NOT NULL DEFAULT '',
      \`username\` VARCHAR(255) NOT NULL DEFAULT '',
      \`clientid\` VARCHAR(255) NOT NULL DEFAULT '',
      \`action\` ENUM('publish', 'subscribe', 'all') NOT NULL,
      \`permission\` ENUM('allow', 'deny') NOT NULL,
      \`topic\` VARCHAR(255) NOT NULL DEFAULT '',
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
    postgresql: `
      CREATE TYPE ACTION AS ENUM('publish','subscribe','all');
      CREATE TYPE PERMISSION AS ENUM('allow','deny');

      CREATE TABLE mqtt_acl (
        id SERIAL PRIMARY KEY,
        ipaddress CHARACTER VARYING(60) NOT NULL DEFAULT '',
        username CHARACTER VARYING(255) NOT NULL DEFAULT '',
        clientid CHARACTER VARYING(255) NOT NULL DEFAULT '',
        action ACTION,
        permission PERMISSION,
        topic CHARACTER VARYING(255) NOT NULL
      );
      `,
    mongodb: `
      {
        username: "emqx_u",
        clientid: "emqx_c",
        ipaddress: "127.0.0.1",
        permission: "allow",
        action: "all",
        topics: ["#"]
      }

      db.mqtt_acl.findOne({"username": "emqx_user"})
      `,
    redis: `
      # sample data
      HSET mqtt_acl:emqx_u 't/#' subscribe

      # sample cmd
      HGETALL mqtt_acl:\${username}
    `,
  },
}
