const recordFormABM11 = document.getElementById('record-form-abm11');
const lastNameInputABM11 = document.getElementById('last-name-abm11');
const firstNameInputABM11 = document.getElementById('first-name-abm11');
const middleNameInputABM11 = document.getElementById('middle-name-abm11');
const trackInputABM11 = document.getElementById('track-abm11');
const strandInputABM11 = document.getElementById('strand-abm11');
const sectionInputABM11 = document.getElementById('section-abm11');
const recordListABM11 = document.getElementById('record-list-abm11');
const editIndexInputABM11 = document.getElementById('edit-index-abm11');


let recordsABM11 = JSON.parse(localStorage.getItem('recordsABM11')) || [];
displayRecordsABM11();

function displayRecordsABM11() {
  recordListABM11.innerHTML = '';
  if (recordsABM11.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListABM11.appendChild(row);
  } else {
    recordsABM11.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordABM11(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteABM11(${index})">Delete</button></td>
                `;
      recordListABM11.appendChild(row);
    });
  }
}

recordFormABM11.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputABM11.value;
  const firstName = firstNameInputABM11.value;
  const middleName = middleNameInputABM11.value;
  const track = trackInputABM11.value;
  const strand = strandInputABM11.value;
  const section = sectionInputABM11.value;
  const editIndex = parseInt(editIndexInputABM11.value);
  const fileInput = document.getElementById('file-input-abm11');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsABM11.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsABM11[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputABM11.value = -1;
    }

    localStorage.setItem('recordsABM11', JSON.stringify(recordsABM11));

    lastNameInputABM11.value = '';
    firstNameInputABM11.value = '';
    middleNameInputABM11.value = '';
    trackInputABM11.value = '';
    strandInputABM11.value = '';
    sectionInputABM11.value = '';
    fileInput.value = '';
    displayRecordsABM11();
  }
});

function editRecordABM11(index) {
  const recordToEdit = recordsABM11[index];
  lastNameInputABM11.value = recordToEdit.lastName;
  firstNameInputABM11.value = recordToEdit.firstName;
  middleNameInputABM11.value = recordToEdit.middleName;
  trackInputABM11.value = recordToEdit.track;
  strandInputABM11.value = recordToEdit.strand;
  sectionInputABM11.value = recordToEdit.section;
  editIndexInputABM11.value = index;
}

function confirmDeleteABM11(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordABM11(index);
  }
}

function deleteRecordABM11(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteABM11(${index})">Yes</button> <button onclick="resetDeleteABM11(${index})">No</button></span>`;
}

function finalConfirmDeleteABM11(index) {
  recordsABM11.splice(index, 1);
  localStorage.setItem('recordsABM11', JSON.stringify(recordsABM11));
  displayRecordsABM11();
}

function resetDeleteABM11(index) {
  displayRecordsABM11();
}

function updateExcelABM11() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsABM11);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "ABM11.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}