// Get relevant DOM elements
const backyard_image = document.getElementById('backyard-image');
const backyard_preview = document.getElementById('backyard-preview');
const selection_box = document.getElementById('selection-box');
const design_prompt = document.getElementById('design-prompt');
const design_sample = document.getElementById('design-sample');
const generate_button = document.getElementById('generate-button');

const design_result = document.getElementById('design-result');
design_result.style.display = 'none';
// Step navigation DOM elements
const steps = document.querySelectorAll('.step-label');
const stepContainer = document.querySelector('.col-md-4');

// Step function mapping
const stepFunctions = {
  1: handleBackyardImageStep,
  2: handleAreaOfInterestStep,
  3: handleDesignDescriptionStep,
  4: handleSampleDesignStep,
  5: handleGenerateDesignStep,
};

// Current Steps
let currentStep = 1;

// Initialize the page and display the first step
stepFunctions[currentStep]();

// Listening Steps Navigation Click Event
stepContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('step-label')) {
    const selectedStep = parseInt(event.target.dataset.step);
    if (selectedStep !== currentStep) {
      stepFunctions[selectedStep]();
      currentStep = selectedStep;
    }
  }
});

// Steps for uploading backyard images
function handleBackyardImageStep() {
  hideAllSteps();
  showStep(1);
}

// Steps for selecting regions of interest
function handleAreaOfInterestStep() {
  hideAllSteps();
  showStep(2);
}

// Process Design Description Steps
function handleDesignDescriptionStep() {
  hideAllSteps();
  showStep(3);
}

// Steps for handling and uploading sample design
function handleSampleDesignStep() {
  hideAllSteps();
  showStep(4);
}

// Process Generation Design Steps
function handleGenerateDesignStep() {
  hideAllSteps();
  showStep(5);
}

// Hide all steps
function hideAllSteps() {
  steps.forEach((step) => {
    step.classList.remove('active');
  });
}

// Display specific steps
function showStep(stepNumber) {
  const step = document.querySelector(`.step-label[data-step="${stepNumber}"]`);
  console.log(step);
  if (step) {
    step.classList.add('active');
  }
}

// Handle backyard image upload
backyard_image.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  backyard_preview.src = imageUrl;
  backyard_preview.style.display = 'block';
  initSelectionBox();
});

// Initialize selection box
function initSelectionBox() {
  const container = document.querySelector('.container');
  const container_rect = container.getBoundingClientRect();

  selection_box.style.width = '100px';
  selection_box.style.height = '100px';
  selection_box.style.left = `${container_rect.left}px`;
  selection_box.style.top = `${container_rect.top}px`;

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX = container_rect.left;
  let initialY = container_rect.top;
  let xOffset = 0;
  let yOffset = 0;
  let startX, startY, startWidth, startHeight;

  selection_box.addEventListener('mousedown', dragStart);
  selection_box.addEventListener('mouseup', dragEnd);
  selection_box.addEventListener('mousemove', drag);

  selection_box.addEventListener('mousedown', startResize);
  selection_box.addEventListener('mouseup', stopResize);
  selection_box.addEventListener('mousemove', resize);

  function dragStart(e) {
    if (e.target === selection_box) {
      e.preventDefault();
      isDragging = true;
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      xOffset = e.clientX - initialX;
      yOffset = e.clientY - initialY;

      setTranslate(xOffset, yOffset, selection_box);
    }
  }

  function dragEnd(e) {
    isDragging = false;
    initialX = xOffset;
    initialY = yOffset;
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }

  // Handle selection box resizing
  function startResize(e) {
    if (e.target === selection_box) {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = selection_box.offsetWidth;
      startHeight = selection_box.offsetHeight;

      selection_box.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    }
  }

  function stopResize(e) {
    isResizing = false;
    selection_box.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }

  function resize(e) {
    if (isResizing) {
      e.preventDefault();
      let width = e.clientX - startX + startWidth;
      let height = e.clientY - startY + startHeight;
      selection_box.style.width = Math.max(100, width) + 'px';
      selection_box.style.height = Math.max(100, height) + 'px';
    }
  }
}

// Handle generate button click
generate_button.addEventListener('click', () => {
  const backyard_photo = backyard_preview.src;
  const selection_x = selection_box.offsetLeft;
  const selection_y = selection_box.offsetTop;
  const selection_width = selection_box.offsetWidth;
  const selection_height = selection_box.offsetHeight;
  const user_prompt = design_prompt.value;
  const sample_photo = design_sample.files[0];
  design_result.style.display = '';

  // Send data to backend or process further
  // Example:
  // fetch('/generate-landscape-design', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //         backyard_photo: backyard_photo,
  //         selection_x: selection_x,
  //         selection_y: selection_y,
  //         selection_width: selection_width,
  //         selection_height: selection_height,
  //         user_prompt: user_prompt,
  //         sample_photo: sample_photo
  //     }),
  //     headers: {
  //         'Content-Type': 'application/json'
  //     }
  // })
  // .then(response => response.json())
  // .then(data => {
  //     // Handle response data
  // })
  // .catch(error => console.error('Error:', error));
});
