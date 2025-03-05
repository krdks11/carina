import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { createPricingPage } from './pricing-page.js'

let servicePageContainer = null
let interactiveButton = null
let scene, camera, renderer

function createServicePage(service) {
  // Create container for service page
  servicePageContainer = document.createElement('div')
  servicePageContainer.className = 'service-page'
  
  // Create header
  const header = document.createElement('header')
  header.className = 'service-header'
  
  const title = document.createElement('div')
  title.className = 'service-title'
  title.innerHTML = `
    <span class="service-icon">${service.icon}</span>
    <div class="title-content">
      <h1>${service.name}</h1>
      <span class="service-category">${service.category}</span>
    </div>
  `
  header.appendChild(title)
  
  const closeButton = document.createElement('button')
  closeButton.className = 'close-button'
  closeButton.innerHTML = '×'
  closeButton.onclick = closeServicePage
  header.appendChild(closeButton)
  
  servicePageContainer.appendChild(header)

  // Create content container
  const content = document.createElement('div')
  content.className = 'service-content'
  
  // Add service description with gradient text
  const description = document.createElement('div')
  description.className = 'service-description'
  description.innerHTML = `
    <div class="description-text">
      <h2>Overview</h2>
      <p>${service.description}</p>
    </div>
    <div class="description-bg"></div>
  `
  content.appendChild(description)

  // Add features section with cards
  const features = document.createElement('div')
  features.className = 'service-features'
  features.innerHTML = `
    <h2>Key Features</h2>
    <div class="features-grid">
      ${service.features.map((feature, index) => `
        <div class="feature-card" style="--delay: ${index * 0.1}s">
          <div class="feature-icon">✦</div>
          <div class="feature-content">
            <h3>${feature}</h3>
            <p>${getFeatureDescription(feature)}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `
  content.appendChild(features)

  // Add technologies section
  const technologies = document.createElement('div')
  technologies.className = 'service-technologies'
  technologies.innerHTML = `
    <h2>Technologies We Use</h2>
    <div class="tech-grid">
      ${getTechnologies(service.category).map(tech => `
        <div class="tech-item">
          <div class="tech-icon">${tech.icon}</div>
          <span class="tech-name">${tech.name}</span>
        </div>
      `).join('')}
    </div>
  `
  content.appendChild(technologies)

  // Add call to action
  const cta = document.createElement('div')
  cta.className = 'service-cta'
  
  // Define services that require custom quotes
  const customQuoteServices = ["App Development", "API Development", "Database Solutions", "Cloud Architecture"];
  const isCustomQuote = customQuoteServices.includes(service.name)
  
  cta.innerHTML = `
    <h2>Ready to Get Started?</h2>
    <p>Let's transform your ideas into reality</p>
    <div class="cta-buttons">
      <button class="cta-button contact-btn">Contact Us</button>
      ${isCustomQuote ? `
        <button class="cta-button pricing-btn disabled" disabled title="Pricing not available for ${service.name}">
          <span>See Pricing</span>
          <span class="price-tag">Custom Quote Only</span>
        </button>
      ` : `
        <button class="cta-button pricing-btn">
          <span>See Pricing</span>
          <span class="price-tag">Starting from ₹4999</span>
        </button>
      `}
    </div>
  `
  content.appendChild(cta)

  // Add pricing button click handler only if it's not a custom quote service
  if (!isCustomQuote) {
    const pricingBtn = cta.querySelector('.pricing-btn')
    pricingBtn.addEventListener('click', () => {
      createPricingPage(service)
    })
  }

  servicePageContainer.appendChild(content)
  document.body.appendChild(servicePageContainer)

  // Add show class after a small delay for animation
  requestAnimationFrame(() => {
    servicePageContainer.classList.add('show')
  })
}

function getFeatureDescription(feature) {
  const descriptions = {
    // App Development
    "Cross-Platform Development": "Build once, deploy everywhere with unified codebase",
    "Native Performance": "Optimized performance matching native app experience",
    "Offline Support": "Work seamlessly even without internet connection",
    "Push Notifications": "Engage users with timely updates and alerts",
    "App Store Optimization": "Maximize visibility in app stores",
    "Regular Updates": "Continuous improvements and feature updates",
    
    // Database Solutions
    "Database Design": "Optimized schema design for your data needs",
    "Data Migration": "Seamless transfer of data between systems",
    "Performance Tuning": "Optimized queries and database performance",
    "Backup Solutions": "Reliable data backup and recovery systems",
    "High Availability": "Ensure continuous data access and uptime",
    "Data Security": "Robust security measures for data protection",
    
    // Static Websites
    "Fast Loading": "Lightning-fast page load times",
    "SEO Optimization": "Built-in SEO best practices",
    "Content Management": "Easy content updates and management",
    "Custom Domains": "Use your own domain name",
    "Analytics Integration": "Track website performance and user behavior",
    "Mobile Optimization": "Perfect display on all devices",
    
    // Dynamic Websites
    "Real-time Updates": "Instant content updates without refresh",
    "User Authentication": "Secure user login and management",
    "Interactive UI": "Engaging user interface elements",
    "API Integration": "Connect with external services seamlessly",
    "Database Integration": "Dynamic data storage and retrieval",
    "Custom Features": "Tailored functionality for your needs",
    
    // API Development
    "RESTful/GraphQL APIs": "Modern API architectures for flexibility",
    "Authentication": "Secure API access control",
    "Rate Limiting": "Protect APIs from abuse",
    "API Documentation": "Comprehensive API documentation",
    "Version Control": "Maintain multiple API versions",
    "Performance Monitoring": "Track API performance metrics",
    
    // Cloud Architecture
    "Cloud Migration": "Seamless transition to cloud infrastructure",
    "Auto Scaling": "Automatic resource scaling based on demand",
    "Load Balancing": "Optimal distribution of traffic",
    "Disaster Recovery": "Robust backup and recovery solutions",
    "Cost Optimization": "Efficient resource utilization",
    "Security Compliance": "Industry standard security measures"
  }
  return descriptions[feature] || "Enhancing your digital presence with innovative solutions"
}

function getTechnologies(category) {
  const technologies = {
    frontend: [
      { name: "React", icon: "⚛️" },
      { name: "Vue.js", icon: "🔷" },
      { name: "Angular", icon: "🅰️" },
      { name: "TypeScript", icon: "📘" },
      { name: "Tailwind", icon: "🎨" },
      { name: "Three.js", icon: "🎮" }
    ],
    backend: [
      { name: "Node.js", icon: "🟢" },
      { name: "Python", icon: "🐍" },
      { name: "Go", icon: "🔵" },
      { name: "MongoDB", icon: "🍃" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Redis", icon: "⚡" }
    ]
  }
  return technologies[category] || technologies.frontend
}

function closeServicePage() {
  if (servicePageContainer) {
    servicePageContainer.classList.remove('show')
    setTimeout(() => {
      servicePageContainer.remove()
      servicePageContainer = null
    }, 300)
  }
}

export function initServicePage(service) {
  console.log('Initializing service page with data:', service)
  // Remove any existing service page
  const existingPage = document.querySelector('.service-page')
  if (existingPage) {
    existingPage.remove()
  }
  createServicePage(service)
}
