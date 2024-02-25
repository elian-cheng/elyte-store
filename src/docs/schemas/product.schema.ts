const productSchema = {
  $id: 1,
  $code: 'BP3-4DA',
  $series: 'BP',
  postfix: 'DA',
  $name: 'Product Name',
  $nameES: 'Product Name ES',
  $type: 'Product Type',
  $description: 'Product Description',
  $descriptionES: 'Product Description ES',
  subcategory: 'Product Subcategory',
  size: 0,
  modules: 3,
  bases: 4,
  angle: 0,
  corners: 0,
  images: ['https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'],
  components: [
    {
      $id: 1,
      $code: 'A1',
      $quantity: 4,
      $component: {
        $ref: '#/components/schemas/Component'
      }
    }
  ],
  $categoryId: 1,
  $category: {
    id: 1,
    $name: 'Category Name'
  },
  $createdAt: '2021-01-01T00:00:00.000Z',
  $updatedAt: '2021-01-01T00:00:00.000Z',
  $isActive: true
};

module.exports = productSchema;
