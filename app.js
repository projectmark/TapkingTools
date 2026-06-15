// Initialize Global Settings State immediately to prevent theme flashing
window.TapkingTools = window.TapkingTools || {};
window.TapkingTools.settings = window.TapkingTools.settings || {};
window.TapkingTools.settings.theme = window.TapkingTools.settings.theme || localStorage.getItem('theme') || 'light';
window.TapkingTools.settings.colorTheme = window.TapkingTools.settings.colorTheme || localStorage.getItem('color_theme') || 'neutral';
window.TapkingTools.settings.showPlaceholders = window.TapkingTools.settings.showPlaceholders !== undefined ? window.TapkingTools.settings.showPlaceholders : (localStorage.getItem('tapkingtools_setting_show_placeholders') !== 'false');
window.TapkingTools.settings.sendDirectToEmail = window.TapkingTools.settings.sendDirectToEmail !== undefined ? window.TapkingTools.settings.sendDirectToEmail : (localStorage.getItem('tapkingtools_setting_send_direct_to_email') === 'true');

// Apply Theme on load immediately
if (window.TapkingTools.settings.theme === 'dark') {
  document.body.classList.add('dark-theme');
} else {
  document.body.classList.remove('dark-theme');
}
// Apply Color Theme class immediately
const colorTheme = window.TapkingTools.settings.colorTheme;
document.body.classList.remove('theme-3', 'theme-catppuccin', 'theme-neutral');
document.body.classList.add(`theme-${colorTheme}`);

