// checkin.js

// This function is called when the Check-in button is clicked
function checkIn() {
  const nameInput = document.getElementById("nameInput").value; // Replace "nameInput" with the actual ID of your input field
  const spreadsheetId = "1nb1UjmRFOBq1U7fIYwvLrUD2--SK6yT-lUxXZjkw3gE"; // Replace with the ID of your Google Sheets spreadsheet
  const apiKey = "AIzaSyCu1IWGckTubH2TNcJwJ7ZYkImgBUe7ufQ";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:B?key=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (!data || !data.values || data.values.length === 0) {
        throw new Error("No data found in the Google Sheets");
      }

      const values = data.values;
      const rowToCheckIn = values.findIndex(row => row[0] === nameInput);

      if (rowToCheckIn !== -1) {
        const details = values[rowToCheckIn][1];
        const checkInStatus = `Checked-in at: ${new Date().toLocaleString()}`;
        values[rowToCheckIn][1] = checkInStatus;

        // Update the Google Sheets with the new check-in status
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values,
          }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Error updating Google Sheets");
            }
            return response.json();
          })
          .then(() => {
            alert(`${nameInput}'s Details: ${details}\nChecked-in successfully!`);
          })
          .catch(error => {
            console.error("Error updating Google Sheets:", error);
            alert("Error occurred while updating Google Sheets.");
          });
      } else {
        alert("User not found!");
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      alert("Error occurred while fetching data from Google Sheets.");
    });
}

// Attach the checkIn() function to the button click event
document.getElementById("checkInButton").addEventListener("click", checkIn);
