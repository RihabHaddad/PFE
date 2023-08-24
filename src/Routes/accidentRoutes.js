
router.get('/accident/:deviceid', AccidentController.getAccidentInfoByDeviceIdAndDate);

router.get('/accidents/all', AccidentController.getAllAccidents);

router.get('/accident/number/:DeviceId', AccidentController.findNumberAccidentByDeviceId);
