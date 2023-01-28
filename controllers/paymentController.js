import Stripe from 'stripe';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { User } from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';

export const buySubscription = catchAsyncError(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
  });

  const { plan, plan_name } = req.body;

  const user = await User.findById(req.user._id);

  if (user.role === 'admin')
    return next(new ErrorHandler("Admin can't buy subscription", 400));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: plan, quantity: 1 }],
    billing_address_collection: 'auto',
    mode: 'subscription',
    customer_email: req.user.email,
    success_url: `${process.env.BACKEND_URL}/api/v1/payment/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BACKEND_URL}//api/v1/payment/checkout-cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  user.subscription.plan_name = plan_name;

  await user.save();

  res.status(201).json({
    success: true,
    url: session.url,
  });
});

export const checkoutSuccessSession = catchAsyncError(
  async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });

    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const subscriptionInfo = await stripe.subscriptions.retrieve(
      session.subscription
    );

    const user = await User.findOne({ email: session.customer_email });

    let userSubIfo = {
      plan_name: user.subscription.plan_name,
      plan: subscriptionInfo.plan.id,
      status: subscriptionInfo.status,
      //status: 'active',
      id: subscriptionInfo.id,
      customer: subscriptionInfo.customer,
      current_period_start: subscriptionInfo.current_period_start,
      current_period_end: subscriptionInfo.current_period_end,
    };

    user.subscription = userSubIfo;

    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/me/subscribe/success`);
  }
);

export const checkoutCancelSession = catchAsyncError(async (req, res, next) => {
  res.redirect(`${process.env.FRONTEND_URL}/me/subscribe/fail`);
});

export const cancelSubscription = catchAsyncError(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
  });

  const user = await User.findById(req.user._id);

  const subscription = await stripe.subscriptions.retrieve(
    user.subscription.id
  );

  if (subscription.status === 'active') {
    await stripe.subscriptions.del(user.subscription.id);
  }

  user.subscription.status = 'canceled';

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Subscription canceled',
  });
});

// export const paymentVerification = catchAsyncError(async (req, res, next) => {
//   const
//   //const user = await User.findById(req.user._id);

//   // const subscription_id = user.subscription.id;

//   // const generated_signature = crypto
//   //   .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
//   //   .update(razorpay_payment_id + '|' + subscription_id, 'utf-8')
//   //   .digest('hex');

//   // const isAuthentic = generated_signature === razorpay_signature;

//   // if (!isAuthentic)
//   //   return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

//   // // database comes here
//   // await Payment.create({
//   //   razorpay_signature,
//   //   razorpay_payment_id,
//   //   razorpay_subscription_id,
//   // });

//   // user.subscription.status = 'active';

//   // await user.save();

//   // res.redirect(
//   //   `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
//   // );
// });

// export const cancelSubscription = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.user._id);

//   const subscriptionId = user.subscription.id;
//   let refund = false;

//   await instance.subscriptions.cancel(subscriptionId);

//   const payment = await Payment.findOne({
//     razorpay_subscription_id: subscriptionId,
//   });

//   const gap = Date.now() - payment.createdAt;

//   const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

//   if (refundTime > gap) {
//     await instance.payments.refund(payment.razorpay_payment_id);
//     refund = true;
//   }

//   await payment.remove();
//   user.subscription.id = undefined;
//   user.subscription.status = undefined;
//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: refund
//       ? 'Subscription cancelled, You will receive full refund within 7 days.'
//       : 'Subscription cancelled, Now refund initiated as subscription was cancelled after 7 days.',
//   });
// });
