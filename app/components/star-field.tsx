"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  z: number
  prevX: number
  prevY: number
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createStars = () => {
      const stars: Star[] = []
      for (let i = 0; i < 800; i++) {
        stars.push({
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * 1000,
          prevX: 0,
          prevY: 0,
        })
      }
      starsRef.current = stars
    }

    const animate = () => {
      ctx.fillStyle = "rgba(17, 24, 39, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.translate(canvas.width / 2, canvas.height / 2)

      starsRef.current.forEach((star) => {
        star.prevX = star.x / (star.z * 0.001)
        star.prevY = star.y / (star.z * 0.001)

        star.z -= 2

        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - canvas.width / 2
          star.y = Math.random() * canvas.height - canvas.height / 2
          star.z = 1000
          star.prevX = star.x / (star.z * 0.001)
          star.prevY = star.y / (star.z * 0.001)
        }

        const x = star.x / (star.z * 0.001)
        const y = star.y / (star.z * 0.001)

        const opacity = 1 - star.z / 1000
        const size = (1 - star.z / 1000) * 2

        // Draw star trail
        ctx.strokeStyle = `rgba(147, 197, 253, ${opacity * 0.5})`
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.moveTo(star.prevX, star.prevY)
        ctx.lineTo(x, y)
        ctx.stroke()

        // Draw star
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createStars()
    animate()

    const handleResize = () => {
      resizeCanvas()
      createStars()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: "linear-gradient(to bottom, #111827, #1f2937, #111827)" }}
    />
  )
}
