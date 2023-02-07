import React, { useEffect, useState } from 'react';
import {
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import axios from 'axios';
// import PayButton from './PayButton';
// import { Text } from '@chakra-ui/react';

const Checkout = props => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
//   const price = props.price;
//   const card_id = props.card_id;
//   const dollar_price = price * 100;
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Purchase',
          amount: 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        applePay: true,
        googlePay: true,
      });

      pr.canMakePayment().then(result => {
        if (result) {
          // console.log("result: ", result)
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    paymentRequest.on('paymentmethod', async ev => {
      const response = await axios.post(
        'https://warm-gorge-84676.herokuapp.com/create-payment-intent/',
        {
          amount: 100,
          automatic_payment_methods: {
            enabled: true,
          },
          currency: 'usd',
        }
      );
      console.log('response data: ', response.data);
      const clientSecret = response.data.client_secret;

      // Confirm the PaymentIntent without handling potential next actions (yet).
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

      if (confirmError) {
        // Report to the browser that the payment failed, prompting it to
        // re-show the payment interface, or show an error message and close
        // the payment interface.
        ev.complete('fail');
      } else {
        // Report to the browser that the confirmation was successful, prompting
        // it to close the browser payment method collection interface.
        ev.complete('success');
        console.log('success');
        // <Text>SUCCESS</Text>;
        setPaymentSuccess(true);
        console.log("payment success: ", paymentSuccess)
        // Check if the PaymentIntent requires any actions and if so let Stripe.js
        // handle the flow. If using an API version older than "2019-02-11"
        // instead check for: `paymentIntent.status === "requires_source_action"`.
        if (paymentIntent.status === 'requires_action') {
          // Let Stripe.js handle the rest of the payment flow.
          const { error } = await stripe.confirmCardPayment(clientSecret);
          if (error) {
            // The payment failed -- ask your customer for a new payment method.
          } else {
            // The payment has succeeded.
          }
        } else {
          // The payment has succeeded.
        }
      }
    });
    return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  }

  return (
    <div>
      {/* <PayButton /> */}
    </div>
  );
};

export default Checkout;
