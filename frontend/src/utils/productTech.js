export const TECH_CATEGORY_OPTIONS = [
  { name: 'Phones', icon: 'bi-phone' },
  { name: 'Laptops', icon: 'bi-laptop' },
  { name: 'Accessories', icon: 'bi-headphones' },
  { name: 'Gadgets', icon: 'bi-cpu' },
];

const normalizeCategoryName = (value) => String(value || '').trim().toLowerCase();

export const getRawCategoryName = (product) => (
  product?.category?.name || product?.categoryName || product?.category || 'Gadgets'
);

export const getCategoryIcon = (categoryName) => {
  const normalized = normalizeCategoryName(categoryName);

  if (/(phone|iphone|android|mobile|smartphone)/.test(normalized)) {
    return 'bi-phone';
  }

  if (/(laptop|notebook|macbook|computer|monitor|keyboard|mouse|workstation)/.test(normalized)) {
    return 'bi-laptop';
  }

  if (/(headphone|earbud|speaker|cable|charger|usb|dock|adapter|watch|case|accessor)/.test(normalized)) {
    return 'bi-headphones';
  }

  return 'bi-cpu';
};

export const buildCategoryOptions = (categories = [], products = []) => {
  const categoryNamesFromApi = categories
    .map((category) => category?.name)
    .filter(Boolean);

  const categoryNamesFromProducts = [
    ...new Set(products.map((product) => getRawCategoryName(product))),
  ].filter(Boolean);

  const sourceNames = categoryNamesFromApi.length > 0
    ? categoryNamesFromApi
    : categoryNamesFromProducts.length > 0
      ? categoryNamesFromProducts
      : TECH_CATEGORY_OPTIONS.map((category) => category.name);

  return sourceNames.map((name) => {
    const normalizedName = normalizeCategoryName(name);
    const count = products.filter(
      (product) => normalizeCategoryName(getRawCategoryName(product)) === normalizedName
    ).length;

    return {
      name,
      icon: getCategoryIcon(name),
      count,
    };
  });
};

export const getTechCategory = (product) => {
  const text = `${product?.name || ''} ${product?.description || ''} ${getRawCategoryName(product)}`.toLowerCase();

  if (/(phone|iphone|android|mobile|smartphone)/.test(text)) {
    return 'Phones';
  }

  if (/(laptop|notebook|macbook|computer|monitor|keyboard|mouse|workstation|java|spring|microservice)/.test(text)) {
    return 'Laptops';
  }

  if (/(headphone|earbud|speaker|cable|charger|usb|dock|adapter|watch|wallet|backpack|case|accessor)/.test(text)) {
    return 'Accessories';
  }

  return 'Gadgets';
};

export const getTechIcon = (product) => {
  const category = getTechCategory(product);
  return TECH_CATEGORY_OPTIONS.find((item) => item.name === category)?.icon || getCategoryIcon(category);
};
