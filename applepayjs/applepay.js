/* global done:false */
/* global error:false */
/* global PaymentRequest:false */

function performValidation(url) {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
}

function sendPaymentToken(token) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

/**
 * Launches payment request that does not require shipping.
 */
function onPayClicked() {  // eslint-disable-line no-unused-vars
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
      requiredShippingAddressFields: ['postalAddress'],
      total: { label: 'total', amount: '155.00' },
    }

    var session = new ApplePaySession(1, request);

    session.onvalidatemerchant = function(event) {
      performValidation(event.validationURL)
          .then(function(merchantSession) {
            sesion.completeMerchantValidation(merchantSession);
          });
    }

    session.onpaymentauthorized = function(event) {
      sendPaymentToken(event.payment.token)
          .then(function(success) {
            session.completePayment(success ? ApplePaySession.STATUS_SUCCESS :
                                              ApplePaySession.STATUS_FAILURE);
            document.getElementById('contents').innerHTML = 'Thank you!';
          });
    }

    session.begin();

    /*
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
    */
  } catch (e) {
    error('Developer mistake: \'' + e.message + '\'');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var canUseApplePay = false;

  if (window.ApplePaySession) {
    var merchantId = 'merchant.io.github.justindonnelly';
    ApplePaySession.canMakePaymentsWithActiveCard(merchantId)
        .then(function(canMakePayments) {
          canUseApplePay = canMakePayments;
        });
  }

  if (true || canUseApplePay) {
    document.getElementById('apple-pay-button')
        .addEventListener('click', onPayClicked);
    document.getElementById('apple-pay-button').hidden = false;
  } else {
    document.getElementById('unavailable-message').hidden = false;
  }
});
