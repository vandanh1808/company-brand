import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, Briefcase } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Enterprise Platform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover leading companies, explore their brands, and find exciting career opportunities in our comprehensive enterprise ecosystem.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/companies">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-6 h-6 mr-2 text-primary" />
                Companies
              </CardTitle>
              <CardDescription>
                Explore our portfolio of leading enterprises and their innovative solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                View Companies →
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/recruitment">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-primary" />
                Careers
              </CardTitle>
              <CardDescription>
                Join our team and build the future with cutting-edge technology and innovation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                Explore Jobs →
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/login">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary" />
                Admin Portal
              </CardTitle>
              <CardDescription>
                Access the administrative dashboard to manage companies, brands, and products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                Admin Login →
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="text-center bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Browse through our companies to discover innovative brands and products, or explore career opportunities to join our growing team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/companies">
            <Button size="lg">
              Browse Companies
            </Button>
          </Link>
          <Link href="/recruitment">
            <Button variant="outline" size="lg">
              View Job Openings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}