var pg = require('pg');
var bcrypt = require('bcrypt');

SALT_WORK_FACTOR = 10;

var config = {
  database: 'passport',
  port: 5432,
  max: 10, //max clients in pool
  idleTimeoutMillis: 30000 //how long a client can remain idle before being closed
};

var pool = new pg.Pool(config);

function findByUsername(username, callback) {
  pool.connect(function(err, client, done) {
    if (err) {
      done();
      return callback(err);
    }

    client.query('SELECT * FROM users WHERE username=$1;', [username], function(err, result) {
      if (err) {
        done();
        return callback(err);
      }

      callback(null, result.rows[0]);
      done();
    });

  });
}

function create(username, password, callback) {

  bcrypt.hash(password, SALT_WORK_FACTOR, function(err, hash) {
    pool.connect(function(err, client, done) {
      if (err) {
        done();
        return callback(err);
      }

      client.query('INSERT INTO users (username, password) '
      + 'VALUES ($1, $2) RETURNING id, username;',
      [username, hash],
      function(err, result) {

        if (err) {
          done();
          return callback(err);
        }

        callback(null, result.rows[0]);
        done();
      });
    });
  });
}

function findAndComparePassword(username, candidatePassword, callback) {
  //we received candidate password on the request

  findByUsername(username, function(err, user) {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(err);
    };

    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
      if (err) {
        console.log('Error comparing passwords', err);
        callback(err);
      } else {
        console.log('isMatch:', isMatch);
        callback(null, isMatch, user);
      };
    });
  });

}

function findById(id, callback) {
  pool.connect(function(err, client, done) {
    if (err) {
      done();
      return callback(err);
    }

    client.query('SELECT * FROM users WHERE id=$1;', [id], function(err, result) {
      if (err) {
        done();
        return callback(err);
      }

      callback(null, result.rows[0]);
      done();
    });
  });
}

module.exports = {
  findByUsername: findByUsername,
  findById: findById,
  create: create,
  findAndComparePassword: findAndComparePassword
};
