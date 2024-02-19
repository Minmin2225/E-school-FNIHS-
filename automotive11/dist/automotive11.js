const recordFormAutomotive11 = document.getElementById('record-form-automotive11');
const lastNameInputAutomotive11 = document.getElementById('last-name-automotive11');
const firstNameInputAutomotive11 = document.getElementById('first-name-automotive11');
const middleNameInputAutomotive11 = document.getElementById('middle-name-automotive11');
const trackInputAutomotive11 = document.getElementById('track-automotive11');
const strandInputAutomotive11 = document.getElementById('strand-automotive11');
const sectionInputAutomotive11 = document.getElementById('section-automotive11');
const recordListAutomotive11 = document.getElementById('record-list-automotive11');
const editIndexInputAutomotive11 = document.getElementById('edit-index-automotive11');

let recordsAutomotive11 = JSON.parse(localStorage.getItem('recordsAutomotive11')) || [];
displayRecordsAutomotive11();

function displayRecordsAutomotive11() {
  recordListAutomotive11.innerHTML = '';
  if (recordsAutomotive11.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListAutomotive11.appendChild(row);
  } else {
    recordsAutomotive11.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordAutomotive11(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteAutomotive11(${index})">Delete</button></td>
                `;
      recordListAutomotive11.appendChild(row);
    });
  }
}

recordFormAutomotive11.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputAutomotive11.value;
  const firstName = firstNameInputAutomotive11.value;
  const middleName = middleNameInputAutomotive11.value;
  const track = trackInputAutomotive11.value;
  const strand = strandInputAutomotive11.value;
  const section = sectionInputAutomotive11.value;
  const editIndex = parseInt(editIndexInputAutomotive11.value);
  const fileInput = document.getElementById('file-input-automotive11');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsAutomotive11.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsAutomotive11[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputAutomotive11.value = -1;
    }

    localStorage.setItem('recordsAutomotive11', JSON.stringify(recordsAutomotive11));

    lastNameInputAutomotive11.value = '';
    firstNameInputAutomotive11.value = '';
    middleNameInputAutomotive11.value = '';
    trackInputAutomotive11.value = '';
    strandInputAutomotive11.value = '';
    sectionInputAutomotive11.value = '';
    fileInput.value = '';
    displayRecordsAutomotive11();
  }
});

function editRecordAutomotive11(index) {
  const recordToEdit = recordsAutomotive11[index];
  lastNameInputAutomotive11.value = recordToEdit.lastName;
  firstNameInputAutomotive11.value = recordToEdit.firstName;
  middleNameInputAutomotive11.value = recordToEdit.middleName;
  trackInputAutomotive11.value = recordToEdit.track;
  strandInputAutomotive11.value = recordToEdit.strand;
  sectionInputAutomotive11.value = recordToEdit.section;
  editIndexInputAutomotive11.value = index;
}

function confirmDeleteAutomotive11(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordAutomotive11(index);
  }
}

function deleteRecordAutomotive11(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteAutomotive11(${index})">Yes</button> <button onclick="resetDeleteAutomotive11(${index})">No</button></span>`;
}

function finalConfirmDeleteAutomotive11(index) {
  recordsAutomotive11.splice(index, 1);
  localStorage.setItem('recordsAutomotive11', JSON.stringify(recordsAutomotive11));
  displayRecordsAutomotive11();
}

function resetDeleteAutomotive11(index) {
  displayRecordsAutomotive11();
}

function updateExcelAutomotive11() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsAutomotive11);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "Automotive11.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}
