'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  quantity: number
  images: string[]
  brandId: {
    _id: string
    name: string
    companyId: {
      _id: string
      name: string
    }
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tất cả sản phẩm</h1>
        <p className="text-lg text-muted-foreground">
          Khám phá toàn bộ danh mục sản phẩm từ các thương hiệu hàng đầu
        </p>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Hiện tại chưa có sản phẩm nào.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
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
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Thỏa thuận
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Link 
                      href={`/brands/${product.brandId._id}`}
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {product.brandId.name}
                    </Link>
                    {' • '}
                    <Link 
                      href={`/companies/${product.brandId.companyId._id}`}
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {product.brandId.companyId.name}
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm line-clamp-3">
                    {product.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}