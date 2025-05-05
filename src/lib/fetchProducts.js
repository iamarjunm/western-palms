// src/lib/fetchProducts.js

export async function fetchProducts() {
  const endpoint = `${process.env.SHOPIFY_STORE_URL}/api/2023-01/graphql.json`;
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            productType
            descriptionHtml
            tags
            priceRange {
              minVariantPrice {
                amount
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
              }
            }
            featuredImage {
              url
            }
            images(first: 2) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log('Fetching products from:', endpoint); // Log endpoint
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });
  
    const data = await response.json();
    console.log('Raw API response:', data); // Log raw response
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return { products: [] };
    }
  
    const products = data.data.products.edges.map(edge => {
      const product = edge.node;
      return {
        id: product.id,
        title: product.title, 
        handle: product.handle,
        productType: product.productType,
        descriptionHtml: product.descriptionHtml,
        tags: product.tags,
        price: product.priceRange.minVariantPrice.amount,
        compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount || null,
        featuredImage: product.featuredImage?.url,
        images: product.images.edges.map(imgEdge => imgEdge.node.url),
        variants: product.variants.edges.map(variantEdge => ({
          id: variantEdge.node.id,
          title: variantEdge.node.title,
          price: variantEdge.node.price.amount,
          compareAtPrice: variantEdge.node.compareAtPrice?.amount || null,
          selectedOptions: variantEdge.node.selectedOptions,
          image: variantEdge.node.image?.url
        }))
      };
    });

    console.log('Processed products:', products); // Log processed data
    return { products };
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return { products: [] };
  }
}


export async function fetchProductById(id) {
  // Handle both full GID and just the ID part
  const productId = id.startsWith('gid://shopify/Product/') ? id : `gid://shopify/Product/${id}`;
  
  const endpoint = `${process.env.SHOPIFY_STORE_URL}/api/2024-01/graphql.json`;
  const query = `
    query GetProductById($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        descriptionHtml
        productType
        tags
        featuredImage {
          url
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          name
          values
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
              quantityAvailable
              availableForSale
            }
          }
        }
      }
    }
  `;

  try {
    console.log(`Fetching product with ID: ${productId}`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { id: productId }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL Errors:', errors);
      throw new Error(errors.map(e => e.message).join(', '));
    }

    if (!data?.product) {
      console.error('Product not found in response');
      throw new Error('Product not found');
    }

    const product = data.product;
    console.log('Raw product data:', product);

    // Process images with priority to variant-specific images
    const processImages = () => {
      const imageSet = new Set();
      const images = [];

      // Add featured image first if exists
      if (product.featuredImage?.url) {
        imageSet.add(product.featuredImage.url);
        images.push({
          url: product.featuredImage.url,
          altText: product.featuredImage.altText || product.title,
          isFeatured: true
        });
      }

      // Add other images
      product.images.edges.forEach(edge => {
        if (edge.node?.url && !imageSet.has(edge.node.url)) {
          imageSet.add(edge.node.url);
          images.push({
            url: edge.node.url,
            altText: edge.node.altText || product.title,
            isFeatured: false
          });
        }
      });

      return images;
    };

    // Process variants and extract options
    const processVariants = () => {
      const variants = product.variants.edges.map(edge => edge.node);
      const optionsMap = new Map();

      // Initialize options map from product options
      product.options.forEach(option => {
        optionsMap.set(option.name.toLowerCase(), {
          name: option.name,
          values: new Set(),
          variants: []
        });
      });

      variants.forEach(variant => {
        variant.selectedOptions.forEach(option => {
          const optionName = option.name.toLowerCase();
          if (optionsMap.has(optionName)) {
            optionsMap.get(optionName).values.add(option.value);
            optionsMap.get(optionName).variants.push({
              id: variant.id,
              value: option.value,
              available: variant.availableForSale,
              quantity: variant.quantityAvailable,
              price: variant.price.amount,
              image: variant.image?.url
            });
          }
        });
      });

      // Convert to more usable structure
      const options = Array.from(optionsMap.values()).map(option => ({
        name: option.name,
        values: Array.from(option.values),
        variants: option.variants
      }));

      return {
        all: variants.map(v => ({
          id: v.id,
          title: v.title,
          sku: v.sku,
          price: v.price.amount,
          compareAtPrice: v.compareAtPrice?.amount,
          available: v.availableForSale,
          quantity: v.quantityAvailable,
          options: v.selectedOptions.reduce((acc, opt) => {
            acc[opt.name.toLowerCase()] = opt.value;
            return acc;
          }, {})
        })),
        options
      };
    };

    const images = processImages();
    const { all: variants, options } = processVariants();
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const compareAtPrice = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || 0);
    const currencyCode = product.priceRange.minVariantPrice.currencyCode;

    const result = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.descriptionHtml,
      productType: product.productType,
      tags: product.tags,
      price,
      compareAtPrice: compareAtPrice > price ? compareAtPrice : null,
      currencyCode,
      discountPercentage: compareAtPrice > price 
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0,
      images,
      variants,
      options,
      available: variants.some(v => v.available)
    };

    console.log('Processed product data:', result);
    return result;

  } catch (error) {
    console.error('Error in fetchProductById:', error.message);
    throw error; // Re-throw to allow error handling in calling code
  }
}

