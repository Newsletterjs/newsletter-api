module.exports = function newsletter1(we, cb) {
  const et = new we.class.EmailTemplate({
    label: 'Newsletter 2col-1-2',
    description: 'Email simples de newsletter'
  });

  cb(null, et);
};