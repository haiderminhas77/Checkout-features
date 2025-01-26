import {
  reactExtension,
  BlockStack,
  InlineStack,
  Image,
  Text,
  Button,
  Grid,
  View,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.reductions.render-before',
  () => <Extension />,
);

function Extension() {
  const upsellProducts = [
    {
      id: '1',
      title: 'Space socks',
      price: '$25.00',
      image: 'https://cdn.shopify.com/s/files/1/0674/3307/0763/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1733961012',
    },
    // Add more products as needed
  ];

  return (
    <BlockStack spacing="loose">
      {upsellProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </BlockStack>
  );
}

function ProductCard({ product }) {
  return (
    <View padding="none">
      <InlineStack alignment="space-between" spacing="base">
        <InlineStack columns={['20%', 'fill']}>
            <Image
              source={product.image}
              alt={product.title}
              fit="cover"
            />
          <BlockStack spacing="none">
            <Text size="small">{product.title}</Text>
            <Text appearance="subdued" size="small">{product.price}</Text>
          </BlockStack>
        </InlineStack>
        <View border="none" padding="none">
          <Button
            kind="plain"
            onPress={() => {
              console.log(`Adding ${product.title} to cart`);
            }}
          >
            Add
          </Button>
        </View>
      </InlineStack>
    </View>
  );
}