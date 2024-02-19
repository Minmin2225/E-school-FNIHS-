const recordForm = document.getElementById('record-form');
const lastNameInput = document.getElementById('last-name');
const firstNameInput = document.getElementById('first-name');
const middleNameInput = document.getElementById('middle-name');
const trackInput = document.getElementById('track');
const strandInput = document.getElementById('strand');
const sectionInput = document.getElementById('section');
const recordList = document.getElementById('record-list');
const editIndexInput = document.getElementById('edit-index');

// Load records from local storage when the page loads
let records = JSON.parse(localStorage.getItem('records')) || [];
displayRecords();

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}

function displayRecords() {
  // Sort records alphabetically by last name
  records.sort((a, b) => {
    if (a.lastName < b.lastName) return -1;
    if (a.lastName > b.lastName) return 1;
    return 0;
  });

  recordList.innerHTML = '';
  if (records.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordList.appendChild(row);
  } else {
    records.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecord(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDelete(${index})">Delete</button></td>
                `;
      recordList.appendChild(row);
    });
  }
}
recordForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInput.value;
  const firstName = firstNameInput.value;
  const middleName = middleNameInput.value;
  const track = trackInput.value;
  const strand = strandInput.value;
  const section = sectionInput.value;
  const editIndex = parseInt(editIndexInput.value);
  const fileInput = document.getElementById('file-input');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      records.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      records[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInput.value = -1;
    }

    // Save records to local storage
    localStorage.setItem('records', JSON.stringify(records));

    // Export records to Excel
    exportToExcel();

    lastNameInput.value = '';
    firstNameInput.value = '';
    middleNameInput.value = '';
    trackInput.value = '';
    strandInput.value = '';
    sectionInput.value = '';
    fileInput.value = '';
    displayRecords();
  }
});


function editRecord(index) {
  const recordToEdit = records[index];
  lastNameInput.value = recordToEdit.lastName;
  firstNameInput.value = recordToEdit.firstName;
  middleNameInput.value = recordToEdit.middleName;
  trackInput.value = recordToEdit.track;
  strandInput.value = recordToEdit.strand;
  sectionInput.value = recordToEdit.section;
  editIndexInput.value = index;
}

function confirmDelete(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecord(index);
  }
}

function deleteRecord(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDelete(${index})">Yes</button> <button onclick="resetDelete(${index})">No</button></span>`;
}


function finalConfirmDelete(index) {
  records.splice(index, 1);
  localStorage.setItem('records', JSON.stringify(records));
  displayRecords();
}

function resetDelete(index) {
  displayRecords();
}
// Function to update Excel file
function updateExcel() {
  const wb = XLSX.utils.book_new();
  const existingRecords = JSON.parse(localStorage.getItem('records')) || [];
  const allRecords = existingRecords.concat(records);
  const ws = XLSX.utils.json_to_sheet(allRecords);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "records.xlsx";
  saveAs(blob, fileName);
}
