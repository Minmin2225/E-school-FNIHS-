const recordFormSTEM12 = document.getElementById('record-form-stem12');
const lastNameInputSTEM12 = document.getElementById('last-name-stem12');
const firstNameInputSTEM12 = document.getElementById('first-name-stem12');
const middleNameInputSTEM12 = document.getElementById('middle-name-stem12');
const trackInputSTEM12 = document.getElementById('track-stem12');
const strandInputSTEM12 = document.getElementById('strand-stem12');
const sectionInputSTEM12 = document.getElementById('section-stem12');
const recordListSTEM12 = document.getElementById('record-list-stem12');
const editIndexInputSTEM12 = document.getElementById('edit-index-stem12');

function updateStrandsSTEM12() {
  const trackSelectSTEM12 = document.getElementById('track-stem12');
  const strandSelectSTEM12 = document.getElementById('strand-stem12');
  strandSelectSTEM12.innerHTML = '';
  if (trackSelectSTEM12.value === 'Academic') {
      const academicStrandsSTEM12 = ['STEM', 'ABM', 'HUMSS'];
      academicStrandsSTEM12.forEach(strand => {
          const option = document.createElement('option');
          option.value = strand;
          option.textContent = strand;
          strandSelectSTEM12.appendChild(option);
      });
  } else if (trackSelectSTEM12.value === 'TVL') {
      const tvlStrandsSTEM12 = ['ICT', 'Automotive', 'HE', 'EIM'];
      tvlStrandsSTEM12.forEach(strand => {
          const option = document.createElement('option');
          option.value = strand;
          option.textContent = strand;
          strandSelectSTEM12.appendChild(option);
      });
  } else {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select Strand';
      strandSelectSTEM12.appendChild(defaultOption);
  }
}

let recordsSTEM12 = JSON.parse(localStorage.getItem('recordsSTEM12')) || [];
displayRecordsSTEM12();

function displayRecordsSTEM12() {
  recordListSTEM12.innerHTML = '';
  if (recordsSTEM12.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListSTEM12.appendChild(row);
  } else {
    recordsSTEM12.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordSTEM12(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteSTEM12(${index})">Delete</button></td>
                `;
      recordListSTEM12.appendChild(row);
    });
  }
}

recordFormSTEM12.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputSTEM12.value;
  const firstName = firstNameInputSTEM12.value;
  const middleName = middleNameInputSTEM12.value;
  const track = trackInputSTEM12.value;
  const strand = strandInputSTEM12.value;
  const section = sectionInputSTEM12.value;
  const editIndex = parseInt(editIndexInputSTEM12.value);
  const fileInput = document.getElementById('file-input-stem12');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsSTEM12.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsSTEM12[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputSTEM12.value = -1;
    }

    localStorage.setItem('recordsSTEM12', JSON.stringify(recordsSTEM12));

    lastNameInputSTEM12.value = '';
    firstNameInputSTEM12.value = '';
    middleNameInputSTEM12.value = '';
    trackInputSTEM12.value = '';
    strandInputSTEM12.value = '';
    sectionInputSTEM12.value = '';
    fileInput.value = '';
    displayRecordsSTEM12();
  }
});

function editRecordSTEM12(index) {
  const recordToEdit = recordsSTEM12[index];
  lastNameInputSTEM12.value = recordToEdit.lastName;
  firstNameInputSTEM12.value = recordToEdit.firstName;
  middleNameInputSTEM12.value = recordToEdit.middleName;
  trackInputSTEM12.value = recordToEdit.track;
  strandInputSTEM12.value = recordToEdit.strand;
  sectionInputSTEM12.value = recordToEdit.section;
  editIndexInputSTEM12.value = index;
}

function confirmDeleteSTEM12(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordSTEM12(index);
  }
}

function deleteRecordSTEM12(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteSTEM12(${index})">Yes</button> <button onclick="resetDeleteSTEM12(${index})">No</button></span>`;
}

function finalConfirmDeleteSTEM12(index) {
  recordsSTEM12.splice(index, 1);
  localStorage.setItem('recordsSTEM12', JSON.stringify(recordsSTEM12));
  displayRecordsSTEM12();
}

function resetDeleteSTEM12(index) {
  displayRecordsSTEM12();
}

function updateExcelSTEM12() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsSTEM12);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "STEM12.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  // Directly open the file without specifying the folder path
  const filePath = fileName;
  window.open(filePath, '_blank');
}
