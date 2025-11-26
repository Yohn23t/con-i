import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Zap, Users, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section className="relative py-20 px-4 overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ethiopian-construction-workers.jpg"
            alt="Ethiopian construction workers on site"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-white">
                Smart Bidding for Construction Success
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl text-balance">
                The modern platform connecting construction companies with skilled contractors. Post projects, receive
                competitive bids, and manage your construction business efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/welcome">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-white/10 border-white text-white hover:bg-white/20"
                >
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-white/10 border-white text-white hover:bg-white/20"
                >
                  <Link href="/job-matching">Find Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Post Your Project",
                desc: "Companies post construction projects with details, budget, and timeline.",
                icon: "📋",
              },
              {
                step: 2,
                title: "Receive Bids",
                desc: "Contractors submit competitive bids with their expertise and pricing.",
                icon: "💰",
              },
              {
                step: 3,
                title: "Manage & Build",
                desc: "Select the best bid and manage the project through completion.",
                icon: "🏗️",
              },
            ].map((item, idx) => (
              <Card
                key={item.step}
                className="p-8 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animationDuration: "600ms",
                }}
              >
                <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-6xl animate-bounce" style={{ animationDelay: `${idx * 200}ms` }}>
                    {item.icon}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Matching",
                desc: "Smart algorithms match projects with the best contractors.",
              },
              {
                icon: Users,
                title: "Verified Professionals",
                desc: "All contractors are verified and rated by the community.",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Analytics",
                desc: "Track project progress and bid performance in real-time.",
              },
              {
                icon: CheckCircle,
                title: "Secure Payments",
                desc: "Safe and secure payment processing for all transactions.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="p-8 flex gap-6">
                  <div className="flex-shrink-0">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">About Con-I</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Con-I is revolutionizing the construction industry by connecting companies with skilled contractors
                through an intelligent bidding platform. We believe in one connection at a time, building trust and
                transparency in every project.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our mission is to make construction project management seamless, efficient, and accessible to businesses
                of all sizes. With advanced AI matching and real-time project tracking, we help you find the right
                contractors and complete projects on time.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded with a passion for innovation in construction, Con-I combines cutting-edge technology with
                industry expertise to deliver a platform that truly works for you.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/ethiopian-construction-team.jpg"
                alt="Ethiopian construction team working together"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Mr. Yosef Yacob",
                role: "Construction Manager",
                text: "Con-I has transformed how we find contractors. The bidding process is seamless.",
              },
              {
                name: "Sarah Kebede",
                role: "Contractor",
                text: "I love the platform. Finding quality projects has never been easier.",
              },
              {
                name: "Daniel Mekonnen",
                role: "Project Coordinator",
                text: "The AI matching is incredible. We get the right contractors every time.",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-8">
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
