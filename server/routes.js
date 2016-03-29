/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/user', require('./api/user'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res, next) {
		// if (req.originalUrl == '/') {
		// 	models.MainCrm.findOne({})
		// 		.exec(function (err, result) {
		// 			if (err) {
		// 				return next(err)
		// 			}
		// 			return res.render('index', {
		// 				result: result
		// 			});
		// 		})
		// }
    console.log(app.get('appPath'));
		return res.sendFile(app.get('appPath') + '/main.html')
	});
};