export async function fetchCollectionByHandle(handle) {
  const endpoint = `${process.env.SHOPIFY_STORE_URL}/api/2023-01/graphql.json`;

  const query = `
    query getCollection($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 2) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error fetching collection data:', response.status, errorData);
      return null;
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return null;
    }

    const collection = data?.data?.collectionByHandle;
    if (!collection) return null;

    const products = collection.products.edges.map(({ node }) => {
      const discountedPrice = parseFloat(node.priceRange.minVariantPrice.amount);
      const originalPriceRaw = node.variants.edges[0]?.node.compareAtPrice?.amount || node.compareAtPriceRange.minVariantPrice?.amount;
      const originalPrice = parseFloat(originalPriceRaw) || 0;

      const discountPercentage = originalPrice
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : 0;

      const images = node.images.edges.map((edge) => edge.node.src);
      const frontImage = images[0] || 'https://picsum.photos/200';
      const backImage = images[1] || frontImage;

      return {
        id: node.id,
        handle: node.handle,
        title: node.title,
        description: node.descriptionHtml,
        price: discountedPrice.toFixed(2),
        originalPrice: originalPrice ? originalPrice.toFixed(2) : null,
        discountPercentage,
        frontImage,
        backImage,
      };
    });

    return {
      collection: {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
      },
      products,
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
}

export async function fetchProductsByCategory(categoryHandle) {
  const endpoint = `${process.env.SHOPIFY_STORE_URL}/api/2023-01/graphql.json`;

  const query = `
    query getProductsByCategory($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              productType
              descriptionHtml
              tags
              featuredImage {
                url
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 2) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                    }
                    compareAtPrice {
                      amount
                    }
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle: categoryHandle },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error fetching category:', response.status, errorData);
      return null;
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return null;
    }

    const collection = data.data.collectionByHandle;
    if (!collection) return null;

    const products = collection.products.edges.map(({ node: product }) => {
      const originalPrice = parseFloat(
        product.variants.edges[0]?.node.compareAtPrice?.amount ||
        product.compareAtPriceRange.minVariantPrice.amount ||
        0
      );

      const discountedPrice = parseFloat(product.priceRange.minVariantPrice.amount);
      const discountPercentage = originalPrice
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : 0;

      const images = product.images.edges.map(edge => edge.node.url);
      const frontImage = product.featuredImage?.url || images[0] || 'https://picsum.photos/300';
      const backImage = images[1] || frontImage;

      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        productType: product.productType,
        descriptionHtml: product.descriptionHtml,
        tags: product.tags,
        price: discountedPrice,
        compareAtPrice: originalPrice > 0 ? originalPrice : null,
        discountPercentage,
        featuredImage: product.featuredImage?.url,
        images,
        frontImage,
        backImage,
        variants: product.variants.edges.map(variantEdge => {
          const v = variantEdge.node;
          return {
            id: v.id,
            title: v.title,
            price: v.price.amount,
            compareAtPrice: v.compareAtPrice?.amount || null,
            selectedOptions: v.selectedOptions,
            image: v.image?.url,
          };
        }),
      };
    });

    return {
      collection: {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
      },
      products,
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return null;
  }
}
