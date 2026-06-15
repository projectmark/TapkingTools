window.TapkingTools = window.TapkingTools || {};
window.TapkingTools.settings = window.TapkingTools.settings || {};
window.TapkingTools.settings.theme = window.TapkingTools.settings.theme || localStorage.getItem('theme') || 'light';
window.TapkingTools.settings.colorTheme = window.TapkingTools.settings.colorTheme || localStorage.getItem('color_theme') || 'neutral';
window.TapkingTools.settings.showPlaceholders = window.TapkingTools.settings.showPlaceholders !== undefined ? window.TapkingTools.settings.showPlaceholders : (localStorage.getItem('tapkingtools_setting_show_placeholders') !== 'false');
window.TapkingTools.settings.sendDirectToEmail = window.TapkingTools.settings.sendDirectToEmail !== undefined ? window.TapkingTools.settings.sendDirectToEmail : (localStorage.getItem('tapkingtools_setting_send_direct_to_email') === 'true');

// Helper to escape HTML to prevent XSS and formatting injection
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Dynamic icons
const phoneIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--error);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/></svg>`;
const emailIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-outgoing);"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

const placeholderData = {
  contacts: [
    { first: 'Linus', last: 'Torvalds' },
    { first: 'Richard', last: 'Stallman' },
    { first: 'Mark', last: 'Shuttleworth' },
    { first: 'Ian', last: 'Murdock' },
    { first: 'Patrick', last: 'Volkerding' },
    { first: 'Alan', last: 'Cox' },
    { first: 'Greg', last: 'Kroah-Hartman' },
    { first: 'Eric', last: 'Raymond' },
    { first: 'Bruce', last: 'Perens' },
    { first: 'Guido', last: 'van Rossum' },
    { first: 'Rasmus', last: 'Lerdorf' },
    { first: 'Larry', last: 'Wall' },
    { first: 'Yukihiro', last: 'Matsumoto' },
    { first: 'Tim', last: 'Berners-Lee' },
    { first: 'Steve', last: 'Jobs' },
    { first: 'Bill', last: 'Gates' },
    { first: 'Steve', last: 'Wozniak' },
    { first: 'Ada', last: 'Lovelace' },
    { first: 'Alan', last: 'Turing' },
    { first: 'Fritz', last: 'Sennheiser' },
    { first: 'Robert', last: 'Moog' }
  ],
  recipients: ['Elsa', 'Mark', 'Menno', 'Edwin', 'Bas'],
  clients: [
    'Red Hat',
    'Canonical',
    'SUSE',
    'Mozilla',
    'Linux Foundation',
    'Apache Software',
    'GitLab',
    'Debian',
    'Arch Linux',
    'Apple',
    'Microsoft',
    'Sony',
    'Behringer',
    'Akai Professional',
    'Sennheiser',
    'Genelec',
    'Shure'
  ],
  subjects: [
    'Vraag over de levertijd van de Axia Quasar mengtafel',
    'Probleem met de Shure SM7B microfoon setup in studio 2',
    'Offerteaanvraag voor Genelec 8030C studio monitoren',
    'Vraag over licenties voor OmniPlayer broadcast software',
    'Verzoek om ondersteuning bij het inrichten van een podcast studio'
  ]
};

// Read saved request type to set initial icon before registration
let initialRequestType = 'phone';
try {
  const saved = localStorage.getItem('tapkingtools_contact_form');
  if (saved) {
    const data = JSON.parse(saved);
    if (data.requestType) {
      initialRequestType = data.requestType;
    }
  }
} catch (e) {}

window.TapkingTools.contact = {
  id: 'contact',
  name: 'Contactverzoek',
  description: 'Genereer een opgemaakte e-mail voor een contactverzoek (bellen of mailen) die je direct kunt kopiëren en plakken.',
  icon: initialRequestType === 'phone' ? phoneIconSvg : emailIconSvg,
  
  settings: {
    render: function() {
      const showPlaceholders = window.TapkingTools.settings.showPlaceholders;
      const sendDirectToEmail = window.TapkingTools.settings.sendDirectToEmail;
      return `
        <div class="settings-item">
          <div class="settings-item-info">
            <span class="settings-item-title">Voorbeeld data tonen</span>
            <span class="settings-item-desc">Toon willekeurige voorbeeldgegevens in de preview en formuliervelden.</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="setting-toggle-placeholders" ${showPlaceholders ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="settings-item">
          <div class="settings-item-info">
            <span class="settings-item-title">Direct openen in e-mailprogramma</span>
            <span class="settings-item-desc">Open bij het genereren direct je e-mailprogramma (zoals Outlook) met het ingevulde onderwerp en de inhoud.</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="setting-toggle-direct-email" ${sendDirectToEmail ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      `;
    },
    init: function(container) {
      const toggle = container.querySelector('#setting-toggle-placeholders');
      if (toggle) {
        toggle.addEventListener('change', (e) => {
          const showPlaceholders = e.target.checked;
          window.TapkingTools.settings.showPlaceholders = showPlaceholders;
          localStorage.setItem('tapkingtools_setting_show_placeholders', showPlaceholders);
          
          // Trigger settings changed event
          window.dispatchEvent(new CustomEvent('tapkingtools-settings-changed'));
        });
      }
      
      const toggleEmail = container.querySelector('#setting-toggle-direct-email');
      if (toggleEmail) {
        toggleEmail.addEventListener('change', (e) => {
          const sendDirectToEmail = e.target.checked;
          window.TapkingTools.settings.sendDirectToEmail = sendDirectToEmail;
          localStorage.setItem('tapkingtools_setting_send_direct_to_email', sendDirectToEmail);
          
          // Trigger settings changed event
          window.dispatchEvent(new CustomEvent('tapkingtools-settings-changed'));
        });
      }
    }
  },
  
  render: function() {
    // We use the initialRequestType color configuration for rendering the initial form header icon
    const currentIcon = initialRequestType === 'phone' ? phoneIconSvg : emailIconSvg;

    return `
      <div class="tool-split-layout">
        <!-- Input Form Panel -->
        <div class="panel">
          <h2 class="panel-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-incoming)"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            Details contactverzoek
          </h2>
          
          <form id="contact-form" novalidate>
            <div class="form-group-row">
              <div class="form-group">
                <label for="contact-firstname">Voornaam <span class="required-badge">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input type="text" id="contact-firstname" placeholder="Jan" required>
                </div>
                <div class="field-error-message" id="contact-firstname-error"></div>
              </div>
              
              <div class="form-group">
                <label for="contact-lastname">Achternaam <span class="optional-badge">Optioneel</span></label>
                <div class="input-wrapper">
                  <span class="input-icon-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input type="text" id="contact-lastname" placeholder="de Vries">
                </div>
                <div class="field-error-message" id="contact-lastname-error"></div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="client-name">
                Klantnaam 
                <span class="optional-badge">Optioneel</span>
              </label>
              <div class="input-wrapper">
                <span class="input-icon-left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </span>
                <input type="text" id="client-name" placeholder="Acme Corporation">
              </div>
            </div>

            <div class="form-group">
              <label for="recipient">Ontvanger <span class="required-badge">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon-left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <input type="text" id="recipient" placeholder="Elsa, Mark of afdeling Sales" required>
              </div>
              <div class="field-error-message" id="recipient-error"></div>
            </div>

            <div class="form-group">
              <label for="subject">Onderwerp <span class="required-badge">*</span></label>
              <textarea id="subject" rows="4" placeholder="Waar gaat het contactverzoek over?" required></textarea>
              <div class="field-error-message" id="subject-error"></div>
            </div>

            <!-- Request Type Selector -->
            <div class="form-group" style="margin-bottom: 20px;">
              <label>Type verzoek</label>
              <div class="radio-group" style="display: flex; gap: 24px; margin-top: 4px; padding: 4px 0;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500; color: var(--text-primary);">
                  <input type="radio" name="request-type" value="phone" ${initialRequestType === 'phone' ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-primary); cursor: pointer;">
                  <span>📞 Terugbelverzoek</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500; color: var(--text-primary);">
                  <input type="radio" name="request-type" value="email" ${initialRequestType === 'email' ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-primary); cursor: pointer;">
                  <span>✉️ E-mailverzoek</span>
                </label>
              </div>
            </div>
            
            <div class="form-group-row">
              <div class="form-group">
                <label for="phone" id="phone-label">Telefoonnummer <span class="required-badge" id="phone-badge">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                  </span>
                  <input type="tel" id="phone" placeholder="06 12345678">
                </div>
                <div class="field-error-message" id="phone-error"></div>
              </div>
              
              <div class="form-group">
                <label for="email" id="email-label">E-mailadres <span class="optional-badge" id="email-badge">Optioneel</span></label>
                <div class="input-wrapper">
                  <span class="input-icon-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <input type="email" id="email" placeholder="contact@bedrijf.nl">
                </div>
                <div class="field-error-message" id="email-error"></div>
              </div>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 12px;">
              <button type="submit" class="btn-primary" id="btn-generate">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Genereer &amp; Kopieer
              </button>
              <button type="button" class="btn-secondary" id="btn-reset">
                Wissen
              </button>
            </div>
          </form>
        </div>
        
        <!-- Live Rich Text Preview Panel -->
        <div class="preview-container">
          <div class="panel" style="flex: 1; display: flex; flex-direction: column; height: 100%;">
            <h2 class="panel-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-outgoing)"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              E-mail Voorbeeld
            </h2>
            
            <div class="rich-text-wrapper">
              <div class="rich-text-header">
                <!-- Subject line container on the left -->
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden; margin-right: 12px;">
                  <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; white-space: nowrap;">Onderwerp:</span>
                  <span id="email-subject-line" style="font-size: 0.8rem; font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">In te vullen via formulier</span>
                </div>
                <!-- Copy button on the right - copies ONLY the subject line -->
                <button class="btn-icon" id="btn-copy-subject" title="Kopieer onderwerp" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
              </div>
              <div class="rich-text-content" id="email-output"></div>
            </div>
            
            <div style="margin-top: 16px;">
              <button type="button" class="btn-primary" id="btn-copy-direct" style="width: 100%;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Kopieer contactverzoek
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  init: function() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const btnGenerate = document.getElementById('btn-generate');
    const btnReset = document.getElementById('btn-reset');
    const btnCopyDirect = document.getElementById('btn-copy-direct');
    const emailOutput = document.getElementById('email-output');
    
    // Header subject elements
    const btnCopySubject = document.getElementById('btn-copy-subject');
    const emailSubjectLine = document.getElementById('email-subject-line');

    // Cached Input Elements
    const contactFirstnameInput = document.getElementById('contact-firstname');
    const contactLastnameInput = document.getElementById('contact-lastname');
    const clientNameInput = document.getElementById('client-name');
    const recipientInput = document.getElementById('recipient');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');

    // Cached Error Message Elements
    const contactFirstnameError = document.getElementById('contact-firstname-error');
    const recipientError = document.getElementById('recipient-error');
    const subjectError = document.getElementById('subject-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    
    const STORAGE_KEY = 'tapkingtools_contact_form';
    let generatedHtml = '';
    let generatedPlain = '';

    let activePlaceholders = {
      contactFirst: 'Jan',
      contactLast: 'de Vries',
      clientName: 'Acme Corporation',
      recipient: 'Elsa',
      phone: '06 12345678',
      email: 'contact@bedrijf.nl',
      subject: 'Vraag over de levertijd van de Axia Quasar mengtafel'
    };

    function randomizePlaceholders() {
      if (!contactFirstnameInput) return;

      const showPlaceholders = window.TapkingTools.settings.showPlaceholders;

      if (showPlaceholders) {
        const randomContact = placeholderData.contacts[Math.floor(Math.random() * placeholderData.contacts.length)];
        const randomRecipient = placeholderData.recipients[Math.floor(Math.random() * placeholderData.recipients.length)];
        const randomClient = placeholderData.clients[Math.floor(Math.random() * placeholderData.clients.length)];
        const randomSubject = placeholderData.subjects[Math.floor(Math.random() * placeholderData.subjects.length)];
        
        activePlaceholders.contactFirst = randomContact.first;
        activePlaceholders.contactLast = randomContact.last;
        activePlaceholders.recipient = randomRecipient;
        activePlaceholders.clientName = randomClient;
        activePlaceholders.subject = randomSubject;

        contactFirstnameInput.placeholder = randomContact.first;
        if (contactLastnameInput) contactLastnameInput.placeholder = randomContact.last;
        if (recipientInput) recipientInput.placeholder = randomRecipient;
        if (clientNameInput) clientNameInput.placeholder = randomClient;
        if (subjectInput) subjectInput.placeholder = randomSubject;
      } else {
        activePlaceholders.contactFirst = '';
        activePlaceholders.contactLast = '';
        activePlaceholders.recipient = '';
        activePlaceholders.clientName = '';
        activePlaceholders.subject = '';

        contactFirstnameInput.placeholder = '';
        if (contactLastnameInput) contactLastnameInput.placeholder = '';
        if (recipientInput) recipientInput.placeholder = '';
        if (clientNameInput) clientNameInput.placeholder = '';
        if (subjectInput) subjectInput.placeholder = '';
      }
    }

    // Dynamic UI Update according to type (phone vs email)
    function updateRequestTypeUI(type) {
      const isPhone = type === 'phone';
      const iconHtml = isPhone ? phoneIconSvg : emailIconSvg;
      
      // Update local state icon
      window.TapkingTools.contact.icon = iconHtml;

      // Update header icon
      const headerIcon = document.getElementById('header-icon');
      if (headerIcon) headerIcon.innerHTML = iconHtml;

      // Update sidebar nav item icon
      const navItem = document.getElementById('nav-contact');
      if (navItem) {
        const svg = navItem.querySelector('svg');
        if (svg) {
          svg.outerHTML = iconHtml;
        }
      }

      // Update badges in form labels
      const phoneBadge = document.getElementById('phone-badge');
      const emailBadge = document.getElementById('email-badge');
      if (isPhone) {
        if (phoneBadge) {
          phoneBadge.className = 'required-badge';
          phoneBadge.textContent = '*';
        }
        if (emailBadge) {
          emailBadge.className = 'optional-badge';
          emailBadge.textContent = 'Optioneel';
        }
      } else {
        if (phoneBadge) {
          phoneBadge.className = 'optional-badge';
          phoneBadge.textContent = 'Optioneel';
        }
        if (emailBadge) {
          emailBadge.className = 'required-badge';
          emailBadge.textContent = '*';
        }
      }
    }

    // Load saved form data from localStorage
    function loadSavedState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.requestType) {
            const radio = form.querySelector(`input[name="request-type"][value="${data.requestType}"]`);
            if (radio) {
              radio.checked = true;
              updateRequestTypeUI(data.requestType);
            }
          } else {
            updateRequestTypeUI('phone');
          }
          if (data.firstName && contactFirstnameInput) contactFirstnameInput.value = data.firstName;
          if (data.lastName && contactLastnameInput) contactLastnameInput.value = data.lastName;
          if (data.clientName && clientNameInput) clientNameInput.value = data.clientName;
          if (data.recipient && recipientInput) recipientInput.value = data.recipient;
          if (data.phone && phoneInput) phoneInput.value = data.phone;
          if (data.email && emailInput) emailInput.value = data.email;
          if (data.subject && subjectInput) subjectInput.value = data.subject;
        } else {
          updateRequestTypeUI('phone');
        }
      } catch (e) {
        console.error('Error loading contact form state:', e);
        updateRequestTypeUI('phone');
      }
    }

    // Save form data to localStorage
    function saveState() {
      try {
        const checkedRadio = form.querySelector('input[name="request-type"]:checked');
        const requestType = checkedRadio ? checkedRadio.value : 'phone';
        const data = {
          requestType: requestType,
          firstName: contactFirstnameInput ? contactFirstnameInput.value : '',
          lastName: contactLastnameInput ? contactLastnameInput.value : '',
          clientName: clientNameInput ? clientNameInput.value : '',
          recipient: recipientInput ? recipientInput.value : '',
          phone: phoneInput ? phoneInput.value : '',
          email: emailInput ? emailInput.value : '',
          subject: subjectInput ? subjectInput.value : ''
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving contact form state:', e);
      }
    }

    // Debounced saveState to prevent main thread blocking during typing
    let saveTimeout;
    function debouncedSaveState() {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveState, 250);
    }

    // Listen for Request Type Radio Changes
    const requestTypeRadios = form.querySelectorAll('input[name="request-type"]');
    requestTypeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        updateRequestTypeUI(e.target.value);
        updateLivePreview();
        saveState();
      });
    });

    // Simple reactive live preview
    if (form) {
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        const handler = () => {
          updateLivePreview();
          debouncedSaveState();
        };
        input.addEventListener('input', handler);
        input.addEventListener('change', handler); // Listen to change event for autofill support
      });
    }

    function updateLivePreview() {
      if (!form) return;

      const firstName = contactFirstnameInput ? escapeHtml(contactFirstnameInput.value.trim()) : '';
      const lastName = contactLastnameInput ? escapeHtml(contactLastnameInput.value.trim()) : '';
      const clientName = clientNameInput ? escapeHtml(clientNameInput.value.trim()) : '';
      const recipient = recipientInput ? escapeHtml(recipientInput.value.trim()) : '';
      const phone = phoneInput ? escapeHtml(phoneInput.value.trim()) : '';
      const email = emailInput ? escapeHtml(emailInput.value.trim()) : '';
      const subject = subjectInput ? escapeHtml(subjectInput.value.trim()) : '';

      const showPlaceholders = window.TapkingTools.settings.showPlaceholders;
      
      const checkedRadio = form.querySelector('input[name="request-type"]:checked');
      const requestType = checkedRadio ? checkedRadio.value : 'phone';
      const isPhone = requestType === 'phone';
      const prefix = isPhone ? 'Terugbelverzoek' : 'E-mailverzoek';

      // Render name: if both empty, show placeholder "Jan de Vries". If at least one is entered, show actual.
      const displayFullName = (firstName || lastName)
        ? `${firstName} ${lastName}`.trim()
        : (showPlaceholders
            ? `<span style="color: #868e96; font-style: italic;">${activePlaceholders.contactFirst} ${activePlaceholders.contactLast}</span>`
            : `-`);

      const displayClientName = clientName
        ? clientName
        : (showPlaceholders
            ? `<span style="color: #868e96; font-style: italic;">${activePlaceholders.clientName}</span>`
            : `-`);

      const displayRecipient = recipient
        ? recipient
        : (showPlaceholders
            ? `<span style="color: #868e96; font-style: italic;">${activePlaceholders.recipient}</span>`
            : `-`);

      const displayPhone = phone
        ? `<a href="tel:${phone.replace(/\s+/g, '')}" style="color: #10a3d3; text-decoration: none; font-weight: bold;">${phone}</a>`
        : (showPlaceholders
            ? `<span style="color: #868e96; font-style: italic;">06 12345678</span>`
            : `-`);

      const displayEmail = email
        ? `<a href="mailto:${email}" style="color: #10a3d3; text-decoration: none;">${email}</a>`
        : (showPlaceholders
            ? `<span style="color: #868e96; font-style: italic;">contact@bedrijf.nl</span>`
            : `-`);

      const displaySubject = subject
        ? subject.replace(/\n/g, '<br>')
        : (showPlaceholders
            ? `<span style="color: #868e96; font-style: italic;">${activePlaceholders.subject}</span>`
            : `-`);

      const dateStr = new Date().toLocaleString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Update subject line text
      let subjectText = '';
      let isSubjectPlaceholder = false;
      if (firstName || lastName || clientName) {
        const namePart = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : '';
        const companyPart = clientName ? ` (${clientName})` : '';
        const mainPart = namePart ? `${namePart}${companyPart}` : clientName;
        subjectText = `${prefix}: ${mainPart} - ${dateStr}`;
      } else {
        if (showPlaceholders) {
          const placeholderName = `${activePlaceholders.contactFirst} ${activePlaceholders.contactLast}`;
          const placeholderCompany = activePlaceholders.clientName ? ` (${activePlaceholders.clientName})` : '';
          subjectText = `${prefix}: ${placeholderName}${placeholderCompany} - ${dateStr}`;
          isSubjectPlaceholder = true;
        } else {
          subjectText = 'In te vullen via formulier';
        }
      }

      if (emailSubjectLine) {
        if (isSubjectPlaceholder) {
          emailSubjectLine.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">${subjectText}</span>`;
        } else {
          emailSubjectLine.textContent = subjectText;
        }
      }

      // Render the HTML preview directly inside the email sheet (pre-styled)
      if (emailOutput) {
        emailOutput.innerHTML = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #212529; line-height: 1.6;">
            <h3 style="color: #10a3d3; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px; font-size: 16px; font-weight: bold; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${isPhone ? '📞 Terugbelverzoek' : '✉️ E-mailverzoek'}</h3>
            
            <p style="margin-bottom: 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Een ${isPhone ? 'terugbelverzoek' : 'contactverzoek via e-mail'} is aangemaakt op <strong>${dateStr}</strong>.</p>
            
            <table style="table-layout: fixed; border-collapse: collapse; width: 100%; max-width: 500px; margin-bottom: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Contactpersoon</td>
                <td style="padding: 8px 0; color: #212529; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${displayFullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Klantnaam</td>
                <td style="padding: 8px 0; color: #212529; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${displayClientName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Voor wie</td>
                <td style="padding: 8px 0; color: #212529; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${displayRecipient}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Telefoonnummer</td>
                <td style="padding: 8px 0; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${displayPhone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">E-mailadres</td>
                <td style="padding: 8px 0; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${displayEmail}</td>
              </tr>
            </table>
            
            <p style="font-weight: bold; margin-bottom: 8px; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Onderwerp / Vraag:</p>
            <div style="border-left: 4px solid #10a3d3; padding: 10px 15px; margin: 8px 0 20px 0; background-color: #f8f9fa; color: #495057; font-style: italic; font-size: 14px; font-family: 'Segoe UI', sans-serif;">
              ${displaySubject}
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e9ecef; margin: 20px 0;">
          </div>
        `;
      }

      // Enable the copy buttons if there's any user content entered (prevent copying default placeholders)
      if (btnCopySubject) {
        btnCopySubject.disabled = !(firstName || lastName || clientName);
      }
      
      // Update buttons text based on setting
      const sendDirectToEmail = window.TapkingTools.settings.sendDirectToEmail;
      if (btnGenerate) {
        if (sendDirectToEmail) {
          btnGenerate.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Genereer &amp; Open e-mail
          `;
        } else {
          btnGenerate.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Genereer &amp; Kopieer
          `;
        }
      }
      
      if (btnCopyDirect) {
        if (sendDirectToEmail) {
          btnCopyDirect.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Genereer &amp; Open e-mail
          `;
        } else {
          btnCopyDirect.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Kopieer contactverzoek
          `;
        }
      }

      // Reset generated data to force validation check upon copy
      generatedHtml = '';
      generatedPlain = '';
    }

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
          generateEmailAndCopy();
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', function() {
        if (form) form.reset();
        
        // Clear error messages using cached references
        if (contactFirstnameInput) contactFirstnameInput.classList.remove('error');
        if (contactFirstnameError) contactFirstnameError.textContent = '';
        
        if (contactLastnameInput) contactLastnameInput.classList.remove('error');
        
        if (recipientInput) recipientInput.classList.remove('error');
        if (recipientError) recipientError.textContent = '';
        
        if (subjectInput) subjectInput.classList.remove('error');
        if (subjectError) subjectError.textContent = '';
        
        if (phoneInput) phoneInput.classList.remove('error');
        if (phoneError) phoneError.textContent = '';
        
        if (emailInput) emailInput.classList.remove('error');
        if (emailError) emailError.textContent = '';
        
        localStorage.removeItem(STORAGE_KEY); // Clear the storage
        
        if (emailOutput) emailOutput.textContent = '';
        if (emailSubjectLine) emailSubjectLine.textContent = 'In te vullen via formulier';
        generatedHtml = '';
        generatedPlain = '';
        if (btnCopySubject) btnCopySubject.disabled = true;
        randomizePlaceholders();
        // Reset request type to phone
        const defaultRadio = form.querySelector('input[name="request-type"][value="phone"]');
        if (defaultRadio) defaultRadio.checked = true;
        updateRequestTypeUI('phone');
        updateLivePreview();
        
        if (typeof window.showToast === 'function') {
          window.showToast('Formulier gewist', 'info');
        }
      });
    }

    if (btnCopyDirect) {
      btnCopyDirect.addEventListener('click', copyToClipboard);
    }

    // Copy subject event listener
    if (btnCopySubject) {
      btnCopySubject.addEventListener('click', () => {
        const text = emailSubjectLine ? emailSubjectLine.textContent : '';
        if (text && text !== 'In te vullen via formulier') {
          navigator.clipboard.writeText(text).then(() => {
            if (typeof window.showToast === 'function') {
              window.showToast('Onderwerp gekopieerd!', 'success');
            }
            
            // Visual feedback on copy icon
            const originalIcon = btnCopySubject.innerHTML;
            btnCopySubject.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--success)"><polyline points="20 6 9 17 4 12"/></svg>`;
            setTimeout(() => {
              btnCopySubject.innerHTML = originalIcon;
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy subject:', err);
          });
        }
      });
    }

    function validateForm() {
      let isValid = true;
      const checkedRadio = form.querySelector('input[name="request-type"]:checked');
      const requestType = checkedRadio ? checkedRadio.value : 'phone';
      const isPhone = requestType === 'phone';

      // Fields to validate using cached inputs and error elements
      const validationRules = [
        { input: contactFirstnameInput, errorEl: contactFirstnameError, message: 'Voornaam is verplicht' },
        { input: recipientInput, errorEl: recipientError, message: 'Ontvanger is verplicht' },
        { input: subjectInput, errorEl: subjectError, message: 'Onderwerp is verplicht' }
      ];

      // Conditional validation depending on type
      if (isPhone) {
        validationRules.push({ input: phoneInput, errorEl: phoneError, message: 'Telefoonnummer is verplicht voor een terugbelverzoek' });
      } else {
        validationRules.push({ input: emailInput, errorEl: emailError, message: 'E-mailadres is verplicht voor een e-mailverzoek' });
      }

      validationRules.forEach(rule => {
        const input = rule.input;
        const errorEl = rule.errorEl;
        if (!input || !errorEl) return;
        
        if (!input.value.trim()) {
          input.classList.add('error');
          errorEl.textContent = rule.message;
          isValid = false;
        } else {
          input.classList.remove('error');
          errorEl.textContent = '';
        }
      });

      // Clear the other fields errors and check formats
      if (isPhone) {
        if (emailInput) {
          emailInput.classList.remove('error');
          if (emailError) emailError.textContent = '';
        }
      } else {
        if (phoneInput) {
          phoneInput.classList.remove('error');
          if (phoneError) phoneError.textContent = '';
        }
        
        // Also validate email format if email request
        const emailValue = emailInput ? emailInput.value.trim() : '';
        if (emailValue) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailValue)) {
            if (emailInput) emailInput.classList.add('error');
            if (emailError) emailError.textContent = 'Vul een geldig e-mailadres in';
            isValid = false;
          }
        }
      }

      if (!isValid && typeof window.showToast === 'function') {
        window.showToast('Vul alle verplichte velden correct in.', 'error');
      }

      return isValid;
    }

    function generateEmailAndCopy() {
      const firstName = contactFirstnameInput ? escapeHtml(contactFirstnameInput.value.trim()) : '';
      const lastName = contactLastnameInput ? escapeHtml(contactLastnameInput.value.trim()) : '';
      const clientName = clientNameInput ? escapeHtml(clientNameInput.value.trim()) : '';
      const recipient = recipientInput ? escapeHtml(recipientInput.value.trim()) : '';
      const phone = phoneInput ? escapeHtml(phoneInput.value.trim()) : '';
      const email = emailInput ? escapeHtml(emailInput.value.trim()) : '';
      const subject = subjectInput ? escapeHtml(subjectInput.value.trim()) : '';

      const fullName = `${firstName} ${lastName}`.trim();
      
      const checkedRadio = form.querySelector('input[name="request-type"]:checked');
      const requestType = checkedRadio ? checkedRadio.value : 'phone';
      const isPhone = requestType === 'phone';
      const prefix = isPhone ? 'Terugbelverzoek' : 'E-mailverzoek';

      const dateStr = new Date().toLocaleString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // 1. Generate HTML format (suitable for Outlook / rich text clipboard)
      generatedHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #212529; line-height: 1.6;">
          <h3 style="color: #10a3d3; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px; font-size: 16px; font-weight: bold; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${isPhone ? '📞 Terugbelverzoek' : '✉️ E-mailverzoek'}</h3>
          
          <p style="margin-bottom: 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Een ${isPhone ? 'terugbelverzoek' : 'contactverzoek via e-mail'} is aangemaakt op <strong>${dateStr}</strong>.</p>
          
          <table style="table-layout: fixed; border-collapse: collapse; width: 100%; max-width: 500px; margin-bottom: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Contactpersoon</td>
              <td style="padding: 8px 0; color: #212529; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Klantnaam</td>
              <td style="padding: 8px 0; color: #212529; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${clientName || '<em>Niet opgegeven</em>'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Voor wie</td>
              <td style="padding: 8px 0; color: #212529; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${recipient}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Telefoonnummer</td>
              <td style="padding: 8px 0; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${phone ? `<a href="tel:${phone.replace(/\s+/g, '')}" style="color: #10a3d3; text-decoration: none; font-weight: bold;">${phone}</a>` : '<em>Niet opgegeven</em>'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 8px 0; font-weight: bold; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">E-mailadres</td>
              <td style="padding: 8px 0; font-size: 14px; font-family: 'Segoe UI', sans-serif; word-break: break-word; overflow-wrap: break-word;">${email ? `<a href="mailto:${email}" style="color: #10a3d3; text-decoration: none;">${email}</a>` : '<em>Niet opgegeven</em>'}</td>
            </tr>
          </table>
          
          <p style="font-weight: bold; margin-bottom: 8px; color: #495057; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Onderwerp / Vraag:</p>
          <div style="border-left: 4px solid #10a3d3; padding: 10px 15px; margin: 8px 0 20px 0; background-color: #f8f9fa; color: #495057; font-style: italic; font-size: 14px; font-family: 'Segoe UI', sans-serif;">
            ${subject.replace(/\n/g, '<br>')}
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e9ecef; margin: 20px 0;">
        </div>
      `;

      // 2. Generate Plain Text format (fallback for notepad etc.)
      generatedPlain = `${isPhone ? '📞 Terugbelverzoek' : '✉️ E-mailverzoek'}

Een ${isPhone ? 'terugbelverzoek' : 'contactverzoek via e-mail'} is aangemaakt op ${dateStr}.

Contactpersoon: ${fullName}
Klantnaam: ${clientName || 'Niet opgegeven'}
Voor wie: ${recipient}
Telefoonnummer: ${phone || 'Niet opgegeven'}
E-mailadres: ${email || 'Niet opgegeven'}

Onderwerp / Vraag:
${subject}

---`;

      // Update display with final HTML
      if (emailOutput) emailOutput.innerHTML = generatedHtml;

      // Copy to clipboard
      copyToClipboard();
    }

    function copyToClipboard() {
      if (!generatedHtml) {
        if (validateForm()) {
          generateEmailAndCopy();
        }
        return;
      }

      const blobHtml = new Blob([generatedHtml], { type: 'text/html' });
      const blobText = new Blob([generatedPlain], { type: 'text/plain' });

      if (typeof window.ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        });

        navigator.clipboard.write([item]).then(() => {
          showCopySuccess();
        }).catch(err => {
          console.error('HTML clipboard copy failed: ', err);
          fallbackCopyToClipboard();
        });
      } else {
        fallbackCopyToClipboard();
      }
    }

    function fallbackCopyToClipboard() {
      navigator.clipboard.writeText(generatedPlain).then(() => {
        if (typeof window.showToast === 'function') {
          window.showToast('Gekopieerd als platte tekst (HTML klembord niet ondersteund)', 'warning');
        }
        showCopySuccess();
      }).catch(err => {
        console.error('Fallback copy failed: ', err);
        if (typeof window.showToast === 'function') {
          window.showToast('Kopiëren mislukt. Kopieer handmatig de code.', 'error');
        }
      });
    }

    function showCopySuccess() {
      if (typeof window.showToast === 'function') {
        window.showToast('Opgemaakte e-mail gekopieerd naar klembord!', 'success');
      }
      
      const wrapper = document.querySelector('.rich-text-wrapper');
      if (wrapper) {
        wrapper.classList.add('success-pulse');
        setTimeout(() => wrapper.classList.remove('success-pulse'), 500);
      }

      // Trigger mailto redirect if enabled
      if (window.TapkingTools.settings.sendDirectToEmail) {
        triggerMailtoRedirect();
      }
    }

    function triggerMailtoRedirect() {
      const subjectText = emailSubjectLine ? emailSubjectLine.textContent.trim() : '';
      const directPlainBody = generatedPlain;
      
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(directPlainBody)}`;
      const tempLink = document.createElement('a');
      tempLink.href = mailtoUrl;
      tempLink.click();
    }

    // Clean up any existing duplicate listeners from previous loads to prevent leaks
    if (window.TapkingTools.contact.settingsListener) {
      window.removeEventListener('tapkingtools-settings-changed', window.TapkingTools.contact.settingsListener);
    }

    // Define the new listener closure
    window.TapkingTools.contact.settingsListener = () => {
      if (document.getElementById('contact-form')) {
        randomizePlaceholders();
        updateLivePreview();
      }
    };

    // Listen for global settings changes
    window.addEventListener('tapkingtools-settings-changed', window.TapkingTools.contact.settingsListener);

    // Initialize state (load saved inputs and update preview)
    randomizePlaceholders();
    loadSavedState();
    updateLivePreview();
  }
};
