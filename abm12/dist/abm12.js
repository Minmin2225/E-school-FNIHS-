const recordFormABM12 = document.getElementById('record-form-abm12');
const lastNameInputABM12 = document.getElementById('last-name-abm12');
const firstNameInputABM12 = document.getElementById('first-name-abm12');
const middleNameInputABM12 = document.getElementById('middle-name-abm12');
const trackInputABM12 = document.getElementById('track-abm12');
const strandInputABM12 = document.getElementById('strand-abm12');
const sectionInputABM12 = document.getElementById('section-abm12');
const recordListABM12 = document.getElementById('record-list-abm12');
const editIndexInputABM12 = document.getElementById('edit-index-abm12');


let recordsABM12 = JSON.parse(localStorage.getItem('recordsABM12')) || [];
displayRecordsABM12();

function displayRecordsABM12() {
  recordListABM12.innerHTML = '';
  if (recordsABM12.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListABM12.appendChild(row);
  } else {
    recordsABM12.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordABM12(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteABM12(${index})">Delete</button></td>
                `;
      recordListABM12.appendChild(row);
    });
  }
}

recordFormABM12.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputABM12.value;
  const firstName = firstNameInputABM12.value;
  const middleName = middleNameInputABM12.value;
  const track = trackInputABM12.value;
  const strand = strandInputABM12.value;
  const section = sectionInputABM12.value;
  const editIndex = parseInt(editIndexInputABM12.value);
  const fileInput = document.getElementById('file-input-abm12');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsABM12.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsABM12[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputABM12.value = -1;
    }

    localStorage.setItem('recordsABM12', JSON.stringify(recordsABM12));

    lastNameInputABM12.value = '';
    firstNameInputABM12.value = '';
    middleNameInputABM12.value = '';
    trackInputABM12.value = '';
    strandInputABM12.value = '';
    sectionInputABM12.value = '';
    fileInput.value = '';
    displayRecordsABM12();
  }
});

function editRecordABM12(index) {
  const recordToEdit = recordsABM12[index];
  lastNameInputABM12.value = recordToEdit.lastName;
  firstNameInputABM12.value = recordToEdit.firstName;
  middleNameInputABM12.value = recordToEdit.middleName;
  trackInputABM12.value = recordToEdit.track;
  strandInputABM12.value = recordToEdit.strand;
  sectionInputABM12.value = recordToEdit.section;
  editIndexInputABM12.value = index;
}

function confirmDeleteABM12(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordABM12(index);
  }
}

function deleteRecordABM12(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteABM12(${index})">Yes</button> <button onclick="resetDeleteABM12(${index})">No</button></span>`;
}

function finalConfirmDeleteABM12(index) {
  recordsABM12.splice(index, 1);
  localStorage.setItem('recordsABM12', JSON.stringify(recordsABM12));
  displayRecordsABM12();
}

function resetDeleteABM12(index) {
  displayRecordsABM12();
}

function updateExcelABM12() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsABM12);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "ABM12.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}
