module.exports = {
  find: function findAll (req, res) {
    if (req.isAuthenticated()) {
      res.locals.query.include.push({
        model: req.we.db.models.user,
        as: 'subscribers',
        through: {
          attributes: ['id', 'status'],
          // where: {completed: true}
        }
      })
    }

    return res.locals.Model
    .findAndCountAll(res.locals.query)
    // .then( (result)=> {
    //   if (!result.count) {
    //     return result;
    //   }


    // })
    .then(function afterFindAndCount (record) {
      res.locals.metadata.count = record.count
      res.locals.data = record.rows
      res.ok()
      return null
    })
    .catch(res.queryError)
  },

  getAllUserSubscriptions: function getAllUserSubscriptions(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();

    const plugin = req.we.plugins.project;

    plugin.getAllSubscriptions(req.user.id)
    .then( (subscriptions)=> {

      res.ok(subscriptions);
      return subscriptions;
    })
    .catch(res.queryError);
  },

  isSubscribed: function isSubscribed(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();

    const plugin = req.we.plugins.project;

    plugin.isSubscribed(req.params.newsletterId, req.user.id)
    .then( (have)=> {
      if (have) {
        res.ok(have);
        return null;
      } else {
        return res.ok();
      }
    })
    .catch(res.queryError);
  },

  subscribe: function subscribe(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();

    const plugin = req.we.plugins.project;

    plugin.subscribe(req.user.id, req.params.newsletterId)
    .then( (subs)=> {
      res.locals.data = subs;
      res.ok();
      return null;
    })
    .catch(res.queryError);
  },

  unSubscribe: function unSubscribe(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();

    req.we.db.models.newsletter.findById(req.params.newsletterId)
    .then( (news)=> {
      if (!news) {
        res.notFound();
        return null;
      }

      return news.removeSubscriber(req.user)
      .then( ()=> {
        res.ok();
        return null;
      });
    })
    .catch(res.queryError);
  }
};