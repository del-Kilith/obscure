const DustParticle = function (screen) {
  return () => ({
    x: Random.range(screen.width),
    y: Random.range(screen.height),
    xFactor: Random.range(0.8, -0.2),
    yFactor: Random.range(1.5, 0.5),
    offset: Random.range(2 * Math.PI),
    radius: Random.range(12, 5),
    spt: performance.now(),
    ttl: Random.range(110, 10) * 1000,
  })
}

const DustRenderer = Renderer(RendererPriority.High, screen => ({
  maxOpacity: 34,
  factory: DustParticle(screen),
  particles: Arrays.ofSize(180, DustParticle(screen)),
}), function (context, time, screen) {
  this.particles = this.particles.map(process.bind(this))
  this.particles.forEach(render.bind(this))

  function process(particle) {
    if (time.now > particle.spt + particle.ttl) {
      return this.factory()
    } else {
      return particle
    }
  }

  function render(particle) {
    const {xFactor, yFactor, offset, spt, ttl} = particle
    particle.x += time.delta * xFactor * Math.cos(time.now / 1000 + offset)
    particle.y += time.delta * yFactor * Math.sin(time.now / 1000 + offset)

    const percent = (time.now - spt) / ttl
    const opacity = Math.round(this.maxOpacity * Math.sin(Math.PI * percent))
    const string = opacity.toString(16).padStart(2, '0')

    const gradient = context.createRadialGradient(
      particle.x,
      particle.y,
      particle.radius - 3,
      particle.x,
      particle.y,
      particle.radius
    )
    gradient.addColorStop(0, `#ffffff${string}`)
    gradient.addColorStop(1, `#ffffff00`)

    context.fillStyle = gradient
    context.beginPath()
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false)
    context.fill()
  }
})

const RippleParticle = function (screen) {
  return () => ({
    x: Random.range(screen.width),
    y: Random.range(screen.height),
    speed: Random.range(7, 5),
    direction: Random.of(1, -1),
    maxRadius: Random.range(25, 20),
    spt: performance.now(),
    ttl: Random.range(25, 23.2) * 1000
  })
}

const RippleRenderer = Renderer(RendererPriority.High, screen => ({
  factory: RippleParticle(screen),
  particles: [],
  lastRippleAt: performance.now(),
  nextRippleAt: performance.now(),
  cooldown: 1.5,
}), function (context, time, screen) {
  this.particles = this.particles.filter(process)
  this.particles.forEach(render.bind(this))

  if (time.now > this.nextRippleAt) {
    this.particles.push(this.factory())
    this.nextRippleAt = time.now + Random.range(this.cooldown) * 1000
  }

  function process(particle) {
    return time.now < particle.spt + particle.ttl
  }

  function render(particle) {
    const {speed, direction, maxRadius, spt, ttl} = particle
    const percent = (time.now - spt) / ttl

    particle.x += time.delta * speed * direction

    const radius = Math.min(maxRadius * percent, maxRadius)

    const maxOpacity = State.get('rippleMaxOpacity')
    const opacity = Math.round(maxOpacity * Math.sin(Math.PI * percent))
    const string = opacity.toString(16).padStart(2, '0')
    const colour = State.get('rippleColor')

    context.fillStyle = `${colour}${string}`
    context.beginPath()
    context.arc(particle.x, particle.y, radius, 0, Math.PI * 2, false)
    context.fill()
  }
})
