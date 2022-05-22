const express = require('express');
const router = express.Router();
const offerController = require('../controllers/OfferController');
const tenderController = require('../controllers/TenderController');
const ct = require('../functions/GetCurrentTimeFunction');

router.get('/:id', async function (req, res, _next) {
    const tender = await tenderController.getOneTender(req.params.id);
    if(typeof tender === 'undefined')
        res.render('error', { message: 'Przetarg o tym id nie istnieje', error: ''});
    if(tender[0].EndDate < new Date(ct.getCurrentTime()))
        res.render('error', { message: 'Przetarg o tym id już się zakończył', error: ''});
    else
        res.render('AddOfferView', { tenderId: req.params.id, title: 'Nowa oferta' });
});

router.post('/', async function (req, res, _next) {
    const offer = await offerController.createOffer(req);
    if(typeof offer === 'string')
        res.render('error', { message: offer, error: '' });
    else
        res.render('error', { message: 'Oferta została dodana pomyślnie', error: '' });
});

module.exports = router;