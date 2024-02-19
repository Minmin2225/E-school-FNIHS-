const recordFormICT11 = document.getElementById('record-form-ict11');
const lastNameInputICT11 = document.getElementById('last-name-ict11');
const firstNameInputICT11 = document.getElementById('first-name-ict11');
const middleNameInputICT11 = document.getElementById('middle-name-ict11');
const trackInputICT11 = document.getElementById('track-ict11');
const strandInputICT11 = document.getElementById('strand-ict11');
const sectionInputICT11 = document.getElementById('section-ict11');
const recordListICT11 = document.getElementById('record-list-ict11');
const editIndexInputICT11 = document.getElementById('edit-index-ict11');

function updateStrandsICT11() {
  const trackSelectICT11 = document.getElementById('track-ict11');
  const strandSelectICT11 = document.getElementById('strand-ict11');
  strandSelectICT11.innerHTML = '';
  if (trackSelectICT11.value === 'TVL') {
    const tvlStrandsICT11 = ['ICT', 'Automotive', 'HE', 'EIM'];
    tvlStrandsICT11.forEach(function(strand) {
      const option = document.createElement('option');
      option.value = strand;
      option.textContent = strand;
      strandSelectICT11.appendChild(option);
    });
  } else if (trackSelectICT11.value === 'Academic') {
    const academicStrandsICT11 = ['STEM', 'HUMSS', 'ABM'];
    academicStrandsICT11.forEach(function(strand) {
      const option = document.createElement('option');
      option.value = strand;
      option.textContent = strand;
      strandSelectICT11.appendChild(option);
    });
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Strand';
    strandSelectICT11.appendChild(defaultOption);
  }
}

let recordsICT11 = JSON.parse(localStorage.getItem('recordsICT11')) || [];
displayRecordsICT11();

function displayRecordsICT11() {
  recordListICT11.innerHTML = '';
  if (recordsICT11.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListICT11.appendChild(row);
  } else {
    recordsICT11.forEach(function(record, index) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
        <td>${record.track}</td>
        <td>${record.strand}</td>
        <td>${record.section}</td>
        <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
        <td><button onclick="editRecordICT11(${index})">Edit</button></td>
        <td class="deleteButton"><button onclick="confirmDeleteICT11(${index})">Delete</button></td>
      `;
      recordListICT11.appendChild(row);
    });
  }
}

recordFormICT11.addEventListener('submit', function(e) {
  e.preventDefault();
  const lastName = lastNameInputICT11.value;
  const firstName = firstNameInputICT11.value;
  const middleName = middleNameInputICT11.value;
  const track = trackInputICT11.value;
  const strand = strandInputICT11.value;
  const section = sectionInputICT11.value;
  const editIndex = parseInt(editIndexInputICT11.value);
  const fileInput = document.getElementById('file-input-ict11');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsICT11.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsICT11[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputICT11.value = -1;
    }

    localStorage.setItem('recordsICT11', JSON.stringify(recordsICT11));

    lastNameInputICT11.value = '';
    firstNameInputICT11.value = '';
    middleNameInputICT11.value = '';
    trackInputICT11.value = '';
    strandInputICT11.value = '';
    sectionInputICT11.value = '';
    fileInput.value = '';
    displayRecordsICT11();
  }
});

function editRecordICT11(index) {
  const recordToEdit = recordsICT11[index];
  lastNameInputICT11.value = recordToEdit.lastName;
  firstNameInputICT11.value = recordToEdit.firstName;
  middleNameInputICT11.value = recordToEdit.middleName;
  trackInputICT11.value = recordToEdit.track;
  strandInputICT11.value = recordToEdit.strand;
  sectionInputICT11.value = recordToEdit.section;
  editIndexInputICT11.value = index;
}

function confirmDeleteICT11(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordICT11(index);
  }
}

function deleteRecordICT11(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteICT11(${index})">Yes</button> <button onclick="resetDeleteICT11(${index})">No</button></span>`;
}

function finalConfirmDeleteICT11(index) {
  recordsICT11.splice(index, 1);
  localStorage.setItem('recordsICT11', JSON.stringify(recordsICT11));
  displayRecordsICT11();
}

function resetDeleteICT11(index) {
  displayRecordsICT11();
}

function updateExcelICT11() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(recordsICT11);
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } 
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const fileName = "ICT11.xlsx";
  saveAs(blob, fileName);
}

function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}
