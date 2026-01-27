import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Award, 
  Target, 
  Lightbulb,
  Heart,
  Shield,
  Zap,
  Star
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const navigate = useNavigate()

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Pushing the boundaries of AI to make antique expertise accessible to everyone'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Deep love for vintage treasures and their fascinating stories'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a global community of collectors, designers, and vintage enthusiasts'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Committed to accuracy, privacy, and ethical AI practices'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      background: 'Former Stanford AI researcher, 15+ years in computer vision',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face&auto=format'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder', 
      background: 'Ex-Google engineer, specialist in mobile AI applications',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&auto=format'
    },
    {
      name: 'Emma Thompson',
      role: 'Chief Design Officer',
      background: 'Award-winning product designer, formerly at Apple and Airbnb',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&auto=format'
    },
    {
      name: 'Prof. James Williams',
      role: 'Head of Antique Research',
      background: 'Sotheby\'s Institute graduate, 25+ years in antique authentication',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&auto=format'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'Company Founded',
      description: 'Started with a vision to democratize antique expertise'
    },
    {
      year: 'Q1 2025',
      title: 'AI Model Launch',
      description: 'Launched GPT-4 Vision powered analysis with honest confidence scoring'
    },
    {
      year: 'Q2 2025',
      title: 'Beta Launch',
      description: 'Opened beta access for vintage collectors and antique enthusiasts'
    },
    {
      year: 'Q3 2025',
      title: 'Series A Funding',
      description: '$15M raised from leading VCs to accelerate growth'
    },
    {
      year: 'Q4 2025',
      title: 'Global Expansion',
      description: 'Launched in 12 countries with localized expertise'
    }
  ]

  const awards = [
    {
      title: 'Product Hunt #1 Product of the Day',
      year: '2025',
      icon: Star
    },
    {
      title: 'TechCrunch Startup of the Year',
      year: '2025',
      icon: Award
    },
    {
      title: 'Apple Design Award Finalist',
      year: '2025',
      icon: Target
    },
    {
      title: 'Fast Company Most Innovative App',
      year: '2025',
      icon: Zap
    }
  ]

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-background">
      {/* Header */}
      <div className="relative z-10 p-4">
        <GlassCard className="p-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="default"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </GlassCard>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VintageVision
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make antique expertise accessible to everyone through the power of AI,
              helping people everywhere discover the stories behind their treasures.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-12 text-center" variant="brass">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                "To democratize antique expertise through cutting-edge AI technology, empowering everyone 
                to discover, understand, and appreciate the rich history of vintage treasures. We believe 
                every object has a story, and everyone deserves to know it."
              </p>
              <div className="flex justify-center mt-8">
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8 text-center h-full" hover="scale">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">World-class experts passionate about vintage treasures</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 text-center h-full" hover="scale">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/50"
                    whileHover={{ scale: 1.1 }}
                  />
                  <h3 className="text-lg font-bold text-foreground mb-2">{member.name}</h3>
                  <p className="text-info font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.background}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Journey</h2>
            <p className="text-xl text-muted-foreground">Key milestones in our mission to revolutionize antique identification</p>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="flex items-start gap-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {milestone.year}
                </div>
                <GlassCard className="flex-1 p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Awards */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Recognition</h2>
            <p className="text-xl text-muted-foreground">Awards and achievements that validate our mission</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 text-center h-full" hover="scale">
                  <award.icon className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">{award.title}</h3>
                  <p className="text-success font-medium">{award.year}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12" variant="brass">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Join Our Mission
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Ready to discover the stories behind your treasures? Start your vintage journey today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/')}
                  variant="brass"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Discovering
                </Button>

                <Button
                  onClick={() => navigate('/contact')}
                  variant="outline"
                  size="lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
