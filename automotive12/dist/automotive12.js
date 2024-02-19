const recordFormAutomotive12 = document.getElementById('record-form-automotive12');
const lastNameInputAutomotive12 = document.getElementById('last-name-automotive12');
const firstNameInputAutomotive12 = document.getElementById('first-name-automotive12');
const middleNameInputAutomotive12 = document.getElementById('middle-name-automotive12');
const trackInputAutomotive12 = document.getElementById('track-automotive12');
const strandInputAutomotive12 = document.getElementById('strand-automotive12');
const sectionInputAutomotive12 = document.getElementById('section-automotive12');
const recordListAutomotive12 = document.getElementById('record-list-automotive12');
const editIndexInputAutomotive12 = document.getElementById('edit-index-automotive12');


let recordsAutomotive12 = JSON.parse(localStorage.getItem('recordsAutomotive12')) || [];
displayRecordsAutomotive12();

function displayRecordsAutomotive12() {
  recordListAutomotive12.innerHTML = '';
  if (recordsAutomotive12.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListAutomotive12.appendChild(row);
  } else {
    recordsAutomotive12.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordAutomotive12(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteAutomotive12(${index})">Delete</button></td>
                `;
      recordListAutomotive12.appendChild(row);
    });
  }
}

recordFormAutomotive12.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputAutomotive12.value;
  const firstName = firstNameInputAutomotive12.value;
  const middleName = middleNameInputAutomotive12.value;
  const track = trackInputAutomotive12.value;
  const strand = strandInputAutomotive12.value;
  const section = sectionInputAutomotive12.value;
  const editIndex = parseInt(editIndexInputAutomotive12.value);
  const fileInput = document.getElementById('file-input-automotive12');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsAutomotive12.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsAutomotive12[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputAutomotive12.value = -1;
    }

    localStorage.setItem('recordsAutomotive12', JSON.stringify(recordsAutomotive12));

    lastNameInputAutomotive12.value = '';
    firstNameInputAutomotive12.value = '';
    middleNameInputAutomotive12.value = '';
    trackInputAutomotive12.value = '';
    strandInputAutomotive12.value = '';
    sectionInputAutomotive12.value = '';
    fileInput.value = '';
    displayRecordsAutomotive12();
  }
});

function editRecordAutomotive12(index) {
  const recordToEdit = recordsAutomotive12[index];
  lastNameInputAutomotive12.value = recordToEdit.lastName;
  firstNameInputAutomotive12.value = recordToEdit.firstName;
  middleNameInputAutomotive12.value = recordToEdit.middleName;
  trackInputAutomotive12.value = recordToEdit.track;
  strandInputAutomotive12.value = recordToEdit.strand;
  sectionInputAutomotive12.value = recordToEdit.section;
  editIndexInputAutomotive12.value = index;
}

function confirmDeleteAutomotive12(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordAutomotive12(index);
  }
}

function deleteRecordAutomotive12(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteAutomotive12(${index})">Yes</button> <button onclick="resetDeleteAutomotive12(${index})">No</button></span>`;
}

function finalConfirmDeleteAutomotive12(index) {
  recordsAutomotive12.splice(index, 1);
  localStorage.setItem('recordsAutomotive12', JSON.stringify(recordsAutomotive12));
  displayRecordsAutomotive12();
}

function resetDeleteAutomotive12(index) {
  displayRecordsAutomotive12();
}

function updateExcelAutomotive12() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsAutomotive12);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "Automotive12.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  // Directly open the file without specifying the folder path
  const filePath = fileName;
  window.open(filePath, '_blank');
}
