const fetch = require('node-fetch');

module.exports = class Shoppy 
{
    constructor(api)
    {
        this.api_key = api;
    }
    
    async AuthenticateOrder(orderId)
    {
        const response = await fetch(`https://shoppy.gg/api/v1/orders/${orderId}`, { 
            method: 'GET',
            headers: {
                'Authorization': this.api_key,
                'User-agent': 'User1337'
        }});
        
        const data = await response.json();

        if (data.delivered === 1)
        {
            if (data.paid_at.substr(0, 10) > "2021-06-05")
            {
                if (data.confirmations === 1)
                {
                    return true;
                }
            }
        }
        return false;
    }

    async GetOrderInformation(orderId)
    {
        const response = await fetch(`https://shoppy.gg/api/v1/orders/${orderId}`, { 
            method: 'GET',
            headers: {
                'Authorization': this.api_key,
                'User-agent': 'User1337'
            }});

        if (response.status === 200)
        {
            const data = await response.json();

            const userData = [ data.product_id, data.product.title, data.paid_at, data.email, data.agent.geo.ip ];
    
            return userData;
        }

        return false;
    }

    async GetProductTitle(orderId)
    {
        const response = await fetch(`https://shoppy.gg/api/v1/orders/${orderId}`, { 
            method: 'GET',
            headers: {
                'Authorization': this.api_key,
                'User-agent': 'User1337'
        }});

        const data = await response.json();

        var productTitle= data.product.title;
        productTitle = productTitle.toString().replace(`'`, '');

        return productTitle;
    }
}