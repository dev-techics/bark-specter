// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getBuyerInfo" }, async (response) => {
    const nameElement = document.getElementById("name");
    const phoneElement = document.getElementById("phone");
    const emailElement = document.getElementById("email");
    const resultsContainer = document.getElementById("results");
    const seeMatter = document.getElementsByClassName("see_matter");

    


 

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

    const buyerName = response.buyerName;
    const buyerPhone = response.buyerPhone;
    const buyerEmail = response.buyerEmail;

    nameElement.textContent = buyerName;
    phoneElement.textContent = buyerPhone;
    emailElement.textContent = buyerEmail;

    try {
        const apiResponse = await fetch("http://localhost/cms/bark-api.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: buyerName,
                phone: buyerPhone,
                email: buyerEmail
            })
        });

        const response = await apiResponse.json();

        // if response is not ok, throw an error
        if(!apiResponse.ok) {
            throw new Error(`HTTP error! status: ${apiResponse.status}`);
        }

        // if response is okay
        const data = response.data;
        if(!data || data.length === 0) {
            resultsContainer.insertAdjacentHTML('beforeend', `
              <div class="result">
                <div class="result_header">
                  <div>
                    <h3 class="result_name">No client found</h3>
                  </div>
                </div>
              </div>
            `)
            return;
        }
        data.forEach((client) => {
            resultsContainer.insertAdjacentHTML('beforeend', `
              <div class="result">
                <div class="result_header">
                  <div>
                    <h3 class="result_name">${client.fname}</h3>
                  </div>
                  <button class="see_matter" data-id="${client.caseid}">See Matter</button>
                </div>
                <div>
                  <p class="result_title">Client Phone : ${client.phone || client.mobile}</p>
                  <p class="result_info">Client Email : ${client.email}</p>
                </div>
                <div class="result_beauty"></div>
              </div>
            `)
        });


        console.log("API response:", response);
    } catch (error) {
        console.log(error);
    //   resultEl.textContent = `❌ Request failed: ${error.message}`;
    }



    if(seeMatter.length > 0) {
      Array.from(seeMatter).forEach((button) => {
        console.log("Click Working");

        button.addEventListener("click", (e) => {
          const caseId = e.target.dataset.id;
          console.log(caseId);
          chrome.tabs.create({ url: `http://localhost/cms/add_edit_case.php?caseid=${caseId}` });
        });
      });
    }

  });
});


        // <div class="result">
        //   <div class="result_header">
        //     <div>
        //       <h3 class="result_name">Dwip Sarker</h3>
        //       <p class="result_date">2023-10-01 05:23pm</p>
        //     </div>
        //     <a class="see_matter" href="#">See Matter</a>
        //   </div>
        //   <div>
        //     <p class="result_title">Client Phone : 78021 25683259</p>
        //     <p class="result_info">Client Email : adrina23340@gmail.com</p>
        //   </div>
        //   <div class="result_beauty"></div>
        // </div>



        // if response is okay
        // const data = response.data;
        // data.forEach(user => {
        //     console.log(user);
        //     const html = `
              // <div class="result">
              //   <div class="result_header">
              //     <div>
              //       <h3 class="result_name">${user.fname + " " + user.lname}</h3>
              //       <p class="result_date">${user.date}</p>
              //     </div>
              //     <a class="see_matter" href="#">See Matter</a>
              //   </div>
              //   <div>
              //     <p class="result_title">Client Phone : ${user.phone}</p>
              //     <p class="result_info">Client Email : ${user.email}</p>
              //   </div>
              //   <div class="result_beauty"></div>
              // </div>
        //     `;

        //     resultsContainer.insertAdjacentHTML('beforeend', html);
        //   });





        // console.log("API response:", response);