chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { action: "getBuyerInfo" },
    async (response) => {
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
      const saveClient = document.getElementById("saveMatter");
      const buttonGroup = document.querySelectorAll(".button_group");
      const saveMatterWithPriority = document.getElementById(
        "saveMatterWithPriority"
      );

      // server information
      const SERVER_URL = "https://cms.icslegal.com";
      // const SERVER_URL    = "http://localhost/cms";
      console.log(SERVER_URL);

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

      if (!response || !response.buyerLocation) {
        locationElement.textContent = "No buyer location found.";
        return;
      }

      // buyer information form website
      const buyerName = response.buyerName;
      const buyerPhone = response.buyerPhone.split(" ").join("");
      const buyerEmail = response.buyerEmail;
      const buyerLocation = response.buyerLocation;
      const activityLog = response.activityLog;
      const buyerService = response.buyerService;

      nameElement.textContent = buyerName;
      // phoneElement.textContent = buyerPhone;
      // emailElement.textContent = buyerEmail;
      locationElement.textContent = buyerEmail;
      avatarElement.textContent = buyerName.charAt(0).toUpperCase();

      // show save button if email not masked
      if (!buyerEmail.includes("*")) {
        buttonGroup[0].style.display = "flex";
      }

      // create new matter
      saveClient.addEventListener("click", () => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "send-email" },
          async (response) => {
            console.log(response)
          }
        );
        
        createMatter(SERVER_URL, saveClient, {
          fname: buyerName,
          lname: '.',
          mobile: buyerPhone,
          email: buyerEmail,
          service: buyerService,
          activity_log: activityLog,
          advertise: "Bark",
          sources: "Bark",
          matter_type: 'Consultation',
          priority: "",
        });
      });

      // create new matter with priority
      saveMatterWithPriority.addEventListener("click", () => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "send-email" },
          async (response) => {
            console.log(response)
          }
        );

        createMatter(SERVER_URL, saveClient, {
          fname: buyerName,
          lname: '.',
          mobile: buyerPhone,
          email: buyerEmail,
          service: buyerService,
          activity_log: activityLog,
          advertise: "Bark",
          sources: "Bark",
          matter_type: 'Consultation',
          priority: "high",
        });
      });



      try {
        // request on api end points
        const apiResponse = await fetch(`${SERVER_URL}/bark-load.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "check",
            name: buyerName,
            phone: buyerPhone,
            email: buyerEmail,
          }),
        });

        if (!apiResponse.ok) {
          throw new Error(`HTTP error! status: ${apiResponse.status}`);
        }

        // response data from api
        const result = await apiResponse.json();
        console.log(result);
        

        if (result && result.status == "success") {
          // change headings
          result.users.length > 0 && (memberHeading.textContent = "Peoples");
          result.matters.length > 0 && (matterHeading.textContent = "Matters");

          // load users or members
          result.users.forEach((user) => {
            let percentage = getPercentage(
              user,
              buyerName,
              buyerPhone,
              buyerEmail
            );
            membersContainer.insertAdjacentHTML(
              "beforeend",
              `<div class="member" data-id="${user.id}">
                  <div class="progress ${percentage}">
                    <img class="member_avatar" src="../images/avatar.jpg" alt="matter icon">
                  </div>
                  <div>
                    <h3 class="member_name">${user.fname + " " + user.lname}</h3>
                    <small class="member_email text-secondary">
                      <img src="../images/icon-email.svg" alt="email icon" class="icon_small icon_email">
                      ${user.email}
                    </small>&nbsp;
                    <small class="member_email text-secondary">
                      <img src="../images/icon-phone.svg" alt="email icon" class="icon_small icon_phone">
                      ${user.mobile || user.phone}
                    </small>
                  </div>
                </div>
              `
            );

            // looks saves with text disabled.
            if (user.email == buyerEmail) {
              saveClient.textContent = "Saved";
              buttonGroup[0].classList.add("disabled");
            }

            // change header email
          });

          // load matters
          result.matters.forEach((matter) => {
            mattersContainer.insertAdjacentHTML(
              "beforeend",
              `
              <div class="matter" data-id="${matter.caseid}" data-client="${
                  matter.fkclientid
                }" >
                <img class="matter_icon" src="../images/matter-icon.svg" alt="matter icon">
                  <div class="matter_details">
                    <h3 class="matter_title">${
                      stripHtml(matter.title) || "Untitled Matter"
                    }</h3>
                    <small class="matter_desc text-secondary">
                    ${
                      stripHtml(matter.details) ||
                      "This matter has no description available."
                    }
                    </small>
                  </div>
                  <div class="button_group matter_button_group">
                    <button class="left_button update_activity" data-priority="normal" data-id="${
                      matter.caseid
                    }">
                      <img class="arrow" src="../images/icon-arrow-down.svg" alt="">
                      <p>Update</p>
                    </button>
                    <button class="right_button update_activity" data-priority="high" data-id="${
                      matter.caseid
                    }">
                      <img class="arrow" src="../images/icon-arrow-down.svg" alt="">
                      <p>Update With Priority</p>
                    </button>
                  </div>
              </div>
            `
            );
          });

          // count and render result
          let matters = result.matters.length;
          let members = result.matters.length;

          // update footer text
          resultSummery.textContent = `We found ${members} members and ${matters} matters for this leads.`;

          // click listener for matters
          document.querySelectorAll(".matter").forEach((button) => {
            button.addEventListener("click", (e) => {
              const caseId = e.currentTarget.getAttribute("data-id");
              chrome.tabs.create({
                url: `${SERVER_URL}/add_edit_case.php?caseid=${caseId}`,
              });
            });
          });
        } else {
          console.log(result);
        }

        // update matter activity
        const updateActivity = document.querySelectorAll(".update_activity");
        updateActivity.forEach((button) => {
          button.addEventListener("click", async (e) => {
            e.stopPropagation();
            const priority = e.currentTarget.dataset.priority;
            const caseId = e.currentTarget.dataset.id;

            // update matter activity
            updateMatterActivity(SERVER_URL, button, {
              matterId: caseId,
              activityLog: activityLog,
              priority: priority,
            });
          });
        });

        // filter matter
        const memberElements = document.querySelectorAll(".member");
        memberElements.forEach((member) => {
          // hide matter on click
          member.addEventListener("click", (e) => {
            // Remove 'selected' from all progress elements first (optional, for single selection)
            document
              .querySelectorAll(".progress.selected")
              .forEach((p) => p.classList.remove("selected"));

            const progress = e.currentTarget.querySelector(".progress");
            if (progress) {
              progress.classList.add("selected");
            }

            const memberId = e.currentTarget.getAttribute("data-id");
            const selectedMatter = document.querySelectorAll(".matter");
            selectedMatter.forEach((matter) => {
              if (matter.getAttribute("data-client") === memberId) {
                matter.classList.remove("hide");
              } else {
                matter.classList.add("hide");
              }
            });
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  );
});
