// useful functions
function isEmailMatch(masked, real) {
  let pattern = masked.replace(/([.+?^${}()|\[\]\\])/g, "\\$1");
  pattern = pattern.replace(/\*/g, ".");
  const regex = new RegExp("^" + pattern + "$", "i");
  return regex.test(real);
}

function isPhoneMatch(maskedPhone, realPhone) {
  let cleanMasked = maskedPhone.replace(/\s+/g, "");
  let pattern = cleanMasked.replace(/([.+?^${}()|\[\]\\])/g, "\\$1");
  pattern = pattern.replace(/\*/g, ".");
  const regex = new RegExp("^" + pattern + "$");
  return regex.test(realPhone);
}

function getPercentage(user, buyerName, buyerPhone, buyerEmail) {
  // email + number + name [ not masked ] 100%
  return user.email == buyerEmail &&
    (user.phone == buyerPhone || user.mobile == buyerPhone) &&
    user.fname == buyerName
    ? "match-100"
    : // email + number + name [ masked ]
    isEmailMatch(buyerEmail, user.email) &&
      isPhoneMatch(buyerPhone, user.phone || user.mobile) &&
      user.fname == buyerName
    ? "match-90"
    : // email + phone [ masked ]
    isEmailMatch(buyerEmail, user.email) &&
      isPhoneMatch(buyerPhone, user.phone || user.mobile)
    ? "match-75"
    : // email + name [ masked ]
    isEmailMatch(buyerEmail, user.email) && user.fname == buyerName
    ? "match-75"
    : // if phone or name match
    isPhoneMatch(buyerPhone, user.phone || user.mobile) ||
      user.fname == buyerName
    ? "match-50"
    : // if not match
      "";
}

// html to text converter
function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// create new matter function
async function createMatter(URL, button, data) {
  //send request;
  const apiResponse = await fetch(`${URL}/bark-api-store.php`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });

  // check if response is ok
  if (apiResponse.ok) {
    const result = await apiResponse.json();
    if (result?.status == "success") {
      button.textContent = "Saved";
      document.querySelectorAll(".button_group")[0].classList.add("disabled");
    }
  }
}

async function updateMatterActivity(URL, button, data) {
  try {
    // sending request to api
    const apiResponse = await fetch(`${URL}/bark_api_store_activity.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // check if response is ok
    if (!apiResponse.ok) {
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    // response data from api
    const result = await apiResponse.json();

    // see response
    if (result.status == "success") {
      button.parentElement.classList.add("disabled");
      const firstButton = button.parentElement.querySelector("button");
      if (firstButton) firstButton.textContent = "Updated";
    }
  } catch (error) {
    console.log(error);
  }
}
