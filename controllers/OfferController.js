const offerModel = require('../models/OfferModel');

const getOffersForTender = async (id, budget) => {
    return offerModel.getOffersForTender(id, budget);
};

const createOffer = async (req, _res) => {
    const { body } = req;
    if(
        !body.Owner ||
        !body.Price ||
        !body.TenderId ||
        body.Price <= 0
    ) {
        if(body.Price <= 0)
            return 'Budżet musi być większy od 0!';
        return 'Błąd w przesłanych danych!';
    }

    const offerToAdd = {
        Owner: body.Owner,
        Price: body.Price,
        TenderId: body.TenderId,
    };

    return offerModel.createOffer(Object.values(offerToAdd));
};

module.exports = {
    getOffersForTender,
    createOffer
};