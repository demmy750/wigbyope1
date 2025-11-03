import React from 'react';
import './OrderConfirmation.css';

const OrderConfirmation = ({ orderId, estimatedDelivery, onTrackOrder }) => {
  return (
    <section className="order-confirmation" role="main" aria-labelledby="confirmation-heading">
      <div className="container confirmation-container">
        <h1 id="confirmation-heading" className="confirmation-title">Thank You for Your Purchase!</h1>
        <p className="confirmation-message">
          Your order has been successfully placed.
        </p>
        <div className="order-details">
          <p><strong>Order ID:</strong> <span className="order-id">{orderId}</span></p>
          <p><strong>Estimated Delivery:</strong> <span className="delivery-time">{estimatedDelivery}</span></p>
        </div>
        <button 
          className="btn btn-primary track-order-btn" 
          onClick={onTrackOrder}
          aria-label="Track your order"
        >
          Track Your Order
        </button>
      </div>
    </section>
  );
};

export default OrderConfirmation;