const recordFormHE11 = document.getElementById('record-form-he11');
const lastNameInputHE11 = document.getElementById('last-name-he11');
const firstNameInputHE11 = document.getElementById('first-name-he11');
const middleNameInputHE11 = document.getElementById('middle-name-he11');
const trackInputHE11 = document.getElementById('track-he11');
const strandInputHE11 = document.getElementById('strand-he11');
const sectionInputHE11 = document.getElementById('section-he11');
const recordListHE11 = document.getElementById('record-list-he11');
const editIndexInputHE11 = document.getElementById('edit-index-he11');

let recordsHE11 = JSON.parse(localStorage.getItem('recordsHE11')) || [];
displayRecordsHE11();

function displayRecordsHE11() {
  recordListHE11.innerHTML = '';
  if (recordsHE11.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListHE11.appendChild(row);
  } else {
    recordsHE11.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordHE11(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteHE11(${index})">Delete</button></td>
                `;
      recordListHE11.appendChild(row);
    });
  }
}

recordFormHE11.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputHE11.value;
  const firstName = firstNameInputHE11.value;
  const middleName = middleNameInputHE11.value;
  const track = trackInputHE11.value;
  const strand = strandInputHE11.value;
  const section = sectionInputHE11.value;
  const editIndex = parseInt(editIndexInputHE11.value);
  const fileInput = document.getElementById('file-input-he11');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsHE11.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsHE11[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputHE11.value = -1;
    }

    localStorage.setItem('recordsHE11', JSON.stringify(recordsHE11));

    lastNameInputHE11.value = '';
    firstNameInputHE11.value = '';
    middleNameInputHE11.value = '';
    trackInputHE11.value = '';
    strandInputHE11.value = '';
    sectionInputHE11.value = '';
    fileInput.value = '';
    displayRecordsHE11();
  }
});

function editRecordHE11(index) {
  const recordToEdit = recordsHE11[index];
  lastNameInputHE11.value = recordToEdit.lastName;
  firstNameInputHE11.value = recordToEdit.firstName;
  middleNameInputHE11.value = recordToEdit.middleName;
  trackInputHE11.value = recordToEdit.track;
  strandInputHE11.value = recordToEdit.strand;
  sectionInputHE11.value = recordToEdit.section;
  editIndexInputHE11.value = index;
}

function confirmDeleteHE11(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordHE11(index);
  }
}

function deleteRecordHE11(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteHE11(${index})">Yes</button> <button onclick="resetDeleteHE11(${index})">No</button></span>`;
}

function finalConfirmDeleteHE11(index) {
  recordsHE11.splice(index, 1);
  localStorage.setItem('recordsHE11', JSON.stringify(recordsHE11));
  displayRecordsHE11();
}

function resetDeleteHE11(index) {
  displayRecordsHE11();
}

function updateExcelHE11() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsHE11);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "HE11.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}
