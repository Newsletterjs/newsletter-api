/**
 * We.js project plugin file, use to load routes and configs
 *
 * @param  {String} projectPath current project path
 * @param  {Object} Plugin      we.js Plugin class
 * @return {Object}             intance of we.js Plugin class
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  /**
   * Get user subscription
   *
   * @param  {Number} userId
   * @param  {Number} newsletterId
   * @return {Promisse}              sequelize find promisse
   */
  plugin.getSubscription = function getSubscription(userId, newsletterId) {
    return plugin.we.db.models.newsletterSubscribers
    .findOne({
      where: {
        newsletterId: newsletterId,
        userId: userId
      },
      include: [{ all: true }]
    });
  }
  /**
   * check if user is Subscribed
   *
   * @param  {Number}  userId
   * @param  {Number}  nesletterId
   * @return {Promisse}             sequelize find promisse
   */
  plugin.isSubscribed = function isSubscribed(userId, nesletterId) {
    return plugin.getSubscription(userId, nesletterId);
  }
  /**
   * Get all user subscriptions
   *
   * @param  {Number} userId
   * @return {Promisse}       Sequelize find promisse
   */
  plugin.getAllSubscriptions = function getAllSubscriptions(userId) {
    if (!userId) throw new Error('getAllSubscriptions.userId.required');

    return plugin.we.db.models.newsletterSubscribers
    .findAll({
      where: {
        userId: userId
      },
      limit: 100,
      include: [{ all: true }]
    });
  }

  /**
   * subscribe one user in one newsletter
   *
   * @param  {Number} userId
   * @param  {Number} newsletterId
   * @return {Promisse}              sequelize find promisse
   */
  plugin.subscribe = function subscribe(userId, newsletterId) {
    return plugin.we.db.models.newsletter
    .findOne({
      where: { id: newsletterId }
    })
    .then( (news)=> {
      // return null;
      if (!news) {
        return null;
      }

      return news.hasSubscriber(userId)
      .then( (have)=> {
        if (have) {
          return null;
        } else {
          return news.addSubscriber(userId)
          .then( ()=> {
            return null;
          });
        }
      });
    })
    .then( ()=> {
      return plugin.getSubscription(userId, newsletterId);
    });
  }

  return plugin;
};