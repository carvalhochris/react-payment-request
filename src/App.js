// import logo from './logo.svg';
import './App.css';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";
import Checkout from './Checkout';

const stripePromise = loadStripe('pk_test_VZ1hztjRaEh9jZYDMHVyuFCj');

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
            <Checkout 
            // price={props.price} 
            // card_id={props.id}
            />
        </Elements>
    </div>
  );
}

export default App;
