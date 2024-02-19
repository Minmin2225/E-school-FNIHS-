const recordFormSTEM11 = document.getElementById('record-form-stem11');
const lastNameInputSTEM11 = document.getElementById('last-name-stem11');
const firstNameInputSTEM11 = document.getElementById('first-name-stem11');
const middleNameInputSTEM11 = document.getElementById('middle-name-stem11');
const trackInputSTEM11 = document.getElementById('track-stem11');
const strandInputSTEM11 = document.getElementById('strand-stem11');
const sectionInputSTEM11 = document.getElementById('section-stem11');
const recordListSTEM11 = document.getElementById('record-list-stem11');
const editIndexInputSTEM11 = document.getElementById('edit-index-stem11');
let recordsSTEM11 = JSON.parse(localStorage.getItem('recordsSTEM11')) || [];

// Display records when page loads
displayRecordsSTEM11();

// Function to display records in the table
function displayRecordsSTEM11() {
  recordListSTEM11.innerHTML = '';
  if (recordsSTEM11.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align:center;color:red;">No Record Found</td>`;
    recordListSTEM11.appendChild(row);
  } else {
    recordsSTEM11.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                    <td title="${record.lastName} ${record.firstName} ${record.middleName}">${record.lastName} ${record.firstName} ${record.middleName.substr(0, 1)}...</td>
                    <td>${record.track}</td>
                    <td>${record.strand}</td>
                    <td>${record.section}</td>
                    <td><a href="#" onclick="openFile('${record.sf10}')">${record.sf10}</a></td>
                    <td><button onclick="editRecordSTEM11(${index})">Edit</button></td>
                    <td class="deleteButton"><button onclick="confirmDeleteSTEM11(${index})">Delete</button></td>
                `;
      recordListSTEM11.appendChild(row);
    });
  }
}

// Event listener for form submission
recordFormSTEM11.addEventListener('submit', function (e) {
  e.preventDefault();
  const lastName = lastNameInputSTEM11.value;
  const firstName = firstNameInputSTEM11.value;
  const middleName = middleNameInputSTEM11.value;
  const track = trackInputSTEM11.value;
  const strand = strandInputSTEM11.value;
  const section = sectionInputSTEM11.value;
  const editIndex = parseInt(editIndexInputSTEM11.value);
  const fileInput = document.getElementById('file-input-stem11');
  const fileName = fileInput.files[0].name;

  if (lastName && firstName && middleName && track && strand && section && fileName) {
    if (editIndex === -1) {
      recordsSTEM11.push({ lastName, firstName, middleName, track, strand, section, sf10: fileName });
    } else {
      recordsSTEM11[editIndex] = { lastName, firstName, middleName, track, strand, section, sf10: fileName };
      editIndexInputSTEM11.value = -1;
    }

    localStorage.setItem('recordsSTEM11', JSON.stringify(recordsSTEM11));

    lastNameInputSTEM11.value = '';
    firstNameInputSTEM11.value = '';
    middleNameInputSTEM11.value = '';
    trackInputSTEM11.value = '';
    strandInputSTEM11.value = '';
    sectionInputSTEM11.value = '';
    fileInput.value = '';
    displayRecordsSTEM11();
  }
});

// Function to edit a record
function editRecordSTEM11(index) {
  const recordToEdit = recordsSTEM11[index];
  lastNameInputSTEM11.value = recordToEdit.lastName;
  firstNameInputSTEM11.value = recordToEdit.firstName;
  middleNameInputSTEM11.value = recordToEdit.middleName;
  trackInputSTEM11.value = recordToEdit.track;
  strandInputSTEM11.value = recordToEdit.strand;
  sectionInputSTEM11.value = recordToEdit.section;
  editIndexInputSTEM11.value = index;
}

// Function to confirm deletion of a record
function confirmDeleteSTEM11(index) {
  const confirmation = confirm("Are you sure you want to delete this record?");
  if (confirmation) {
    deleteRecordSTEM11(index);
  }
}

// Function to delete a record
function deleteRecordSTEM11(index) {
  let delBtn = document.querySelectorAll('.deleteButton');
  delBtn[index].innerHTML = `<span class="confirm-delete"><button onclick="finalConfirmDeleteSTEM11(${index})">Yes</button> <button onclick="resetDeleteSTEM11(${index})">No</button></span>`;
}

// Function to finalize deletion of a record
function finalConfirmDeleteSTEM11(index) {
  recordsSTEM11.splice(index, 1);
  localStorage.setItem('recordsSTEM11', JSON.stringify(recordsSTEM11));
  displayRecordsSTEM11();
}

// Function to cancel deletion and reset button
function resetDeleteSTEM11(index) {
  displayRecordsSTEM11();
}

// Function to update strands based on selected track
function updateStrandsSTEM11() {
  const trackSelectSTEM11 = document.getElementById('track-stem11');
  const strandSelectSTEM11 = document.getElementById('strand-stem11');
  strandSelectSTEM11.innerHTML = '';
  if (trackSelectSTEM11.value === 'Academic') {
      const academicStrandsSTEM11 = ['ABM', 'STEM', 'HUMSS'];
      academicStrandsSTEM11.forEach(strand => {
          const option = document.createElement('option');
          option.value = strand;
          option.textContent = strand;
          strandSelectSTEM11.appendChild(option);
      });
  } else if (trackSelectSTEM11.value === 'TVL') {
      const tvlStrandsSTEM11 = ['ICT', 'Automotive', 'HE', 'EIM'];
      tvlStrandsSTEM11.forEach(strand => {
          const option = document.createElement('option');
          option.value = strand;
          option.textContent = strand;
          strandSelectSTEM11.appendChild(option);
      });
  } else {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select Strand';
      strandSelectSTEM11.appendChild(defaultOption);
  }
}

// Function to open the file
function openFile(fileName) {
  const filePath = './forms/' + fileName;
  window.open(filePath, '_blank');
}
