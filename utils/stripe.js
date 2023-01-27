import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

// export const createSubscription = async (req, res, next) => {
//   const { plan, token } = req.body;

//   const user = await User.findById(req.user._id);

//   const { id } = await stripe.customers.create({
//     email: token.email,
//     source: token.id,
//   });

//   const { subscription } = await stripe.subscriptions.create({
//     customer: id,
//     items: [{ plan }],
//     expand: ['latest_invoice.payment_intent'],
//   });

//   user.subscription.id = subscription.id;

//   user.subscription.status = subscription.status;

//   await user.save();

//   res.status(201).json({
//     success: true,
//     subscriptionId: subscription.id,
//   });
// };
