/* global done:false */
/* global error:false */
/* global PaymentRequest:false */

/**
 * Launches payment request that does not require shipping.
 */
function onBuyClicked() {  // eslint-disable-line no-unused-vars
  var supportedInstruments = [
    {
      supportedMethods: ['https://android.com/pay'],
      data: {
        merchantId: '123456',
        allowedCardNetworks: ['AMEX', 'MASTERCARD', 'VISA'],
        paymentMethodTokenizationParameters: {
          tokenizationType: 'GATEWAY_TOKEN',
          parameters: {
            'gateway': 'stripe',
            'stripe:publishableKey': 'pk_test_VKUbaXb3LHE7GdxyOBMNwXqa',
            'stripe:version': '2015-10-16 (latest)'
          }
        }
      }
    },
    {
      supportedMethods: [
        'visa', 'mastercard', 'amex', 'discover', 'maestro', 'diners', 'jcb',
        'unionpay'
      ]
    }
  ];

  var details = {
    total: {label: 'Original donation amount (plus here is a whole bunch of extra words)', amount: {currency: 'USD', value: '65,032,482.00'}},
    displayItems: [
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'}
      },
      {
        label: 'Total',
        amount: {currency: 'USD', value: '55.00'}
      }
    ]
  };

  if (!window.PaymentRequest) {
    error('PaymentRequest API is not supported.');
    return;
  }

  try {
    var request = new PaymentRequest(supportedInstruments, details);
    request.show()
        .then(function(instrumentResponse) {
          window.setTimeout(function() {
            instrumentResponse.complete('success')
                .then(function() {
                  done('Thank you!', instrumentResponse);
                })
                .catch(function(err) {
                  error(err.message);
                });
          }, 2000);
        })
        .catch(function(err) {
          error(err.message);
        });
  } catch (e) {
    error('Developer mistake: \'' + e.message + '\'');
  }
}
