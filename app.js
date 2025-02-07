const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use environment variable for security
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());

// Endpoint to create payment intent
app.post('/create-payment-intent', async (req, res) => {
    const { token, amount } = req.body;

    console.log("Received token:", token);  // Log the token received
    console.log("Received amount:", amount); // Log the amount received

    try {
        // Validate the request data
        if (!token || !amount) {
            return res.status(400).send({ success: false, error: 'Token and amount are required' });
        }

        // Create a PaymentIntent with the amount (convert to cents)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: 'usd',
            payment_method: token,
            confirm: true,
        });

        // Return client secret back to the front-end
        res.send({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);  // Log the error
        res.status(500).send({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
