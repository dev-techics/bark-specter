chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getBuyerInfo" }, async (response) => {
    const avatarElement = document.getElementById("clientAvatar");
    const nameElement = document.getElementById("name");
    // const phoneElement = document.getElementById("phone"); 
    // const emailElement = document.getElementById("email");
    const locationElement = document.getElementById("location");
    const membersContainer = document.getElementById("members");
    const mattersContainer = document.getElementById("matters");
    const matterHeading = document.getElementById("matterHeading");
    const memberHeading = document.getElementById("memberHeading");
    const resultSummery = document.getElementById("resultSummery");
    const saveClient = document.getElementById("saveClient");


    if (!response || !response.buyerName) {
      nameElement.textContent = "No buyer name found.";
      return;
    }

    if (!response || !response.buyerPhone) {
      phoneElement.textContent = "No buyer phone found.";
      return;
    }

    if (!response || !response.buyerEmail) {
      emailElement.textContent = "No buyer email found.";
      return;
    }

    if(!response || !response.buyerLocation) {
      locationElement.textContent = "No buyer location found.";
      return;
    }


    const buyerName = response.buyerName;
    const buyerPhone = response.buyerPhone;
    const buyerEmail = response.buyerEmail;
    const buyerLocation = response.buyerLocation;


    nameElement.textContent = buyerName;
    // phoneElement.textContent = buyerPhone;
    // emailElement.textContent = buyerEmail;
    locationElement.textContent = buyerLocation;
    avatarElement.textContent = buyerName.charAt(0).toUpperCase();

    

    try {
      // const SERVER_URL =  "https://cms.icslegal.com";
      const SERVER_URL =  "http://localhost/cms";

      const apiResponse = await fetch(`${SERVER_URL}/bark-api.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'check',
          name: buyerName,
          phone: buyerPhone,
          email: buyerEmail
        })
      });


      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      // response data from api
      const result = await apiResponse.json();
      console.log(result);

      console.log(result);

      // check if data is empty
      if (result?.data?.length > 0) {
        memberHeading.textContent = "Peoples";
        matterHeading.textContent = result.data[0]?.cases?.length > 0 ? "Matters" : "No matter found for this leads.";
      }

      // matter and member counter
      let matters = 0;
      let members = 0;

      // handle the data
      result?.data?.forEach((data) => {
        data.cases.forEach((caseData) => {
          // loading matter data
          mattersContainer.insertAdjacentHTML('beforeend', `
            <div class="matter" data-id="${caseData.caseid}">
              <img class="matter_icon" src="../images/matter-icon.svg" alt="matter icon">
              <div>
                <h3 class="matter_title">${caseData.title || "Untitled Matter"}</h3>
                <small class="matter_desc text-secondary">
                  ${caseData.details || "This matter has no description available."}
                </small>
              </div>
            </div>
          `);

          // matter counter
          matters++;
        });

        // loading member data
        membersContainer.insertAdjacentHTML('beforeend', `
          <div class="member" data-id="125478">
            <img class="member_avatar" src="../images/avatar.jpg" alt="matter icon">
            <div>
              <h3 class="member_name">${data.member.fname + " " + data.member.lname}</h3>
              <small class="member_email text-secondary">
                <img src="../images/icon-email.svg" alt="email icon" class="icon_small icon_email">
                ${data.member.email}
              </small>&nbsp;
              <small class="member_email text-secondary">
                <img src="../images/icon-phone.svg" alt="email icon" class="icon_small icon_phone">
                ${data.member.mobile}
              </small>
            </div>
          </div>
        `);

        // member counter
        members++;
      });


      // result summery
      resultSummery.textContent = `We found ${members} members and ${matters} matters for this leads.`;


      // click listener
      document.querySelectorAll(".matter").forEach((button) => {
          button.addEventListener("click", (e) => {
            const caseId = e.currentTarget.dataset.id;
            console.log(caseId);
            chrome.tabs.create({ url: `${SERVER_URL}/add_edit_case.php?caseid=${caseId}` });
        });
      });


      // click listener
      saveClient.addEventListener("click", (e) => {


        console.log(response.activityLog);
      });
      

    } catch (error) {
      console.error("Fetch error:", error);
    }
  });
});
