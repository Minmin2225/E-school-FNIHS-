const recordFormEIM12 = document.getElementById('record-form-eim12');
const lastNameInputEIM12 = document.getElementById('last-name-eim12');
const firstNameInputEIM12 = document.getElementById('first-name-eim12');
const middleNameInputEIM12 = document.getElementById('middle-name-eim12');
const trackInputEIM12 = document.getElementById('track-eim12');
const strandInputEIM12 = document.getElementById('strand-eim12');
const sectionInputEIM12 = document.getElementById('section-eim12');
const recordListEIM12 = document.getElementById('record-list-eim12');
const editIndexInputEIM12 = document.getElementById('edit-index-eim12');

function updateStrandsEIM12() {
  const trackSelectEIM12 = document.getElementById('track-eim12');
  const strandSelectEIM12 = document.getElementById('strand-eim12');
  strandSelectEIM12.innerHTML = '';
  if (trackSelectEIM12.value === 'Academic') {
      const academicStrandsEIM12 = ['EIM', 'ABM', 'STEM', 'HUMSS'];
      academicStrandsEIM12.forEach(strand => {
          const option = document.createElement('option');
          option.value = strand;
          option.textContent = strand;
          strandSelectEIM12.appendChild(option);
      });
  } else if (trackSelectEIM12.value === 'TVL') {
      const tvlStrandsEIM12 = ['ICT', 'Automotive', 'HE', 'EIM'];
      tvlStrandsEIM12.forEach(strand => {
          const option = document.createElement('option');
          option.value = strand;
          option.textContent = strand;
          strandSelectEIM12.appendChild(option);
      });
  } else {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select Strand';
      strandSelectEIM12.appendChild(defaultOption);
  }
}

let recordsEIM12 = JSON.parse(localStorage.getItem('recordsEIM12')) || [];
displayRecordsEIM12();

function displayRecordsEIM12() {
  recordListEIM12.innerHTML = '';
  if (recordsEIM12.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListEIM12.appendChild(row);
  } else {
    recordsEIM12.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordEIM12(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteEIM12(${index})">Delete</button></td>
                `;
      recordListEIM12.appendChild(row);
    });
  }
}

recordFormEIM12.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputEIM12.value;
  const firstName = firstNameInputEIM12.value;
  const middleName = middleNameInputEIM12.value;
  const track = trackInputEIM12.value;
  const strand = strandInputEIM12.value;
  const section = sectionInputEIM12.value;
  const editIndex = parseInt(editIndexInputEIM12.value);
  const fileInput = document.getElementById('file-input-eim12');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsEIM12.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsEIM12[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputEIM12.value = -1;
    }

    localStorage.setItem('recordsEIM12', JSON.stringify(recordsEIM12));

    lastNameInputEIM12.value = '';
    firstNameInputEIM12.value = '';
    middleNameInputEIM12.value = '';
    trackInputEIM12.value = '';
    strandInputEIM12.value = '';
    sectionInputEIM12.value = '';
    fileInput.value = '';
    displayRecordsEIM12();
  }
});

function editRecordEIM12(index) {
  const recordToEdit = recordsEIM12[index];
  lastNameInputEIM12.value = recordToEdit.lastName;
  firstNameInputEIM12.value = recordToEdit.firstName;
  middleNameInputEIM12.value = recordToEdit.middleName;
  trackInputEIM12.value = recordToEdit.track;
  strandInputEIM12.value = recordToEdit.strand;
  sectionInputEIM12.value = recordToEdit.section;
  editIndexInputEIM12.value = index;
}

function confirmDeleteEIM12(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordEIM12(index);
  }
}

function deleteRecordEIM12(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteEIM12(${index})">Yes</button> <button onclick="resetDeleteEIM12(${index})">No</button></span>`;
}

function finalConfirmDeleteEIM12(index) {
  recordsEIM12.splice(index, 1);
  localStorage.setItem('recordsEIM12', JSON.stringify(recordsEIM12));
  displayRecordsEIM12();
}

function resetDeleteEIM12(index) {
  displayRecordsEIM12();
}

function updateExcelEIM12() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsEIM12);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "EIM12.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}

