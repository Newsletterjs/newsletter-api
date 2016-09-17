module.exports = {
  /**
   * Install function run in we.js project install.
   *
   * @param  {Object}   we    we.js object
   * @param  {Function} done  callback
   */
  install: function install (we, done) {
    we.log.info('Starting project install...');

    var fns = [];
    var sUser;

    fns.push(function registerUser1(done) {
      var user1 = {
        username: 'admin',
        email: 'contato@albertosouza.net',
        password: '123', // change after install
        displayName: 'Administrator',
        active: true,
        roles: ['administrator']
      };

      we.log.info('I will create the user: ', user1);

      we.db.models.user.findOrCreate({
        where: { email: user1.email },
        defaults: user1
      })
      .spread(function (user, created) {
        we.log.info('New User with id: ', user.id);

        sUser = user;

        // install we-plugin-auth for use password
        if (!we.db.models.password) return done();
        // set the password
        return we.db.models.password.create({
          userId: user.id,
          password: user1.password,
          confirmPassword: user1.password
        })
        .then(function () {
          return done();
        })
      })
      .catch(done);
    });

    fns.push(function createExampleNewsletters(done) {
      we.log.info('Creating first newsletters');

      we.db.models.newsletter.create({
        name: 'Tech news',
        description: 'Newsletter about the newest tecnologies in the world',
        creatorId: sUser.id
      })
      .then(function(user) {
        done();
        return user;
      })
      .catch(done);

    });

    we.utils.async.series(fns, done);
  }
};
