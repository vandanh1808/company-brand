'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Brand {
  _id: string
  name: string
  description?: string
  logo?: string
  companyId: {
    _id: string
    name: string
  }
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      if (data.success) {
        setBrands(data.data)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl">Loading brands...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tất cả thương hiệu</h1>
        <p className="text-lg text-muted-foreground">
          Khám phá danh mục thương hiệu đầy đủ từ các công ty hàng đầu
        </p>
      </div>

      {brands.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Hiện tại chưa có thương hiệu nào.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link key={brand._id} href={`/brands/${brand._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  {brand.logo && (
                    <div className="w-full h-24 mb-4 bg-gray-100 rounded flex items-center justify-center">
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <CardTitle className="text-xl">{brand.name}</CardTitle>
                  <CardDescription className="text-sm">
                    thuộc{' '}
                    <Link 
                      href={`/companies/${brand.companyId._id}`}
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {brand.companyId.name}
                    </Link>
                  </CardDescription>
                </CardHeader>
                {brand.description && (
                  <CardContent>
                    <CardDescription className="text-sm line-clamp-3">
                      {brand.description}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}