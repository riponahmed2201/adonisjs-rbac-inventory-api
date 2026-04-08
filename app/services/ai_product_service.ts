import env from '#start/env'
import OpenAI from 'openai'
import type Product from '#models/product'

export default class AiProductService {
  static async generateSummary(product: Product) {
    const apiKey = env.get('OPENAI_API_KEY')

    if (!apiKey) {
      return `Product ${product.name} (SKU: ${product.sku}) is priced at ${product.price} with stock ${product.stock}.`
    }

    const client = new OpenAI({ apiKey })
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: `Generate a short sales-friendly summary for this product:
Name: ${product.name}
SKU: ${product.sku}
Price: ${product.price}
Stock: ${product.stock}
Description: ${product.description ?? 'N/A'}`,
    })

    return response.output_text
  }
}
