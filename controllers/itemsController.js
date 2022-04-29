const axios = require('axios');

const handlerdecimals = (number) => {
    return +(number - Math.trunc(number)).toFixed(2);
}

exports.getSearch = async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${req.query.q}`);

        let categories = data.available_filters.find((item) => item.id === 'category');
        categories = categories.values.map((val) => val.name);
        
        const items = data.results.slice(0, 4).map((item) => ({
            id: item.id,
            title: item.title,
            price: {
                currency: item.currency_id,
                amount: Math.trunc(item.price),
                decimals: handlerdecimals(item.price),
            },
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping
        }));

        const author = {
            name: 'David Felipe',
            lastname: 'Puentes Farfan'
        } 

        res.json({ author, categories, items });
    } catch (err) {
        const { status, data } = err.response;
        res.json({ status, ...data });
    }
}

exports.getItem = async (req, res) => {
    try {
        const itemGet = axios.get(`https://api.mercadolibre.com/items/${req.params.id}`);
        const itemDescriptionGet = axios.get(`https://api.mercadolibre.com/items/${req.params.id}/description`);

        const [itemInfo, descriptionInfo] = await axios.all([itemGet, itemDescriptionGet]);

        const { data: dataInfo } = itemInfo;
        const { data: dataDesc } = descriptionInfo;

        const item = {
            id: dataInfo.id,
            title: dataInfo.title,
            price: {
                currency: dataInfo.currency_id,
                amount: Math.trunc(dataInfo.price),
                decimals: handlerdecimals(dataInfo.price),
            },
            picture: dataInfo.thumbnail,
            condition: dataInfo.condition,
            free_shipping: dataInfo.shipping.free_shipping,
            sold_quantity: dataInfo.sold_quantity,
            description: dataDesc.plain_text,
        }

        const author = {
            name: 'David Felipe',
            lastname: 'Puentes Farfan'
        } 

        res.json({ author, item });
    } catch (err) {
        res.json(err);
    }
}