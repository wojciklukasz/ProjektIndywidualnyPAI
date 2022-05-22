const TenderModel = require('../models/TenderModel');
const ct = require('../functions/GetCurrentTimeFunction');

const getAllActiveTenders = async () => {
    return TenderModel.getAllActiveTenders();
};

const getAllPastTenders = async () => {
    return TenderModel.getAllPastTenders();
};

const getOneTender = async (id) => {
    return TenderModel.getOneTender(id);
};

const createTender = async (req, _res) => {
    const { body } = req;
    if(
        !body.Name ||
        !body.Owner ||
        !body.Description ||
        !body.Budget ||
        !body.StartDate ||
        !body.EndDate ||
        body.StartDate > body.EndDate ||
        body.EndDate.replace('T', ' ') <= ct.getCurrentTimeWithoutSeconds() ||
        body.Budget <= 0
    ) {
        if(body.StartDate > body.EndDate)
            return 'Zakończenie przetargu musi nastąpić po jego rozpoczęciu!';
        if(body.EndDate.replace('T', ' ') <= ct.getCurrentTimeWithoutSeconds())
            return 'Data zakończenia musi być późniejsza od aktualnej daty!';
        if(body.Budget <= 0)
            return 'Budżet musi być większy od 0!';
        return 'Błąd w przesłanych danych!';
    }

    const tenderToAdd = {
        Name: body.Name,
        Owner: body.Owner,
        Description: body.Description,
        Budget: parseInt(body.Budget),
        StartDate: body.StartDate.replace('T', ' '),
        EndDate: body.EndDate.replace('T', ' ')
    };

    return TenderModel.createTender(Object.values(tenderToAdd));
};

module.exports = {
    getAllActiveTenders,
    getAllPastTenders,
    getOneTender,
    createTender
};