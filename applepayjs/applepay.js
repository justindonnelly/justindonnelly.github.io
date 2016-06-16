var merchantIdentifier = = 'merchant.io.github.justindonnelly';

function showApplePayButton() {
  document.getElementById('apple-pay-button')
      .addEventListener('click', onPayClicked);
  document.getElementById('apple-pay-button').hidden = false;
}

function showUnavailableMessage() {
  document.getElementById('unavailable-message').hidden = false;
}

function performValidation(url) {
  return new Promise(function(resolve, reject) {
    var merchantSession = {};
    merchantSession.merchantIdentifier = merchantIdentifier;
    merchantSession.merchantSessionIdentifier = 'fake-session-id';
    merchantSession.nonce = 'fake-nonce';
    resolve(merchantSession);
  });
}

function sendPaymentToken(token) {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
}

/**
 * Launches payment request that does not require shipping.
 */
function onPayClicked() {  // eslint-disable-line no-unused-vars
  try {
    var request = {
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard'],
      merchantCapabilities: ['supports3DS'],
      requiredShippingAddressFields: ['postalAddress'],
      total: { label: 'Fake Merchant', amount: '155.00' },
    }

    var session = new ApplePaySession(1, request);

    session.onvalidatemerchant = function(event) {
      performValidation(event.validationURL)
          .then(function(merchantSession) {
            session.completeMerchantValidation(merchantSession);
          });
    }

    session.onpaymentauthorized = function(event) {
      sendPaymentToken(event.payment.token)
          .then(function(success) {
            session.completePayment(success ? ApplePaySession.STATUS_SUCCESS :
                                              ApplePaySession.STATUS_FAILURE);
            info('Thank you!');
          });
    }

    session.oncancel = function(event) {
      error("You cancelled. Sorry it didn't work out.");
    }

    session.begin();
  } catch (e) {
    error('Developer mistake: \'' + e.message + '\'');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.ApplePaySession) {
    ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier)
        .then(function(canMakePayments) {
          if (canMakePayments) {
            showApplePayButton();
          } else {
            showUnavailableMessage();
          }
        });
  } else {
    showUnavailableMessage();
  }
});
