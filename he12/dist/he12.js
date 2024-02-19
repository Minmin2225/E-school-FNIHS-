const recordFormHE12 = document.getElementById('record-form-he12');
const lastNameInputHE12 = document.getElementById('last-name-he12');
const firstNameInputHE12 = document.getElementById('first-name-he12');
const middleNameInputHE12 = document.getElementById('middle-name-he12');
const trackInputHE12 = document.getElementById('track-he12');
const strandInputHE12 = document.getElementById('strand-he12');
const sectionInputHE12 = document.getElementById('section-he12');
const recordListHE12 = document.getElementById('record-list-he12');
const editIndexInputHE12 = document.getElementById('edit-index-he12');


let recordsHE12 = JSON.parse(localStorage.getItem('recordsHE12')) || [];
displayRecordsHE12();

function displayRecordsHE12() {
  recordListHE12.innerHTML = '';
  if (recordsHE12.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListHE12.appendChild(row);
  } else {
    recordsHE12.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordHE12(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteHE12(${index})">Delete</button></td>
                `;
      recordListHE12.appendChild(row);
    });
  }
}

recordFormHE12.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputHE12.value;
  const firstName = firstNameInputHE12.value;
  const middleName = middleNameInputHE12.value;
  const track = trackInputHE12.value;
  const strand = strandInputHE12.value;
  const section = sectionInputHE12.value;
  const editIndex = parseInt(editIndexInputHE12.value);
  const fileInput = document.getElementById('file-input-he12');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsHE12.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsHE12[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputHE12.value = -1;
    }

    localStorage.setItem('recordsHE12', JSON.stringify(recordsHE12));

    lastNameInputHE12.value = '';
    firstNameInputHE12.value = '';
    middleNameInputHE12.value = '';
    trackInputHE12.value = '';
    strandInputHE12.value = '';
    sectionInputHE12.value = '';
    fileInput.value = '';
    displayRecordsHE12();
  }
});

function editRecordHE12(index) {
  const recordToEdit = recordsHE12[index];
  lastNameInputHE12.value = recordToEdit.lastName;
  firstNameInputHE12.value = recordToEdit.firstName;
  middleNameInputHE12.value = recordToEdit.middleName;
  trackInputHE12.value = recordToEdit.track;
  strandInputHE12.value = recordToEdit.strand;
  sectionInputHE12.value = recordToEdit.section;
  editIndexInputHE12.value = index;
}

function confirmDeleteHE12(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordHE12(index);
  }
}

function deleteRecordHE12(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteHE12(${index})">Yes</button> <button onclick="resetDeleteHE12(${index})">No</button></span>`;
}

function finalConfirmDeleteHE12(index) {
  recordsHE12.splice(index, 1);
  localStorage.setItem('recordsHE12', JSON.stringify(recordsHE12));
  displayRecordsHE12();
}

function resetDeleteHE12(index) {
  displayRecordsHE12();
}

function updateExcelHE12() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsHE12);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "HE12.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}

