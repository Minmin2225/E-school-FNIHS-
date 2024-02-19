const recordFormEIM11 = document.getElementById('record-form-eim11');
const lastNameInputEIM11 = document.getElementById('last-name-eim11');
const firstNameInputEIM11 = document.getElementById('first-name-eim11');
const middleNameInputEIM11 = document.getElementById('middle-name-eim11');
const trackInputEIM11 = document.getElementById('track-eim11');
const strandInputEIM11 = document.getElementById('strand-eim11');
const sectionInputEIM11 = document.getElementById('section-eim11');
const recordListEIM11 = document.getElementById('record-list-eim11');
const editIndexInputEIM11 = document.getElementById('edit-index-eim11');



let recordsEIM11 = JSON.parse(localStorage.getItem('recordsEIM11')) || [];
displayRecordsEIM11();

function displayRecordsEIM11() {
  recordListEIM11.innerHTML = '';
  if (recordsEIM11.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListEIM11.appendChild(row);
  } else {
    recordsEIM11.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordEIM11(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteEIM11(${index})">Delete</button></td>
                `;
      recordListEIM11.appendChild(row);
    });
  }
}

recordFormEIM11.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputEIM11.value;
  const firstName = firstNameInputEIM11.value;
  const middleName = middleNameInputEIM11.value;
  const track = trackInputEIM11.value;
  const strand = strandInputEIM11.value;
  const section = sectionInputEIM11.value;
  const editIndex = parseInt(editIndexInputEIM11.value);
  const fileInput = document.getElementById('file-input-eim11');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsEIM11.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsEIM11[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputEIM11.value = -1;
    }

    localStorage.setItem('recordsEIM11', JSON.stringify(recordsEIM11));

    lastNameInputEIM11.value = '';
    firstNameInputEIM11.value = '';
    middleNameInputEIM11.value = '';
    trackInputEIM11.value = '';
    strandInputEIM11.value = '';
    sectionInputEIM11.value = '';
    fileInput.value = '';
    displayRecordsEIM11();
  }
});

function editRecordEIM11(index) {
  const recordToEdit = recordsEIM11[index];
  lastNameInputEIM11.value = recordToEdit.lastName;
  firstNameInputEIM11.value = recordToEdit.firstName;
  middleNameInputEIM11.value = recordToEdit.middleName;
  trackInputEIM11.value = recordToEdit.track;
  strandInputEIM11.value = recordToEdit.strand;
  sectionInputEIM11.value = recordToEdit.section;
  editIndexInputEIM11.value = index;
}

function confirmDeleteEIM11(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordEIM11(index);
  }
}

function deleteRecordEIM11(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteEIM11(${index})">Yes</button> <button onclick="resetDeleteEIM11(${index})">No</button></span>`;
}

function finalConfirmDeleteEIM11(index) {
  recordsEIM11.splice(index, 1);
  localStorage.setItem('recordsEIM11', JSON.stringify(recordsEIM11));
  displayRecordsEIM11();
}

function resetDeleteEIM11(index) {
  displayRecordsEIM11();
}

function updateExcelEIM11() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsEIM11);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "EIM11.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}

