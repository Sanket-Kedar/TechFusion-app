// SIMULATED PAYMENT SYSTEM FOR DEVELOPMENT
// This replaces Stripe integration with mock payments for testing
console.log('💳 Using SIMULATED payment system (not real payments)');

// Generate a mock payment intent ID
const generatePaymentIntentId = () => {
  return `pi_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

// Generate a mock client secret
const generateClientSecret = (paymentIntentId) => {
  return `${paymentIntentId}_secret_${Math.random().toString(36).substring(7)}`;
};

// @desc    Create payment intent (SIMULATED)
// @route   POST /api/payment/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Simulate payment intent creation
    const paymentIntentId = generatePaymentIntentId();
    const clientSecret = generateClientSecret(paymentIntentId);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock payment intent data
    res.json({
      clientSecret: clientSecret,
      paymentIntentId: paymentIntentId,
      amount: Math.round(amount),
      currency: 'inr',
      status: 'requires_payment_method',
      simulated: true,
      message: 'This is a simulated payment - no real transaction will occur'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get payment config (SIMULATED)
// @route   GET /api/payment/config
// @access  Public
export const getStripeConfig = async (req, res) => {
  res.json({
    publishableKey: 'pk_test_simulated_key_for_development',
    simulated: true,
    message: 'Using simulated payment system'
  });
};

// @desc    Confirm payment (SIMULATED)
// @route   POST /api/payment/confirm-payment
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId || !paymentIntentId.startsWith('pi_sim_')) {
      return res.status(400).json({ message: 'Invalid payment intent ID' });
    }

    // Simulate payment confirmation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful payment
    res.json({
      success: true,
      paymentIntentId: paymentIntentId,
      status: 'succeeded',
      simulated: true,
      message: 'Payment simulated successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
