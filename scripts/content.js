// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getBuyerInfo") {
    // get the buyer name from the page
    const buyerNameElement = document.querySelector('.buyer_name');
    const name = buyerNameElement ? buyerNameElement.textContent.trim() : null;

    // get the buyer phone from the page
    const buyerPhoneElement = document.querySelector('.buyer-telephone-display');
    const phone = buyerPhoneElement ? buyerPhoneElement.textContent.trim() : null;

    // get the buyer email from the page
    const buyerEmailElement = document.querySelector('.buyer-email-display');
    const email = buyerEmailElement ? buyerEmailElement.textContent.trim() : null;

    // get the buyer location from the page
    const buyerLocationElement = document.querySelectorAll('.location')[1];
    const location = buyerLocationElement ? buyerLocationElement.textContent.trim() : null;

    // get the buyer question & answer from the page
    const container = document.querySelector('.project-questions-answers');
    const questions = container.querySelectorAll('.project-details-question');
    const answers = container.querySelectorAll('.project-details-answer');
    let finalOutput = '';

    questions.forEach((question, index) => {
      const qText = question.textContent.trim();
      const aText = answers[index]?.textContent.trim() || '';
      finalOutput += `Question : ${qText}\nAnswer : ${aText}\n\n`;
    });


    // request quotes info and message
    let requestQuotes = '';
    const responseSpan = document.querySelector('.response.text-regular');
    if (responseSpan) {
      const spanTextNode = responseSpan.childNodes[0];
      const spanText = spanTextNode?.textContent?.trim() || '';
      const messageElement = responseSpan.querySelector('.font-weight-bold');
      const message = messageElement?.textContent?.trim() || '';
      if (spanText || message) {
        requestQuotes = `Info: ${spanText}\nMessage: ${message}\n`;
      }
    }

    // send the data back to the popup
    sendResponse({ 
        buyerName: name, 
        buyerPhone: phone,
        buyerEmail: email,
        buyerLocation: location,
        activityLog: finalOutput += requestQuotes,
    });
  }
  return true;
});