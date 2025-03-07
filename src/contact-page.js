// Create and manage contact page overlay
let contactPageContainer = null;

export function showContactPage() {
  if (contactPageContainer) {
    contactPageContainer.classList.add('show');
    return;
  }

  // Create contact page container
  contactPageContainer = document.createElement('div');
  contactPageContainer.className = 'contact-page';
  
  // Create contact form content
  contactPageContainer.innerHTML = `
    <div class="contact-header">
      <h2>Contact Us</h2>
      <button class="close-button">×</button>
    </div>
    <div class="contact-content">
      <p>Let's discuss your project requirements</p>
      <form id="contact-form" class="contact-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="service">Service</label>
          <select id="service" name="service" required>
            <option value="">Select a service</option>
            <option value="app-development">App Development</option>
            <option value="database-solutions">Database Solutions</option>
            <option value="static-websites">Static Websites</option>
            <option value="dynamic-websites">Dynamic Websites</option>
            <option value="api-development">API Development</option>
            <option value="cloud-architecture">Cloud Architecture</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        <button type="submit" class="submit-button">Send Message</button>
      </form>
    </div>
  `;

  // Add form submission handler
  const form = contactPageContainer.querySelector('#contact-form');
  form.addEventListener('submit', handleSubmit);

  // Add close button handler
  const closeButton = contactPageContainer.querySelector('.close-button');
  closeButton.addEventListener('click', closeContactPage);

  document.body.appendChild(contactPageContainer);
  
  // Add show class after a small delay for animation
  requestAnimationFrame(() => {
    contactPageContainer.classList.add('show');
  });
}

function closeContactPage() {
  if (contactPageContainer) {
    contactPageContainer.classList.remove('show');
    contactPageContainer.addEventListener('transitionend', () => {
      if (contactPageContainer && contactPageContainer.parentNode) {
        contactPageContainer.parentNode.removeChild(contactPageContainer);
        contactPageContainer = null;
      }
    });
  }
}

function handleSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  
  // Here you would typically send the data to your backend
  console.log('Form submitted:', data);
  
  // Show success message
  const form = event.target;
  form.innerHTML = `
    <div class="success-message">
      <h3>Thank you for contacting us!</h3>
      <p>We'll get back to you soon.</p>
    </div>
  `;
  
  // Close the contact page after a delay
  setTimeout(closeContactPage, 3000);
}

// Make closeContactPage available globally
window.closeContactPage = closeContactPage;