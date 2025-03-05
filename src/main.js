import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import * as TWEEN from '@tweenjs/tween.js'
import { onMouseMove, onMouseClick, onWindowResize, animate, initScene } from './service-detail.js'

// Create UI elements
const header = document.createElement('header')
header.innerHTML = `
  <h1>Carina DevWorks</h1>
  <p>Interactive 3D Services Showcase</p>
  <nav>
    <button class="nav-btn active" data-view="all">All Services</button>
    <button class="nav-btn" data-view="frontend">Frontend</button>
    <button class="nav-btn" data-view="backend">Backend</button>
  </nav>
`
document.body.insertBefore(header, document.getElementById('app'))

// Create tooltip element
const tooltip = document.createElement('div')
tooltip.className = 'tooltip hidden'
document.body.appendChild(tooltip)

// Create service details container
const serviceDetailsContainer = document.createElement('div')
serviceDetailsContainer.id = 'service-details'
serviceDetailsContainer.className = 'service-details hidden'
serviceDetailsContainer.innerHTML = `
  <h2 id="service-title"></h2>
  <p id="service-description"></p>
  <ul id="service-features"></ul>
`
document.body.appendChild(serviceDetailsContainer)

// Create loading screen
const loadingScreen = document.createElement('div')
loadingScreen.className = 'loading-screen'
loadingScreen.innerHTML = `
  <div class="loader"></div>
  <p>Loading Experience...</p>
`
document.body.appendChild(loadingScreen)

// Get DOM elements
const serviceDetails = document.getElementById('service-details')
const serviceTitle = document.getElementById('service-title')
const serviceDescription = document.getElementById('service-description')
const serviceFeatures = document.getElementById('service-features')

// Ensure DOM elements are initialized
if (!serviceDetails || !serviceTitle || !serviceDescription || !serviceFeatures) {
  console.error('Required DOM elements not found')
  throw new Error('Required DOM elements not found. Check if the HTML structure is correct.')
}

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('app').appendChild(renderer.domElement)

// Post-processing setup
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
composer.addPass(renderPass)
composer.addPass(bloomPass)

// Initialize variables
const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const radius = 5
const targetBgColor = new THREE.Color(0x000000)
const serviceObjects = []

// Create services with categories
const services = [
  { 
    title: "App Development",
    description: "Native and cross-platform mobile applications with modern frameworks like React Native and Flutter. We build responsive, user-friendly apps for iOS and Android platforms.",
    category: "frontend",
    icon: "📱",
    features: [
      "Cross-Platform Development",
      "Native Performance",
      "Offline Support",
      "Push Notifications",
      "App Store Optimization",
      "Regular Updates"
    ]
  },
  { 
    title: "Database Solutions",
    description: "Comprehensive database design and management services including SQL, NoSQL, and cloud databases. We ensure secure, scalable, and efficient data storage solutions.",
    category: "backend",
    icon: "🗄️",
    features: [
      "Database Design",
      "Data Migration",
      "Performance Tuning",
      "Backup Solutions",
      "High Availability",
      "Data Security"
    ]
  },
  { 
    title: "Static Websites",
    description: "Fast, secure, and SEO-friendly static websites built with modern technologies. Perfect for portfolios, landing pages, and content-focused sites.",
    category: "frontend",
    icon: "🌐",
    features: [
      "Fast Loading",
      "SEO Optimization",
      "Content Management",
      "Custom Domains",
      "Analytics Integration",
      "Mobile Optimization"
    ]
  },
  { 
    title: "Dynamic Websites",
    description: "Feature-rich dynamic websites with real-time updates, user authentication, and interactive elements. Built using modern frameworks like React, Vue, or Angular.",
    category: "frontend",
    icon: "⚡",
    features: [
      "Real-time Updates",
      "User Authentication",
      "Interactive UI",
      "API Integration",
      "Database Integration",
      "Custom Features"
    ]
  },
  {
    title: "API Development",
    description: "RESTful and GraphQL APIs built with modern technologies. Secure, scalable, and well-documented endpoints for your applications.",
    category: "backend",
    icon: "🔌",
    features: [
      "RESTful/GraphQL APIs",
      "Authentication",
      "Rate Limiting",
      "API Documentation",
      "Version Control",
      "Performance Monitoring"
    ]
  },
  {
    title: "Cloud Architecture",
    description: "Expert cloud solutions using AWS, Azure, or Google Cloud. We design and implement scalable, cost-effective cloud infrastructures.",
    category: "backend",
    icon: "☁️",
    features: [
      "Cloud Migration",
      "Auto Scaling",
      "Load Balancing",
      "Disaster Recovery",
      "Cost Optimization",
      "Security Compliance"
    ]
  }
]

// Create service objects with enhanced visuals
services.forEach((service, index) => {
  const geometry = new THREE.IcosahedronGeometry(0.5, 2) 
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(index / services.length, 0.8, 0.5),
    metalness: 0.7,
    roughness: 0.3,
    emissive: new THREE.Color().setHSL(index / services.length, 0.8, 0.2),
    emissiveIntensity: 0.5
  })
  const mesh = new THREE.Mesh(geometry, material)
  
  // Store service data directly in userData
  mesh.userData = service
  mesh.userData.originalScale = mesh.scale.clone()
  mesh.userData.originalEmissiveIntensity = 0.5
  mesh.userData.hoverScale = 1.3
  mesh.userData.hoverEmissiveIntensity = 1.0
  
  // Position the service object
  const angle = (index / services.length) * Math.PI * 2
  mesh.position.x = Math.cos(angle) * radius
  mesh.position.z = Math.sin(angle) * radius
  
  serviceObjects.push(mesh)
  scene.add(mesh)
})

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)

// Create particle system
const particlesGeometry = new THREE.BufferGeometry()
const particleCount = 2000 
const posArray = new Float32Array(particleCount * 3)
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Create mouse trail
const trailGeometry = new THREE.BufferGeometry()
const trailPositions = new Float32Array(30 * 3)
trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
const trailMaterial = new THREE.LineBasicMaterial({ 
  color: 0xffffff, 
  transparent: true, 
  opacity: 0.5,
  blending: THREE.AdditiveBlending
})
const trail = new THREE.Line(trailGeometry, trailMaterial)
scene.add(trail)

// Set initial camera position
camera.position.z = 15

// Add event listeners
window.addEventListener('mousemove', onMouseMove)
window.addEventListener('click', onMouseClick)
window.addEventListener('resize', onWindowResize)

// Add category filter functionality
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
    e.target.classList.add('active')
    const category = e.target.dataset.view
    
    serviceObjects.forEach((obj, index) => {
      const shouldShow = category === 'all' || obj.userData.category === category
      new TWEEN.Tween(obj.scale)
        .to(shouldShow ? obj.userData.originalScale : { x: 0.001, y: 0.001, z: 0.001 }, 500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()
    })
  })
})

// Initialize scene
initScene(scene, camera, renderer, composer, mouse, raycaster, targetBgColor, serviceObjects, trail, particles, services, serviceDetails, serviceTitle, serviceDescription, serviceFeatures)

// Remove loading screen after everything is loaded
setTimeout(() => {
  loadingScreen.style.opacity = '0'
  setTimeout(() => loadingScreen.remove(), 500)
}, 1500)

// Start animation loop
animate()
