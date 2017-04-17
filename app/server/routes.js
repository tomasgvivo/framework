const Router = Framework.include('modules', 'server', 'Router');

let router = new Router();

router.use('/', (req, res) => {
	res.send('hola mundo 2');
});



module.exports = router;