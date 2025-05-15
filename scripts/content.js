// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getBuyerInfo") {
    // get the buyer name from the page
    const buyerNameElement = document.querySelector('.buyer_name');
    const name = buyerNameElement ? buyerNameElement.textContent.trim() : null;

    // get the buyer phone from the page
    const buyerPhoneElement = document.querySelector('.buyer-telephone-display');
    const phone = buyerPhoneElement ? buyerPhoneElement.textContent.trim() : null;

    const buyerEmailElement = document.querySelector('.buyer-email-display');
    const email = buyerEmailElement ? buyerEmailElement.textContent.trim() : null;

    const buyerLocationElement = document.querySelectorAll('.location')[1];
    const location = buyerLocationElement ? buyerLocationElement.textContent.trim() : null;

    sendResponse({ 
        buyerName: name, 
        buyerPhone: phone,
        buyerEmail: email,
        buyerLocation: location
    });
  }
  return true;
});