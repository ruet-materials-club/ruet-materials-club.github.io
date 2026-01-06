function getcredentialFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("credential");
}

async function loadPerson() {
  const credential = getcredentialFromURL();
  const detailsDiv = document.getElementById("toProvided");

  if (!credential) {
     //window.location.replace("attendeeError.html");
    //return;
  }

  try {
    const res = await fetch("people.csv");
    const csvText = await res.text();

    const people = parseCSV(csvText);

    const person = people.find((p) => String(p.credential) === String(credential));

    if (!person) {
       //window.location.replace("attendeeError.html");
       // return;
    }

    detailsDiv.innerHTML = `${person.name}`;
    } catch (err) {
     window.location.replace("networkError.html");
    return;
  }
}

function parseCSV(csvText) {
  // Remove UTF-8 BOM if exists
  csvText = csvText.replace(/^\uFEFF/, "");

  // Normalize line endings (\r\n -> \n)
  csvText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const lines = csvText.trim().split("\n");

  // Clean headers (trim + remove invisible chars)
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^\uFEFF/, ""));

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(",").map((v) => v.trim());
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] ?? "";
    });

    data.push(obj);
  }

  return data;
}

loadPerson();
