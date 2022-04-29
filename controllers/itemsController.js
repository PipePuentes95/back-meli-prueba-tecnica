const axios = require('axios');

const handlerdecimals = (number) => {
    return +(number - Math.trunc(number)).toFixed(2);
}

exports.getSearch = async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${req.query.q}`);

        const author = {
            name: 'David Felipe',
            lastname: 'Puentes Farfan'
        } 

        let categories = data.available_filters.find((item) => item.id === 'category')
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

        res.json({ author, categories, items });
    } catch (error) {
        console.log(error);
    }
}