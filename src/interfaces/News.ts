export interface NewsImage {
    url: string
    width: number
    height: number
}

export interface News {
    id: string
    slug: string
    image: NewsImage[]
    title: string
    title_ar?: string
    description: string[]
    description_ar?: string[]
    shortDescription: string
    shortDescription_ar?: string
    date: string
}