require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.static('.')); // Serve static frontend files
app.use(express.json());
app.use(cors());

app.post('/create-subscription', async (req, res) => {
    try {
        const { amount, interval, name, email } = req.body;

        // Convert amount to cents
        const unitAmountCents = Math.round(parseFloat(amount) * 100);
        const stripeInterval = interval.toLowerCase() === 'week' ? 'week' : 'month';

        // 1. Create a Stripe Customer (or fetch existing by email in a real app)
        const customer = await stripe.customers.create({
            name: name,
            email: email || 'test@example.com'
        });

        // 2. Create the Price object for the dynamic recurring subscription
        const price = await stripe.prices.create({
            currency: 'usd',
            unit_amount: unitAmountCents,
            recurring: { interval: stripeInterval },
            product_data: { name: `Custom bebestlocal Subscription` },
        });

        // 3. Create the Subscription in 'incomplete' status to return a PaymentIntent
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: price.id }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });

        // Return the client_secret of the PaymentIntent to the frontend Payment Element
        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (e) {
        console.error("Error creating subscription:", e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
