/* global done:false */
/* global error:false */
/* global PaymentRequest:false */

/**
 * Launches payment request that does not require shipping.
 */
function onBuyClicked() {  // eslint-disable-line no-unused-vars
  /*
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
    total: {label: 'Donation', amount: {currency: 'USD', value: '55.00'}},
    displayItems: [
      {
        label: 'Original donation amount',
        amount: {currency: 'USD', value: '65.00'}
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'}
      }
    ]
  };
  */

  try {
    var request = {
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard'],
      merchantCapabilities: ['supports3DS'],
      total: { label: 'Your Label', amount: '155.00' },
    }
    var session = new ApplePaySession(1, request);
    session.show()
        .then(function(instrumentResponse) {
          window.setTimeout(function() {
            instrumentResponse.complete(true)
                .then(function() {
                  done(
                      'Thank you!', instrumentResponse.shippingAddress,
                      session.shippingOption, instrumentResponse.methodName,
                      instrumentResponse.details,
                      instrumentResponse.totalAmount);
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

document.addEventListener('DOMContentLoaded', function () {
  if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
    document.querySelector('button').addEventListener('click', onBuyClicked);
    document.querySelector('button').hidden = false;
  }
});