document.addEventListener('DOMContentLoaded', () => {
  // Global Toast function
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--success)"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--error)"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else if (type === 'warning') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--warning)"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent-secondary)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      ${icon}
      <span class="toast-message"></span>
    `;
    toast.querySelector('.toast-message').textContent = message;

    container.appendChild(toast);

    // Auto remove toast after 3.5s
    setTimeout(() => {
      toast.classList.add('fade-out');
      let removed = false;
      const removeToast = () => {
        if (!removed) {
          removed = true;
          toast.remove();
        }
      };
      toast.addEventListener('animationend', removeToast);
      setTimeout(removeToast, 500); // safety fallback for prefers-reduced-motion
    }, 3500);
  };

  // Settings Modal elements
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsModal = document.getElementById('settings-modal');
  const modalClose = document.getElementById('modal-close');
  const themeSettingToggle = document.getElementById('setting-toggle-theme');
  const toolSettingsContainer = document.getElementById('tool-settings-container');

  // Changelog Modal elements
  const changelogToggle = document.getElementById('changelog-toggle');
  const changelogModal = document.getElementById('changelog-modal');
  const changelogClose = document.getElementById('changelog-close');

  // Sidebar Collapse Logic
  const sidebar = document.querySelector('.sidebar');
  const sidebarCollapseToggle = document.getElementById('sidebar-collapse-toggle');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  if (sidebar && sidebarCollapseToggle) {
    // Helper to toggle sidebar overlay along with the dim backdrop
    function toggleOverlay(forceState) {
      if (typeof forceState === 'boolean') {
        if (forceState) {
          sidebar.classList.add('overlay-active');
          if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
        } else {
          sidebar.classList.remove('overlay-active');
          if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        }
      } else {
        const isActive = sidebar.classList.toggle('overlay-active');
        if (sidebarBackdrop) {
          if (isActive) sidebarBackdrop.classList.add('active');
          else sidebarBackdrop.classList.remove('active');
        }
      }
    }

    // Initial collapse state: always collapse on tablet and mobile viewports
    if (window.innerWidth <= 1150) {
      sidebar.classList.add('collapsed');
    } else {
      // Desktop preference check
      const savedPref = localStorage.getItem('sidebar_collapsed_pref');
      if (savedPref === 'collapsed') {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }

    // Desktop/Tablet toggle button click listener
    sidebarCollapseToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth > 1150) {
        // Desktop mode: toggle collapse normally and save preference
        const wasCollapsed = sidebar.classList.contains('collapsed');
        if (wasCollapsed) {
          sidebar.classList.remove('collapsed');
          localStorage.setItem('sidebar_collapsed_pref', 'expanded');
        } else {
          sidebar.classList.add('collapsed');
          localStorage.setItem('sidebar_collapsed_pref', 'collapsed');
        }
        toggleOverlay(false);
      } else {
        // Tablet mode: toggle overlay
        toggleOverlay();
      }
    });

    // Mobile hamburger menu toggle click listener
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleOverlay();
      });
    }

    // Close overlay when clicking the dim backdrop
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => {
        toggleOverlay(false);
      });
    }

    // Close overlay when clicking outside the sidebar
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('overlay-active') && !sidebar.contains(e.target)) {
        toggleOverlay(false);
      }
    });

    // Close overlay after clicking a navigation link
    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('.nav-item')) {
        toggleOverlay(false);
      }
    });

    // Sync state on window resize (throttled with requestAnimationFrame)
    let lastWidth = window.innerWidth;
    let resizeScheduled = false;
    window.addEventListener('resize', () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        const currentWidth = window.innerWidth;
        if (lastWidth > 1150 && currentWidth <= 1150) {
          // Scaling down to tablet/mobile: force collapse
          sidebar.classList.add('collapsed');
        } else if (lastWidth <= 1150 && currentWidth > 1150) {
          // Scaling up to desktop: restore preference
          const currentPref = localStorage.getItem('sidebar_collapsed_pref');
          if (currentPref === 'collapsed') {
            sidebar.classList.add('collapsed');
          } else {
            sidebar.classList.remove('collapsed');
          }
          toggleOverlay(false); // Reset overlay state
        }
        lastWidth = currentWidth;
        resizeScheduled = false;
      });
    });
  }

  // Sync theme switch and color theme select inside modal
  const colorThemeSelect = document.getElementById('setting-color-theme');
  if (themeSettingToggle) {
    themeSettingToggle.checked = window.TapkingTools.settings.theme === 'dark';
  }
  if (colorThemeSelect) {
    colorThemeSelect.value = window.TapkingTools.settings.colorTheme;
  }

  // Modal open/close actions
  function openSettingsModal() {
    if (themeSettingToggle) {
      themeSettingToggle.checked = document.body.classList.contains('dark-theme');
    }
    if (colorThemeSelect) {
      colorThemeSelect.value = window.TapkingTools.settings.colorTheme;
    }
    renderContextualSettings();
    settingsModal.classList.add('open');
  }

  function closeSettingsModal() {
    settingsModal.classList.remove('open');
  }

  if (settingsToggle) settingsToggle.addEventListener('click', openSettingsModal);
  if (modalClose) modalClose.addEventListener('click', closeSettingsModal);
  
  // Close modal when clicking outside the card
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }

  // Changelog Modal open/close actions
  function openChangelogModal() {
    if (changelogModal) changelogModal.classList.add('open');
  }

  function closeChangelogModal() {
    if (changelogModal) changelogModal.classList.remove('open');
  }

  if (changelogToggle) changelogToggle.addEventListener('click', openChangelogModal);
  if (changelogClose) changelogClose.addEventListener('click', closeChangelogModal);

  // Close changelog modal when clicking outside the card
  if (changelogModal) {
    changelogModal.addEventListener('click', (e) => {
      if (e.target === changelogModal) {
        closeChangelogModal();
      }
    });
  }

  // Close modal when pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (settingsModal && settingsModal.classList.contains('open')) {
        closeSettingsModal();
      }
      if (changelogModal && changelogModal.classList.contains('open')) {
        closeChangelogModal();
      }
    }
  });

  // Theme Toggle inside Settings Modal
  if (themeSettingToggle) {
    themeSettingToggle.addEventListener('change', (e) => {
      const isDark = e.target.checked;
      const newTheme = isDark ? 'dark' : 'light';
      window.TapkingTools.settings.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      
      window.showToast(`Thema aangepast naar ${newTheme === 'light' ? 'Licht' : 'Donker'}`, 'info');
      
      // Trigger global settings changed event
      window.dispatchEvent(new CustomEvent('tapkingtools-settings-changed'));
    });
  }

  // Color Theme selector inside Settings Modal
  if (colorThemeSelect) {
    colorThemeSelect.addEventListener('change', (e) => {
      const newColorTheme = e.target.value;
      window.TapkingTools.settings.colorTheme = newColorTheme;
      localStorage.setItem('color_theme', newColorTheme);
      
      // Update body classes
      document.body.classList.remove('theme-3', 'theme-catppuccin', 'theme-neutral');
      document.body.classList.add(`theme-${newColorTheme}`);
      
      const displayName = newColorTheme === '3' ? '3' : (newColorTheme === 'catppuccin' ? 'Catppuccin' : 'Neutraal');
      window.showToast(`Kleurthema aangepast naar ${displayName}`, 'info');
      
      // Trigger global settings changed event
      window.dispatchEvent(new CustomEvent('tapkingtools-settings-changed'));
    });
  }

  // Render tool specific settings dynamically
  function renderContextualSettings() {
    if (!toolSettingsContainer) return;
    toolSettingsContainer.innerHTML = '';
    
    // Get active tool from URL hash
    const hash = window.location.hash || '#home';
    const activeToolKey = hash.substring(1);
    const activeTool = window.TapkingTools[activeToolKey];
    
    if (activeTool && activeTool.settings && typeof activeTool.settings.render === 'function') {
      // Render specific tool settings
      toolSettingsContainer.innerHTML = activeTool.settings.render();
      if (typeof activeTool.settings.init === 'function') {
        activeTool.settings.init(toolSettingsContainer);
      }
    } else {
      // Empty state
      toolSettingsContainer.innerHTML = '<div class="no-settings-notice">Geen specifieke instellingen voor dit hulpmiddel.</div>';
    }
  }

  // Load and Register Tools
  const tools = window.TapkingTools || {};
  const sidebarNav = document.getElementById('sidebar-nav');
  const toolViewport = document.getElementById('tool-viewport');
  const headerTitle = document.getElementById('header-title');
  const headerIcon = document.getElementById('header-icon');
  const headerDesc = document.getElementById('header-desc');

  // Build Sidebar navigation
  function initNavigation() {
    sidebarNav.innerHTML = '';
    
    // 1. Dashboard (Home) Link
    const homeItem = document.createElement('a');
    homeItem.className = 'nav-item';
    homeItem.id = 'nav-home';
    homeItem.href = '#home';
    homeItem.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="15" rx="1"/></svg>
      <span>Dashboard</span>
    `;
    sidebarNav.appendChild(homeItem);

    // Section title for tools
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'nav-section-title';
    sectionTitle.style.marginTop = '16px';
    sectionTitle.textContent = 'Tools';
    sidebarNav.appendChild(sectionTitle);

    // 2. Loop through registered tools in TapkingTools object
    Object.keys(tools).forEach(key => {
      if (key === 'settings') return; // Skip settings config
      const tool = tools[key];
      if (!tool.id || !tool.name) return; // Skip invalid tool configs
      const navItem = document.createElement('a');
      navItem.className = 'nav-item';
      navItem.id = `nav-${tool.id}`;
      navItem.href = `#${tool.id}`;
      navItem.innerHTML = `
        ${tool.icon}
        <span>${tool.name}</span>
      `;
      sidebarNav.appendChild(navItem);
    });
  }

  function switchActiveNav(id) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeItem = document.getElementById(id);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  function renderDashboard() {
    document.title = 'TapkingTools - Dashboard';
    switchActiveNav('nav-home');
    headerTitle.textContent = 'TapkingTools Dashboard';
    headerIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="15" rx="1"/></svg>`;
    headerDesc.textContent = 'Beheer en gebruik handige hulpmiddelen voor je dagelijkse workflow.';

    let cardsHtml = '';
    Object.keys(tools).forEach(key => {
      if (key === 'settings') return; // Skip settings config
      const tool = tools[key];
      if (!tool.id || !tool.name) return; // Skip invalid tool configs
      cardsHtml += `
        <div class="tool-card" data-tool-id="${tool.id}">
          <div class="tool-card-content">
            <div class="tool-card-icon">${tool.icon}</div>
            <h3 class="tool-card-title">${tool.name}</h3>
            <p class="tool-card-desc">${tool.description}</p>
            <div class="tool-card-footer">
              <span class="tool-card-link">Hulpmiddel openen</span>
              <svg class="tool-card-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        </div>
      `;
    });

    toolViewport.innerHTML = `
      <div class="dashboard-welcome">
        <div class="dashboard-hero">
          <h1>Welkom bij TapkingTools</h1>
          <p>Kies een van de onderstaande tools om direct aan de slag te gaan.</p>
        </div>
        
        <div class="tools-grid">
          ${cardsHtml || '<div style="color:var(--text-muted); grid-column: 1/-1; text-align:center;">Geen tools geregistreerd.</div>'}
        </div>
      </div>
    `;

    // Add click listeners to cards
    toolViewport.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', () => {
        const toolId = card.getAttribute('data-tool-id');
        window.location.hash = `#${toolId}`;
      });
    });
  }

  function loadTool(tool) {
    document.title = `TapkingTools - ${tool.name}`;
    switchActiveNav(`nav-${tool.id}`);
    headerTitle.textContent = tool.name;
    headerIcon.innerHTML = tool.icon;
    headerDesc.textContent = tool.description;
    
    // Render the tool's template
    toolViewport.innerHTML = tool.render();
    
    // Initialize tool specific JavaScript listeners
    if (typeof tool.init === 'function') {
      tool.init();
    }
  }

  // Hash router
  function handleRouting() {
    const hash = window.location.hash || '#home';
    const toolId = hash.substring(1);

    if (toolId === 'home') {
      renderDashboard();
    } else if (tools[toolId] && toolId !== 'settings' && typeof tools[toolId].render === 'function') {
      loadTool(tools[toolId]);
    } else {
      // Fallback
      window.location.hash = '#home';
    }
  }

  // Start application
  initNavigation();
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleRouting);
  
  // Trigger initial routing
  handleRouting();
});
