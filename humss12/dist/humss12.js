const recordFormHUMSS12 = document.getElementById('record-form-humss12');
const lastNameInputHUMSS12 = document.getElementById('last-name-humss12');
const firstNameInputHUMSS12 = document.getElementById('first-name-humss12');
const middleNameInputHUMSS12 = document.getElementById('middle-name-humss12');
const trackInputHUMSS12 = document.getElementById('track-humss12');
const strandInputHUMSS12 = document.getElementById('strand-humss12');
const sectionInputHUMSS12 = document.getElementById('section-humss12');
const recordListHUMSS12 = document.getElementById('record-list-humss12');
const editIndexInputHUMSS12 = document.getElementById('edit-index-humss12');


let recordsHUMSS12 = JSON.parse(localStorage.getItem('recordsHUMSS12')) || [];
displayRecordsHUMSS12();

function displayRecordsHUMSS12() {
  recordListHUMSS12.innerHTML = '';
  if (recordsHUMSS12.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListHUMSS12.appendChild(row);
  } else {
    recordsHUMSS12.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
        <td>${record.track}</td>
        <td>${record.strand}</td>
        <td>${record.section}</td>
        <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
        <td><button onclick="editRecordHUMSS12(${index})">Edit</button></td>
        <td class="deleteButton"><button onclick="confirmDeleteHUMSS12(${index})">Delete</button></td>
      `;
      recordListHUMSS12.appendChild(row);
    });
  }
}

recordFormHUMSS12.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputHUMSS12.value;
  const firstName = firstNameInputHUMSS12.value;
  const middleName = middleNameInputHUMSS12.value;
  const track = trackInputHUMSS12.value;
  const strand = strandInputHUMSS12.value;
  const section = sectionInputHUMSS12.value;
  const editIndex = parseInt(editIndexInputHUMSS12.value);
  const fileInput = document.getElementById('file-input-humss12');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsHUMSS12.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsHUMSS12[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputHUMSS12.value = -1;
    }

    localStorage.setItem('recordsHUMSS12', JSON.stringify(recordsHUMSS12));

    lastNameInputHUMSS12.value = '';
    firstNameInputHUMSS12.value = '';
    middleNameInputHUMSS12.value = '';
    trackInputHUMSS12.value = '';
    strandInputHUMSS12.value = '';
    sectionInputHUMSS12.value = '';
    fileInput.value = '';
    displayRecordsHUMSS12();
  }
});

function editRecordHUMSS12(index) {
  const recordToEdit = recordsHUMSS12[index];
  lastNameInputHUMSS12.value = recordToEdit.lastName;
  firstNameInputHUMSS12.value = recordToEdit.firstName;
  middleNameInputHUMSS12.value = recordToEdit.middleName;
  trackInputHUMSS12.value = recordToEdit.track;
  strandInputHUMSS12.value = recordToEdit.strand;
  sectionInputHUMSS12.value = recordToEdit.section;
  editIndexInputHUMSS12.value = index;
}

function confirmDeleteHUMSS12(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordHUMSS12(index);
  }
}

function deleteRecordHUMSS12(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteHUMSS12(${index})">Yes</button> <button onclick="resetDeleteHUMSS12(${index})">No</button></span>`;
}

function finalConfirmDeleteHUMSS12(index) {
  recordsHUMSS12.splice(index, 1);
  localStorage.setItem('recordsHUMSS12', JSON.stringify(recordsHUMSS12));
  displayRecordsHUMSS12();
}

function resetDeleteHUMSS12(index) {
  displayRecordsHUMSS12();
}

function updateExcelHUMSS12() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsHUMSS12);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "HUMSS12.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}
