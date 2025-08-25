'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

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

interface Product {
  _id: string
  name: string
  description: string
  price: number
  quantity: number
  images: string[]
  brandId: string
}

export default function BrandPage() {
  const params = useParams()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBrandData = useCallback(async () => {
    try {
      const [brandResponse, productsResponse] = await Promise.all([
        fetch(`/api/brands/${params.id}`),
        fetch(`/api/products?brandId=${params.id}`)
      ])

      const brandData = await brandResponse.json()
      const productsData = await productsResponse.json()

      if (brandData.success) {
        setBrand(brandData.data)
      }
      
      if (productsData.success) {
        setProducts(productsData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchBrandData()
    }
  }, [params.id, fetchBrandData])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Brand not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={`/companies/${brand.companyId._id}`} 
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {brand.companyId.name}
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold">{brand.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              by {brand.companyId.name}
            </p>
          </div>
        </div>
        
        {brand.description && (
          <p className="text-xl text-muted-foreground mb-4">{brand.description}</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Products</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                  {product.images.length > 0 && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <Badge variant="secondary" className="text-sm">
                        Thỏa thuận
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base line-clamp-3">
                      {product.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-lg text-muted-foreground">No products available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}