import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

let scene, camera, renderer, composer, mouse, raycaster, targetBgColor, serviceObjects, trail, particles, services, serviceDetails, serviceTitle, serviceDescription
const radius = 5

export function initScene(sceneInstance, cameraInstance, rendererInstance, composerInstance, mouseInstance, raycasterInstance, targetBgColorInstance, serviceObjectsInstance, trailInstance, particlesInstance, servicesInstance, serviceDetailsInstance, serviceTitleInstance, serviceDescriptionInstance) {
  scene = sceneInstance
  camera = cameraInstance
  renderer = rendererInstance
  composer = composerInstance
  mouse = mouseInstance
  raycaster = raycasterInstance
  targetBgColor = targetBgColorInstance
  serviceObjects = serviceObjectsInstance
  trail = trailInstance
  particles = particlesInstance
  services = servicesInstance
  serviceDetails = serviceDetailsInstance
  serviceTitle = serviceTitleInstance
  serviceDescription = serviceDescriptionInstance
}

export function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(serviceObjects)

  // Get tooltip element
  const tooltip = document.querySelector('.tooltip')

  // Reset all objects to their original state
  serviceObjects.forEach(obj => {
    if (!obj.userData.isSelected) {
      new TWEEN.Tween(obj.scale)
        .to({
          x: obj.userData.originalScale.x,
          y: obj.userData.originalScale.y,
          z: obj.userData.originalScale.z
        }, 300)
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
      
      obj.material.emissiveIntensity = obj.userData.originalEmissiveIntensity
    }
  })

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object
    const service = intersectedObject.userData
    document.body.style.cursor = 'pointer'
    
    if (!intersectedObject.userData.isSelected) {
      // Scale up and increase glow on hover
      new TWEEN.Tween(intersectedObject.scale)
        .to({
          x: intersectedObject.userData.hoverScale * 1.2,
          y: intersectedObject.userData.hoverScale * 1.2,
          z: intersectedObject.userData.hoverScale * 1.2
        }, 300)
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
      
      intersectedObject.material.emissiveIntensity = intersectedObject.userData.hoverEmissiveIntensity * 1.5

      // Show tooltip with service info
      const categoryColor = service.category === 'frontend' ? '#00ff88' : '#646cff'
      tooltip.innerHTML = `
        <div class="tooltip-icon">${service.icon}</div>
        <div class="tooltip-content">
          <div class="tooltip-title">${service.title}</div>
          <div class="tooltip-category" style="color: ${categoryColor}">
            ${service.category.charAt(0).toUpperCase() + service.category.slice(1)}
          </div>
        </div>
      `
      tooltip.style.left = event.clientX + 'px'
      tooltip.style.top = (event.clientY - 40) + 'px'
      tooltip.classList.remove('hidden')
    }
    
    // Update background color based on service color
    targetBgColor.setHSL(serviceObjects.indexOf(intersectedObject) / services.length, 0.3, 0.1)
  } else {
    document.body.style.cursor = 'default'
    if (!serviceObjects.some(obj => obj.userData.isSelected)) {
      targetBgColor.setHex(0x000000)
    }
    // Hide tooltip
    tooltip.classList.add('hidden')
  }
}

export function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(serviceObjects)

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object
    const service = intersectedObject.userData

    // Mark object as selected
    intersectedObject.userData.isSelected = true

    // Create dramatic camera movement
    const targetPosition = new THREE.Vector3()
    intersectedObject.getWorldPosition(targetPosition)
    targetPosition.multiplyScalar(1.5)
    
    // Move camera to focus on selected service
    new TWEEN.Tween(camera.position)
      .to({
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z + 8
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start()

    // Rotate camera to look at the service
    new TWEEN.Tween(camera.rotation)
      .to({
        x: -Math.atan2(targetPosition.y, targetPosition.z),
        y: Math.atan2(targetPosition.x, targetPosition.z),
        z: 0
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start()

    // Show service preview
    serviceTitle.textContent = service.title
    serviceTitle.setAttribute('data-icon', service.icon)
    serviceDescription.textContent = service.description
    
    // Add explore button if it doesn't exist
    const existingButton = serviceDetails.querySelector('.explore-button')
    if (existingButton) {
      existingButton.remove()
    }

    const exploreButton = document.createElement('button')
    exploreButton.className = 'explore-button'
    exploreButton.innerHTML = `
      <span class="button-text">Explore Service</span>
      <span class="button-category">${service.category}</span>
    `
    
    exploreButton.onclick = async () => {
      // Hide tooltip and service details panel
      document.querySelector('.tooltip').classList.add('hidden')
      serviceDetails.classList.add('hidden')
      
      // Import and initialize service page with the correct service data
      const { initServicePage } = await import('./service-page.js')
      
      // Initialize service page with the current service data
      initServicePage({
        name: service.title,
        description: service.description,
        category: service.category,
        icon: service.icon,
        features: service.features
      })

      // Reset camera position
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 0, z: 15 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()

      // Reset camera rotation
      new TWEEN.Tween(camera.rotation)
        .to({ x: 0, y: 0, z: 0 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()

      // Reset all objects
      serviceObjects.forEach(obj => {
        obj.userData.isSelected = false
      })
    }
    
    serviceDetails.appendChild(exploreButton)
    serviceDetails.classList.remove('hidden')

  } else {
    // Reset camera position when clicking empty space
    new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 0, z: 15 }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start()

    // Reset camera rotation
    new TWEEN.Tween(camera.rotation)
      .to({ x: 0, y: 0, z: 0 }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start()

    // Reset all objects
    serviceObjects.forEach(obj => {
      obj.userData.isSelected = false
    })

    // Hide service details and tooltip
    serviceDetails.classList.add('hidden')
    document.querySelector('.tooltip').classList.add('hidden')
  }
}

export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

function updateServicePositions() {
  const time = Date.now() * 0.001
  serviceObjects.forEach((obj, index) => {
    const angle = (index / serviceObjects.length) * Math.PI * 2 + time * 0.5
    obj.position.x = Math.cos(angle) * radius
    obj.position.y = Math.sin(angle) * radius
    obj.rotation.x += 0.01
    obj.rotation.y += 0.01
  })
}

function updateTrail() {
  const positions = trail.geometry.attributes.position.array
  for (let i = positions.length - 3; i >= 3; i -= 3) {
    positions[i] = positions[i - 3]
    positions[i + 1] = positions[i - 2]
    positions[i + 2] = positions[i - 1]
  }
  positions[0] = mouse.x * 10
  positions[1] = mouse.y * 10
  positions[2] = 0
  trail.geometry.attributes.position.needsUpdate = true
}

export function animate() {
  requestAnimationFrame(animate)

  try {
    // Update service positions
    updateServicePositions()

    // Update trail effect
    updateTrail()

    // Update background color
    if (scene.background && targetBgColor) {
      scene.background.lerp(targetBgColor, 0.05)
    }

    // Update TWEEN
    TWEEN.update()

    // Rotate particles
    if (particles) {
      particles.rotation.y += 0.001
      particles.rotation.x += 0.0005
    }

    // Render the scene
    composer.render()
  } catch (error) {
    console.error('Animation error:', error)
  }
}