const recordFormHUMSS11 = document.getElementById('record-form-humss11');
const lastNameInputHUMSS11 = document.getElementById('last-name-humss11');
const firstNameInputHUMSS11 = document.getElementById('first-name-humss11');
const middleNameInputHUMSS11 = document.getElementById('middle-name-humss11');
const trackInputHUMSS11 = document.getElementById('track-humss11');
const strandInputHUMSS11 = document.getElementById('strand-humss11');
const sectionInputHUMSS11 = document.getElementById('section-humss11');
const recordListHUMSS11 = document.getElementById('record-list-humss11');
const editIndexInputHUMSS11 = document.getElementById('edit-index-humss11');



let recordsHUMSS11 = JSON.parse(localStorage.getItem('recordsHUMSS11')) || [];
displayRecordsHUMSS11();

function displayRecordsHUMSS11() {
  recordListHUMSS11.innerHTML = '';
  if (recordsHUMSS11.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListHUMSS11.appendChild(row);
  } else {
    recordsHUMSS11.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
        <td>${record.track}</td>
        <td>${record.strand}</td>
        <td>${record.section}</td>
        <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
        <td><button onclick="editRecordHUMSS11(${index})">Edit</button></td>
        <td class="deleteButton"><button onclick="confirmDeleteHUMSS11(${index})">Delete</button></td>
      `;
      recordListHUMSS11.appendChild(row);
    });
  }
}

recordFormHUMSS11.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputHUMSS11.value;
  const firstName = firstNameInputHUMSS11.value;
  const middleName = middleNameInputHUMSS11.value;
  const track = trackInputHUMSS11.value;
  const strand = strandInputHUMSS11.value;
  const section = sectionInputHUMSS11.value;
  const editIndex = parseInt(editIndexInputHUMSS11.value);
  const fileInput = document.getElementById('file-input-humss11');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsHUMSS11.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsHUMSS11[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputHUMSS11.value = -1;
    }

    localStorage.setItem('recordsHUMSS11', JSON.stringify(recordsHUMSS11));

    lastNameInputHUMSS11.value = '';
    firstNameInputHUMSS11.value = '';
    middleNameInputHUMSS11.value = '';
    trackInputHUMSS11.value = '';
    strandInputHUMSS11.value = '';
    sectionInputHUMSS11.value = '';
    fileInput.value = '';
    displayRecordsHUMSS11();
  }
});

function editRecordHUMSS11(index) {
  const recordToEdit = recordsHUMSS11[index];
  lastNameInputHUMSS11.value = recordToEdit.lastName;
  firstNameInputHUMSS11.value = recordToEdit.firstName;
  middleNameInputHUMSS11.value = recordToEdit.middleName;
  trackInputHUMSS11.value = recordToEdit.track;
  strandInputHUMSS11.value = recordToEdit.strand;
  sectionInputHUMSS11.value = recordToEdit.section;
  editIndexInputHUMSS11.value = index;
}

function confirmDeleteHUMSS11(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordHUMSS11(index);
  }
}

function deleteRecordHUMSS11(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteHUMSS11(${index})">Yes</button> <button onclick="resetDeleteHUMSS11(${index})">No</button></span>`;
}

function finalConfirmDeleteHUMSS11(index) {
  recordsHUMSS11.splice(index, 1);
  localStorage.setItem('recordsHUMSS11', JSON.stringify(recordsHUMSS11));
  displayRecordsHUMSS11();
}

function resetDeleteHUMSS11(index) {
  displayRecordsHUMSS11();
}

function updateExcelHUMSS11() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsHUMSS11);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "HUMSS11.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}

