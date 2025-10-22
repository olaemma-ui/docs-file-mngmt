"use client"

interface MarqueeItem {
  text: string
}

const marqueeItems: MarqueeItem[] = [
  { text: "Secure Document Management" },
  { text: "Version Control" },
  { text: "Role-Based Access" },
  { text: "Real-Time Collaboration" },
  { text: "Enterprise Security" },
  { text: "Advanced Search" },
]

export function MarqueeSection() {
  return (
    <section className="relative py-12 bg-accent/5 border-y border-border overflow-hidden">
      <div className="flex gap-8 animate-marquee">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <div key={index} className="flex-shrink-0 text-lg font-mono font-semibold text-accent whitespace-nowrap">
            {item.text}
          </div>
        ))}
      </div>
    </section>
  )
}
