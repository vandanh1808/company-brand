'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Users, Target, Award } from 'lucide-react'

export default function RecruitmentPage() {
  const companyInfo = {
    name: "TechCorp Enterprise",
    description: "Leading technology company specializing in innovative solutions for the digital age. We are committed to creating cutting-edge products that transform how businesses operate.",
    address: "123 Innovation Street, Tech District, Ho Chi Minh City",
    phone: "+84 (0)28 1234 5678",
    email: "careers@techcorp.com",
    website: "https://techcorp.com",
    employees: "500-1000",
    founded: "2010",
    industry: "Technology & Software"
  }

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Ho Chi Minh City",
      type: "Full-time",
      experience: "3-5 years",
      description: "We are looking for an experienced software engineer to join our development team and work on cutting-edge projects."
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Ho Chi Minh City",
      type: "Full-time",
      experience: "5+ years",
      description: "Lead product strategy and development for our enterprise solutions. Work closely with engineering and design teams."
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "Ho Chi Minh City",
      type: "Full-time",
      experience: "2-4 years",
      description: "Create beautiful and intuitive user experiences for our web and mobile applications."
    },
    {
      id: 4,
      title: "Data Analyst",
      department: "Analytics",
      location: "Ho Chi Minh City",
      type: "Full-time",
      experience: "1-3 years",
      description: "Analyze business data to provide insights and support decision-making across the organization."
    }
  ]

  const benefits = [
    "Competitive salary and performance bonuses",
    "Comprehensive health insurance",
    "Flexible working hours and remote work options",
    "Professional development opportunities",
    "Modern office with latest technology",
    "Team building events and company trips",
    "Free meals and snacks",
    "Gym membership reimbursement"
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 mb-12 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl md:text-2xl">Build the future with us</p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">About {companyInfo.name}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{companyInfo.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Company Facts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Founded:</span>
                <span className="font-semibold">{companyInfo.founded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry:</span>
                <span className="font-semibold">{companyInfo.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size:</span>
                <span className="font-semibold">{companyInfo.employees}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{companyInfo.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{companyInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{companyInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-3 text-muted-foreground" />
                <a href={companyInfo.website} className="text-primary hover:underline">
                  Visit Website
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Job Openings */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Current Job Openings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobOpenings.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {job.department} • {job.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">
                    {job.experience} experience
                  </Badge>
                  <Button size="sm">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Why Work With Us</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Benefits & Perks</CardTitle>
            <CardDescription>
              We believe in taking care of our team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Us?</h3>
            <p className="text-muted-foreground mb-6">
              Send your resume and cover letter to start your journey with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Mail className="w-4 h-4 mr-2" />
                Send Application
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}