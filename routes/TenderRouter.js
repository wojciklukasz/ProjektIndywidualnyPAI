const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/TenderController');
const offerController = require('../controllers/OfferController');
const ct = require('../functions/GetCurrentTimeFunction');

router.get('/', async function (_req, res, _next) {
    const tenders = await tenderController.getAllActiveTenders();
    res.render('ActiveTendersView', { tenders: tenders, title: 'Przetargi' });
});

router.get('/dodaj', async function(_req, res, _next) {
    res.render('AddTenderView', { title: 'Dodaj nowy przetarg' });
});

router.get('/zakonczone', async function(_req, res, _next) {
    const tenders = await tenderController.getAllPastTenders();
    res.render('OldTendersView', { tenders: tenders, title: 'Zakończone przetargi' });
});

router.get('/zakonczone/:id', async function(req, res, _next) {
    const tender = await tenderController.getOneTender(req.params.id);
    if(tender.length === 0)
        res.render('error', { message: 'Przetarg o danym id nie istnieje!', error: ''});
    else if(tender[0].EndDate > new Date(ct.getCurrentTime()))
        res.redirect('/przetargi/' + req.params.id);
    else {
        const offers = await offerController.getOffersForTender(req.params.id, tender[0].Budget);
        res.render('OneOldTenderView', {tender: tender, offers: offers, title: 'Szegóły przetargu'});
    }
});

router.get('/:id', async function (req, res, _next) {
    const tender = await tenderController.getOneTender(req.params.id);
    console.log(tender);
    if(tender.length === 0)
        res.render('error', { message: 'Przetarg o danym id nie istnieje!', error: ''});
    else if(tender[0].EndDate < new Date(ct.getCurrentTime()))
        res.redirect('/przetargi/zakonczone/' + req.params.id);
    else
        res.render('OneTenderView', { tender: tender, title: 'Szegóły przetargu'});
});

router.post('/', async function(req, res, _next) {
    const tender = await tenderController.createTender(req);
    if(typeof tender === 'string')
        res.render('error', { message: tender, error: '' });
    else
        res.render('error', { message: 'Przetarg został ogłoszony pomyślnie', error: '' });
});

module.exports = router;